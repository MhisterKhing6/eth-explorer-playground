# ChainExplorer - Multi-Chain Blockchain Explorer

🔍 **Explore transactions, blocks, and addresses across multiple blockchain networks**

ChainExplorer is a modern, responsive blockchain explorer that provides real-time data and analytics for multiple blockchain networks including Bitcoin, Ethereum, Polygon, and more.

## 🌟 Features

### **Multi-Chain Support**
- **9 Networks**: Bitcoin, Ethereum, BNB Chain, Avalanche, Polygon, Optimism, Arbitrum, Base, Soneium
- **Real-Time Data**: Live blockchain data from Alchemy SDK and CoinGecko APIs
- **Network Switching**: Seamless switching between different blockchain networks

### **Comprehensive Search**
- **Block Explorer**: Search blocks by number with detailed transaction lists
- **Transaction Details**: View complete transaction information with gas fees
- **Address Lookup**: Check balances and transaction history for any address
- **Smart Search**: Auto-detect search type (block, transaction, address)
- **ENS Support**: Ready for ENS domain resolution (coming soon)

### **Real-Time Analytics**
- **Live Price Charts**: 24-hour price history with multiple timeframes (1h, 24h, 7d, 30d)
- **Market Data**: Real-time market cap, trading volume, and supply information
- **Network Status**: Live network health, TPS, and gas price indicators
- **Transaction Volume**: Hourly transaction count visualization

### **Advanced Features**
- **Time Filters**: Analyze data across different time periods
- **Transaction Categories**: Color-coded transaction types (DeFi, Transfer, Contract)
- **Copy to Clipboard**: One-click copying of addresses and hashes
- **Search History**: Recent searches with suggestions
- **Dark/Light Theme**: Persistent theme preferences
- **Responsive Design**: Mobile-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/MhisterKhing6/eth-explorer-playground

# Navigate to project directory
cd chainexplorer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Docker Deployment

```bash
# Build Docker image
docker build -t chainexplorer .

# Run container
docker run -p 8080:8080 chainexplorer
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Blockchain APIs**: Alchemy SDK, CoinGecko API
- **Routing**: React Router
- **State Management**: React Context
- **Icons**: Lucide React

## 🔧 Configuration

### API Keys
- **Alchemy SDK**: Configured for blockchain data
- **CoinGecko**: Premium API key for enhanced rate limits
- **Bitcoin**: Uses Blockstream API for Bitcoin-specific data

### Supported Networks
| Network | Currency | API Support |
|---------|----------|-------------|
| Bitcoin | BTC | Blockstream |
| Ethereum | ETH | Alchemy |
| BNB Chain | BNB | Alchemy |
| Avalanche | AVAX | Alchemy |
| Polygon | MATIC | Alchemy |
| Optimism | ETH | Alchemy |
| Arbitrum | ETH | Alchemy |
| Base | ETH | Alchemy |
| Soneium | SONEIUM | Alchemy |

## 📱 Features Overview

### Dashboard
- Network status indicators
- Real-time price metrics with trends
- Interactive price and volume charts
- Latest blocks and transactions
- Time-based filtering

### Block Explorer
- Detailed block information
- Transaction search within blocks
- Pagination for large transaction lists
- Miner and timestamp details

### Transaction Details
- Complete transaction information
- Network-specific gas units
- Status indicators
- Copy functionality for hashes and addresses

### Address Lookup
- Balance checking
- Transaction history
- Portfolio value calculation
- Search and filtering capabilities

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic system preference detection
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Search Hints**: Helpful examples for different search types
- **Copy to Clipboard**: Easy copying of blockchain data

## 🔗 Links

- **Developer**: [KBEmpire](https://mhisterkhing6.github.io/personalportfolio/)
- **GitHub**: [MhisterKhing6](https://github.com/MhisterKhing6)
- **LinkedIn**: [Botchway Kingsley](https://www.linkedin.com/in/botchway-kingsley-410097374)

## 📄 License

© 2024 KBEmpire. All rights reserved.

---

**ChainExplorer** - Making blockchain data accessible and beautiful 🚀
