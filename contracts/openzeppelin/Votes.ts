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

export namespace VotesErrors {
    export interface InvalidShortString {
        type: 'InvalidShortString'
        params: {
        }
    }
    export interface StringTooLong {
        type: 'StringTooLong'
        params: {
            str: string
        }
    }
    export type Error = InvalidShortString | StringTooLong
}

export class Votes extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
    "class": "./contracts/openzeppelin/Votes.ts"
}

    // 0x4bf5d7e9
    async CLOCK_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'CLOCK_MODE'));
    }

    // 0x3644e515
    async DOMAIN_SEPARATOR (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'DOMAIN_SEPARATOR'));
    }

    // 0x91ddadf4
    async clock (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'clock'));
    }

    // 0x5c19a95c
    async delegate (sender: TSender, delegatee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegate'), sender, delegatee);
    }

    // 0xc3cda520
    async delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegateBySig'), sender, delegatee, nonce, expiry, v, r, s);
    }

    // 0x587cde1e
    async delegates (account: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'delegates'), account);
    }

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TEth.Hex, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TEth.Hex, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    // 0x8e539e8c
    async getPastTotalSupply (timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getPastTotalSupply'), timepoint);
    }

    // 0x3a46b1a8
    async getPastVotes (account: TAddress, timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getPastVotes'), account, timepoint);
    }

    // 0x9ab24eb0
    async getVotes (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotes'), account);
    }

    // 0x7ecebe00
    async nonces (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonces'), owner);
    }

    $call () {
        return super.$call() as IVotesTxCaller;
    }
    $signed (): TOverrideReturns<IVotesTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IVotesTxData {
        return super.$data() as IVotesTxData;
    }
    $gas (): TOverrideReturns<IVotesTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onDelegateChanged (fn?: (event: TClientEventsStreamData<TLogDelegateChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDelegateChangedParameters>> {
        return this.$onLog('DelegateChanged', fn);
    }

    onDelegateVotesChanged (fn?: (event: TClientEventsStreamData<TLogDelegateVotesChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDelegateVotesChangedParameters>> {
        return this.$onLog('DelegateVotesChanged', fn);
    }

    onEIP712DomainChanged (fn?: (event: TClientEventsStreamData<TLogEIP712DomainChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogEIP712DomainChangedParameters>> {
        return this.$onLog('EIP712DomainChanged', fn);
    }

    extractLogsDelegateChanged (tx: TEth.TxReceipt): ITxLogItem<TLogDelegateChanged>[] {
        let abi = this.$getAbiItem('event', 'DelegateChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDelegateChanged>[];
    }

    extractLogsDelegateVotesChanged (tx: TEth.TxReceipt): ITxLogItem<TLogDelegateVotesChanged>[] {
        let abi = this.$getAbiItem('event', 'DelegateVotesChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDelegateVotesChanged>[];
    }

    extractLogsEIP712DomainChanged (tx: TEth.TxReceipt): ITxLogItem<TLogEIP712DomainChanged>[] {
        let abi = this.$getAbiItem('event', 'EIP712DomainChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogEIP712DomainChanged>[];
    }

    async getPastLogsDelegateChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegator?: TAddress,fromDelegate?: TAddress,toDelegate?: TAddress }
    }): Promise<ITxLogItem<TLogDelegateChanged>[]> {
        return await this.$getPastLogsParsed('DelegateChanged', options) as any;
    }

    async getPastLogsDelegateVotesChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegate?: TAddress }
    }): Promise<ITxLogItem<TLogDelegateVotesChanged>[]> {
        return await this.$getPastLogsParsed('DelegateVotesChanged', options) as any;
    }

    async getPastLogsEIP712DomainChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogEIP712DomainChanged>[]> {
        return await this.$getPastLogsParsed('EIP712DomainChanged', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogDelegateChanged = {
        delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress
    };
    type TLogDelegateChangedParameters = [ delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress ];
    type TLogDelegateVotesChanged = {
        delegate: TAddress, previousBalance: bigint, newBalance: bigint
    };
    type TLogDelegateVotesChangedParameters = [ delegate: TAddress, previousBalance: bigint, newBalance: bigint ];
    type TLogEIP712DomainChanged = {
        
    };
    type TLogEIP712DomainChangedParameters = [  ];

interface IEvents {
  DelegateChanged: TLogDelegateChangedParameters
  DelegateVotesChanged: TLogDelegateVotesChangedParameters
  EIP712DomainChanged: TLogEIP712DomainChangedParameters
  '*': any[] 
}



interface IMethodCLOCK_MODE {
  method: "CLOCK_MODE"
  arguments: [  ]
}

interface IMethodDOMAIN_SEPARATOR {
  method: "DOMAIN_SEPARATOR"
  arguments: [  ]
}

interface IMethodClock {
  method: "clock"
  arguments: [  ]
}

interface IMethodDelegate {
  method: "delegate"
  arguments: [ delegatee: TAddress ]
}

interface IMethodDelegateBySig {
  method: "delegateBySig"
  arguments: [ delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex ]
}

interface IMethodDelegates {
  method: "delegates"
  arguments: [ account: TAddress ]
}

interface IMethodEip712Domain {
  method: "eip712Domain"
  arguments: [  ]
}

interface IMethodGetPastTotalSupply {
  method: "getPastTotalSupply"
  arguments: [ timepoint: bigint ]
}

interface IMethodGetPastVotes {
  method: "getPastVotes"
  arguments: [ account: TAddress, timepoint: bigint ]
}

interface IMethodGetVotes {
  method: "getVotes"
  arguments: [ account: TAddress ]
}

interface IMethodNonces {
  method: "nonces"
  arguments: [ owner: TAddress ]
}

interface IMethods {
  CLOCK_MODE: IMethodCLOCK_MODE
  DOMAIN_SEPARATOR: IMethodDOMAIN_SEPARATOR
  clock: IMethodClock
  delegate: IMethodDelegate
  delegateBySig: IMethodDelegateBySig
  delegates: IMethodDelegates
  eip712Domain: IMethodEip712Domain
  getPastTotalSupply: IMethodGetPastTotalSupply
  getPastVotes: IMethodGetPastVotes
  getVotes: IMethodGetVotes
  nonces: IMethodNonces
  '*': { method: string, arguments: any[] } 
}






interface IVotesTxCaller {
    delegate (sender: TSender, delegatee: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IVotesTxData {
    delegate (sender: TSender, delegatee: TAddress): Promise<TEth.TxLike>
    delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
}


