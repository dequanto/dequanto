import di from 'a-di';
import memd from 'memd';
import Web3 from 'web3';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BlockHeader, BlockTransactionString, Syncing } from 'web3-eth';
import { ClientPool, IPoolClientConfig, IPoolWeb3Request } from './ClientPool';
import { ClientPoolTrace } from './ClientPoolStats';
import { IWeb3Client, IWeb3ClientOptions } from './interfaces/IWeb3Client';
import { type BlockNumber, Log, LogsOptions, type PastLogsOptions, type TransactionConfig } from 'web3-core';
import { Subscription } from 'web3-core-subscriptions';
import { Wallet } from 'ethers';
import { $number } from '@dequanto/utils/$number';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { $txData } from '@dequanto/utils/$txData';
import { $logger } from '@dequanto/utils/$logger';
import { class_Dfr } from 'atma-utils';

export abstract class Web3Client implements IWeb3Client {

    public TIMEOUT = 3 * 60 * 1000;

    abstract platform: TPlatform;
    abstract chainId: number;
    abstract chainToken: string;
    abstract defaultGasLimit: number;

    defaultTxType: 1 | 2 = 2;

    async sign(txData: TransactionRequest, privateKey: string): Promise<string> {
        let wallet = new Wallet(privateKey);
        let json = $txData.getJson(txData, this);
        let tx = await wallet.signTransaction(json);
        return tx;
    }


    public options: IWeb3ClientOptions;
    public pool: ClientPool;

    constructor (options: IWeb3ClientOptions)
    constructor (endpoints: IPoolClientConfig[] )
    constructor (mix: IWeb3ClientOptions | IPoolClientConfig[]) {
        if (Array.isArray(mix)) {
            this.options = { endpoints: mix }
        } else if (mix != null) {
            this.options = mix;
        }

        if (this.options.endpoints == null && this.options.web3 == null) {
            console.dir(this.options, { depth: null });
            throw new Error(`Neither Node endpoints nor web3 instance provided`);
        }
        this.pool = new ClientPool(this.options);
    }

    getEventStream (address: TAddress, abi: any, event: string) {
        return this.pool.getEventStream(address, abi, event);
    }

    with <TResult> (fn: (web3: Web3) => Promise<TResult>) {
        return this.pool.call(fn);
    }
    withSync <TResult> (fn: (web3: Web3) => TResult) {
        return this.pool.callSync(fn);
    }
    async getWeb3 (options?: IPoolWeb3Request) {
        return await this.pool.getWeb3(options);
    }
    async getNodeURL (options?: IPoolWeb3Request) {
        return await this.pool.getNodeURL(options);
    }

    subscribe(
        type: 'logs',
        options: LogsOptions,
        callback?: (error: Error, log: Log) => void
    ): Promise<Subscription<Log>>;
    subscribe(
        type: 'syncing',
        callback?: (error: Error, result: Syncing) => void
    ): Promise<Subscription<Syncing>>;
    subscribe(
        type: 'newBlockHeaders',
        callback?: (error: Error, blockHeader: BlockHeader) => void
    ): Promise<Subscription<BlockHeader>>;
    subscribe(
        type: 'pendingTransactions',
        callback?: (error: Error, transactionHash: string) => void
    ): Promise<Subscription<string>>;
    async subscribe (...args): Promise<Subscription<any>>{
        let web3 = await this.getWeb3({ ws: true });
        return web3.eth.subscribe(...args as Parameters<Web3['eth']['subscribe']>);
    }

    readContract (data: Web3ContractRequest.IContractRequest) {
        let { address, method, abi, options, blockNumber, arguments: params } = data;
        return this.pool.call(async web3 => {
            let contract = new web3.eth.Contract(abi, address);
            let callArgs = [];
            if (options != null) {
                callArgs[0] = options;
            }
            if (blockNumber != null) {
                callArgs[0] = null;
                callArgs[1] = blockNumber;
            }
            let result = await contract.methods[method](...params).call(...callArgs);
            return result;
        }, {
            trace: ClientPoolTrace.createContractCall(address, method, params)
        });
    }

    readContractBatch (requests: Web3ContractRequest.IContractRequest[]) {
        let trace = new ClientPoolTrace();
        trace.action = `Batch requests: ${ requests.map(x => x.address) }`;
        return this.pool.call(async web3 => {
            let batch = new Web3ContractRequest.BatchRequest(web3, requests);
            return batch.execute();
        }, {
            trace
        });
    }

    encodeParameters (types: any[], paramaters: any[]) {
        return this.pool.callSync(web3 => {
            return web3.eth.abi.encodeParameters(types, paramaters);
        });
    }

    getBalance (address: TAddress, blockNumber?: number): Promise<bigint> {
        return this.pool.call(async web3 => {
            let weiStr = await web3.eth.getBalance(address, blockNumber);
            return BigInt(weiStr);
        });
    }
    getTransactionCount(address: TAddress, type?: 'pending' | string) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionCount(address, type);
        });
    }
    isSyncing () {
        return this.pool.call(web3 => {
            return web3.eth.isSyncing();
        });
    }
    getTransaction (txHash: TAddress, opts?: IPoolWeb3Request) {
        return this.pool.call(web3 => {
            return web3.eth.getTransaction(txHash);
        }, opts);
    }
    getTransactionReceipt (txHash: TAddress) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionReceipt(txHash);
        });
    }
    getBlock (nr: number): Promise<BlockTransactionString> {
        return this.pool.call(web3 => {
            return web3.eth.getBlock(nr);
        });
    }
    getPendingTransactions () {
        return this.pool.call(web3 => {
            return web3.eth.getPendingTransactions();
        });
    }
    getPoolStatus(): Promise<{ baseFee: bigint, pending: number, queued: number }> {
        return this.pool.call(async web3 => {
            let eth = web3.eth as any;
            if (eth.txpool == null) {
                eth.extend({
                    property: 'txpool',
                    methods: [{
                      name: 'content',
                      call: 'txpool_content'
                    },{
                      name: 'inspect',
                      call: 'txpool_inspect'
                    },{
                      name: 'status',
                      call: 'txpool_status'
                    }]
                  });
            }
            let status = await eth.txpool.status();
            return {
                baseFee: BigInt(status.baseFee),
                pending: Number(status.pending),
                queued: Number(status.queued),
            }
        });
    }
    getStorageAt (address: TAddress, position: string | number | bigint, blockNumber?: number) {
        return this.pool.call(web3 => {
            return web3.eth.getStorageAt(address, <any> position, blockNumber);
        });
    }
    getGasPrice (): Promise<{ price: bigint, base?: bigint, priority?: bigint }> {
        return this.pool.call(web3 => {
            return web3.eth.getGasPrice().then(x => {
                return {
                    price: BigInt(x)
                };
            });
        });
    }
    getGasEstimation (from: TAddress, tx: TransactionRequest) {
        return this.pool.call(async web3 => {
            let txData = {
                from: from,
                to: tx.to as string,
                value: tx.value as any,
                data: tx.data as any,
                nonce: tx.nonce as any,
            };
            let gasAmount = await web3.eth.estimateGas(txData);
            return gasAmount;
        })
    }
    async getAccounts (options?: IPoolWeb3Request): Promise<TAddress[]> {
        let web3 = await this.getWeb3(options);
        return web3.eth.getAccounts();
    }
    async getChainId (options: IPoolWeb3Request): Promise<number> {
        let web3 = await this.getWeb3(options);
        return web3.eth.getChainId()
    }

    async switchChain (params: { chainId: number | string }, options: IPoolWeb3Request): Promise<any> {
        let web3 = await this.getWeb3(options);
        if (typeof (web3.eth.currentProvider as any).request !== 'function') {
            throw new Error(`Current provider doesn't have request method`);
        }
        return (web3.eth.currentProvider as any).request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: $number.toHex(params.chainId) }],
        });
    }

    sendSignedTransaction(signedTxBuffer: string) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendSignedTransaction(signedTxBuffer);
        }, { preferSafe: true, distinct: true });
    }
    sendTransaction(data: TransactionConfig) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendTransaction(data);
        }, { preferSafe: true, distinct: true });
    }

    getBlockNumber () {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }

    @memd.deco.memoize({ maxAge: 30 })
    getBlockNumberCached () {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }

    async getPastLogs (options: PastLogsOptions) {

        const getBlock = async (block: BlockNumber | Date, $default) => {
            if (block == null) {
                return $default;
            }
            if (block instanceof Date) {
                let resolver = di.resolve(BlockDateResolver, this);
                return resolver.getBlockNumberFor(block);
            }
            return block;
        };

        options.fromBlock = await getBlock(options.fromBlock, 0);
        options.toBlock = await getBlock(options.toBlock, 'latest');
        options.topics = options.topics?.map(topic => {
            if (typeof topic === 'string' && topic.startsWith('0x')) {
                return '0x' + topic.substring(2).padStart(64, '0');
            }
            return topic;
        });



        const fetch = async (maxBlockRange: number) => {
            let fromBlock = options.fromBlock ?? 0;

            if (typeof fromBlock === 'number') {
                let to = options.toBlock;
                if (typeof to !== 'number') {
                    to = await this.getBlockNumber();
                }
                let range = to - fromBlock;
                if (typeof maxBlockRange === 'number' && range > maxBlockRange) {
                    let logs = [];
                    let cursor = fromBlock;
                    let pages = Math.ceil(range / maxBlockRange);
                    let page = 0;
                    let complete = false;
                    while (complete === false) {
                        ++page;
                        let end = cursor + maxBlockRange;
                        if (end > to) {
                            end = options.toBlock as number;
                            complete = true;
                        }
                        $logger.log(`Get past logs paged: ${page}/${pages} (Block start: ${cursor}). Loaded ${logs.length}`);
                        let paged = await this.pool.call(web3 => web3.eth.getPastLogs({
                            ...options,
                            fromBlock: cursor,
                            toBlock: end ?? undefined,
                        }));
                        logs.push(...paged);
                        cursor += maxBlockRange + 1;
                    }
                    return logs;
                }
            }

            return this.pool.call(web3 => {
                return web3.eth.getPastLogs(options)
            });
        };

        try {
            let MAX = this.pool.getOptionForFetchableRange();
            return await fetch(MAX);
        } catch (err) {
            let match = /\b(?<maxRange>\d+)\b/.exec(err.message);
            if (match) {
                let max = Number(match.groups.maxRange);
                return await fetch(max);
            }
            throw err;
        }
    }

    getNodeInfos () {
        return this.pool.getNodeInfos();
    }
    getNodeStats () {
        return this.pool.getNodeStats();
    }

    static url<T extends Web3Client> (options: IWeb3ClientOptions)
    static url<T extends Web3Client> (endpoints: IPoolClientConfig[], opts?: Partial<IWeb3ClientOptions>)
    static url<T extends Web3Client> (url: string, opts?: Partial<IWeb3ClientOptions>): T
    static url<T extends Web3Client> (mix: IWeb3ClientOptions | IPoolClientConfig[] | string, opts?: Partial<IWeb3ClientOptions>): T {
        const Ctor: any = this;
        let options: IWeb3ClientOptions;
        if (typeof mix === 'string') {
            options = { endpoints: [ { url: mix }] }
        } else if (Array.isArray(mix)) {
            options = { endpoints: mix }
        } else {
            options = mix;
        }
        const param = {
            ...options,
            ...(opts ?? {})
        };
        return new Ctor(param);
    }
}


namespace Web3ContractRequest {

    export interface IContractRequest {
        address: TAddress,
        abi: any
        method: string,
        arguments?: any[]
        options?: {
            from?: TAddress
        }
        blockNumber?: number
    }

    export function request (web3: Web3, request: IContractRequest, onComplete: Function) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call.request(...callArgs, onComplete);
    }


    export function call (web3: Web3, request: IContractRequest) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call(...callArgs);
    }

    export class BatchRequest {
        private promise = new class_Dfr();
        private results = new Array(this.requests.length);
        private awaitables = this.requests.length;
        //-private wasCompleted = false;

        constructor (private web3: Web3, private requests: IContractRequest[]) {

        }
        async execute (): Promise<any[]> {
            let web3 = this.web3;
            let batch = new web3.BatchRequest();
            let arr = this.requests.map((req, i) => {
                return request(web3, req, (err, result) => {
                    this.onCompleted(i, err, result);
                });
            });

            arr.forEach(req => {
                batch.add(req);
            });
            batch.execute();

            return this.promise;
        }

        private onCompleted (i: number, error: Error, result?) {
            this.results[i] = result ?? error;

            if (--this.awaitables === 0) {
                this.promise.resolve(this.results);
            }
        }
    }

    function prepair (web3: Web3, request: IContractRequest) {
        let { address, method, abi, options, blockNumber, arguments: params } = request;
        let contract = new web3.eth.Contract(abi, address);
        let callArgs = [];
        if (options != null) {
            callArgs[0] = options;
        }
        if (blockNumber != null) {
            callArgs[0] = null;
            callArgs[1] = blockNumber;
        }
        return { contract, method, params, callArgs };
    }
}
