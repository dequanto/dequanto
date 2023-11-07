import di from 'a-di';
import { ChainAccount } from "@dequanto/models/TAccount";
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $bigint } from '@dequanto/utils/$bigint';
import { TokensServiceFactory } from './TokensServiceFactory';
import { $require } from '@dequanto/utils/$require';
import { TokensService } from './TokensService';
import { RpcTypes } from '@dequanto/rpc/Rpc';
import { WETH } from '@dequanto-contracts/weth/WETH/WETH';


export class TokenService {

    private tokensProvider: TokensService;

    constructor(public client: Web3Client) {
        this.tokensProvider = TokensServiceFactory.get(this.client.platform);
    }

    async balanceOf(address: TAddress, token: string | IToken, params?: {
        forBlock?: RpcTypes.BlockNumberOrTagOrHash
    }): Promise<bigint> {
        token = await this.getToken(token);
        let isNative = this.tokensProvider.isNative(token.address);
        if (isNative) {
            return this.client.getBalance(address, params?.forBlock);
        }
        let erc20 = await this.tokensProvider.erc20(token);
        if (params?.forBlock != null) {
            erc20 = erc20.forBlock(params.forBlock);
        }
        let balance = await erc20.balanceOf(address);
        return balance;
    }
    async hasToken(address: TAddress, token: string | IToken, amount: number): Promise<boolean> {
        let t = await this.getToken(token);
        let balance = await this.balanceOf(address, t);
        let wei = $bigint.toWei(amount, t.decimals);
        return wei <= balance;
    }

    async ensureApproved (account: ChainAccount, tokenMix: string | IToken, spender: TAddress, amount: bigint | number): Promise<TxWriter | null> {
        let token = await this.getToken(tokenMix);
        let erc20 = await this.tokensProvider.erc20(token.address);
        let approved = await erc20.allowance(account.address, spender);

        let desiredApproval = typeof amount === 'bigint'
            ? amount
            : $bigint.toWei(amount, token.decimals);

        if (true || approved < desiredApproval) {
            return await erc20
                .$config({
                    gasEstimation: true,
                    type: 2,
                }, {
                    retries: 0
                })
                .approve(account, spender, desiredApproval * 2n);
        }
        return null;
    }

    /**
     * @param amount Can be negative (wraps all with rest)
     */
    async wrapNativeToERC20 (account: ChainAccount, amount: number): Promise<TxWriter> {
        let amountWei = $bigint.toWei(amount, 18);
        if (amountWei < 0n) {
            let balance = await this.client.getBalance(account.address);
            amountWei = balance + amountWei;
        }
        $require.gt(amountWei, 0n);

        let depositor: { deposit: WETH['deposit'] };
        switch (this.client.platform) {
            case 'xdai':
                depositor = di.resolve(WETH, '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d');
                break;
        }
        if (depositor == null) {
            throw new Error(`Wrapping depositor not found for platform ${this.client?.platform}`);
        }
        return await depositor.deposit({
            ...account,
            value: amountWei
        });
    }
    /**
     *
     */
     async unwrapNative (account: ChainAccount, amount?: number | bigint): Promise<TxWriter> {
        let depositor: { balanceOf: WETH['balanceOf'], withdraw: WETH['withdraw'] };
        switch (this.client.platform) {
            case 'xdai':
                depositor = di.resolve(WETH, '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d');
                break;
        }
        if (depositor == null) {
            throw new Error(`Wrapping depositor not found for platform ${this.client?.platform}`);
        }
        if (amount == null || amount === Infinity) {
            amount = await depositor.balanceOf(account.address);
        }
        let amountWei = typeof amount === 'number'
            ? $bigint.toWei(amount, 18)
            : amount;

        console.log(amount, amountWei);
        $require.gt(amountWei, 0n);

        return await depositor.withdraw(account, amountWei);
    }

    protected async getToken(mix: string | IToken): Promise<IToken> {
        let token = typeof mix === 'string'
            ? await this.tokensProvider.getKnownToken(mix)
            : mix;

        if (this.tokensProvider.isNative(token.address)) {
            token = {
                ...token,
                address: '0x0000000000000000000000000000000000000000',
            }
        }

        if (token == null || token.address == null) {
            throw new Error(`Address undefined: ${token}`);
        }
        return token;
    }
}
