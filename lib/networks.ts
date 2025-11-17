import { Network } from '@/types';

export const NETWORKS: Record<string, Network> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC || 'https://eth.llamarpc.com',
    wsUrl: process.env.NEXT_PUBLIC_ETHEREUM_WS,
    explorer: 'https://etherscan.io',
    chainId: 1,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  base: {
    id: 'base',
    name: 'Base',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    chainId: 8453,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    chainId: 42161,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const DEFAULT_NETWORK = 'ethereum';
