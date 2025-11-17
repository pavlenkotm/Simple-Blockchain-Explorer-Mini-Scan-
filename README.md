# 🔍 Mini-Scan - Simple Blockchain Explorer

A modern, feature-rich blockchain explorer for EVM-compatible networks (Ethereum, Base, Arbitrum). Built with Next.js 14, TypeScript, and ethers.js.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![ethers.js](https://img.shields.io/badge/ethers.js-6.13-7c3aed)

## ✨ Features

### 🔎 Search & Explore
- **Universal Search**: Search by wallet address, transaction hash, or block number
- **Multi-Network Support**: Switch between Ethereum, Base, and Arbitrum networks
- **Real-time Data**: Direct RPC connection for live blockchain data

### 💼 Wallet Explorer
- View ETH balance for any address
- Display recent transactions (last 20)
- Show transaction count
- Identify contract vs EOA addresses
- Interactive transaction value charts
- Gas usage analytics

### 📦 Block Inspector
- View block details (hash, timestamp, miner)
- Display gas usage and limits
- Show base fee per gas (EIP-1559)
- List all transactions in a block
- Navigate between blocks (prev/next)

### 📝 Transaction Details
- Complete transaction information
- Transaction status (success/failed)
- Gas price and gas used
- Input data viewer
- From/To address links
- Confirmation count

### 🔧 Contract Inspector
- View contract bytecode
- ABI inspector interface
- Read public contract functions
- Execute view/pure functions
- Example ABIs for common contracts (ERC20)

### 📊 Data Visualization
- **Transaction Value Chart**: Line chart showing transaction values over time
- **Gas Usage Chart**: Bar chart displaying gas consumption
- Powered by Chart.js with dark/light theme support

### 🎨 UI/UX
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Network Selector**: Easy switching between EVM networks
- **Copy to Clipboard**: Quick copy for addresses and hashes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4
- **Charts**: Chart.js 4.4 + react-chartjs-2
- **Icons**: Heroicons (SVG)

### Backend
- **Runtime**: Node.js
- **Blockchain**: ethers.js 6.13
- **RPC**: Direct JSON-RPC provider connections
- **API Routes**: Next.js API routes

### Additional
- **Date Formatting**: date-fns
- **HTTP Client**: axios (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Simple-Blockchain-Explorer-Mini-Scan-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` to add custom RPC endpoints or API keys:
   ```env
   NEXT_PUBLIC_ETHEREUM_RPC=https://eth.llamarpc.com
   NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
   NEXT_PUBLIC_ARBITRUM_RPC=https://arb1.arbitrum.io/rpc
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Search Examples

1. **Search by Address**
   ```
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```

2. **Search by Transaction Hash**
   ```
   0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

3. **Search by Block Number**
   ```
   18000000
   ```

### Network Switching

Use the network selector in the header to switch between:
- Ethereum Mainnet
- Base
- Arbitrum One

### Contract Inspection

1. Navigate to any contract address
2. Click "View Contract" button
3. Paste the contract's ABI (JSON format)
4. Click "Load ABI" to enable function reading
5. Click "Read" on view/pure functions to execute them

## 📁 Project Structure

```
Simple-Blockchain-Explorer-Mini-Scan-/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── address/[address]/   # Address data endpoint
│   │   ├── block/[block]/       # Block data endpoint
│   │   ├── transaction/[hash]/  # Transaction data endpoint
│   │   └── contract/[address]/  # Contract data endpoint
│   ├── address/[address]/       # Address page
│   ├── block/[block]/           # Block page
│   ├── tx/[hash]/               # Transaction page
│   ├── contract/[address]/      # Contract page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── Card.tsx                 # Reusable card component
│   ├── CopyButton.tsx           # Copy to clipboard button
│   ├── GasChart.tsx             # Gas usage chart
│   ├── Loading.tsx              # Loading spinner
│   ├── NetworkSelector.tsx      # Network dropdown
│   ├── SearchBar.tsx            # Search input
│   ├── ThemeToggle.tsx          # Dark/light theme toggle
│   └── TransactionChart.tsx     # Transaction value chart
├── lib/                          # Utilities and helpers
│   ├── blockchain.ts            # Blockchain interaction logic
│   └── networks.ts              # Network configurations
├── types/                        # TypeScript types
│   └── index.ts                 # Type definitions
├── utils/                        # Utility functions
│   └── format.ts                # Formatting helpers
├── public/                       # Static assets
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔌 API Endpoints

### GET `/api/address/[address]`
Fetch address information and recent transactions.

**Query Parameters:**
- `network`: Network ID (ethereum, base, arbitrum)

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "balance": "1234567890000000000",
    "balanceFormatted": "1.23456789",
    "transactionCount": 42,
    "isContract": false,
    "transactions": [...]
  }
}
```

### GET `/api/block/[block]`
Fetch block information.

**Query Parameters:**
- `network`: Network ID
- `block`: Block number or "latest"

**Response:**
```json
{
  "success": true,
  "data": {
    "number": 18000000,
    "hash": "0x...",
    "timestamp": 1234567890,
    "miner": "0x...",
    "gasUsed": "12345678",
    "transactions": [...]
  }
}
```

### GET `/api/transaction/[hash]`
Fetch transaction details.

**Query Parameters:**
- `network`: Network ID

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "0x...",
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "gasPrice": "20000000000",
    "status": 1
  }
}
```

### GET `/api/contract/[address]`
Fetch contract information.

**Query Parameters:**
- `network`: Network ID

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "bytecode": "0x...",
    "isContract": true,
    "balance": "0"
  }
}
```

## 🎨 Customization

### Adding New Networks

Edit `lib/networks.ts`:

```typescript
export const NETWORKS: Record<string, Network> = {
  // ... existing networks
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    chainId: 137,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};
```

### Customizing Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-color',
        // ...
      },
    },
  },
}
```

## 🚧 Limitations & Future Enhancements

### Current Limitations
- Transaction history limited to last 1000 blocks (for performance)
- No transaction indexing (relies on real-time scanning)
- Contract ABI must be provided manually
- Functions with parameters not yet supported in UI

### Planned Enhancements
- [ ] SQLite transaction indexing for full history
- [ ] ENS name resolution
- [ ] ERC20 token detection and display
- [ ] NFT (ERC721/ERC1155) viewer
- [ ] WebSocket support for live updates
- [ ] Contract verification integration
- [ ] Advanced search filters
- [ ] Export transaction history
- [ ] Growth statistics dashboard
- [ ] Gas price tracker
- [ ] Mempool viewer

## 📝 License

MIT License - feel free to use this project for your portfolio or commercial applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [ethers.js](https://docs.ethers.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Chart.js](https://www.chartjs.org/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for the Ethereum community**
