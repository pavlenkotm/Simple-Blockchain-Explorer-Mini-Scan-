import { ethers } from 'ethers';
import { NETWORKS } from './networks';

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
];

// ERC721 ABI (minimal)
export const ERC721_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function ownerOf(uint256) view returns (address)',
  'function tokenURI(uint256) view returns (string)',
];

export function getProvider(networkId: string): ethers.JsonRpcProvider {
  const network = NETWORKS[networkId];
  if (!network) {
    throw new Error(`Network ${networkId} not found`);
  }
  return new ethers.JsonRpcProvider(network.rpcUrl);
}

export function formatEther(value: bigint | string): string {
  return ethers.formatEther(value);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export async function getAddressInfo(address: string, networkId: string) {
  const provider = getProvider(networkId);

  const [balance, code, txCount] = await Promise.all([
    provider.getBalance(address),
    provider.getCode(address),
    provider.getTransactionCount(address),
  ]);

  return {
    address,
    balance: balance.toString(),
    balanceFormatted: formatEther(balance),
    transactionCount: txCount,
    isContract: code !== '0x',
  };
}

export async function getBlockInfo(blockNumber: number | string, networkId: string) {
  const provider = getProvider(networkId);
  const block = await provider.getBlock(blockNumber);

  if (!block) {
    throw new Error('Block not found');
  }

  return {
    number: block.number,
    hash: block.hash,
    timestamp: block.timestamp,
    parentHash: block.parentHash,
    miner: block.miner,
    gasUsed: block.gasUsed.toString(),
    gasLimit: block.gasLimit.toString(),
    baseFeePerGas: block.baseFeePerGas?.toString(),
    transactions: block.transactions,
    transactionCount: block.transactions.length,
  };
}

export async function getTransaction(txHash: string, networkId: string) {
  const provider = getProvider(networkId);
  const [tx, receipt] = await Promise.all([
    provider.getTransaction(txHash),
    provider.getTransactionReceipt(txHash),
  ]);

  if (!tx) {
    throw new Error('Transaction not found');
  }

  const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null;

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    gasPrice: tx.gasPrice?.toString() || '0',
    gasUsed: receipt?.gasUsed.toString(),
    gasLimit: tx.gasLimit.toString(),
    nonce: tx.nonce,
    blockNumber: tx.blockNumber || 0,
    blockHash: tx.blockHash || '',
    timestamp: block?.timestamp || 0,
    confirmations: receipt?.confirmations || 0,
    input: tx.data,
    status: receipt?.status,
  };
}

export async function getRecentTransactions(address: string, networkId: string, limit: number = 10) {
  const provider = getProvider(networkId);
  const currentBlock = await provider.getBlockNumber();
  const transactions = [];

  // Scan last 1000 blocks for transactions
  const blocksToScan = Math.min(1000, currentBlock);
  const startBlock = currentBlock - blocksToScan;

  for (let i = currentBlock; i > startBlock && transactions.length < limit; i--) {
    const block = await provider.getBlock(i, true);
    if (!block || !block.transactions) continue;

    for (const txData of block.transactions) {
      if (typeof txData === 'string') continue;

      const tx = txData as any;

      if (tx.from.toLowerCase() === address.toLowerCase() ||
          tx.to?.toLowerCase() === address.toLowerCase()) {
        transactions.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          gasPrice: tx.gasPrice?.toString() || '0',
          gasLimit: tx.gasLimit.toString(),
          nonce: tx.nonce,
          blockNumber: block.number,
          blockHash: block.hash,
          timestamp: block.timestamp,
          confirmations: currentBlock - block.number,
          input: tx.data,
        });

        if (transactions.length >= limit) break;
      }
    }
  }

  return transactions;
}

export async function getERC20Tokens(address: string, networkId: string, tokenAddresses: string[]) {
  const provider = getProvider(networkId);
  const tokens = [];

  for (const tokenAddress of tokenAddresses) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const [name, symbol, decimals, balance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.balanceOf(address),
      ]);

      if (balance > 0n) {
        tokens.push({
          address: tokenAddress,
          name,
          symbol,
          decimals: Number(decimals),
          balance: balance.toString(),
          balanceFormatted: ethers.formatUnits(balance, decimals),
        });
      }
    } catch (error) {
      console.error(`Error fetching token ${tokenAddress}:`, error);
    }
  }

  return tokens;
}

export async function isERC721(contractAddress: string, networkId: string): Promise<boolean> {
  try {
    const provider = getProvider(networkId);
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
    await contract.name();
    return true;
  } catch {
    return false;
  }
}

export async function getContractInfo(address: string, networkId: string) {
  const provider = getProvider(networkId);
  const [code, balance] = await Promise.all([
    provider.getCode(address),
    provider.getBalance(address),
  ]);

  return {
    address,
    bytecode: code,
    isContract: code !== '0x',
    balance: balance.toString(),
  };
}
