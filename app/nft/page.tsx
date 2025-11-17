'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { NFTCollection, NFTItem } from '@/types/ecosystem';
export default function NFTPage() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [contractAddress, setContractAddress] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [collection, setCollection] = useState<NFTCollection | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSearchCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/nft/collection?address=${contractAddress}&network=${network}`
      );
      const data = await response.json();
      if (data.success) {
        setCollection(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch collection information');
    } finally {
      setLoading(false);
    }
  };
  const handleSearchNFTs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress || !ownerAddress) {
      setError('Please enter both contract and owner addresses');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/nft/owned?contract=${contractAddress}&owner=${ownerAddress}&network=${network}`
      );
      const data = await response.json();
      if (data.success) {
        setNfts(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">NFT Explorer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore NFT collections and tokens
        </p>
      </div>
      {/* Collection Search */}
      <Card title="Search NFT Collection">
        <form onSubmit={handleSearchCollection} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              NFT Contract Address
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
          >
            {loading ? 'Searching...' : 'Search Collection'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200">
            {error}
          </div>
        )}
        {collection && (
          <div className="mt-6 p-6 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {collection.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
                <p className="font-medium text-gray-900 dark:text-white">{collection.symbol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {collection.totalSupply > 0
                    ? collection.totalSupply.toLocaleString()
                    : 'Unknown'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Address</p>
                <Link
                  href={`/contract/${collection.address}?network=${network}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm break-all"
                >
                  {collection.address}
                </Link>
              </div>
            </div>
          </div>
        )}
      </Card>
      {/* NFT Ownership Search */}
      <Card title="Search NFTs by Owner">
        <form onSubmit={handleSearchNFTs} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Owner Address
            </label>
            <input
              type="text"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
          >
            {loading ? 'Searching...' : 'Find NFTs'}
          </button>
        </form>
        {loading && <Loading />}
        {nfts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Found {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nfts.map((nft) => (
                <div
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  {nft.image && (
                    <img
                      src={nft.image}
                      alt={nft.name || `NFT #${nft.tokenId}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x400?text=NFT';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      {nft.name || `Token #${nft.tokenId}`}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {nft.description?.slice(0, 100)}
                      {nft.description && nft.description.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Token ID:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        #{nft.tokenId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && nfts.length === 0 && ownerAddress && (
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            No NFTs found for this owner in this collection
          </p>
        )}
      </Card>
      {/* Popular Collections (Placeholder) */}
      <Card title="Popular NFT Collections">
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            Popular collections will be displayed here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Feature requires NFT marketplace API integration
          </p>
        </div>
      </Card>
    </div>
  );
}
