import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import NetworkSelector from '@/components/NetworkSelector';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blockchain Explorer - Mini-Scan',
  description: 'A mini blockchain explorer for EVM networks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Mini-Scan
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Blockchain Explorer
                    </p>
                  </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/block/latest"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Blocks
                  </Link>
                </nav>

                <div className="flex items-center space-x-3">
                  <NetworkSelector />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Mini-Scan - Blockchain Explorer for EVM Networks
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Powered by ethers.js</span>
                  <span>•</span>
                  <span>Next.js 14</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
