// Extended types for ecosystem features

export interface GasPrice {
  slow: string;
  standard: string;
  fast: string;
  instant: string;
  baseFee?: string;
  timestamp: number;
}

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price?: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  totalSupply: string;
  holders?: number;
}

export interface NFTCollection {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  floorPrice?: number;
  volume24h?: number;
  owners?: number;
}

export interface NFTItem {
  tokenId: string;
  contractAddress: string;
  owner: string;
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface DeFiProtocol {
  name: string;
  tvl: number;
  tvlChange24h: number;
  category: string;
  chains: string[];
  logo?: string;
}

export interface WhaleWallet {
  address: string;
  balance: string;
  balanceUSD: number;
  label?: string;
  transactionCount: number;
  lastActivity: number;
}

export interface MempoolTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasLimit: string;
  timestamp: number;
  priority?: number;
}

export interface Portfolio {
  address: string;
  totalValueUSD: number;
  tokens: Array<{
    token: TokenData;
    balance: string;
    valueUSD: number;
  }>;
  nfts: NFTItem[];
  nativeBalance: string;
  nativeValueUSD: number;
}

export interface ENSDomain {
  name: string;
  owner: string;
  resolver?: string;
  registrant?: string;
  expiryDate?: number;
  addresses?: Record<string, string>;
}

export interface NetworkStats {
  blockNumber: number;
  blockTime: number;
  gasPrice: GasPrice;
  tps: number;
  activeAddresses24h: number;
  transactions24h: number;
  volume24h: string;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface Alert {
  id: string;
  type: 'transaction' | 'price' | 'gas' | 'whale';
  condition: string;
  value: string;
  active: boolean;
  createdAt: number;
}
