import { type AbiItem } from 'web3-utils';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractBase } from './ContractBase';
import { $abiParser } from '@dequanto/utils/$abiParser';


export interface IContractWrapped extends ContractBase {
    abi?: any
    [method: string]: any
}


export namespace ContractFactory {

    export async function get (client: Web3Client, explorer: IBlockChainExplorer, contractAddr: TAddress) {
        let { abi } = await explorer.getContractAbi(contractAddr);

        let abiJson = JSON.parse(abi);
        return fromAbi(contractAddr, abiJson, client, explorer);
    }

    export function fromAbi<TReturn extends ContractBase = IContractWrapped> (contractAddr: TAddress, abi: (AbiItem | string)[], client: Web3Client, explorer: IBlockChainExplorer) {
        let arr = abi.map(item => {
            return typeof item ==='string'
                ? $abiParser.parseMethod(item)
                : item
        });
        let builder = new ClassBuilder <TReturn> (arr);
        return builder.create(contractAddr, client, explorer) as TReturn;
    }
}


class ClassBuilder<T extends ContractBase> {
    private Ctor = class extends ContractBase {
        abi?
    };

    constructor (private abi: AbiItem[]) {

    }

    create (contractAddr: TAddress, client: Web3Client, explorer: IBlockChainExplorer) {
        let { Ctor, abi } = this;

        Ctor.prototype.abi = abi;

        this.createMethods();
        let instance = new Ctor(contractAddr, client, explorer);
        return instance as IContractWrapped;
    }

    private createMethods () {
        let { Ctor, abi } = this;

        abi
            .filter(x => x.type === 'function')
            .forEach(abiItem => {
                let isRead = $abiUtil.isReader(abiItem);
                if (isRead) {
                    Ctor.prototype[abiItem.name] = function (this: ContractBase, ...args) {
                        return this.$read(abiItem, ...args);
                    };
                    return;
                }
                Ctor.prototype[abiItem.name] = function (this: ContractBase, account, ...args) {
                    return this.$write(abiItem, account, ...args);
                };
            });
    }
}

namespace $abiUtil {
    export function isReader (abi: AbiItem) {
        return ['view', 'pure', null].includes(abi.stateMutability);
    }
}
