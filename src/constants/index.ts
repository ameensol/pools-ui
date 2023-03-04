export { privacyPoolABI } from './privacyPoolAbi';
export { subsetRegistryABI } from './subsetRegistryAbi';

interface Assets {
  [chainId: number]: string[];
}

interface Denominations {
  [chainId: number]: { [asset: string]: number[] };
}

interface Contracts {
  [chainId: number]: { [assetDenominationPair: string]: string };
}

export const assets: Assets = {
  5: ['ETH'],
  420: ['ETH']
};

export const denominations: Denominations = {
  5: {
    ETH: [0.001, 0.01]
  },
  420: {
    ETH: [0.001, 0.01]
  }
};

export const subsetRegistries: { [chainId: number]: string } = {
  5: '0x5B27a0d86fa25bf74A77f0d0841d292eD4B6f992',
  420: '0xa4410556507e44EDa497Fe5051eb37F8aD2C4104'
};

export const contracts: Contracts = {
  5: {
    'ETH-0.001': '0xeeB3445BB3702B1aE830f6fe02BcFeF082860468',
    'ETH-0.01': '0xC1e42b18Ba0c454f32D437c397FC96a51dB3556d'
  },
  420: {
    'ETH-0.001': '0x3fB005c1A83FCF63A87fC584aC2a5c67FB38F880',
    'ETH-0.01': '0x13B6BD28d27a33c14E3B7f95185Ec7a091C1F2de'
  }
};
