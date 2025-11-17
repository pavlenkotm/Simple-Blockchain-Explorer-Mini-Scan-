import { ethers } from 'ethers';
import { getProvider, ERC20_ABI } from '../blockchain';
import { TokenData } from '@/types/ecosystem';

// Popular tokens on different networks (you can expand this)
const POPULAR_TOKENS: Record<string, string[]> = {
  ethereum: [
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
  ],
  base: [
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
  ],
  arbitrum: [
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
  ],
};

export async function getTokenInfo(
  tokenAddress: string,
  networkId: string
): Promise<TokenData> {
  const provider = getProvider(networkId);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: totalSupply.toString(),
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    throw error;
  }
}

export async function getTopTokens(networkId: string): Promise<TokenData[]> {
  const tokenAddresses = POPULAR_TOKENS[networkId] || [];
  const tokens: TokenData[] = [];

  for (const address of tokenAddresses) {
    try {
      const tokenInfo = await getTokenInfo(address, networkId);
      tokens.push(tokenInfo);
    } catch (error) {
      console.error(`Error fetching token ${address}:`, error);
    }
  }

  return tokens;
}

export async function getTokenHolders(
  tokenAddress: string,
  networkId: string
): Promise<Array<{ address: string; balance: string }>> {
  // This would require event indexing or external API
  // For now, return empty array as placeholder
  return [];
}

export async function getTokenTransfers(
  tokenAddress: string,
  networkId: string,
  limit: number = 10
): Promise<Array<{
  from: string;
  to: string;
  value: string;
  timestamp: number;
  txHash: string;
}>> {
  const provider = getProvider(networkId);
  const contract = new ethers.Contract(
    tokenAddress,
    [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ],
    provider
  );

  try {
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 1000);

    const filter = contract.filters.Transfer();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    const transfers = await Promise.all(
      events.slice(-limit).map(async (event: any) => {
        const block = await event.getBlock();
        return {
          from: event.args[0],
          to: event.args[1],
          value: event.args[2].toString(),
          timestamp: block.timestamp,
          txHash: event.transactionHash,
        };
      })
    );

    return transfers.reverse();
  } catch (error) {
    console.error('Error fetching token transfers:', error);
    return [];
  }
}
