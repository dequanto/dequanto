import { WETH } from './0xc/eth/WETH/WETH.js';
import { Config } from 'dequanto/config/Config'

//await Config.fetch();

const decimals = await new WETH().decimals();

console.log(`WETH decimals: ${decimals}`);
