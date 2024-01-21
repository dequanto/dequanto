import memd from 'memd';
import AppConfig from 'appcfg'
import { IContractDetails } from './models/IContractDetails';
import { TPlatform } from './models/TPlatform';
import { $secret } from './utils/$secret';
import { $cli } from './utils/$cli';
import { class_Dfr, obj_extend } from 'atma-utils';
import { Directory, File } from 'atma-io';
import { ITokenGlob } from './models/ITokenGlob';
import { TAddress } from './models/TAddress';
import { $logger } from './utils/$logger';

export interface IProviderEndpoint {
    url: string
    private?: boolean
    safe?: boolean

    // Is not used in generall ClientPool, only retrievable via getWeb3 method.
    manual?: boolean

    traceable?: boolean
}
export class Config {
    settings: {
        /** Root path of the dequanto library */
        base?: string
    }
    accounts: {
        [platform in TPlatform]: {
            [name: string]: {
                address: string
                key: string
            }
        }
    }
    tokens: ITokenGlob[]

    blockchainExplorer: {
        [platform in TPlatform]: {
            key: string
            host: string
        }
    }
    web3: {
        [platform in TPlatform]: {
            chainId?: number
            chainToken?: string
            endpoints: IProviderEndpoint[]
        }
    }
    contracts?: {
        [platform in TPlatform]: IContractDetails[]
    }
    erc4337?: {
        name: string
        contracts: {
            entryPoint: TAddress
            accountFactory: TAddress
        }
        platforms: TPlatform[]
    }[]

    safe?: {
        transactionService: Record<TPlatform, `https://${string}`>
        contracts: Record<TPlatform, {
            Safe: TAddress
            SafeL2?: TAddress
            SafeProxyFactory: TAddress
            MultiSend: TAddress
            CreateCall?: TAddress
        }>
    }
    flashbots?: {
        [platform in TPlatform]: {
            url: string
        }
    }

    @memd.deco.memoize()
    static async fetch (parameters?: {
        dotenv?: boolean
        pin?: string
        configAccounts?: string
        configGlobal?: string
    } ) {
        singleton ??= new class_Dfr();

        let unlockedAccountsKey = await $secret.getPin(parameters);
        let configPathAccounts = $cli.getParamValue('config-accounts', parameters) ?? '%APPDATA%/.dequanto/accounts.json';
        let configPathGlobal = $cli.getParamValue('config-global', parameters) ?? '%APPDATA%/.dequanto/config.yml';

        let dequantoConfigs = 'dequanto/configs/';

        /** An optional fallback if none of possible locations will be found */
        let pfx = '%APP%/';
        let [
            inCwd,
            inNodeModules,
            inCwdAsConfig,
        ] = await Promise.all([
            File.existsAsync(`./${dequantoConfigs}dequanto.yml`),
            File.existsAsync(`./node_modules/${dequantoConfigs}dequanto.yml`),
            File.existsAsync(`./configs/dequanto.yml`),
        ]);
        let rgx0xwebPath = /[/\\]0xweb[/\\].+$/;

        if (inCwd) {
            pfx = './';
        } else if (inNodeModules) {
            pfx = './node_modules/';
        } else if (inCwdAsConfig) {
            pfx = '';
            dequantoConfigs = 'configs/';
        } else if (rgx0xwebPath.test(__filename)) {
            // check the folder where this 0xweb package could be located
            let dir = __filename.replace(rgx0xwebPath, '/0xweb/');
            let path = `${dir}${dequantoConfigs}`;
            let exists = await Directory.existsAsync(path);
            if (exists) {
                pfx = dir;
            }
        }

        let dequantoDefaultPath = `${pfx}${dequantoConfigs}dequanto.yml`;
        let cfg = await AppConfig.fetch<Config>([
            {
                path: dequantoDefaultPath,
                optional: true,
            },
            {
                path: `${pfx}${dequantoConfigs}defi.yml`,
                optional: true,
            },
            {
                path: configPathGlobal,
                writable: true,
                optional: true,
                extendArrays: false,
            },
            unlockedAccountsKey ? {
                name: 'accounts',
                path: configPathAccounts,
                writable: true,
                optional: true,
                secret: unlockedAccountsKey
            } : null,
            {
                path: 'package.json',
                getterProperty: 'dequanto',
                optional: true,
            },
            {
                path: 'dequanto.yml',
                optional: true
            },
            parameters?.dotenv ? {
                dotenv: true
            } : null,
        ]);

        obj_extend(config, cfg.toJSON());
        if (config.web3 == null) {
            let defaultExists = await File.existsAsync(dequantoDefaultPath);
            let message = `Default config path not exists: ${dequantoDefaultPath} (${ defaultExists });`;
            message += ` cwd: ${process.cwd()} inCwd: ${inCwd}; inNodeModules: ${inNodeModules}; inCwdAsConfig: ${inCwdAsConfig}`;

            $logger.log(message);
            singleton.reject(new Error(message));
            return;
        }
        singleton.resolve(cfg);
        return cfg;
    }

    /** Will return a config that was previously loaded by fetch with any parameters or will trigger fetch with default parameters  */
    static get (): PromiseLike<AppConfig<Config> & Config> {
        if (singleton != null) {
            return singleton;
        }
        return Config.fetch();
    }

    static async extend (json) {
        let current = await Config.fetch();
        await current.$write(json)
    }
}

export const config = new Config();

let singleton: class_Dfr<AppConfig<Config> & Config> = null;
