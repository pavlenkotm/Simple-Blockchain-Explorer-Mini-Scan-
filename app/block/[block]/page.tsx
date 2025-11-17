'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { Block } from '@/types';
import { formatTimestamp, formatTimeAgo, formatGwei } from '@/utils/format';

export default function BlockPage({ params }: { params: { block: string } }) {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<Block | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/block/${params.block}?network=${network}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setBlock(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch block data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.block, network]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
      </Card>
    );
  }
  if (!block) return null;

  return (
    <div className="space-y-6">
      {/* Block Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Block #{block.number.toLocaleString()}
          </h1>
          <div className="flex items-center space-x-2">
            {block.number > 0 && (
              <Link
                href={`/block/${block.number - 1}?network=${network}`}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                ← Prev
              </Link>
            )}
            <Link
              href={`/block/${block.number + 1}?network=${network}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Next →
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Block Hash</p>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono break-all flex-1">
                  {block.hash}
                </code>
                <CopyButton text={block.hash} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Hash</p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/block/${block.number - 1}?network=${network}`}
                  className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono break-all flex-1 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {block.parentHash}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatTimestamp(block.timestamp)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(block.timestamp)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {block.transactionCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Miner</p>
              <Link
                href={`/address/${block.miner}?network=${network}`}
                className="text-sm font-mono text-primary-600 dark:text-primary-400 hover:underline"
              >
                {block.miner.slice(0, 10)}...{block.miner.slice(-8)}
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Used</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseInt(block.gasUsed).toLocaleString()}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({((parseInt(block.gasUsed) / parseInt(block.gasLimit)) * 100).toFixed(2)}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Limit</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseInt(block.gasLimit).toLocaleString()}
              </p>
            </div>
          </div>

          {block.baseFeePerGas && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Base Fee Per Gas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatGwei(block.baseFeePerGas)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Transactions */}
      <Card title={`Transactions (${block.transactionCount})`}>
        {block.transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No transactions in this block
          </p>
        ) : (
          <div className="space-y-2">
            {block.transactions.slice(0, 25).map((txHash, index) => (
              <div
                key={txHash}
                className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 dark:text-gray-400 text-sm w-8">
                    {index}
                  </span>
                  <Link
                    href={`/tx/${txHash}?network=${network}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                  >
                    {txHash}
                  </Link>
                </div>
                <CopyButton text={txHash} />
              </div>
            ))}
            {block.transactions.length > 25 && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm pt-4">
                Showing first 25 of {block.transactions.length} transactions
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
