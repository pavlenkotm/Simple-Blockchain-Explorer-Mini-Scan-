'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { TokenData } from '@/types/ecosystem';
import { formatNumber } from '@/utils/format';
export default function TokensPage() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tokens/top?network=${network}`);
        const data = await response.json();
        if (data.success) {
          setTokens(data.data);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [network]);
  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Token Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Popular ERC20 tokens on {network}
        </p>
      </div>
      {/* Top Tokens Table */}
      <Card title="Top Tokens">
        {tokens.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No token data available for this network
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Token
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Symbol
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contract Address
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Supply
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr
                    key={token.address}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {token.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium">
                        {token.symbol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/address/${token.address}?network=${network}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                      >
                        {token.address.slice(0, 10)}...{token.address.slice(-8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                      {formatNumber(
                        parseFloat(
                          (BigInt(token.totalSupply) / BigInt(10 ** token.decimals)).toString()
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Token Search */}
      <Card title="Search Token">
        <TokenSearch network={network} />
      </Card>
    </div>
  );
}
function TokenSearch({ network }: { network: string }) {
  const [address, setAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !address.startsWith('0x')) {
      setError('Please enter a valid contract address');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/tokens/info?address=${address}&network=${network}`);
      const data = await response.json();
      if (data.success) {
        setTokenInfo(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch token information');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter token contract address (0x...)"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      {tokenInfo && (
        <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tokenInfo.name}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenInfo.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Decimals</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenInfo.decimals}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
              <p className="font-medium text-gray-900 dark:text-white font-mono">
                {formatNumber(
                  parseFloat(
                    (BigInt(tokenInfo.totalSupply) / BigInt(10 ** tokenInfo.decimals)).toString()
                  )
                )}{' '}
                {tokenInfo.symbol}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Address</p>
              <Link
                href={`/address/${tokenInfo.address}?network=${network}`}
                className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm break-all"
              >
                {tokenInfo.address}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
