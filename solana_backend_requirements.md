# Solana Backend API Requirements

This document outlines the requirements for a backend API to power the **STAMPD** loyalty application using the Solana blockchain.

## Core Responsibilities

The API will serve as the bridge between the mobile app (React Native) and the Solana Blockchain. Its primary duties are:
1.  **Identity & Wallet Management**: Resolving Users and Merchants to Solana Public Keys.
2.  **Token Management**: Managing SPL Tokens (minting, transferring, burning) representing loyalty points.
3.  **Transaction Orchestration**: Constructing transactions for the frontend to sign or finding transactions to submit directly.

## Data Structures (Database / State)

The backend needs to maintain a mapping of off-chain data to on-chain assets.

### Merchants
- **ID**: `string` (Internal UUID)
- **Name**: `string`
- **Wallet Address**: `string` (Solana Public Key for receiving redeemed tokens)
- **Token Mint Address**: `string` (The specific SPL Token Address for this merchant's points)
- **Mint Authority Key**: `secure_storage` (Private key needed to mint new tokens for this merchant)
- **Metadata**: `color`, `logo_url`, `type` (coffee/grocery)

### Users
- **ID**: `string`
- **Wallet Address**: `string` (Solana Public Key)

## API Endpoints

### 1. Merchant & Token Information
*Endpoints to fetch static data needed for the UI.*

-   **`GET /merchants`**
    -   **Returns**: List of merchants with their `id`, `name`, `color`, and `tokenMintAddress`.
    -   **Purpose**: Allows the frontend to know which SPL Token Mint corresponds to which card in the UI.

-   **`GET /merchants/:id`**
    -   **Returns**: Details for a specific merchant.

### 2. Earning Tokens (Minting)
*Triggered when a user scans a standard "Earn" QR Code.*

-   **`POST /transactions/earn`**
    -   **Input**:
        -   `userPublicKey`: The user's wallet address.
        -   `merchantId`: The ID of the merchant being visited.
        -   `amount`: (Optional) Amount to mint, defaults to 1.
        -   `proof`: (Optional) Validation token from the QR code to prevent replay attacks.
    -   **Backend Logic**:
        1.  Validate the `merchantId` and `proof`.
        2.  Check if `userPublicKey` has an **Associated Token Account (ATA)** for this merchant's Mint.
        3.  **If ATA exists**: Construct a `MintTo` instruction.
        4.  **If ATA is missing**: Construct `CreateAssociatedTokenAccount` + `MintTo` instructions.
        5.  **Signer**: The Backend (Mint Authority) must sign. The Backend likely pays for Rent/Gas (Gasless for user).
    -   **Returns**:
        -   `signature`: The transaction signature if submitted by backend.
        -   **OR** `transaction`: Serialized transaction if User needs to sign (unlikely for earning if Backend pays).

### 3. Redeeming Tokens (Burning or Transferring)
*Triggered when a user scans a "Redeem" QR Code or activates a reward.*

-   **`POST /transactions/redeem`**
    -   **Input**:
        -   `userPublicKey`: The user's wallet address.
        -   `merchantId`: The ID of the merchant.
        -   `amount`: Number of tokens to redeem (e.g., 10).
    -   **Backend Logic**:
        1.  Fetch `tokenMintAddress` and `merchantWalletAddress`.
        2.  Construct a transaction with an SPL Token `Transfer` (to merchant) or `Burn` instruction.
        3.  **Signer**: The **User** must sign this transaction because it moves funds from their wallet.
    -   **Returns**:
        -   `transaction`: A base64 encoded serialized transaction (partially signed by backend if backend is payer, otherwise just the instruction).
    -   **Frontend Action**: The App decodes the transaction, prompts User to sign, and submits it to the network.

### 4. History & Balances
*While the Frontend can query Solana directly, a backend indexer is faster.*

-   **`GET /users/:publicKey/balances`**
    -   **Returns**: A summary of tokens held by the user, mapped to `merchantId`.
    -   **Purpose**: Populates the "My Cards" section with real on-chain data.

-   **`GET /users/:publicKey/history`**
    -   **Returns**: List of recent transfers/mints parsed into readable format (e.g., "Earned 1 Token at Spartan Coffee").

## Technical Stack Requirements

-   **Language/Framework**: Node.js / Next.js / Python (FastAPI).
-   **Solana SDK**: `@solana/web3.js`, `@solana/spl-token`.
-   **Wallet Security**: Determine how the Backend's "Mint Authority" keys are stored (e.g., AWS KMS, Hashicorp Vault, or simple .env for hackathon).
-   **Network**: Devnet (for testing) / Mainnet.
