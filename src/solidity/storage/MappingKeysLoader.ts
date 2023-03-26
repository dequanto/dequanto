import alot from 'alot';
import memd from 'memd';
import type { AbiItem } from 'web3-utils';
import type { PastLogsOptions } from 'web3-core';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $require } from '@dequanto/utils/$require';
import { MappingSettersResolver, TMappingSetterEvent } from '../SlotsParser/MappingSettersResolver';
import { SourceCodeProvider } from '../SourceCodeProvider';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { $logger } from '@dequanto/utils/$logger';
import { $contract } from '@dequanto/utils/$contract';
import { File } from 'atma-io';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';

export class MappingKeysLoader {

    private address = this.params.address;
    private implementation = this.params.implementation;

    private client = this.params.client ?? Web3ClientFactory.get(this.params.platform ?? 'eth')
    private explorer = this.params.explorer ?? BlockChainExplorerProvider.get(this.client.platform)
    private sourceCodeProvider = this.params.sourceCodeProvider ?? new SourceCodeProvider(this.client, this.explorer)

    private logger = this.params.logger ?? $logger;

    constructor(private params: {
        address: TAddress
        /** Optionally, the implementation contract to load sources from. Otherwise it will detect automatically if the "address" is the proxy contract */
        implementation?: TAddress

        platform?: TPlatform
        client?: Web3Client
        explorer?: IBlockChainExplorer
        sourceCodeProvider?: SourceCodeProvider
        logger?: typeof $logger
    }) {
        $require.Address(this?.address);
    }

    async load(mappingVarName: string) {
        let source = await this.loadSourceCode();
        this.logger.log(`Source code for "${ source.main.contractName }" loaded to extract "${mappingVarName}"`);
        let { errors, events, methods } = await MappingSettersResolver.getEventsForMappingMutations(mappingVarName, {
            path: source.main.path,
            code: source.main.content
        }, source.main.contractName, { files: source.files });

        let error = errors?.[0];
        if (error != null) {
            throw error;
        }

        let eventMessage = `For the key "${mappingVarName}" found ${events.length} mutation Events (${events.map(x => x.event.name).join(',')})`;
        let methodsMessage = methods.length
            ? ` and ${ methods.length } mutation methods without Events (${methods.map(x => x.method.name).join(',')})`
            : ''
        this.logger.log(`${eventMessage} ${methodsMessage}`);


        let keys = await alot(events)
            .mapManyAsync(async eventInfo => {
                const logs = await this.loadEvents(eventInfo.event);
                this.logger.log(`Loaded ${logs.length} ${ eventInfo.event.name } Events to pick arguments at ${eventInfo.accessorsIdxMapping.join(', ')}`);

                const keys = logs.map(log => {
                    return eventInfo
                        .accessorsIdxMapping
                        .map(idx => log.arguments[idx]?.value);
                });
                return keys;
            })
            .toArrayAsync();

        let unique = alot(keys).distinctBy(x => x.join('')).toArray();
        return unique;
    }

    @memd.deco.memoize({ perInstance: true })
    private async loadSourceCode() {
        let source = await this.sourceCodeProvider.getSourceCode({
            address: this.address,
            implementation: this.implementation,
        });
        return source;
    }

    private async loadEvents(ev: AbiItem) {
        const logs = await this.loadEventsByTopic($abiUtils.getTopicSignature(ev));
        return logs.map(log => $contract.parseLogWithAbi(log, ev));
    }

    @memd.deco.memoize({ perInstance: true })
    private async loadEventsByTopic(topic0: string) {
        // get the contracts deployment date to skip lots of blocks (in case we use pagination to fetch logs)
        let fromBlock = 0;
        try {
            let dateResolver = new ContractCreationResolver(this.client, this.explorer);
            let info = await dateResolver.getInfo(this.address);
            fromBlock = info.block - 1;
        } catch (error) {
            // Skip any explorer errors and look from block 0
        }

        let filters = <PastLogsOptions>{
            address: this.address,
            fromBlock: fromBlock,
            topics: [
                topic0
            ]
        };

        let logs = await this.client.getPastLogs(filters);
        return logs;
    }
}
