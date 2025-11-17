'use client';

import { NETWORKS } from '@/lib/networks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NetworkSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNetwork = searchParams.get('network') || 'ethereum';

  const handleNetworkChange = (networkId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('network', networkId);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentNetwork}
      onChange={(e) => handleNetworkChange(e.target.value)}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-primary-500 transition-colors"
    >
      {Object.values(NETWORKS).map((network) => (
        <option key={network.id} value={network.id}>
          {network.name}
        </option>
      ))}
    </select>
  );
}
