/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: https://etherscan.io/address/undefined#code
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



export class AccessControlCrossChain extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
    "class": "./contracts/openzeppelin/AccessControlCrossChain.ts"
}

    // 0xf9d04295
    async CROSSCHAIN_ALIAS (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'CROSSCHAIN_ALIAS'));
    }

    // 0xa217fddf
    async DEFAULT_ADMIN_ROLE (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'DEFAULT_ADMIN_ROLE'));
    }

    // 0x248a9ca3
    async getRoleAdmin (role: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
    }

    // 0x2f2ff15d
    async grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
    }

    // 0x91d14854
    async hasRole (role: TEth.Hex, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
    }

    // 0x36568abe
    async renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
    }

    // 0xd547741f
    async revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    $call () {
        return super.$call() as IAccessControlCrossChainTxCaller;
    }
    $signed (): TOverrideReturns<IAccessControlCrossChainTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAccessControlCrossChainTxData {
        return super.$data() as IAccessControlCrossChainTxData;
    }
    $gas (): TOverrideReturns<IAccessControlCrossChainTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onRoleAdminChanged (fn?: (event: TClientEventsStreamData<TLogRoleAdminChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleAdminChangedParameters>> {
        return this.$onLog('RoleAdminChanged', fn);
    }

    onRoleGranted (fn?: (event: TClientEventsStreamData<TLogRoleGrantedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleGrantedParameters>> {
        return this.$onLog('RoleGranted', fn);
    }

    onRoleRevoked (fn?: (event: TClientEventsStreamData<TLogRoleRevokedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleRevokedParameters>> {
        return this.$onLog('RoleRevoked', fn);
    }

    extractLogsRoleAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TLogRoleAdminChanged>[] {
        let abi = this.$getAbiItem('event', 'RoleAdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleAdminChanged>[];
    }

    extractLogsRoleGranted (tx: TEth.TxReceipt): ITxLogItem<TLogRoleGranted>[] {
        let abi = this.$getAbiItem('event', 'RoleGranted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleGranted>[];
    }

    extractLogsRoleRevoked (tx: TEth.TxReceipt): ITxLogItem<TLogRoleRevoked>[] {
        let abi = this.$getAbiItem('event', 'RoleRevoked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleRevoked>[];
    }

    async getPastLogsRoleAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,previousAdminRole?: TEth.Hex,newAdminRole?: TEth.Hex }
    }): Promise<ITxLogItem<TLogRoleAdminChanged>[]> {
        return await this.$getPastLogsParsed('RoleAdminChanged', options) as any;
    }

    async getPastLogsRoleGranted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleGranted>[]> {
        return await this.$getPastLogsParsed('RoleGranted', options) as any;
    }

    async getPastLogsRoleRevoked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleRevoked>[]> {
        return await this.$getPastLogsParsed('RoleRevoked', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"CROSSCHAIN_ALIAS","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogRoleAdminChanged = {
        role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex
    };
    type TLogRoleAdminChangedParameters = [ role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex ];
    type TLogRoleGranted = {
        role: TEth.Hex, account: TAddress, _sender: TAddress
    };
    type TLogRoleGrantedParameters = [ role: TEth.Hex, account: TAddress, _sender: TAddress ];
    type TLogRoleRevoked = {
        role: TEth.Hex, account: TAddress, _sender: TAddress
    };
    type TLogRoleRevokedParameters = [ role: TEth.Hex, account: TAddress, _sender: TAddress ];

interface IEvents {
  RoleAdminChanged: TLogRoleAdminChangedParameters
  RoleGranted: TLogRoleGrantedParameters
  RoleRevoked: TLogRoleRevokedParameters
  '*': any[] 
}



interface IMethodCROSSCHAIN_ALIAS {
  method: "CROSSCHAIN_ALIAS"
  arguments: [  ]
}

interface IMethodDEFAULT_ADMIN_ROLE {
  method: "DEFAULT_ADMIN_ROLE"
  arguments: [  ]
}

interface IMethodGetRoleAdmin {
  method: "getRoleAdmin"
  arguments: [ role: TEth.Hex ]
}

interface IMethodGrantRole {
  method: "grantRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodHasRole {
  method: "hasRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodRenounceRole {
  method: "renounceRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodRevokeRole {
  method: "revokeRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TEth.Hex ]
}

interface IMethods {
  CROSSCHAIN_ALIAS: IMethodCROSSCHAIN_ALIAS
  DEFAULT_ADMIN_ROLE: IMethodDEFAULT_ADMIN_ROLE
  getRoleAdmin: IMethodGetRoleAdmin
  grantRole: IMethodGrantRole
  hasRole: IMethodHasRole
  renounceRole: IMethodRenounceRole
  revokeRole: IMethodRevokeRole
  supportsInterface: IMethodSupportsInterface
  '*': { method: string, arguments: any[] } 
}






interface IAccessControlCrossChainTxCaller {
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAccessControlCrossChainTxData {
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
}


