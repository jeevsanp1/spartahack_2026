# STAMPD - Blockchain-Powered Loyalty Rewards

A Solana-based loyalty rewards platform that enables local businesses to create and manage their own digital loyalty tokens. Built for SpartaHack 2026.

## Overview

**STAMPD** is a decentralized loyalty rewards system where merchants can mint their own branded SPL tokens (Solana Program Library tokens) for customers. Users earn tokens by scanning QR codes at participating businesses and can redeem accumulated tokens for rewards - all powered by blockchain technology.

### Key Features

- **Blockchain-Backed Rewards**: Each merchant has their own SPL token on Solana
- **Gasless Earning**: Users earn tokens without paying transaction fees
- **Non-Custodial**: Users maintain control of their own wallets
- **Real-Time Balances**: All token balances live on-chain
- **Multi-Merchant Support**: Track rewards from multiple businesses in one app
- **QR Code Integration**: Simple scan-to-earn and scan-to-redeem flows

## Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Libraries**: React Native Reanimated, Expo Linear Gradient, Lucide Icons
- **Camera**: Expo Camera & Barcode Scanner
- **Network**: Axios for API calls

### Backend (API)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with raw SQL queries)
- **Blockchain**: Solana Web3.js & SPL Token
- **Security**: Crypto-js for key encryption
- **Dev Tools**: Nodemon, ts-node

### Blockchain
- **Network**: Solana Devnet (for development)
- **Token Standard**: SPL Tokens
- **Wallet Integration**: Solana Web3.js

## Project Structure

```
spartahack_2026/
├── backend/                 # Express API server
│   ├── src/                # TypeScript source files
│   ├── API_GUIDE.md        # Comprehensive API documentation
│   ├── IMPLEMENTATION_PLAN.md
│   └── package.json
├── spartahack-app/         # React Native mobile app
│   ├── app/               # Expo Router pages
│   │   ├── (tabs)/       # Bottom tab navigation
│   │   ├── merchant/     # Merchant detail screens
│   │   └── scan.tsx      # QR scanner screen
│   ├── components/       # Reusable components
│   └── package.json
├── freewili_qr/           # Python QR code generator utilities
├── test_qrs/              # Sample QR codes for testing
├── generate_qr.js         # QR code generation script
└── RUN_GUIDE.md           # Quick start guide
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Expo Go app (for mobile testing)
- Solana CLI (optional, for advanced testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spartahack_2026
   ```

2. **Install root dependencies** (for QR generation)
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the mobile app**
   ```bash
   cd spartahack-app
   npm install
   ```

### Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/stampd

# Server Configuration
PORT=3000

# Encryption (for storing mint authority keys)
ENCRYPTION_KEY=your-secure-encryption-key-here
```

#### Database Setup

Run the SQL schema to create required tables (see `backend/IMPLEMENTATION_PLAN.md` for schema details).

## Running the Application

### Option 1: Using the Quick Start Guide

Follow the instructions in [RUN_GUIDE.md](./RUN_GUIDE.md) for a simplified setup.

### Option 2: Manual Setup

#### 1. Start the Backend

```bash
cd backend
npm run dev
```

The API will start on `http://localhost:3000`

Verify it's running:
```bash
curl http://localhost:3000/health
```

#### 2. Start the Mobile App

```bash
cd spartahack-app
npm start
```

Scan the QR code with the **Expo Go** app on your phone to launch the app.

### Testing the Application

1. **Generate Test QR Codes** (optional)
   ```bash
   node generate_test_qr.js
   ```

2. **Use Pre-Generated QR Codes**
   - Open `test_qrs/earn_spartan_coffee.png` on your computer
   - Launch the app on your phone
   - Tap "Scan & Earn"
   - Point your phone at the QR code on your screen

3. **Test API Endpoints**
   ```bash
   cd backend
   npm run test:api
   ```

## API Documentation

Comprehensive API documentation is available in [backend/API_GUIDE.md](./backend/API_GUIDE.md).

### Quick API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/merchants` | GET | List all merchants |
| `/merchants/:id` | GET | Get merchant details |
| `/transactions/earn` | POST | Mint tokens (gasless) |
| `/transactions/redeem` | POST | Create redemption transaction |
| `/users/:publicKey/balances` | GET | Get user token balances |
| `/users/:publicKey/history` | GET | Get transaction history |

## Architecture

### System Flow

1. **User Scans QR Code**: Opens camera in the mobile app
2. **QR Decryption**: App extracts merchant ID and action (earn/redeem)
3. **API Request**: App sends transaction request to backend
4. **Blockchain Interaction**:
   - For **earning**: Backend mints tokens directly (gasless for user)
   - For **redeeming**: Backend creates unsigned transaction for user to sign
5. **Balance Update**: Token balance updates on-chain instantly
6. **UI Refresh**: App fetches updated balances from blockchain

### Key Design Decisions

- **Non-Custodial**: Users control their own wallets (no private keys stored on backend)
- **Gasless Earning**: Backend pays transaction fees when users earn tokens
- **User-Signed Redemptions**: Users must sign redemption transactions (they control their tokens)
- **On-Chain Balances**: All token balances are stored on Solana blockchain
- **Off-Chain Metadata**: Business information (name, colors, logos) stored in PostgreSQL

## Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run production build
npm run test:api # Run API tests
```

#### Mobile App
```bash
npm start        # Start Expo development server
npm run android  # Run on Android device/emulator
npm run ios      # Run on iOS device/simulator
npm run web      # Run in web browser
npm run lint     # Run ESLint
```

### Development Tools

- **Backend Debugging**: Check console logs when running `npm run dev`
- **Mobile Debugging**: Shake device and select "Debug" in Expo Go
- **Solana Explorer**: View transactions on [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- **Database Client**: Use pgAdmin or psql to inspect database

## Project Features

### For Users
- Scan QR codes to earn loyalty tokens instantly
- View all loyalty cards in one unified wallet
- Track transaction history across all merchants
- Redeem accumulated tokens for rewards
- No signup required - just a Solana wallet

### For Merchants
- Create custom-branded loyalty tokens
- Generate earn & redeem QR codes
- Track customer engagement
- Zero platform fees for transactions
- Immutable, transparent reward system

## Roadmap

- [ ] Mainnet deployment
- [ ] Merchant dashboard for analytics
- [ ] Push notifications for token earnings
- [ ] Multi-tier reward programs
- [ ] Social sharing features
- [ ] Integration with popular wallet apps

## Known Issues

- Currently runs on Solana Devnet (test network)
- No authentication system implemented yet
- Limited error handling for network failures
- QR code validation not yet implemented

## Contributing

This project was built for SpartaHack 2026. For bug reports or feature requests, please create an issue in the repository.

## Team

Built with passion during SpartaHack 2026.

## License

[Add your license here]

## Acknowledgments

- Solana Foundation for blockchain infrastructure
- Expo team for React Native tooling
- SpartaHack organizers

---

**Built on Solana** | **Powered by SPL Tokens** | **Made for Local Businesses**
