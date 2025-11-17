import Card from '@/components/Card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function APIDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          API Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Public API for blockchain data access
        </p>
      </div>

      {/* Introduction */}
      <Card title="Introduction">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">
            Mini-Scan provides a free, public API for accessing blockchain data across multiple EVM networks.
            All endpoints return JSON responses and support cross-origin requests (CORS).
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Base URL:</strong> <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api</code>
            </p>
          </div>
        </div>
      </Card>

      {/* Endpoints */}
      <Card title="Address Endpoints">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/address/[address]
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get address information and recent transactions
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <strong>Query Parameters:</strong>
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li><code>network</code> - Network ID (ethereum, base, arbitrum)</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-2">
                <strong>Example:</strong>
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block overflow-x-auto">
                GET /api/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?network=ethereum
              </code>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Block Endpoints">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/block/[block]
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get block information by block number or &apos;latest&apos;
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <strong>Query Parameters:</strong>
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li><code>network</code> - Network ID</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-2">
                <strong>Example:</strong>
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block overflow-x-auto">
                GET /api/block/latest?network=ethereum
              </code>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Transaction Endpoints">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/transaction/[hash]
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get transaction details by transaction hash
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <strong>Example:</strong>
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block overflow-x-auto">
                GET /api/transaction/0x123...?network=ethereum
              </code>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Analytics Endpoints">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/dashboard/stats
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get network statistics (TPS, gas prices, etc.)
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/dashboard/gas-history
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get historical gas price data
            </p>
          </div>
        </div>
      </Card>

      <Card title="Token Endpoints">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/tokens/top
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get list of top tokens on the network
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-mono rounded">
                GET
              </span>
              <code className="text-sm font-mono text-gray-900 dark:text-white">
                /api/tokens/info
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get token information by contract address
            </p>
          </div>
        </div>
      </Card>

      <Card title="Response Format">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <strong>Success Response:</strong>
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    // ... response data
  }
}`}
          </pre>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 mb-3">
            <strong>Error Response:</strong>
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded overflow-x-auto">
{`{
  "success": false,
  "error": "Error message"
}`}
          </pre>
        </div>
      </Card>

      <Card title="Rate Limits">
        <p className="text-gray-600 dark:text-gray-400">
          Currently, there are no strict rate limits. However, please be respectful and avoid making
          excessive requests. We recommend implementing caching on your end for frequently accessed data.
        </p>
      </Card>
    </div>
  );
}
