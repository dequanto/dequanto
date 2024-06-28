import { Config } from '@dequanto/config/Config';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { EoAccount, IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { Rpc, RpcTypes } from '@dequanto/rpc/Rpc';
import { $contract } from '@dequanto/utils/$contract';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';
import { $sig } from '@dequanto/utils/$sig';
import { DeepPartial } from '@dequanto/utils/types';

import { $buffer } from '@dequanto/utils/$buffer';
import { $crypto } from '@dequanto/utils/$crypto';
import { IConfigData } from '@dequanto/config/interface/IConfigData';

/**
 * Submits transaction to Flashbots network
 *
 * The signed raw transactions could be generated by Contract Classes with `$signed()` getter: e.g.:
 *
 * ```ts
 * let foo = new ERC20();
 * let tx = await foo.$signed().transfer(from, to);
 * ```
 */

export class FlashbotsProvider {

    private rpc: Rpc;

    protected constructor (
        public account: EoAccount,
        public config: IConfigData['flashbots'][''],
        private client: Web3Client
    ) {

        this.rpc = new Rpc({
            url: this.config.url,
            headers: {
                'X-Flashbots-Signature': async (req) => {
                    let body = req.body;
                    let str = $buffer.fromString($contract.keccak256(body), 'utf8');
                    let sig = await $sig.signMessage(str, account);
                    let header = `${account.address}:${sig.signature}`;
                    return header;
                }
            }
        });
    }

    async sendMevBundle (bundle: DeepPartial<RpcTypes.FlashbotsMevBundleRequest>) {
        bundle = await this.prepareMevBundle(bundle);

        let result = await this.rpc.mev_sendBundle(bundle);
        return {
            uuid: bundle.metadata.originId,
            block: bundle.inclusion.block,
            ...result
        };
    }
    async simMevBundle (bundle: DeepPartial<RpcTypes.FlashbotsMevBundleRequest>) {
        bundle = await this.prepareMevBundle(bundle);

        let result = await this.rpc.mev_simBundle(bundle);
        return {
            uuid: bundle.metadata.originId,
            block: bundle.inclusion.block,
            ...result
        };
    }

    async sendBundle (bundle: DeepPartial<RpcTypes.FlashbotsBundleRequest>) {
        bundle = await this.prepareBundle(bundle);

        let result = await this.rpc.eth_sendBundle(bundle);
        return {
            uuid: bundle.replacementUuid,
            block: bundle.blockNumber,
            ...result
        };
    }
    async callBundle (bundle: DeepPartial<RpcTypes.FlashbotsBundleRequest>) {
        bundle = await this.prepareBundle(bundle);

        let result = await this.rpc.eth_callBundle(bundle);
        return {
            uuid: bundle.replacementUuid,
            block: bundle.blockNumber,
            ...result
        };
    }

    async sendPrivateTransaction (bundle: DeepPartial<RpcTypes.FlashbotsSingleBundleReq>) {
        $require.Hex(bundle.tx, 'Expects signed raw transaction');
        let result = await this.rpc.eth_sendPrivateTransaction(bundle);
        return result;
    }

    async getBundleStats (bundle: { bundleHash: TEth.Hex, blockNumber: number | TEth.Hex }) {
        $require.Hex(bundle.bundleHash, `Expects returned value by the flashbots api when calling eth_sendBundle`);
        $require.notNull(bundle.blockNumber, `Expects the block number the bundle was targeting`);

        let blockNumberHex = $hex.ensure(bundle.blockNumber);
        let result = await this.rpc.flashbots_getBundleStatsV2({
            bundleHash: bundle.bundleHash,
            blockNumber: blockNumberHex
        });
        return result;
    }

    async cancelBundle (uuid: string) {
        let result = await this.rpc.eth_cancelBundle({
            replacementUuid: uuid
        });
        return result;
    }


    private async prepareMevBundle (bundle: DeepPartial<RpcTypes.FlashbotsMevBundleRequest>) {
        $require.gt(bundle.body?.length, 0, 'Bundle should contain at least one transaction');

        if (bundle.version == null) {
            bundle.version = 'v0.1';
        }
        if (bundle.inclusion == null) {
            bundle.inclusion = {};
        }
        if (bundle.inclusion.block == null) {
            bundle.inclusion.block = $hex.ensure(await this.client.getBlockNumber() + 1);
        }
        if (bundle.inclusion.maxBlock != null) {
            bundle.inclusion.maxBlock = $hex.ensure(bundle.inclusion.maxBlock);
        }
        if (bundle.metadata == null) {
            bundle.metadata = {};
        }
        if (bundle.metadata.originId == null) {
            bundle.metadata.originId = $crypto.randomUUID();
        }
        return bundle;
    }
    private async prepareBundle (bundle: DeepPartial<RpcTypes.FlashbotsBundleRequest>) {
        $require.gt(bundle.txs?.length, 0, 'Bundle should contain at least one transaction');

        if (bundle.blockNumber == null) {
            bundle.blockNumber = $hex.ensure(await this.client.getBlockNumber() + 1);
        }
        if (bundle.replacementUuid == null) {
            bundle.replacementUuid = $crypto.randomUUID();
        }
        return bundle;
    }

    static async create(client: Web3Client, account: EoAccount) {
        let platform = client.platform;
        let cfg = await Config.get();
        let flashbotsCfg = $require.notNull(cfg.flashbots?.[platform], `Flashbots configuration not found for platform ${platform}`);

        $require.notEmpty(flashbotsCfg.url, `Flashbots URL not set for platform ${platform}`);

        return new FlashbotsProvider(account, flashbotsCfg, client);
    }
}
