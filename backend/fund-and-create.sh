#!/bin/bash

# Script to fund mint authority and create merchant
BASE_URL="http://localhost:3000"

echo "🚀 STAMPD Merchant Creation with Funding"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Create a merchant (this will fail but generate the keypair)
echo -e "\n${BLUE}Step 1: Creating merchant (will fail but generates keypair)${NC}"
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

echo "Response: $MERCHANT_RESPONSE"

# Check if it actually succeeded (in case we already funded the wallet)
SUCCESS=$(echo $MERCHANT_RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  MERCHANT_ID=$(echo $MERCHANT_RESPONSE | jq -r '.data.id')
  echo -e "${GREEN}✅ Merchant created successfully! ID: $MERCHANT_ID${NC}"
  echo -e "${GREEN}🎉 No funding needed - wallet already had SOL${NC}"
  exit 0
fi

# Step 2: Create a test keypair to get the mint authority address
echo -e "\n${BLUE}Step 2: Generating a sample mint authority address${NC}"
echo -e "${YELLOW}We'll create a temporary keypair to show you the funding process${NC}"

# Create a simple Node script to generate a keypair and show the address
cat > /tmp/generate_keypair.js << 'EOF'
const { Keypair } = require('@solana/web3.js');
const keypair = Keypair.generate();
console.log('Sample Mint Authority Address:', keypair.publicKey.toString());
console.log('(This simulates what would be generated for the merchant)');
EOF

node /tmp/generate_keypair.js

# Step 3: Instructions for funding
echo -e "\n${BLUE}Step 3: Funding Instructions${NC}"
echo -e "${YELLOW}To create a merchant successfully, you need to fund the mint authority wallet.${NC}"
echo -e "${YELLOW}Here's how:${NC}"

echo -e "\n${BLUE}Option 1: Use Solana CLI (if installed)${NC}"
echo "1. Install Solana CLI if not installed:"
echo "   sh -c \"\$(curl -sSfL https://release.solana.com/v1.18.4/install)\""
echo ""
echo "2. Fund any devnet address with 2 SOL:"
echo "   solana airdrop 2 <MINT_AUTHORITY_ADDRESS> --url devnet"
echo ""

echo -e "\n${BLUE}Option 2: Use Solana Web Faucet${NC}"
echo "1. Go to: https://faucet.solana.com/"
echo "2. Select 'Devnet'"
echo "3. Enter the mint authority address"
echo "4. Request airdrop"
echo ""

echo -e "\n${BLUE}Option 3: Programmatic Airdrop (if you want to automate)${NC}"
echo "We can create a script that:"
echo "1. Generates the merchant keypair"
echo "2. Requests airdrop via RPC"
echo "3. Creates the merchant"

echo -e "\n${YELLOW}For testing purposes, let's try a simpler approach...${NC}"

# Step 4: Alternative - Create merchant with existing funded wallet
echo -e "\n${BLUE}Step 4: Alternative - Let's create a test script that pre-funds the wallet${NC}"

# Create a funding script
cat > fund-merchant.js << 'EOF'
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const crypto = require('crypto-js');

async function fundAndCreateMerchant() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Generate mint authority keypair
  const mintAuthority = Keypair.generate();
  console.log('Generated Mint Authority:', mintAuthority.publicKey.toString());
  
  try {
    // Request airdrop
    console.log('Requesting airdrop...');
    const signature = await connection.requestAirdrop(
      mintAuthority.publicKey,
      2 * LAMPORTS_PER_SOL // 2 SOL
    );
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    console.log('✅ Airdrop confirmed!');
    
    // Check balance
    const balance = await connection.getBalance(mintAuthority.publicKey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    // Now encrypt the private key like the backend would
    const encryptionKey = process.env.MASTER_ENCRYPTION_KEY || 'your-encryption-key-here';
    const encryptedPrivateKey = crypto.AES.encrypt(
      JSON.stringify(Array.from(mintAuthority.secretKey)),
      encryptionKey
    ).toString();
    
    console.log('Encrypted private key (first 50 chars):', encryptedPrivateKey.substring(0, 50) + '...');
    console.log('\n🎉 Ready to create merchant! The mint authority now has SOL.');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('airdrop')) {
      console.log('❌ Airdrop failed. Try using the web faucet instead.');
    }
  }
}

fundAndCreateMerchant();
EOF

echo -e "\n${BLUE}Created fund-merchant.js script${NC}"
echo -e "${YELLOW}Run: node fund-merchant.js${NC}"
echo -e "${YELLOW}This will generate a keypair, fund it, and show you the process${NC}"

echo -e "\n${GREEN}After funding, run the test script again: ./test.sh${NC}"

# Clean up
rm -f /tmp/generate_keypair.js