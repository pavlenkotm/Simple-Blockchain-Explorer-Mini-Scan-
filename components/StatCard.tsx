import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  suffix?: string;
  loading?: boolean;
}

export default function StatCard({ title, value, change, icon, suffix, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
            {suffix && <span className="text-lg ml-1 text-gray-500">{suffix}</span>}
          </p>
          {change !== undefined && (
            <p
              className={`text-sm mt-2 ${
                change >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </p>
          )}
        </>
      )}
    </div>
  );
}
