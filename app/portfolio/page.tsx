'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { formatNumber } from '@/utils/format';

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addAddress = () => {
    if (newAddress && newAddress.startsWith('0x') && !addresses.includes(newAddress)) {
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
    }
  };

  const removeAddress = (addr: string) => {
    setAddresses(addresses.filter((a) => a !== addr));
    setPortfolios(portfolios.filter((p) => p.address !== addr));
  };

  const loadPortfolios = async () => {
    if (addresses.length === 0) return;

    try {
      setLoading(true);
      const results = await Promise.all(
        addresses.map(async (addr) => {
          const response = await fetch(`/api/address/${addr}?network=${network}`);
          const data = await response.json();
          return data.success ? { address: addr, ...data.data } : null;
        })
      );

      setPortfolios(results.filter(Boolean));
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = portfolios.reduce((sum, p) => {
    return sum + parseFloat(p.balanceFormatted || '0');
  }, 0);

  const totalTxCount = portfolios.reduce((sum, p) => {
    return sum + (p.transactionCount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track multiple wallets and analyze your portfolio
        </p>
      </div>

      {/* Add Wallet */}
      <Card title="Add Wallets">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addAddress()}
            />
            <button
              onClick={addAddress}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
            >
              Add
            </button>
          </div>

          {addresses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tracking {addresses.length} wallet{addresses.length !== 1 ? 's' : ''}:
              </p>
              {addresses.map((addr) => (
                <div
                  key={addr}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Link
                    href={`/address/${addr}?network=${network}`}
                    className="font-mono text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {addr}
                  </Link>
                  <button
                    onClick={() => removeAddress(addr)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {addresses.length > 0 && (
            <button
              onClick={loadPortfolios}
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? 'Loading Portfolio...' : 'Load Portfolio Data'}
            </button>
          )}
        </div>
      </Card>

      {/* Portfolio Summary */}
      {portfolios.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Wallets"
              value={portfolios.length}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Total Balance"
              value={formatNumber(totalBalance)}
              suffix="ETH"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Total Transactions"
              value={totalTxCount.toLocaleString()}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              }
            />
          </div>

          <Card title="Wallet Details">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Balance
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Transactions
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((portfolio) => (
                    <tr
                      key={portfolio.address}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {portfolio.address.slice(0, 10)}...{portfolio.address.slice(-8)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-900 dark:text-white">
                        {formatNumber(parseFloat(portfolio.balanceFormatted))} ETH
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {portfolio.transactionCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            portfolio.isContract
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {portfolio.isContract ? 'Contract' : 'EOA'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/address/${portfolio.address}?network=${network}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {loading && <Loading />}
    </div>
  );
}
