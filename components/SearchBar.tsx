'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const network = searchParams.get('network') || 'ethereum';
    const trimmedQuery = query.trim();

    // Determine what type of search this is
    if (trimmedQuery.startsWith('0x') && trimmedQuery.length === 66) {
      // Transaction hash or block hash
      router.push(`/tx/${trimmedQuery}?network=${network}`);
    } else if (trimmedQuery.startsWith('0x') && trimmedQuery.length === 42) {
      // Address
      router.push(`/address/${trimmedQuery}?network=${network}`);
    } else if (/^\d+$/.test(trimmedQuery)) {
      // Block number
      router.push(`/block/${trimmedQuery}?network=${network}`);
    } else {
      alert('Invalid input. Please enter a valid address, transaction hash, or block number.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Address / Txn Hash / Block Number"
          className="w-full px-6 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
