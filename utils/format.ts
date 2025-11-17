import { formatDistanceToNow } from 'date-fns';

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(n);
}

export function formatGwei(wei: string | bigint): string {
  const gwei = Number(wei) / 1e9;
  return `${formatNumber(gwei)} Gwei`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function truncateMiddle(str: string, startChars: number = 6, endChars: number = 4): string {
  if (str.length <= startChars + endChars) return str;
  return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
}
