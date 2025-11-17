import SearchBar from '@/components/SearchBar';
import Card from '@/components/Card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Explore the Blockchain
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Search for addresses, transactions, blocks, and contracts on Ethereum, Base, and Arbitrum
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet Explorer
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            View balances, transactions, ERC20 tokens, and NFTs for any address
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Block Inspector
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Explore blocks, view timestamps, gas data, and all transactions
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Contract Reader
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Read contract data, inspect bytecode, and interact with public functions
          </p>
        </Card>
      </section>

      {/* Quick Links */}
      <section>
        <Card title="Quick Access">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/block/latest"
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                Latest Block
              </span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span className="text-gray-900 dark:text-white font-medium">
                Network Stats
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Coming soon
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Info Section */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Multi-Chain Support
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Mini-Scan supports multiple EVM-compatible networks including Ethereum Mainnet,
          Base, and Arbitrum One. Switch between networks using the selector in the header.
        </p>
      </section>
    </div>
  );
}
