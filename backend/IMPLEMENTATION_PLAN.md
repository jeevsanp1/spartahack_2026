# STAMPD Backend API Implementation Plan

## Project Overview
STAMPD is a Solana-based loyalty rewards platform where local businesses can create their own loyalty tokens (SPL tokens) for customers. This backend serves as the bridge between the React Native mobile app and the Solana blockchain.

### Tech Stack
- **Backend:** Express.js with TypeScript
- **Database:** Supabase (PostgreSQL) with raw SQL (no ORM)
- **Blockchain:** Solana (devnet for now)
- **Libraries:** @solana/web3.js, @solana/spl-token, pg, bcrypt, jsonwebtoken, express, cors

### Architecture (Non-Custodial)
- Each merchant gets their own SPL token (mint) on Solana
- Users manage their own wallets (non-custodial)
- Backend holds mint authority keys to mint new tokens
- Users sign their own redemption transactions
- Backend constructs transactions for frontend to sign
- All token balances live on-chain, metadata in PostgreSQL

### Core Responsibilities
1. **Identity & Wallet Management**: Mapping merchants to Solana public keys
2. **Token Management**: Managing SPL tokens (minting, transferring, burning)
3. **Transaction Orchestration**: Constructing transactions for frontend signing

## Implementation Phases

### Phase 1: Foundation (High Priority)
1. **Set up Express.js project with TypeScript**
   - Initialize Express with TypeScript
   - Configure tsconfig.json
   - Set up basic project structure with routes

2. **Install backend dependencies**
   - express, cors, helmet, dotenv
   - @solana/web3.js, @solana/spl-token
   - pg, bcrypt, jsonwebtoken
   - Type definitions (@types/node, @types/express, etc.)

3. **Design database schema (merchants, tokens, transactions)**
   - Merchants table (id, name, wallet_address, token_mint_address, encrypted_mint_authority_key, color, logo_url, type, created_at)
   - Tokens table (id, merchant_id, name, symbol, decimals, mint_address, created_at)
   - Transactions table (id, user_public_key, merchant_id, type, amount, tx_signature, created_at)
   - No users table (non-custodial, users identified by public key only)

4. **Create environment variables setup**
   - Solana RPC endpoint (devnet)
   - Database connection
   - Master encryption key for mint authority keys
   - Optional: JWT secret for merchant auth

5. **Build Solana utilities (token operations, transaction construction)**
   - Token mint creation for merchants
   - ATA (Associated Token Account) creation
   - Transaction construction for minting/transferring
   - Balance and transaction history parsing

### Phase 2: STAMPD API Endpoints (Medium Priority)
6. **Implement merchant management APIs**
   - GET /merchants - List all merchants with metadata
   - GET /merchants/:id - Get specific merchant details
   - POST /merchants - Create new merchant (admin)

7. **Build earning tokens API (gasless minting)**
   - POST /transactions/earn
   - Validate user and merchant
   - Check/create ATA if needed
   - Mint tokens to user wallet (backend signs)

8. **Build redemption API (user-signed transactions)**
   - POST /transactions/redeem
   - Construct transfer/burn transaction
   - Return unsigned transaction for user to sign

9. **Implement user balance and history APIs**
   - GET /users/:publicKey/balances
   - GET /users/:publicKey/history
   - Query Solana directly for real-time data

## Database Schema

```sql
-- Merchants table
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255) NOT NULL, -- Where redeemed tokens go
    token_mint_address VARCHAR(255) UNIQUE NOT NULL, -- SPL token mint
    encrypted_mint_authority_key TEXT NOT NULL, -- Encrypted private key for minting
    color VARCHAR(7), -- Hex color for UI
    logo_url TEXT,
    type VARCHAR(50), -- coffee, grocery, etc
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tokens table (optional - could be merged with merchants)
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimals INTEGER DEFAULT 9,
    mint_address VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (for backend tracking, real data is on-chain)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_public_key VARCHAR(255) NOT NULL, -- User's wallet address
    merchant_id UUID REFERENCES merchants(id),
    type VARCHAR(20) NOT NULL, -- 'earn' or 'redeem'
    amount BIGINT NOT NULL,
    tx_signature VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## STAMPD API Endpoints

### Merchant & Token Information
- `GET /merchants` - List all merchants with metadata (id, name, color, tokenMintAddress)
- `GET /merchants/:id` - Get specific merchant details

### Earning Tokens (Minting)
- `POST /transactions/earn` - Mint tokens to user wallet (gasless)
  - Input: `userPublicKey`, `merchantId`, `amount`, `proof` (optional)
  - Returns: `signature` (if backend submits) or `transaction` (if user signs)

### Redeeming Tokens (Burning/Transferring)
- `POST /transactions/redeem` - Create redemption transaction
  - Input: `userPublicKey`, `merchantId`, `amount`
  - Returns: `transaction` (base64 encoded for user to sign)

### User Balance & History
- `GET /users/:publicKey/balances` - Get token balances mapped to merchants
- `GET /users/:publicKey/history` - Get transaction history in readable format

### Admin APIs (Optional)
- `POST /merchants` - Create new merchant (admin only)
- `GET /health` - Health check