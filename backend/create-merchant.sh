#!/bin/bash

# Simple script to create a new merchant via the API
BASE_URL="http://165.232.133.82:3000"

echo "🏪 Create New Merchant Account"
echo "================================"
echo ""

# Get merchant details from user
read -p "Merchant Name (e.g., 'Spartan Coffee'): " MERCHANT_NAME
read -p "Token Name (e.g., 'Spartan Coffee Coin'): " TOKEN_NAME
read -p "Token Symbol (e.g., 'SCC'): " TOKEN_SYMBOL

# Use a default wallet address (can be any valid Solana address)
WALLET_ADDRESS="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv"

echo ""
echo "📤 Creating merchant..."
echo ""

# Make the API call
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/admin/merchants" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$MERCHANT_NAME\",
    \"walletAddress\": \"$WALLET_ADDRESS\",
    \"color\": \"#8B4513\",
    \"logoUrl\": \"https://example.com/logo.png\",
    \"type\": \"coffee\",
    \"tokenName\": \"$TOKEN_NAME\",
    \"tokenSymbol\": \"$TOKEN_SYMBOL\"
  }")

# Split response and status code
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "Response:"
echo "$body" | jq . 2>/dev/null || echo "$body"
echo ""
echo "Status Code: $status_code"
echo ""

if [ "$status_code" == "201" ]; then
  echo "✅ Merchant created successfully!"
  merchant_id=$(echo "$body" | jq -r '.data.id' 2>/dev/null)
  token_mint=$(echo "$body" | jq -r '.data.tokenMintAddress' 2>/dev/null)
  echo ""
  echo "📝 Save these details:"
  echo "   Merchant ID: $merchant_id"
  echo "   Token Mint: $token_mint"
elif echo "$body" | grep -q "insufficient funds\|needs SOL"; then
  echo "❌ Failed: Insufficient funds"
  echo ""
  echo "💡 Next steps:"
  echo "1. The server generated a new wallet that needs funding"
  echo "2. Check the server logs for the mint authority address"
  echo "3. Fund it at: https://faucet.solana.com/"
  echo "4. Add TEST_MINT_AUTHORITY_SECRET_KEY to your server's .env"
  echo "5. Run this script again"
else
  echo "❌ Failed to create merchant"
  echo ""
  echo "Error details above ☝️"
fi
