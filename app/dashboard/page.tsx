'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import NetworkStatsChart from '@/components/NetworkStatsChart';
import Loading from '@/components/Loading';
import { NetworkStats } from '@/types/ecosystem';
import { formatNumber } from '@/utils/format';
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [gasHistory, setGasHistory] = useState<Array<{ timestamp: number; value: number }>>([]);
  const [txHistory, setTxHistory] = useState<Array<{ timestamp: number; value: number }>>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch network stats
        const statsRes = await fetch(`/api/dashboard/stats?network=${network}`);
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
        // Fetch gas price history
        const gasRes = await fetch(`/api/dashboard/gas-history?network=${network}`);
        const gasData = await gasRes.json();
        if (gasData.success) {
          setGasHistory(gasData.data.map((d: any) => ({
            timestamp: d.timestamp,
            value: d.gasPrice,
          })));
        }
        // Fetch transaction volume history
        const txRes = await fetch(`/api/dashboard/tx-history?network=${network}`);
        const txData = await txRes.json();
        if (txData.success) {
          setTxHistory(txData.data.map((d: any) => ({
            timestamp: d.timestamp,
            value: d.count,
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [network]);
  if (loading && !stats) return <Loading />;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Network Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time statistics and analytics for {network}
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Block"
          value={stats?.blockNumber.toLocaleString() || '-'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          loading={loading}
        />
        <StatCard
          title="Gas Price (Standard)"
          value={stats?.gasPrice.standard ? parseFloat(stats.gasPrice.standard).toFixed(2) : '-'}
          suffix="Gwei"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          loading={loading}
        />
        <StatCard
          title="Transactions/Second"
          value={stats?.tps.toFixed(2) || '-'}
          suffix="TPS"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          }
          loading={loading}
        />
        <StatCard
          title="24h Transactions"
          value={stats?.transactions24h.toLocaleString() || '-'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          loading={loading}
        />
      </div>
      {/* Gas Price Chart */}
      <Card title="Gas Price History (24h)">
        {gasHistory.length > 0 ? (
          <NetworkStatsChart
            data={gasHistory}
            label="Gas Price (Gwei)"
            color="rgb(234, 179, 8)"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            {loading ? 'Loading chart data...' : 'No data available'}
          </div>
        )}
      </Card>
      {/* Transaction Volume Chart */}
      <Card title="Transaction Volume History">
        {txHistory.length > 0 ? (
          <NetworkStatsChart
            data={txHistory}
            label="Transactions per Block"
            color="rgb(14, 165, 233)"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            {loading ? 'Loading chart data...' : 'No data available'}
          </div>
        )}
      </Card>
      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Network Information">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Block Time</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.blockTime.toFixed(2)} seconds
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Addresses (24h)</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.activeAddresses24h.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Base Fee</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.gasPrice.baseFee
                  ? `${parseFloat(stats.gasPrice.baseFee).toFixed(2)} Gwei`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
        <Card title="Gas Price Tiers">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Slow</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.gasPrice.slow ? `${parseFloat(stats.gasPrice.slow).toFixed(2)} Gwei` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Standard</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.gasPrice.standard ? `${parseFloat(stats.gasPrice.standard).toFixed(2)} Gwei` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Fast</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.gasPrice.fast ? `${parseFloat(stats.gasPrice.fast).toFixed(2)} Gwei` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Instant</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.gasPrice.instant ? `${parseFloat(stats.gasPrice.instant).toFixed(2)} Gwei` : '-'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
