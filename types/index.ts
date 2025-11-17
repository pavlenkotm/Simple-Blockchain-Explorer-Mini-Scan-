export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  wsUrl?: string;
  explorer: string;
  chainId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasUsed?: string;
  gasLimit: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  confirmations: number;
  input: string;
  status?: number;
}

export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  parentHash: string;
  miner: string;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas?: string;
  transactions: string[];
  transactionCount: number;
}

export interface ERC20Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
}

export interface NFT {
  tokenId: string;
  contract: string;
  name?: string;
  symbol?: string;
  tokenURI?: string;
  owner: string;
}

export interface AddressInfo {
  address: string;
  balance: string;
  balanceFormatted: string;
  transactionCount: number;
  isContract: boolean;
}

export interface ContractInfo {
  address: string;
  bytecode: string;
  isContract: boolean;
  balance: string;
}

export interface ABIItem {
  type: string;
  name?: string;
  inputs?: Array<{
    name: string;
    type: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
  }>;
  stateMutability?: string;
  constant?: boolean;
}
