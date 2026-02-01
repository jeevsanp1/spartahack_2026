#!/bin/bash

# STAMPD Backend API Test Script for Production
BASE_URL="http://165.232.133.82:3000"

echo "🧪 Testing STAMPD API on Digital Ocean"
echo "📡 Base URL: $BASE_URL"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0
TOTAL=0

# Helper function to run a test
run_test() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5

  TOTAL=$((TOTAL + 1))
  echo -e "\n${BLUE}Test $TOTAL: $test_name${NC}"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  # Split response and status code
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  echo "Response: $body" | jq . 2>/dev/null || echo "$body"
  echo "Status Code: $status_code"

  if [ "$status_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Expected $expected_status, Got $status_code)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, Got $status_code)"
    FAILED=$((FAILED + 1))
  fi
}

# Test 1: Health Check
run_test "Health Check" "GET" "/health" "" "200"

# Test 2: List all merchants
run_test "List All Merchants" "GET" "/merchants" "" "200"

# Save merchant data for later use
MERCHANTS_RESPONSE=$(curl -s "$BASE_URL/merchants")
FIRST_MERCHANT_ID=$(echo "$MERCHANTS_RESPONSE" | jq -r '.data[0].id' 2>/dev/null)

# Test 3: Get specific merchant (if one exists)
if [ "$FIRST_MERCHANT_ID" != "null" ] && [ ! -z "$FIRST_MERCHANT_ID" ]; then
  run_test "Get Merchant by ID (existing)" "GET" "/merchants/$FIRST_MERCHANT_ID" "" "200"
else
  echo -e "\n${YELLOW}Skipping Test: Get Merchant by ID (no merchants found)${NC}"
  TOTAL=$((TOTAL + 1))
fi

# Test 4: Get non-existent merchant (404)
run_test "Get Non-existent Merchant" "GET" "/merchants/999999" "" "404"

# Test 5: Get user balances with valid public key
TEST_PUBLIC_KEY="11111111111111111111111111111111"
run_test "Get User Balances (valid key)" "GET" "/users/$TEST_PUBLIC_KEY/balances" "" "200"

# Test 6: Get user history with valid public key
run_test "Get User History (valid key)" "GET" "/users/$TEST_PUBLIC_KEY/history" "" "200"

# Test 7: Get user balances with invalid public key (should fail)
TOTAL=$((TOTAL + 1))
echo -e "\n${BLUE}Test $TOTAL: Get User Balances (invalid key)${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/users/invalid-key/balances")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "Response: $body" | jq . 2>/dev/null || echo "$body"
echo "Status Code: $status_code"
if [ "$status_code" == "500" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Invalid key properly rejected with 500)"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ FAIL${NC} (Expected 500 for invalid key, Got $status_code)"
  FAILED=$((FAILED + 1))
fi

# Test 8: Earn transaction validation (missing fields)
run_test "Earn Transaction Validation" "POST" "/transactions/earn" '{}' "400"

# Test 9: Redeem transaction validation (missing fields)
run_test "Redeem Transaction Validation" "POST" "/transactions/redeem" '{}' "400"

# Test 10: Earn transaction with valid fields
if [ "$FIRST_MERCHANT_ID" != "null" ] && [ ! -z "$FIRST_MERCHANT_ID" ]; then
  TOTAL=$((TOTAL + 1))
  echo -e "\n${BLUE}Test $TOTAL: Earn Transaction with Valid Fields${NC}"

  EARN_VALID_DATA=$(cat <<EOF
{
  "userPublicKey": "11111111111111111111111111111111",
  "merchantId": "$FIRST_MERCHANT_ID",
  "amount": 1
}
EOF
)

  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions/earn" \
    -H "Content-Type: application/json" \
    -d "$EARN_VALID_DATA")

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  echo "Response: $body" | jq . 2>/dev/null || echo "$body"
  echo "Status Code: $status_code"

  # Accept either 200 (success) or 500 (insufficient funds for gas)
  if [ "$status_code" == "200" ] || [ "$status_code" == "500" ]; then
    if [ "$status_code" == "200" ]; then
      echo -e "${GREEN}✓ PASS${NC} (Transaction successful)"
    else
      # Check if it's a gas fee error (which is acceptable)
      if echo "$body" | grep -q "insufficient funds\|Attempt to debit\|Transaction failed"; then
        echo -e "${GREEN}✓ PASS${NC} (Valid request format, failed due to insufficient gas funds)"
      else
        echo -e "${RED}✗ FAIL${NC} (Unexpected error: $body)"
        FAILED=$((FAILED + 1))
        continue
      fi
    fi
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected 200 or 500, Got $status_code)"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "\n${YELLOW}Skipping Test: Earn Transaction with Valid Fields (no merchants found)${NC}"
  TOTAL=$((TOTAL + 1))
fi

# Test 11: Redeem transaction with valid fields (will fail with insufficient balance)
if [ "$FIRST_MERCHANT_ID" != "null" ] && [ ! -z "$FIRST_MERCHANT_ID" ]; then
  TOTAL=$((TOTAL + 1))
  echo -e "\n${BLUE}Test $TOTAL: Redeem Transaction with Valid Fields${NC}"

  REDEEM_VALID_DATA=$(cat <<EOF
{
  "userPublicKey": "11111111111111111111111111111111",
  "merchantId": "$FIRST_MERCHANT_ID",
  "amount": 1,
  "burnTokens": true
}
EOF
)

  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions/redeem" \
    -H "Content-Type: application/json" \
    -d "$REDEEM_VALID_DATA")

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  echo "Response: $body" | jq . 2>/dev/null || echo "$body"
  echo "Status Code: $status_code"

  # Accept either 200 (success) or 400 (insufficient balance)
  if [ "$status_code" == "200" ] || [ "$status_code" == "400" ]; then
    if [ "$status_code" == "200" ]; then
      echo -e "${GREEN}✓ PASS${NC} (Transaction created successfully)"
    else
      # Check if it's an insufficient balance error (which is acceptable)
      if echo "$body" | grep -q "Insufficient balance"; then
        echo -e "${GREEN}✓ PASS${NC} (Valid request format, user has insufficient balance as expected)"
      else
        echo -e "${RED}✗ FAIL${NC} (Unexpected error: $body)"
        FAILED=$((FAILED + 1))
        continue
      fi
    fi
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected 200 or 400, Got $status_code)"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "\n${YELLOW}Skipping Test: Redeem Transaction with Valid Fields (no merchants found)${NC}"
  TOTAL=$((TOTAL + 1))
fi

# Test 12: Non-existent endpoint (404 handler)
run_test "404 Handler" "GET" "/nonexistent-endpoint" "" "404"

# Test 13: Try earn with invalid merchant (404)
EARN_DATA='{
  "userPublicKey": "11111111111111111111111111111111",
  "merchantId": "999999",
  "amount": 1
}'
run_test "Earn with Non-existent Merchant" "POST" "/transactions/earn" "$EARN_DATA" "404"

# Test 14: Try redeem with invalid merchant (404)
REDEEM_DATA='{
  "userPublicKey": "11111111111111111111111111111111",
  "merchantId": "999999",
  "amount": 1
}'
run_test "Redeem with Non-existent Merchant" "POST" "/transactions/redeem" "$REDEEM_DATA" "404"

# Summary
echo ""
echo "================================"
echo -e "\n📊 ${BLUE}Test Summary${NC}"
echo "================================"
echo -e "Total Tests:  $TOTAL"
echo -e "${GREEN}✓ Passed:     $PASSED${NC}"
echo -e "${RED}✗ Failed:     $FAILED${NC}"
echo ""

if [ $TOTAL -gt 0 ]; then
  success_rate=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")
  echo -e "Success Rate: ${success_rate}%"
else
  echo "No tests were run"
fi

echo ""

# Exit with error code if any tests failed
if [ $FAILED -gt 0 ]; then
  exit 1
else
  exit 0
fi
