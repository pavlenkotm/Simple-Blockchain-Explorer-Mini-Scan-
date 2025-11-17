import { ethers } from 'ethers';
import { getProvider } from '../blockchain';
import { NetworkStats, GasPrice } from '@/types/ecosystem';

export async function getNetworkStats(networkId: string): Promise<NetworkStats> {
  const provider = getProvider(networkId);

  const [blockNumber, feeData, block] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData(),
    provider.getBlock('latest'),
  ]);

  const prevBlock = await provider.getBlock(blockNumber - 100);
  const blockTime = block && prevBlock
    ? (block.timestamp - prevBlock.timestamp) / 100
    : 12;

  const gasPrice: GasPrice = {
    slow: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice * 80n / 100n, 'gwei') : '0',
    standard: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0',
    fast: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice * 120n / 100n, 'gwei') : '0',
    instant: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice * 150n / 100n, 'gwei') : '0',
    baseFee: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : undefined,
    timestamp: Date.now(),
  };

  // Calculate approximate TPS
  const tps = block ? block.transactions.length / blockTime : 0;

  // Estimate transactions in last 24h
  const blocksPerDay = Math.floor(86400 / blockTime);
  const transactions24h = Math.floor(tps * 86400);

  return {
    blockNumber,
    blockTime,
    gasPrice,
    tps,
    activeAddresses24h: Math.floor(transactions24h * 0.6), // Estimate
    transactions24h,
    volume24h: '0', // Would need historical data
  };
}

export async function getGasPriceHistory(
  networkId: string,
  hours: number = 24
): Promise<Array<{ timestamp: number; gasPrice: number }>> {
  const provider = getProvider(networkId);
  const currentBlock = await provider.getBlockNumber();
  const history: Array<{ timestamp: number; gasPrice: number }> = [];

  const blocksToSample = Math.min(hours * 6, 100); // Sample every 10 minutes
  const interval = Math.floor((hours * 300) / blocksToSample); // Blocks between samples

  for (let i = 0; i < blocksToSample; i++) {
    const blockNum = currentBlock - (i * interval);
    if (blockNum < 0) break;

    try {
      const block = await provider.getBlock(blockNum);
      if (block && block.baseFeePerGas) {
        history.push({
          timestamp: block.timestamp * 1000,
          gasPrice: parseFloat(ethers.formatUnits(block.baseFeePerGas, 'gwei')),
        });
      }
    } catch (error) {
      console.error(`Error fetching block ${blockNum}:`, error);
    }
  }

  return history.reverse();
}

export async function getTransactionVolumeHistory(
  networkId: string,
  days: number = 7
): Promise<Array<{ timestamp: number; count: number }>> {
  const provider = getProvider(networkId);
  const currentBlock = await provider.getBlockNumber();
  const history: Array<{ timestamp: number; count: number }> = [];

  // Sample once per hour
  const samplesPerDay = 24;
  const totalSamples = days * samplesPerDay;
  const blocksPerHour = Math.floor(3600 / 12); // Assuming 12s block time

  for (let i = 0; i < totalSamples; i++) {
    const blockNum = currentBlock - (i * blocksPerHour);
    if (blockNum < 0) break;

    try {
      const block = await provider.getBlock(blockNum);
      if (block) {
        history.push({
          timestamp: block.timestamp * 1000,
          count: block.transactions.length,
        });
      }
    } catch (error) {
      console.error(`Error fetching block ${blockNum}:`, error);
    }

    // Limit requests to avoid rate limiting
    if (i > 0 && i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return history.reverse();
}
