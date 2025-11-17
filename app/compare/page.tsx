'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import { NETWORKS } from '@/lib/networks';
import { formatNumber } from '@/utils/format';
export default function ComparePage() {
  const [stats, setStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const promises = Object.keys(NETWORKS).map(async (networkId) => {
          const response = await fetch(`/api/dashboard/stats?network=${networkId}`);
          const data = await response.json();
          return { networkId, data: data.success ? data.data : null };
        });
        const results = await Promise.all(promises);
        const statsMap: Record<string, any> = {};
        results.forEach(({ networkId, data }) => {
          if (data) statsMap[networkId] = data;
        });
        setStats(statsMap);
      } catch (error) {
        console.error('Error fetching network stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading) return <Loading />;
  const networks = Object.keys(stats);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Network Comparison
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare statistics across different EVM networks
        </p>
      </div>
      {/* Comparison Table */}
      <Card title="Network Statistics">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Metric
                </th>
                {networks.map((networkId) => (
                  <th
                    key={networkId}
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {NETWORKS[networkId].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Current Block */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Current Block
                </td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {stats[networkId]?.blockNumber.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>
              {/* Block Time */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Block Time
                </td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {stats[networkId]?.blockTime.toFixed(2)}s
                  </td>
                ))}
              </tr>
              {/* Gas Price */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Gas Price (Standard)
                </td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {stats[networkId]?.gasPrice.standard
                      ? `${parseFloat(stats[networkId].gasPrice.standard).toFixed(2)} Gwei`
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              {/* TPS */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Transactions/Second
                </td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {stats[networkId]?.tps.toFixed(2)} TPS
                  </td>
                ))}
              </tr>
              {/* 24h Transactions */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  24h Transactions
                </td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {stats[networkId]?.transactions24h.toLocaleString()}
                  </td>
                ))}
              </tr>
              {/* Chain ID */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Chain ID</td>
                {networks.map((networkId) => (
                  <td key={networkId} className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {NETWORKS[networkId].chainId}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      {/* Network Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {networks.map((networkId) => (
          <Card key={networkId} title={NETWORKS[networkId].name}>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Chain ID</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {NETWORKS[networkId].chainId}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Block Time</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ~{stats[networkId]?.blockTime.toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Gas</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats[networkId]?.gasPrice.standard
                    ? `${parseFloat(stats[networkId].gasPrice.standard).toFixed(1)} Gwei`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">TPS</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats[networkId]?.tps.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={NETWORKS[networkId].explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Official Explorer →
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Cost Comparison */}
      <Card title="Transaction Cost Comparison (ETH Transfer)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Network
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Slow
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Standard
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fast
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Instant
                </th>
              </tr>
            </thead>
            <tbody>
              {networks.map((networkId) => {
                const gasLimit = 21000;
                const calculateCost = (gwei: string) => {
                  const cost = (parseFloat(gwei) * gasLimit) / 1e9;
                  return cost.toFixed(6);
                };
                return (
                  <tr
                    key={networkId}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {NETWORKS[networkId].name}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                      {stats[networkId]?.gasPrice.slow
                        ? `${calculateCost(stats[networkId].gasPrice.slow)} ETH`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                      {stats[networkId]?.gasPrice.standard
                        ? `${calculateCost(stats[networkId].gasPrice.standard)} ETH`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                      {stats[networkId]?.gasPrice.fast
                        ? `${calculateCost(stats[networkId].gasPrice.fast)} ETH`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                      {stats[networkId]?.gasPrice.instant
                        ? `${calculateCost(stats[networkId].gasPrice.instant)} ETH`
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
