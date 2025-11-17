'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { AddressInfo, Transaction } from '@/types';
import { formatNumber } from '@/utils/format';
import { formatTimeAgo } from '@/utils/format';
import TransactionChart from '@/components/TransactionChart';
import GasChart from '@/components/GasChart';

export default function AddressPage({ params }: { params: { address: string } }) {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    addressInfo: AddressInfo;
    transactions: Transaction[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/address/${params.address}?network=${network}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setData({
          addressInfo: result.data,
          transactions: result.data.transactions,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch address data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.address, network]);

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
  if (!data) return null;

  const { addressInfo, transactions } = data;

  return (
    <div className="space-y-6">
      {/* Address Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {addressInfo.isContract ? 'Contract' : 'Address'}
          </h1>
          {addressInfo.isContract && (
            <Link
              href={`/contract/${params.address}?network=${network}`}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
            >
              View Contract
            </Link>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <code className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono break-all">
              {params.address}
            </code>
            <CopyButton text={params.address} />
          </div>
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(addressInfo.balanceFormatted)} ETH
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addressInfo.transactionCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Analytics */}
      {transactions.length > 0 && (
        <>
          <Card title="Transaction Value History">
            <TransactionChart transactions={transactions} />
          </Card>

          <Card title="Gas Usage">
            <GasChart transactions={transactions} />
          </Card>
        </>
      )}

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No transactions found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Txn Hash
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Block
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    From
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    To
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.hash}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/tx/${tx.hash}?network=${network}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                      >
                        {tx.hash.slice(0, 10)}...
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/block/${tx.blockNumber}?network=${network}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {tx.blockNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/address/${tx.from}?network=${network}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                      >
                        {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      {tx.to ? (
                        <Link
                          href={`/address/${tx.to}?network=${network}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                        >
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </Link>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Contract Creation
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {formatNumber(parseFloat((BigInt(tx.value) / BigInt(1e18)).toString()))} ETH
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Info Note */}
      <Card>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Transaction history is limited to recent blocks for performance.
          For full transaction history, consider using the network&apos;s official explorer or
          implementing transaction indexing with a database.
        </p>
      </Card>
    </div>
  );
}
