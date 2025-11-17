'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import NetworkStatsChart from '@/components/NetworkStatsChart';
import Loading from '@/components/Loading';
import { formatNumber } from '@/utils/format';
export default function GasTrackerPage() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [gasData, setGasData] = useState<any>(null);
  const [history, setHistory] = useState<Array<{ timestamp: number; value: number }>>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes] = await Promise.all([
          fetch(`/api/dashboard/stats?network=${network}`),
          fetch(`/api/dashboard/gas-history?network=${network}&hours=48`),
        ]);
        const statsData = await statsRes.json();
        const historyData = await historyRes.json();
        if (statsData.success) {
          setGasData(statsData.data.gasPrice);
        }
        if (historyData.success) {
          setHistory(historyData.data.map((d: any) => ({
            timestamp: d.timestamp,
            value: d.gasPrice,
          })));
        }
      } catch (error) {
        console.error('Error fetching gas data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [network]);
  if (loading && !gasData) return <Loading />;
  const calculateCost = (gwei: number, gasLimit: number = 21000) => {
    const ethCost = (gwei * gasLimit) / 1e9;
    return ethCost.toFixed(6);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gas Price Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time gas prices and transaction cost estimates
        </p>
      </div>
      {/* Current Gas Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Slow</h3>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {gasData?.slow ? parseFloat(gasData.slow).toFixed(1) : '-'}
            <span className="text-lg ml-1 text-gray-500">Gwei</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ~{gasData?.slow ? calculateCost(parseFloat(gasData.slow)) : '-'} ETH
          </p>
          <p className="text-xs text-gray-400 mt-1">Standard transfer (21k gas)</p>
        </Card>
        <Card className="border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Standard</h3>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {gasData?.standard ? parseFloat(gasData.standard).toFixed(1) : '-'}
            <span className="text-lg ml-1 text-gray-500">Gwei</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ~{gasData?.standard ? calculateCost(parseFloat(gasData.standard)) : '-'} ETH
          </p>
          <p className="text-xs text-gray-400 mt-1">Standard transfer (21k gas)</p>
        </Card>
        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fast</h3>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {gasData?.fast ? parseFloat(gasData.fast).toFixed(1) : '-'}
            <span className="text-lg ml-1 text-gray-500">Gwei</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ~{gasData?.fast ? calculateCost(parseFloat(gasData.fast)) : '-'} ETH
          </p>
          <p className="text-xs text-gray-400 mt-1">Standard transfer (21k gas)</p>
        </Card>
        <Card className="border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Instant</h3>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {gasData?.instant ? parseFloat(gasData.instant).toFixed(1) : '-'}
            <span className="text-lg ml-1 text-gray-500">Gwei</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ~{gasData?.instant ? calculateCost(parseFloat(gasData.instant)) : '-'} ETH
          </p>
          <p className="text-xs text-gray-400 mt-1">Standard transfer (21k gas)</p>
        </Card>
      </div>
      {/* Gas Price History Chart */}
      <Card title="Gas Price History (48 hours)">
        {history.length > 0 ? (
          <NetworkStatsChart
            data={history}
            label="Gas Price (Gwei)"
            color="rgb(234, 179, 8)"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Loading chart data...
          </div>
        )}
      </Card>
      {/* Gas Cost Calculator */}
      <Card title="Gas Cost Calculator">
        <GasCostCalculator currentGasPrice={gasData?.standard ? parseFloat(gasData.standard) : 0} />
      </Card>
      {/* Common Operations */}
      <Card title="Estimated Costs for Common Operations">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Operation
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Gas Limit
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cost (Standard)
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cost (Fast)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'ETH Transfer', gas: 21000 },
                { name: 'ERC20 Transfer', gas: 65000 },
                { name: 'ERC20 Approve', gas: 45000 },
                { name: 'Uniswap Swap', gas: 150000 },
                { name: 'NFT Mint', gas: 100000 },
                { name: 'NFT Transfer', gas: 85000 },
              ].map((op) => (
                <tr
                  key={op.name}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{op.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {op.gas.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                    {gasData?.standard
                      ? calculateCost(parseFloat(gasData.standard), op.gas)
                      : '-'}{' '}
                    ETH
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                    {gasData?.fast ? calculateCost(parseFloat(gasData.fast), op.gas) : '-'} ETH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
function GasCostCalculator({ currentGasPrice }: { currentGasPrice: number }) {
  const [gasLimit, setGasLimit] = useState('21000');
  const [gasPrice, setGasPrice] = useState(currentGasPrice.toString());
  useEffect(() => {
    setGasPrice(currentGasPrice.toString());
  }, [currentGasPrice]);
  const cost = (parseFloat(gasPrice) * parseInt(gasLimit || '0')) / 1e9;
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gas Limit
          </label>
          <input
            type="number"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            placeholder="21000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gas Price (Gwei)
          </label>
          <input
            type="number"
            value={gasPrice}
            onChange={(e) => setGasPrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            placeholder="Current gas price"
          />
        </div>
      </div>
      <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Cost</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {cost.toFixed(6)} ETH
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {parseInt(gasLimit || '0').toLocaleString()} gas × {parseFloat(gasPrice).toFixed(2)} Gwei
        </p>
      </div>
    </div>
  );
}
