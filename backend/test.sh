#!/bin/bash

# STAMPD Backend API Test Script
BASE_URL="http://localhost:3000"

echo "🧪 Testing STAMPD Backend API"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n${BLUE}1. Testing Health Check${NC}"
curl -s $BASE_URL/health | jq .

# Test 2: List merchants (should be empty initially)
echo -e "\n${BLUE}2. Testing GET /merchants (should be empty)${NC}"
curl -s $BASE_URL/merchants | jq .

# Test 3: Create a test merchant
echo -e "\n${BLUE}3. Creating test merchant${NC}"
MERCHANT_RESPONSE=$(curl -s -X POST $BASE_URL/admin/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spartan Coffee",
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "color": "#8B4513",
    "logoUrl": "https://example.com/logo.png",
    "type": "coffee",
    "tokenName": "Spartan Coffee Points",
    "tokenSymbol": "SCP"
  }')

echo $MERCHANT_RESPONSE | jq .

# Extract merchant ID for further tests
MERCHANT_ID=$(echo $MERCHANT_RESPONSE | jq -r '.data.id')
TOKEN_MINT=$(echo $MERCHANT_RESPONSE | jq -r '.data.tokenMintAddress')

if [ "$MERCHANT_ID" == "null" ]; then
  echo -e "${RED}❌ Failed to create merchant. Check your database and environment.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Created merchant with ID: $MERCHANT_ID${NC}"
echo -e "${GREEN}✅ Token mint address: $TOKEN_MINT${NC}"

# Test 4: Get specific merchant
echo -e "\n${BLUE}4. Testing GET /merchants/:id${NC}"
curl -s $BASE_URL/merchants/$MERCHANT_ID | jq .

# Test 5: List merchants (should now show our merchant)
echo -e "\n${BLUE}5. Testing GET /merchants (should show new merchant)${NC}"
curl -s $BASE_URL/merchants | jq .

# Test 6: Try to earn tokens (this will likely fail without funded mint authority)
echo -e "\n${BLUE}6. Testing POST /transactions/earn${NC}"
USER_WALLET="9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
curl -s -X POST $BASE_URL/transactions/earn \
  -H "Content-Type: application/json" \
  -d "{
    \"userPublicKey\": \"$USER_WALLET\",
    \"merchantId\": \"$MERCHANT_ID\",
    \"amount\": 1
  }" | jq .

# Test 7: Check user balances (should be 0 initially)
echo -e "\n${BLUE}7. Testing GET /users/:publicKey/balances${NC}"
curl -s $BASE_URL/users/$USER_WALLET/balances | jq .

# Test 8: Check user history (should be empty initially)
echo -e "\n${BLUE}8. Testing GET /users/:publicKey/history${NC}"
curl -s $BASE_URL/users/$USER_WALLET/history | jq .

# Test 9: Try redemption (will likely fail due to insufficient balance)
echo -e "\n${BLUE}9. Testing POST /transactions/redeem${NC}"
curl -s -X POST $BASE_URL/transactions/redeem \
  -H "Content-Type: application/json" \
  -d "{
    \"userPublicKey\": \"$USER_WALLET\",
    \"merchantId\": \"$MERCHANT_ID\",
    \"amount\": 1
  }" | jq .

# Test 10: Test 404 endpoint
echo -e "\n${BLUE}10. Testing 404 endpoint${NC}"
curl -s $BASE_URL/nonexistent | jq .

echo -e "\n${GREEN}🎉 Test script completed!${NC}"
echo -e "\n${BLUE}Notes:${NC}"
echo "- Earning tokens may fail if mint authority wallet isn't funded on devnet"
echo "- To fund the mint authority, you'll need to airdrop SOL to it"
echo "- Token mint address: $TOKEN_MINT"
echo -e "- Merchant ID for future tests: ${GREEN}$MERCHANT_ID${NC}"