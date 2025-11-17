'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GasChartProps {
  transactions: Transaction[];
}

export default function GasChart({ transactions }: GasChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  // Sort transactions by timestamp
  const sortedTransactions = [...transactions].sort((a, b) => a.timestamp - b.timestamp).slice(0, 10);

  const labels = sortedTransactions.map((tx, idx) => `Tx ${idx + 1}`);

  const gasUsedData = sortedTransactions.map((tx) => {
    return tx.gasUsed ? parseInt(tx.gasUsed) : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Gas Used',
        data: gasUsedData,
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
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
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}
