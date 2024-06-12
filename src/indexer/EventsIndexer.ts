import alot from 'alot';
import memd from 'memd';
import { ContractBase, TEventLogOptions } from '@dequanto/contracts/ContractBase';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $date } from '@dequanto/utils/$date';
import { $require } from '@dequanto/utils/$require';
import { TAddress } from '@dequanto/models/TAddress';
import { IEventsIndexerMetaStore, IEventsIndexerStore } from './storage/interfaces';
import { FsEventsIndexerStore } from './storage/FsEventsIndexerStore';
import { FsEventsMetaStore } from './storage/FsEventsMetaStore';
import { class_Dfr } from 'atma-utils';
import { TLogsRangeProgress } from '@dequanto/clients/Web3Client';
import { WClient } from '@dequanto/clients/ClientPool';
import { TEth } from '@dequanto/models/TEth';


export class EventsIndexer <T extends ContractBase> {

    public store: IEventsIndexerStore
    public storeMeta: IEventsIndexerMetaStore

    constructor(public contract: T, public options: {
        // Load events from the contract that was deployed to multiple addresses
        addresses?: TAddress[]
        name?: string
        initialBlockNumber?: number
        store?: IEventsIndexerStore
        storeMeta?: IEventsIndexerMetaStore
        fs?: {
            /** Is used as a base directory. Later the ContractName and the address(es) hash will be appended */
            directory?: string

            /** The events will be splitted into multiple files by block range */
            // @default ~1week
            rangeSeconds?: number
            // @default is taken from Web3Client
            blockTimeAvg?: number
        }
    }) {
        let client = contract.client;

        this.store = options?.store ?? new FsEventsIndexerStore(contract, {
            addresses: this.options.addresses,
            name: this.options.name,
            initialBlockNumber: this.options.initialBlockNumber,
            fs: {
                directory: options?.fs?.directory,
                rangeSeconds: options?.fs?.rangeSeconds ?? $date.parseTimespan('1week', { get: 's' }),
                blockTimeAvg: options?.fs?.blockTimeAvg ?? client.blockTimeAvg
            }
        });

        this.storeMeta = options?.storeMeta ?? new FsEventsMetaStore(contract, {
            addresses: this.options.addresses,
            name: this.options.name,
            fs: {
                directory: options?.fs?.directory,
            }
        });
    }

    /** @deprecated For migration only */
    async fsEnsureMigrated () {
        $require.True(this.store instanceof FsEventsIndexerStore);
        $require.True(this.storeMeta instanceof FsEventsMetaStore);

        await (this.store as FsEventsIndexerStore<T>).ensureMigrated();
        await (this.storeMeta as FsEventsMetaStore<T>).ensureMigrated();
    }

    async getPastLogs <
        TLogName extends GetEventLogNames<T>,
    > (
        event: TLogName | TLogName[] | '*',
        // Fetch all logs and filter later if needed
        //- params?: T[TMethodName] extends (options: { params?: infer TParams }) => any ? TParams : never,
        filter?: {
            fromBlock?: number
            toBlock?: number
        }
    ): Promise<{
        logs: ITxLogItem<GetTypes<T>['Events'][TLogName]['outputParams']>[],
    }> {
        let contract = this.contract;
        let client = contract.client;
        let toBlock = filter?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, toBlock)
        let logs = await this.getPastLogsRanges(ranges, events, toBlock, filter?.fromBlock);

        return {
            logs: logs as any
        };
    }

    async * getPastLogsStream <
        TLogName extends GetEventLogNames<T>,
    > (
        event: TLogName | TLogName[] | '*',
        // Fetch all logs and filter later if needed
        //- params?: T[TMethodName] extends (options: { params?: infer TParams }) => any ? TParams : never,
        options?: {
            fromBlock?: number
            toBlock?: number
            blockRangeLimits?: WClient['blockRangeLimits']
        },
    ): AsyncGenerator<
        TLogsRangeProgress<
            ITxLogItem<GetTypes<T>['Events'][TLogName]['outputParams'], string>
        >       // next result
        , void  // void returns
        , void  // next doesn't get any parameter
    > {
        let contract = this.contract;
        let client = contract.client;
        let toBlock = options?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let ranges = await this.getRanges(events, options?.fromBlock ?? this.options.initialBlockNumber, toBlock);

        let dfrInner = new class_Dfr<any>();
        let dfrOuter = new class_Dfr<any>();

        this.getPastLogsRanges(ranges, events, toBlock, options?.fromBlock, {
            blockRangeLimits: options?.blockRangeLimits,
            streamed: true,
            async onProgress (info) {
                dfrInner.resolve(info);
                await dfrOuter;
            }
        });

        while (true) {
            let result = await dfrInner;
            dfrOuter.defer();
            dfrInner.defer();

            try {
                yield result;
            } catch (err) {
                dfrOuter.reject(err);
                break;
            }

            dfrOuter.resolve();

            if (result.completed) {
                break;
            }
        }
    }

    private async getRanges (events: string[], initialBlockNumber: number, toBlock: number, fromBlock?: number): Promise<TRange[]> {
        let logsMetaArr = await this.storeMeta.fetch();
        let eventsBlock = alot(logsMetaArr).toDictionary(x => x.event, x => x.lastBlock);
        let logsMeta = events.map(event => {
            let blockNr = eventsBlock[event] ?? initialBlockNumber;
            return {
                event: event,
                lastBlock: blockNr
            }
        });
        let hasInitialBlock = logsMeta.every(x => x.lastBlock != null);
        if (hasInitialBlock === false) {
            let blockNr = fromBlock ?? await this.getInitialBlockNumber();
            logsMeta.filter(x => x.lastBlock == null).forEach(x => x.lastBlock = blockNr);
        };

        let ranges = [] as TRange[];
        let blockNumbers = [ ...logsMeta.map(x => x.lastBlock), toBlock ];
        let blockNumberSteps = alot(blockNumbers).distinct().sortBy(x => x).toArray();

        for (let i = 0; i < blockNumberSteps.length - 1; i++) {
            let from = blockNumberSteps[i];
            if (i > 0) {
                from += 1;
            }
            let to = blockNumberSteps[i + 1];
            let events = logsMeta.filter(x => x.lastBlock < to).map(x =>x.event);
            ranges.push({
                fromBlock: from,
                toBlock: to,
                events: events
            });
        }
        return ranges;
    }
    private async getPastLogsRanges (ranges: TRange[], events: string[], toBlock: number, fromBlock?: number, options?: TEventLogOptions<TEth.Log>) {
        // Save indexed logs every 2 minutes
        let PERSIST_INTERVAL = $date.parseTimespan('2min');
        let time = Date.now();
        let contract = this.contract;
        let buffer = [] as ITxLogItem<any>[];

        if (options?.streamed === true) {
            let arr = await this.getItemsFromStore({
                fromBlock: fromBlock,
                toBlock: toBlock,
                events
            });
            if (arr?.length > 0) {
                let latestBlock = arr[arr.length - 1].blockNumber;
                await options.onProgress({
                    logs: arr,
                    paged: arr,
                    completed: false,
                    blocksPerSecond: 0,
                    blocks: { total: 0, loaded: 0 },
                    timeLeftSeconds: 0,
                    latestBlock: latestBlock
                });
            }
        }

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            let { fromBlock, toBlock, events } = range;

            let fetched = await contract.getPastLogs(events, {
                streamed: options?.streamed,
                addresses: this.options.addresses,
                fromBlock: fromBlock,
                toBlock: toBlock,
                blockRangeLimits: options?.blockRangeLimits,
                onProgress: async info => {
                    if (options?.streamed !== true) {
                        buffer.push(...info.paged);
                    }

                    if (options?.onProgress) {
                        // completed must be set to true only when the last Range completes
                        info.completed = i < ranges.length - 1
                            ? false
                            : info.completed;
                        await options.onProgress(info);
                    }

                    let now = Date.now();
                    if (buffer.length > 0 && now - time > PERSIST_INTERVAL) {
                        let cloned = buffer.slice();
                        buffer = [];
                        time = now;

                        await this.upsert(cloned, events, info.latestBlock);
                    }
                }
            });

            if (fetched?.length > 0) {
                await this.upsert(fetched, events, toBlock);
            }
        }


        // Upsert final, if buffer is empty, we still persist the toBlock
        await this.upsert(buffer, events, toBlock);

        if (options?.streamed === true) {
            return;
        }

        let logs = await this.getItemsFromStore({
            fromBlock: fromBlock,
            toBlock: toBlock + 1,
            events: events
        });

        return logs;
    }


    private async getItemsFromStore (filter: {
        fromBlock?: number
        toBlock?: number
        events?: string[]
    }) {
        let arr = await this.store.fetch(filter);
        let events = filter.events;
        if (events?.[0] !== '*') {
            let requestedEvents = alot(events).toDictionary(x => x);
            arr = arr.filter(x => x.event in requestedEvents);
        }

        return arr;
    }

    private async getInitialBlockNumber () {
        let client = this.contract.client;
        if (client.platform !== 'hardhat') {
            let explorer = await BlockChainExplorerProvider.get(this.contract.client.platform);
            let deployment = new ContractCreationResolver(client, explorer);
            let contractInfo = await deployment.getInfo(this.contract.address);
            return $require.Number(contractInfo.block, `Contract deployment not resolved from the blockchain explorer`);
        }
        return 0;
    }

    @memd.deco.queued()
    private async upsert (logs, events: string[], latestBlock: number) {
        if (logs?.length > 0) {
            await this.store.upsertMany(logs);
        }
        const logsMeta =  events.map(event => ({ event, lastBlock: latestBlock }));
        await this.storeMeta.upsertMany(logsMeta);
    }
}

type TRange = {
    events: string[]
    fromBlock: number
    toBlock: number
}


type GetEventLogNames<T extends ContractBase> = keyof T['Types']['Events'];
type GetTypes<T extends ContractBase> = T['Types'];
