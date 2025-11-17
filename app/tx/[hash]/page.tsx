'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { Transaction } from '@/types';
import { formatTimestamp, formatTimeAgo, formatGwei, formatNumber } from '@/utils/format';

export default function TransactionPage({ params }: { params: { hash: string } }) {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/transaction/${params.hash}?network=${network}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setTransaction(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.hash, network]);

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
  if (!transaction) return null;

  const valueInEth = parseFloat((BigInt(transaction.value) / BigInt(1e18)).toString());

  return (
    <div className="space-y-6">
      {/* Transaction Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaction Details
          </h1>
          {transaction.status !== undefined && (
            <span
              className={`px-4 py-2 rounded-lg font-medium ${
                transaction.status === 1
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
              }`}
            >
              {transaction.status === 1 ? 'Success' : 'Failed'}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono break-all flex-1">
                {transaction.hash}
              </code>
              <CopyButton text={transaction.hash} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Block</p>
              <Link
                href={`/block/${transaction.blockNumber}?network=${network}`}
                className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                {transaction.blockNumber.toLocaleString()}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transaction.confirmations} confirmations
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatTimestamp(transaction.timestamp)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(transaction.timestamp)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">From</p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/address/${transaction.from}?network=${network}`}
                  className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-primary-600 dark:text-primary-400 hover:underline break-all flex-1"
                >
                  {transaction.from}
                </Link>
                <CopyButton text={transaction.from} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">To</p>
              {transaction.to ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/address/${transaction.to}?network=${network}`}
                    className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-primary-600 dark:text-primary-400 hover:underline break-all flex-1"
                  >
                    {transaction.to}
                  </Link>
                  <CopyButton text={transaction.to} />
                </div>
              ) : (
                <p className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-gray-500 dark:text-gray-400">
                  Contract Creation
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(valueInEth)} ETH
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatGwei(transaction.gasPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Used</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {transaction.gasUsed ? parseInt(transaction.gasUsed).toLocaleString() : 'Pending'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nonce</p>
            <p className="text-gray-900 dark:text-white">{transaction.nonce}</p>
          </div>

          {transaction.input && transaction.input !== '0x' && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Input Data</p>
              <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 overflow-x-auto">
                <code className="text-xs font-mono text-gray-900 dark:text-white break-all">
                  {transaction.input}
                </code>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This transaction includes input data, which may be a contract interaction.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Transaction Fee */}
      {transaction.gasUsed && (
        <Card title="Transaction Fee">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Limit</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseInt(transaction.gasLimit).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gas Used</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseInt(transaction.gasUsed).toLocaleString()}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({((parseInt(transaction.gasUsed) / parseInt(transaction.gasLimit)) * 100).toFixed(2)}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fee</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(
                  parseFloat(
                    ((BigInt(transaction.gasUsed) * BigInt(transaction.gasPrice)) / BigInt(1e18)).toString()
                  )
                )}{' '}
                ETH
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
