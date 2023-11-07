/**
 *  AUTO-Generated Class: 2023-11-05 00:36
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase, ContractBaseHelper } from '@dequanto/contracts/ContractBase';
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



export class IGovernorCompatibilityBravo extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0x4bf5d7e9
    async CLOCK_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'CLOCK_MODE'));
    }

    // 0xdd4e2ba5
    async COUNTING_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'COUNTING_MODE'));
    }

    // 0x40e58ee5
    async cancel (sender: TSender, proposalId: bigint): Promise<TxWriter>
    // 0x452115d6
    async cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter>
    async cancel (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function cancel(uint256)', 'function cancel(address[], uint256[], bytes[], bytes32) returns uint256' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x56781388
    async castVote (sender: TSender, proposalId: bigint, support: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVote'), sender, proposalId, support);
    }

    // 0x3bccf4fd
    async castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteBySig'), sender, proposalId, support, v, r, s);
    }

    // 0x7b3c71d3
    async castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReason'), sender, proposalId, support, reason);
    }

    // 0x5f398a14
    async castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParams'), sender, proposalId, support, reason, params);
    }

    // 0x03420181
    async castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParamsBySig'), sender, proposalId, support, reason, params, v, r, s);
    }

    // 0x91ddadf4
    async clock (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'clock'));
    }

    // 0x2656227d
    async execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter>
    // 0xfe0d94c1
    async execute (sender: TSender, proposalId: bigint): Promise<TxWriter>
    async execute (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function execute(address[], uint256[], bytes[], bytes32) returns uint256', 'function execute(uint256)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x328dd982
    async getActions (proposalId: bigint): Promise<{ targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[] }> {
        return this.$read(this.$getAbiItem('function', 'getActions'), proposalId);
    }

    // 0xe23a9a52
    async getReceipt (proposalId: bigint, voter: TAddress): Promise<{ hasVoted: boolean, support: number, votes: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getReceipt'), proposalId, voter);
    }

    // 0xeb9019d4
    async getVotes (account: TAddress, timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotes'), account, timepoint);
    }

    // 0x9a802a6d
    async getVotesWithParams (account: TAddress, timepoint: bigint, params: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotesWithParams'), account, timepoint, params);
    }

    // 0x43859632
    async hasVoted (proposalId: bigint, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasVoted'), proposalId, account);
    }

    // 0xc59057e4
    async hashProposal (targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'hashProposal'), targets, values, calldatas, descriptionHash);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0xc01f9e37
    async proposalDeadline (proposalId: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'proposalDeadline'), proposalId);
    }

    // 0x143489d0
    async proposalProposer (proposalId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'proposalProposer'), proposalId);
    }

    // 0x2d63f693
    async proposalSnapshot (proposalId: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'proposalSnapshot'), proposalId);
    }

    // 0x013cf08b
    async proposals (input0: bigint): Promise<{ id: bigint, proposer: TAddress, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean }> {
        return this.$read(this.$getAbiItem('function', 'proposals'), input0);
    }

    // 0x7d5e81e2
    async propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<TxWriter>
    // 0xda95691a
    async propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], description: string): Promise<TxWriter>
    async propose (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function propose(address[], uint256[], bytes[], string) returns uint256', 'function propose(address[], uint256[], string[], bytes[], string) returns uint256' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xddf0b009
    async queue (sender: TSender, proposalId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'queue'), sender, proposalId);
    }

    // 0xf8ce560a
    async quorum (timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quorum'), timepoint);
    }

    // 0x24bc1a64
    async quorumVotes (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quorumVotes'));
    }

    // 0x3e4f49e6
    async state (proposalId: bigint): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'state'), proposalId);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0x54fd4d50
    async version (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'version'));
    }

    // 0x3932abb1
    async votingDelay (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'votingDelay'));
    }

    // 0x02a251a3
    async votingPeriod (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'votingPeriod'));
    }

    $call () {
        return super.$call() as IIGovernorCompatibilityBravoTxCaller;
    }

    $data (): IIGovernorCompatibilityBravoTxData {
        return super.$data() as IIGovernorCompatibilityBravoTxData;
    }
    $gas (): TOverrideReturns<IIGovernorCompatibilityBravoTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onProposalCanceled (fn?: (event: TClientEventsStreamData<TLogProposalCanceledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalCanceledParameters>> {
        return this.$onLog('ProposalCanceled', fn);
    }

    onProposalCreated (fn?: (event: TClientEventsStreamData<TLogProposalCreatedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalCreatedParameters>> {
        return this.$onLog('ProposalCreated', fn);
    }

    onProposalExecuted (fn?: (event: TClientEventsStreamData<TLogProposalExecutedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalExecutedParameters>> {
        return this.$onLog('ProposalExecuted', fn);
    }

    onVoteCast (fn?: (event: TClientEventsStreamData<TLogVoteCastParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogVoteCastParameters>> {
        return this.$onLog('VoteCast', fn);
    }

    onVoteCastWithParams (fn?: (event: TClientEventsStreamData<TLogVoteCastWithParamsParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogVoteCastWithParamsParameters>> {
        return this.$onLog('VoteCastWithParams', fn);
    }

    extractLogsProposalCanceled (tx: TEth.TxReceipt): ITxLogItem<TLogProposalCanceled>[] {
        let abi = this.$getAbiItem('event', 'ProposalCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCanceled>[];
    }

    extractLogsProposalCreated (tx: TEth.TxReceipt): ITxLogItem<TLogProposalCreated>[] {
        let abi = this.$getAbiItem('event', 'ProposalCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCreated>[];
    }

    extractLogsProposalExecuted (tx: TEth.TxReceipt): ITxLogItem<TLogProposalExecuted>[] {
        let abi = this.$getAbiItem('event', 'ProposalExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalExecuted>[];
    }

    extractLogsVoteCast (tx: TEth.TxReceipt): ITxLogItem<TLogVoteCast>[] {
        let abi = this.$getAbiItem('event', 'VoteCast');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCast>[];
    }

    extractLogsVoteCastWithParams (tx: TEth.TxReceipt): ITxLogItem<TLogVoteCastWithParams>[] {
        let abi = this.$getAbiItem('event', 'VoteCastWithParams');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCastWithParams>[];
    }

    async getPastLogsProposalCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCanceled>[]> {
        return await this.$getPastLogsParsed('ProposalCanceled', options) as any;
    }

    async getPastLogsProposalCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCreated>[]> {
        return await this.$getPastLogsParsed('ProposalCreated', options) as any;
    }

    async getPastLogsProposalExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalExecuted>[]> {
        return await this.$getPastLogsParsed('ProposalExecuted', options) as any;
    }

    async getPastLogsVoteCast (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCast>[]> {
        return await this.$getPastLogsParsed('VoteCast', options) as any;
    }

    async getPastLogsVoteCastWithParams (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCastWithParams>[]> {
        return await this.$getPastLogsParsed('VoteCastWithParams', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"address[]","name":"targets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"},{"indexed":false,"internalType":"string[]","name":"signatures","type":"string[]"},{"indexed":false,"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"indexed":false,"internalType":"uint256","name":"voteStart","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"voteEnd","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"VoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"VoteCastWithParams","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COUNTING_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"cancel","outputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"}],"name":"castVote","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteBySig","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"}],"name":"castVoteWithReason","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"castVoteWithReasonAndParams","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteWithReasonAndParamsBySig","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"execute","outputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"execute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"getActions","outputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"string[]","name":"signatures","type":"string[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"voter","type":"address"}],"name":"getReceipt","outputs":[{"components":[{"internalType":"bool","name":"hasVoted","type":"bool"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint96","name":"votes","type":"uint96"}],"internalType":"struct IGovernorCompatibilityBravo.Receipt","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"getVotesWithParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"account","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"hashProposal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalProposer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"uint256","name":"eta","type":"uint256"},{"internalType":"uint256","name":"startBlock","type":"uint256"},{"internalType":"uint256","name":"endBlock","type":"uint256"},{"internalType":"uint256","name":"forVotes","type":"uint256"},{"internalType":"uint256","name":"againstVotes","type":"uint256"},{"internalType":"uint256","name":"abstainVotes","type":"uint256"},{"internalType":"bool","name":"canceled","type":"bool"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"string[]","name":"signatures","type":"string[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"queue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"quorum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"quorumVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"state","outputs":[{"internalType":"enum IGovernor.ProposalState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogProposalCanceled = {
        proposalId: bigint
    };
    type TLogProposalCanceledParameters = [ proposalId: bigint ];
    type TLogProposalCreated = {
        proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], voteStart: bigint, voteEnd: bigint, description: string
    };
    type TLogProposalCreatedParameters = [ proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], voteStart: bigint, voteEnd: bigint, description: string ];
    type TLogProposalExecuted = {
        proposalId: bigint
    };
    type TLogProposalExecutedParameters = [ proposalId: bigint ];
    type TLogVoteCast = {
        voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string
    };
    type TLogVoteCastParameters = [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string ];
    type TLogVoteCastWithParams = {
        voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TBufferLike
    };
    type TLogVoteCastWithParamsParameters = [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TBufferLike ];

interface IEvents {
  ProposalCanceled: TLogProposalCanceledParameters
  ProposalCreated: TLogProposalCreatedParameters
  ProposalExecuted: TLogProposalExecutedParameters
  VoteCast: TLogVoteCastParameters
  VoteCastWithParams: TLogVoteCastWithParamsParameters
  '*': any[] 
}



interface IMethodCLOCK_MODE {
  method: "CLOCK_MODE"
  arguments: [  ]
}

interface IMethodCOUNTING_MODE {
  method: "COUNTING_MODE"
  arguments: [  ]
}

interface IMethodCancel {
  method: "cancel"
  arguments: [ proposalId: bigint ] | [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodCastVote {
  method: "castVote"
  arguments: [ proposalId: bigint, support: number ]
}

interface IMethodCastVoteBySig {
  method: "castVoteBySig"
  arguments: [ proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike ]
}

interface IMethodCastVoteWithReason {
  method: "castVoteWithReason"
  arguments: [ proposalId: bigint, support: number, reason: string ]
}

interface IMethodCastVoteWithReasonAndParams {
  method: "castVoteWithReasonAndParams"
  arguments: [ proposalId: bigint, support: number, reason: string, params: TBufferLike ]
}

interface IMethodCastVoteWithReasonAndParamsBySig {
  method: "castVoteWithReasonAndParamsBySig"
  arguments: [ proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike ]
}

interface IMethodClock {
  method: "clock"
  arguments: [  ]
}

interface IMethodExecute {
  method: "execute"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ] | [ proposalId: bigint ]
}

interface IMethodGetActions {
  method: "getActions"
  arguments: [ proposalId: bigint ]
}

interface IMethodGetReceipt {
  method: "getReceipt"
  arguments: [ proposalId: bigint, voter: TAddress ]
}

interface IMethodGetVotes {
  method: "getVotes"
  arguments: [ account: TAddress, timepoint: bigint ]
}

interface IMethodGetVotesWithParams {
  method: "getVotesWithParams"
  arguments: [ account: TAddress, timepoint: bigint, params: TBufferLike ]
}

interface IMethodHasVoted {
  method: "hasVoted"
  arguments: [ proposalId: bigint, account: TAddress ]
}

interface IMethodHashProposal {
  method: "hashProposal"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodProposalDeadline {
  method: "proposalDeadline"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposalProposer {
  method: "proposalProposer"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposalSnapshot {
  method: "proposalSnapshot"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposals {
  method: "proposals"
  arguments: [ input0: bigint ]
}

interface IMethodPropose {
  method: "propose"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string ] | [ targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], description: string ]
}

interface IMethodQueue {
  method: "queue"
  arguments: [ proposalId: bigint ]
}

interface IMethodQuorum {
  method: "quorum"
  arguments: [ timepoint: bigint ]
}

interface IMethodQuorumVotes {
  method: "quorumVotes"
  arguments: [  ]
}

interface IMethodState {
  method: "state"
  arguments: [ proposalId: bigint ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodVersion {
  method: "version"
  arguments: [  ]
}

interface IMethodVotingDelay {
  method: "votingDelay"
  arguments: [  ]
}

interface IMethodVotingPeriod {
  method: "votingPeriod"
  arguments: [  ]
}

interface IMethods {
  CLOCK_MODE: IMethodCLOCK_MODE
  COUNTING_MODE: IMethodCOUNTING_MODE
  cancel: IMethodCancel
  castVote: IMethodCastVote
  castVoteBySig: IMethodCastVoteBySig
  castVoteWithReason: IMethodCastVoteWithReason
  castVoteWithReasonAndParams: IMethodCastVoteWithReasonAndParams
  castVoteWithReasonAndParamsBySig: IMethodCastVoteWithReasonAndParamsBySig
  clock: IMethodClock
  execute: IMethodExecute
  getActions: IMethodGetActions
  getReceipt: IMethodGetReceipt
  getVotes: IMethodGetVotes
  getVotesWithParams: IMethodGetVotesWithParams
  hasVoted: IMethodHasVoted
  hashProposal: IMethodHashProposal
  name: IMethodName
  proposalDeadline: IMethodProposalDeadline
  proposalProposer: IMethodProposalProposer
  proposalSnapshot: IMethodProposalSnapshot
  proposals: IMethodProposals
  propose: IMethodPropose
  queue: IMethodQueue
  quorum: IMethodQuorum
  quorumVotes: IMethodQuorumVotes
  state: IMethodState
  supportsInterface: IMethodSupportsInterface
  version: IMethodVersion
  votingDelay: IMethodVotingDelay
  votingPeriod: IMethodVotingPeriod
  '*': { method: string, arguments: any[] } 
}






interface IIGovernorCompatibilityBravoTxCaller {
    cancel (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], description: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queue (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIGovernorCompatibilityBravoTxData {
    cancel (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TEth.TxLike>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<TEth.TxLike>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<TEth.TxLike>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TEth.TxLike>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<TEth.TxLike>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<TEth.TxLike>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TEth.TxLike>
    execute (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<TEth.TxLike>
    propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], description: string): Promise<TEth.TxLike>
    queue (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
}


