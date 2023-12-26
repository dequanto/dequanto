/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: ./node_modules/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractBaseUtils } from '@dequanto/contracts/utils/ContractBaseUtils';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class TransparentUpgradeableProxy extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new TransparentUpgradeableProxyStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
    "source": "./node_modules/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    "class": "./contracts/openzeppelin/compiled/TransparentUpgradeableProxy/TransparentUpgradeableProxy.ts"
}

    async $constructor (deployer: TSender, _logic: TAddress, admin_: TAddress, _data: TEth.Hex): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    $call () {
        return super.$call() as ITransparentUpgradeableProxyTxCaller;
    }
    $signed (): TOverrideReturns<ITransparentUpgradeableProxyTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ITransparentUpgradeableProxyTxData {
        return super.$data() as ITransparentUpgradeableProxyTxData;
    }
    $gas (): TOverrideReturns<ITransparentUpgradeableProxyTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onUpgraded (fn?: (event: TClientEventsStreamData<TLogUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUpgradedParameters>> {
        return this.$onLog('Upgraded', fn);
    }

    onAdminChanged (fn?: (event: TClientEventsStreamData<TLogAdminChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAdminChangedParameters>> {
        return this.$onLog('AdminChanged', fn);
    }

    onBeaconUpgraded (fn?: (event: TClientEventsStreamData<TLogBeaconUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBeaconUpgradedParameters>> {
        return this.$onLog('BeaconUpgraded', fn);
    }

    extractLogsUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogUpgraded>[] {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUpgraded>[];
    }

    extractLogsAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TLogAdminChanged>[] {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAdminChanged>[];
    }

    extractLogsBeaconUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogBeaconUpgraded>[] {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBeaconUpgraded>[];
    }

    async getPastLogsUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { implementation?: TAddress }
    }): Promise<ITxLogItem<TLogUpgraded>[]> {
        return await this.$getPastLogsParsed('Upgraded', options) as any;
    }

    async getPastLogsAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogAdminChanged>[]> {
        return await this.$getPastLogsParsed('AdminChanged', options) as any;
    }

    async getPastLogsBeaconUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { beacon?: TAddress }
    }): Promise<ITxLogItem<TLogBeaconUpgraded>[]> {
        return await this.$getPastLogsParsed('BeaconUpgraded', options) as any;
    }

    abi: TAbiItem[] = [{"type":"fallback","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"event","name":"Upgraded","inputs":[{"name":"implementation","type":"address","indexed":true}]},{"type":"event","name":"AdminChanged","inputs":[{"name":"previousAdmin","type":"address","indexed":false},{"name":"newAdmin","type":"address","indexed":false}]},{"type":"event","name":"BeaconUpgraded","inputs":[{"name":"beacon","type":"address","indexed":true}]},{"type":"constructor","name":"constructor","inputs":[{"name":"_logic","type":"address"},{"name":"admin_","type":"address"},{"name":"_data","type":"bytes"}],"outputs":[],"stateMutability":"payable"}]

    declare storage: TransparentUpgradeableProxyStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogUpgraded = {
        implementation: TAddress
    };
    type TLogUpgradedParameters = [ implementation: TAddress ];
    type TLogAdminChanged = {
        previousAdmin: TAddress, newAdmin: TAddress
    };
    type TLogAdminChangedParameters = [ previousAdmin: TAddress, newAdmin: TAddress ];
    type TLogBeaconUpgraded = {
        beacon: TAddress
    };
    type TLogBeaconUpgradedParameters = [ beacon: TAddress ];

interface IEvents {
  Upgraded: TLogUpgradedParameters
  AdminChanged: TLogAdminChangedParameters
  BeaconUpgraded: TLogBeaconUpgradedParameters
  '*': any[] 
}





interface IMethods {
  '*': { method: string, arguments: any[] } 
}





class TransparentUpgradeableProxyStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }



    $slots = []

}



interface ITransparentUpgradeableProxyTxCaller {

}


interface ITransparentUpgradeableProxyTxData {

}


