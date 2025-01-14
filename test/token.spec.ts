import { TokensService } from '@dequanto/tokens/TokensService';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { $address } from '@dequanto/utils/$address';

UTest({
    async 'should load token data' () {
        let service = new TokensService('eth');
        let usdc = await service.getKnownToken('USDC');
        eq_(usdc.decimals, 6);
        eq_(usdc.name, 'USDCoin');
        eq_(usdc.address, $address.toChecksum('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'));
    },
    async 'should load token by forked mainnet via hardhat' () {
        let tokens = await TokensServiceFactory.getAsync('hh:eth');
        let usdc = await tokens.getKnownToken('USDC');
        eq_(usdc.address, $address.toChecksum('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'));
    }
})
