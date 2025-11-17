'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Transaction } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TransactionChartProps {
  transactions: Transaction[];
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Sort transactions by timestamp
  const sortedTransactions = [...transactions].sort((a, b) => a.timestamp - b.timestamp);

  // Prepare data for the chart
  const labels = sortedTransactions.map((tx) => {
    const date = new Date(tx.timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const values = sortedTransactions.map((tx) => {
    return parseFloat((BigInt(tx.value) / BigInt(1e18)).toString());
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Transaction Value (ETH)',
        data: values,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(229, 231, 235)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-64 md:h-80">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
