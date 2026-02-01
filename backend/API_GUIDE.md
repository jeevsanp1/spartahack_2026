# STAMPD Backend API Guide

## Overview
This is the API documentation for the STAMPD loyalty rewards platform backend. The backend manages SPL tokens on Solana for loyalty programs.

**Base URL:** `http://localhost:3000` (development)  
**Network:** Solana Devnet  
**Response Format:** JSON  

---

## Authentication
Currently no authentication required for public endpoints. Admin endpoints for merchant creation are unprotected (development only).

---

## API Endpoints

### 1. Health Check
**GET** `/health`

Check if the backend service is running.

**Response:**
```json
{
  "success": true,
  "message": "STAMPD Backend is running",
  "timestamp": "2026-01-31T23:39:15.714Z",
  "network": "devnet"
}
```

---

### 2. Merchant Management

#### List All Merchants
**GET** `/merchants`

Get a list of all available merchants and their token information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
      "name": "Spartan Coffee",
      "color": "#8B4513",
      "logo_url": "https://example.com/logo.png",
      "type": "coffee",
      "tokenMintAddress": "87ZCz5VKeHqkdzSPoAFtCdTfGuooUiTCmRhfNeRspxxo"
    }
  ]
}
```

#### Get Specific Merchant
**GET** `/merchants/:id`

Get detailed information about a specific merchant.

**Parameters:**
- `id` (string): Merchant UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
    "name": "Spartan Coffee", 
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "tokenMintAddress": "87ZCz5VKeHqkdzSPoAFtCdTfGuooUiTCmRhfNeRspxxo",
    "color": "#8B4513",
    "logoUrl": "https://example.com/logo.png",
    "type": "coffee",
    "createdAt": "2026-02-01T04:39:18.950Z"
  }
}
```

---

### 3. Token Transactions

#### Earn Tokens (Gasless Minting)
**POST** `/transactions/earn`

Mint tokens to a user's wallet when they scan an "earn" QR code. This is gasless for the user.

**Request Body:**
```json
{
  "userPublicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "merchantId": "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
  "amount": 1,
  "proof": "optional-qr-validation-token"
}
```

**Parameters:**
- `userPublicKey` (string): User's Solana wallet address
- `merchantId` (string): Merchant UUID
- `amount` (number, optional): Number of tokens to mint (default: 1)
- `proof` (string, optional): QR code validation token

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": "MV9j2fKEX9oRhB74vRQXz2PwmGh73UaXZGyb4ZTzDMWXtCDo46Ew7ah1CMdSAjNngXwvnS1kfp3q7tgB7hYxE66",
    "amount": 1,
    "merchantName": "Spartan Coffee",
    "createdATA": true
  }
}
```

**Notes:**
- Backend pays for transaction fees and rent
- Automatically creates Associated Token Account (ATA) if needed
- Transaction is immediately submitted to Solana

#### Redeem Tokens
**POST** `/transactions/redeem`

Create a redemption transaction for the user to sign. Returns an unsigned transaction.

**Request Body:**
```json
{
  "userPublicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "merchantId": "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
  "amount": 10,
  "burnTokens": true
}
```

**Parameters:**
- `userPublicKey` (string): User's Solana wallet address
- `merchantId` (string): Merchant UUID
- `amount` (number): Number of tokens to redeem
- `burnTokens` (boolean, optional): Whether to burn tokens or transfer to merchant (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": "base64-encoded-unsigned-transaction",
    "amount": 10,
    "merchantName": "Spartan Coffee",
    "burnTokens": true
  }
}
```

**Integration Notes:**
1. Decode the base64 transaction
2. Present confirmation UI to user
3. Have user sign transaction with their wallet
4. Submit signed transaction to Solana network

---

### 4. User Data

#### Get User Token Balances
**GET** `/users/:publicKey/balances`

Get all token balances for a user across all merchants.

**Parameters:**
- `publicKey` (string): User's Solana wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "userPublicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "balances": [
      {
        "merchantId": "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
        "merchantName": "Spartan Coffee",
        "tokenMintAddress": "87ZCz5VKeHqkdzSPoAFtCdTfGuooUiTCmRhfNeRspxxo",
        "balance": 5,
        "color": "#8B4513",
        "type": "coffee"
      }
    ]
  }
}
```

**Notes:**
- Only returns merchants where user has positive balance
- Balance is in human-readable format (not lamports)

#### Get User Transaction History
**GET** `/users/:publicKey/history`

Get transaction history for a user with pagination.

**Parameters:**
- `publicKey` (string): User's Solana wallet address

**Query Parameters:**
- `limit` (number, optional): Number of transactions to return (default: 50)
- `offset` (number, optional): Number of transactions to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "userPublicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "history": [
      {
        "id": "bc26e057-313a-4b84-ad65-884538cf46f9",
        "type": "earn",
        "amount": "1",
        "description": "Earned 1 token at Spartan Coffee",
        "merchantName": "Spartan Coffee",
        "merchantColor": "#8B4513",
        "merchantType": "coffee",
        "txSignature": "MV9j2fKEX9oRhB74vRQXz2PwmGh73UaXZGyb4ZTzDMWXtCDo46Ew7ah1CMdSAjNngXwvnS1kfp3q7tgB7hYxE66",
        "timestamp": "2026-02-01T04:39:20.891Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message description",
  "details": "Additional technical details (development only)"
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing or invalid parameters |
| 404 | Not Found - Merchant or resource not found |
| 500 | Internal Server Error - Backend or Solana network issue |

### Solana-Specific Errors

| Error Message | Cause | Solution |
|---------------|--------|----------|
| "Insufficient balance" | User doesn't have enough tokens | Check balance before redemption |
| "Insufficient funds - mint authority needs SOL" | Backend wallet needs funding | Contact admin (development issue) |
| "Transaction failed" | Solana network error | Retry after a few seconds |

---

## Integration Examples

### JavaScript/React Native Example

```javascript
const STAMPD_API_BASE = 'http://localhost:3000';

// Get merchants
async function getMerchants() {
  const response = await fetch(`${STAMPD_API_BASE}/merchants`);
  const data = await response.json();
  return data.data;
}

// Earn tokens (QR code scan)
async function earnTokens(userPublicKey, merchantId) {
  const response = await fetch(`${STAMPD_API_BASE}/transactions/earn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userPublicKey,
      merchantId,
      amount: 1
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log('Earned tokens! Transaction:', data.data.signature);
  }
  return data;
}

// Get user balances
async function getUserBalances(userPublicKey) {
  const response = await fetch(`${STAMPD_API_BASE}/users/${userPublicKey}/balances`);
  const data = await response.json();
  return data.data.balances;
}

// Create redemption transaction (user must sign)
async function createRedemption(userPublicKey, merchantId, amount) {
  const response = await fetch(`${STAMPD_API_BASE}/transactions/redeem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userPublicKey,
      merchantId,
      amount
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Decode transaction and have user sign it
    const transaction = data.data.transaction;
    // ... implement signing logic with user's wallet
  }
  
  return data;
}
```

---

## Development Notes

- **Network:** Currently on Solana Devnet (free testing)
- **Database:** PostgreSQL with raw SQL queries
- **Rate Limiting:** None currently implemented
- **Authentication:** Not implemented for public endpoints
- **CORS:** Enabled for all origins (development only)

---

## Support

For technical issues or questions:
1. Check the backend logs for detailed error messages
2. Verify Solana network connectivity
3. Ensure user wallet addresses are valid Solana public keys
4. Confirm merchant exists before transactions