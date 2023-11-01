import '../env/BigIntSerializer'
import di from 'a-di';
import { class_Dfr, class_EventEmitter } from 'atma-utils';

import type { ProposeTransactionProps } from '@gnosis.pm/safe-service-client';

import { $bigint } from '@dequanto/utils/$bigint';
import { $txData } from '@dequanto/utils/$txData';

import { $logger } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { $account } from '@dequanto/utils/$account';
import { $gas } from '@dequanto/utils/$gas';
import { $require } from '@dequanto/utils/$require';
import { $contract } from '@dequanto/utils/$contract';
import { $error } from '@dequanto/utils/$error';

import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxDataBuilder } from './TxDataBuilder';
import { TxLogger } from './TxLogger';
import { ChainAccount, Erc4337Account, IAccount, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { TAddress } from '@dequanto/models/TAddress';
import { ChainAccountsService } from '@dequanto/ChainAccountsService';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ClientErrorUtil } from '@dequanto/clients/utils/ClientErrorUtil';
import { ITxLogItem } from './receipt/ITxLogItem';
import { TxLogParser } from './receipt/TxLogParser';

import { ISafeServiceTransport } from '@dequanto/safe/transport/ISafeServiceTransport';
import { SigFileTransport } from './sig-transports/SigFileTransport';
import { TxWriterAccountAgents } from './agents/TxWriterAccountAgents';
import { PromiseEvent } from '@dequanto/class/PromiseEvent';
import { $sig } from '@dequanto/utils/$sig';
import { TEth } from '@dequanto/models/TEth';

interface ITxWriterEvents {
    transactionHash (hash: string)
    receipt (receipt: TEth.TxReceipt)
    confirmation (confNumber: number, receipt: TEth.TxReceipt)
    error (error: Error)
    sent ()
    log (message: string)
    safeTxProposed (safeTx: ProposeTransactionProps)
}
export interface ITxWriterOptions {
    timeout?: number | boolean
    retries?: number
    retryDelay?: number
    safeTransport?: ISafeServiceTransport

    /** Tx Data will be saved to the store(e.g. a File), and will wait until the signature appears in the store. */
    sigTransport?: string

    /** Optionally disable waiting for the transport response */
    sigTransportWait?: boolean

    /** Write the Tx Data to a JSON file, without submit to the blockchain */
    txOutput?: string

    /** Provide a pre-signed signature for this transaction data. */
    signature?: TEth.Hex

    /**
     * The callback is executed on error, to give the opportunity to build a new Tx to resubmit the tx.
     * @param tx - current TxWriter object
     * @param error - current Error with receipt(if any)
     * @param errCount - num of errors already handled
     */
    onErrorRebuild? (tx: TxWriter, error: Error & { receipt?: TEth.TxReceipt }, errCount: number): Promise<TxDataBuilder>

    /**
     * Do not log Transaction states (start, receipt, etc)
     */
    silent?: boolean
}

export class TxWriter extends class_EventEmitter<ITxWriterEvents> {

    onSent = new class_Dfr<string>();
    onCompleted = new class_Dfr<TEth.TxReceipt>();
    onSaved = new class_Dfr<string>();
    receipt: TEth.TxReceipt

    onConfirmed (waitForCount: number): Promise<string> {
        let promise = new class_Dfr();
        if (this.tx.confirmations >= waitForCount) {
            promise.resolve(this.tx.hash);
        } else {
            this.confirmationAwaiters.push({
                count: waitForCount,
                promise
            });
        }
        return promise as any;
    }

    wait (): Promise<TEth.TxReceipt> {
        return this.onCompleted as any as Promise<TEth.TxReceipt>;
    }

    id = Math.round(Math.random() * 10**10) + '';
    tx: {
        timestamp: number
        confirmations: number,
        hash?: string
        timeout?: NodeJS.Timer
        receipt?: TEth.TxReceipt
        error?: Error
        knownLogs?: ITxLogItem[]
    } = null

    txs: TxWriter['tx'][] = []
    options: ITxWriterOptions;


    private logger: TxLogger;
    private confirmationAwaiters = [] as { count: number, promise }[]

    protected constructor (
        public client: Web3Client,
        public builder: TxDataBuilder,
        public account: IAccount
    ) {
        super();
        this.logger = new TxLogger(this.id, this.getSenderName(), this.builder);
    }

    public send (options?: ITxWriterOptions): this {
        if (this.tx == null) {
            this.logger.logStart();

            this.onCompleted.defer();
            this.onSent.defer();

            // was not sent
            this.options = options;
            this.sendTxInner();
        }
        return this;
    }
    public async call() {
        let tx = await this.builder.getTxData(this.client);
        let result = await this.client.call(tx);
        return result;
    }

    protected write (options?: ITxWriterOptions) {
        if (this.builder?.config?.send !== 'manual') {
            this.send(options);
        }
    }

    private async sendTxInner () {
        if (this.options?.txOutput != null) {
            // handle none blockchain
            await this.saveTxAndExit()
            return;
        }

        let agent = TxWriterAccountAgents.get(this.account);
        if (agent != null) {
            let sender = await this.getSender();
            let innerWriter = await agent.process(sender, this.account, this);
            this.pipeInnerWriter(innerWriter);
            return;
        }


        let time = Date.now();
        let sender: ChainAccount = await this.getSender();

        await Promise.all([
            this.builder.ensureNonce(),
            this.builder.ensureGas(),
        ]);

        let key = sender?.key;
        let signedTxBuffer = key == null
            ? null
            : await this.builder.signToString(sender.key);

        if (signedTxBuffer == null) {
            if (this.options?.sigTransport != null) {
                let transport = di.resolve(SigFileTransport);
                let shouldWait = this.options?.sigTransportWait !== false;
                let { signed, path } = await transport.create(this.options.sigTransport, this.builder, { wait: shouldWait });
                if (path) {
                    this.onSaved.resolve(path);
                }
                if (shouldWait === false) {
                    return;
                }
            }
            if (this.options?.signature) {
                let tx = $txData.getJson(this.builder.data, this.client);
                signedTxBuffer = await $sig.TxSerializer.serialize(tx, this.options.signature);
            }
        }
        let tx = <TxWriter['tx']> {
            timestamp: Date.now(),
            confirmations: 0,
            hash: null,
            receipt: null,
            timeout: null as NodeJS.Timeout,
        };
        tx.timeout = this.startTimer(tx);
        this.tx = tx;
        this.txs.push(tx);

        let promiseEvent: PromiseEvent<TEth.TxReceipt>;
        if (signedTxBuffer != null) {
            promiseEvent = this
                .client
                .sendSignedTransaction(signedTxBuffer);
        } else {
            let txData = this.builder.getTxData(this.client);
            promiseEvent = this
                .client
                .sendTransaction(txData);
        }

        promiseEvent
            .once('transactionHash', hash => {
                if (tx.hash === hash) {
                    return;
                }
                if (tx.hash != null && tx.timeout != null) {
                    // network has reaccepted the tx, restart previous timeout
                    this.clearTimer(tx);
                    tx.timeout = this.startTimer(tx);
                }

                tx.hash = hash;
                this.onSent.resolve(hash);
                this.emit('transactionHash', hash);
                this.emit('log', `Tx hash: ${hash}`);
            })
            // .on('confirmation', (confNumber, receipt) => {
            //     tx.hash = receipt.transactionHash ?? tx.hash;
            //     this.onSent.resolve();
            //     this.emit('confirmation', confNumber, receipt);
            //     this.emit('log', `Tx confirmation received for ${tx.hash}. Confirmations: ${confNumber}`);

            //     let arr = this.confirmationAwaiters;
            //     for (let i = 0; i < arr.length; i++) {
            //         if (confNumber >= arr[i].count) {
            //             arr[i].promise.resolve();
            //             arr.splice(i, 1);
            //             i--;
            //         }
            //     }
            // })
            .on('error', (error: Error & {data?, transactionHash?}) => {

                this.onSent.reject(error);
                this.onCompleted.reject(error);

                this.clearTimer(tx);
                this.logger.logError(error);
                this.emit('error', error);
                this.emit('log', `Tx ERROR "${error.message}"`);
            })
            .then(async receipt => {
                this.clearTimer(tx);

                try {
                    await this.extractLogs(receipt, tx);
                } catch (error) {
                    console.error('Logs error', error);
                }

                try {
                    tx.receipt = receipt;
                    tx.hash = receipt.transactionHash ?? tx.hash;

                    this.receipt = receipt;
                    this.logger.logReceipt(receipt, Date.now() - time);
                    this.onSent.resolve();
                    this.emit('receipt', receipt);

                    let hash = tx.hash;
                    let status = receipt.status;
                    let gasFormatted = $gas.formatUsed(this.builder.data, <any>receipt);
                    this.emit('log', `Tx receipt: ${hash}.\n\tStatus: ${status}.\n\tGas used: ${gasFormatted}`);

                    this.onCompleted.resolve(receipt);
                } catch (error) {
                    console.error('FATAL ERROR', error);
                    throw error;
                }

            }, async (err: Error & { receipt?: TEth.TxReceipt, data, transactionHash? }) => {
                if (err.data != null && this.builder.abi != null) {
                    err.data = $contract.decodeCustomError(err.data, this.builder.abi);
                    $error.normalizeEvmCustomError(err);
                }

                this.logger.log(`Tx errored ${err.message}`);

                this.clearTimer(tx);
                tx.error = err;
                tx.hash = err.transactionHash ?? tx.receipt?.transactionHash ?? tx.hash;

                const options = this.options ?? {};

                if (err.receipt?.status !== 1) {
                    // read reason
                    // let rpc = await this.client.getRpc();
                    // let tx = await this.client.getTransaction(err.receipt.transactionHash);

                    // try {
                    //     let result = await rpc.eth_call(tx, tx.blockNumber);
                    // } catch (err) {
                    //     $logger.log('CALL ERROR', err);
                    // }
                }

                if (ClientErrorUtil.IsInsufficientFunds(err)) {
                    if (this.builder.config?.gasFunding) {
                        this.fundAccountAndResend().catch (err => {
                            this.onCompleted.reject(err);
                        });
                        return;
                    }
                    if (options.retries == null) {
                        options.retries = 1;
                        options.retryDelay = 5000;
                        // If insufficient funds this is can be due to the blockchain hasn't confirmed some incoming transactions
                    }
                }
                if (ClientErrorUtil.IsNonceTooLow(err)) {
                    if (options.retries == null) {
                        options.retries = 1;
                    }
                    let nonce = this.builder.data.nonce;
                    // reset nonce
                    await this.builder.setNonce();
                    this.logger.log(`Nonce was ${Number(nonce)} too low. Retries left: ${options.retries}. New nonce: ${Number(this.builder.data.nonce)}`);
                }

                let submitsCount = this.txs.length;
                let submitsMax = (options.retries ?? 0) + 1;
                if (submitsCount < submitsMax) {
                    let ms = options.retryDelay ?? 3000;
                    let waitMs = ms * submitsCount;
                    $logger.log(`Tx retry in ${waitMs}ms`);
                    await $promise.wait(waitMs);

                    let onErrorRebuild = options.onErrorRebuild;
                    if (onErrorRebuild != null) {
                        let txBuilder = await onErrorRebuild(this, err, submitsCount);
                        if (txBuilder != null) {
                            this.builder = txBuilder;
                        }
                    }
                    this.resubmit({ increaseGas: false });
                    return;
                }

                this.onCompleted.reject(err);
            });
    }

    public catch (fn) {
        return this.onCompleted.catch(fn);
    }

    private async getSender (): Promise<ChainAccount> {
        let account = this.account;

        let sender = $account.getSender(account);
        if (sender.key == null) {
            /** check the encrypted storage. In case no key is found, assume the target node contains unlocked or locked account */
            let addressOrName = sender.address ?? sender.name;
            let service = di.resolve(ChainAccountsService);
            let fromStorage = await service.get(addressOrName, this.client.platform);
            if (fromStorage) {
                sender = fromStorage as ChainAccount;
            }
        }
        return sender;
    }
    private getSenderName () {
        let sender = $account.getSender(this.account);
        return (sender.name as any) ?? sender.address;
    }

    private async extractLogs(receipt: TEth.TxReceipt, tx: TxWriter['tx']) {
        let parser = di.resolve(TxLogParser);
        let logs = await parser.parse(receipt, {
            abi: this.builder.abi,
        });
        tx.knownLogs = logs.filter(x => x != null);
    }

    private async fundAccountAndResend () {
        let gasFunding = this.builder.config.gasFunding;
        let sender = $account.getSender(this.account);
        await this.builder.setGas({
            gasEstimation: true,
            from: sender.address
        });

        let { gas } = this.builder.data;
        let gasPrice = TxDataBuilder.getGasPrice(this.builder);


        let LITTLE_BIT_MORE = 1.3;
        let wei = $bigint.multWithFloat(gasPrice * BigInt(gas as any), LITTLE_BIT_MORE);

        let fundTx = await this.transferNative(gasFunding, sender.address, wei);
        await fundTx.onCompleted;
        // account was funded resubmit the tx
        this.resubmit();
    }
    private startTimer (tx: TxWriter['tx']): NodeJS.Timeout {
        let timeout = this.options?.timeout
        let ms: number;
        if (typeof timeout === 'boolean') {
            if (timeout === false) {
                // Timeout was disabled
                return null;
            }
            ms = this.client.TIMEOUT;
        } else {
            ms = timeout ?? this.client.TIMEOUT;
        }

        return setTimeout(() => {
            if (this.txs.length > 3) {
                let hashes = this.txs.map(x => x.hash).join(', ')
                this.onCompleted.reject(new Error(`${this.txs.length} retries timed out, with hashes: ${ hashes }`))
                return;
            }
            tx.error = new Error(`Timed out ${ms}ms`);
            this.resubmit()
        }, ms);
    }
    private clearTimer (tx: TxWriter['tx']) {
        if (tx.timeout) {
            clearTimeout(tx.timeout);
            tx.timeout = null;
        }
    }
    private resubmit ({ increaseGas = true}: { increaseGas?: boolean} = {}) {
        if (increaseGas !== false) {
            this.builder.increaseGas(1.1);
        }
        this.sendTxInner();
    }
    private pipeInnerWriter (innerWriter: TxWriter) {
        innerWriter.onCompleted.then(
            (receipt) => this.onCompleted.resolve(receipt),
            (error) => this.onCompleted.reject(error)
        );
        innerWriter.onSent.then(
            (hash) => this.onSent.resolve(hash),
            (error) => this.onSent.reject(error)
        );
        innerWriter.on('error', error => this.emit('error', error));
        innerWriter.on('log', message => this.emit('log', message));
    }

    /** Use this transfer also in case of additional account funding */
    public async transferNative (from: ChainAccount, to: TAddress, amount: bigint): Promise<TxWriter> {
        let txBuilder = new TxDataBuilder(this.client, from, {
            to: to,
            value: $bigint.toHex(amount)
        });

        let GAS = 21000;
        await Promise.all([
            txBuilder.setGas({ gasLimit: GAS }),
            txBuilder.setNonce(),
        ]);
        return TxWriter.write(this.client, txBuilder, from);
    }

    toJSON (): TTxWriterJson {
        let account = this.account;
        let accountJson: string | any;
        if (typeof account !== 'string') {
            accountJson = JSON.parse(JSON.stringify(account)) as (ChainAccount | SafeAccount | Erc4337Account);
            // Clean any KEY to prevent leaking. When resubmitted if one is required should be taken from the storage
            if ('operator' in accountJson) {
                delete accountJson.operator.key;
            } else {
                delete accountJson.key;
            }
        } else {
            accountJson = account;
        }
        return {
            id: this.id,
            platform: this.client.platform,
            options: this.options,
            account: accountJson,
            txs: this.txs,
            builder: this.builder.toJSON(),
        };
    }

    //** We can save the Tx Data for later reuse/blockchain send */
    async saveTxAndExit (additionalProperties?) {
        let path = this.options?.txOutput;
        $require.notNull(path, 'Save tx data to the file, but the path is undefined');
        await this.builder.save(path, additionalProperties);
        this.onSent.resolve(path);
        this.onSaved.resolve(path);
        this.onCompleted.reject(new Error(`Transaction is not submitted to the blockchain. It has been saved to "${path}". Subscribe to the "onSaved" promise instead`))
    }

    static async fromJSON (json: TTxWriterJson, client?: Web3Client, account?: TAccount): Promise<TxWriter> {
        client = client ?? Web3ClientFactory.get(json.platform);

        account = account ?? json.account;

        let builder = TxDataBuilder.fromJSON(client, account, {
            config: json.builder.config,
            tx: json.builder.tx,
        });
        let writer = TxWriter.create(client, builder, account, json.options);
        let txs = json.txs;

        writer.id = json.id;
        writer.tx = txs[txs.length - 1];
        writer.txs = txs;
        writer.receipt = txs.find(x =>x.receipt)?.receipt;

        return writer;
    }


    static write (
        client: Web3Client,
        builder: TxDataBuilder,
        account: IAccount,
        options?: ITxWriterOptions
    ): TxWriter {
        let writer = new TxWriter(client, builder, account);
        writer.write(options);
        return writer;
    }

    static create (
        client: Web3Client,
        builder: TxDataBuilder,
        account: IAccount,
        options?: ITxWriterOptions
    ): TxWriter {
        return new TxWriter(client, builder, account);
    }

    static async writeTxData (
        client: Web3Client,
        data: Partial<TEth.TxLike>,
        account: IAccount,
        options?: ITxWriterOptions
    ): Promise<TxWriter> {
        let txBuilder = new TxDataBuilder(client, account as IAccount, data);

        await Promise.all([
            txBuilder.ensureGas(),
            txBuilder.ensureNonce(),
        ]);

        let w = new TxWriter(client, txBuilder, account);
        w.send(options);
        return w;
    }
}

export type TTxWriterJson = {
    id: string
    platform: TPlatform
    options: ITxWriterOptions
    account: TAccount
    txs: TxWriter['txs']
    builder: ReturnType<TxDataBuilder['toJSON']>
};

