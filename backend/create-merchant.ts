/**
 * Script to create a new merchant account with web faucet funding
 *
 * Usage:
 * 1. Run: npx ts-node create-merchant.ts
 * 2. Fund the generated wallet at a Solana devnet faucet
 * 3. Press Enter to create the merchant
 */

import dotenv from 'dotenv';
import { Keypair } from '@solana/web3.js';
import * as readline from 'readline';

dotenv.config();

const BASE_URL = process.env.API_URL || 'http://165.232.133.82:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createMerchant() {
  console.log('🏪 Create New Merchant Account with Devnet Funding');
  console.log('====================================================\n');

  // Step 1: Generate a new mint authority keypair
  const mintAuthority = Keypair.generate();
  const publicKey = mintAuthority.publicKey.toString();

  console.log('Step 1: Fund Your Mint Authority Wallet');
  console.log('─'.repeat(60));
  console.log('\n📋 Your Mint Authority Public Key:');
  console.log('   ' + publicKey);
  console.log('\n💰 Choose a devnet faucet to fund this wallet:');
  console.log('   • Official Solana Faucet: https://faucet.solana.com/');
  console.log('   • QuickNode Faucet: https://faucet.quicknode.com/solana/devnet');
  console.log('   • SolFaucet: https://solfaucet.com/');
  console.log('   • Solfate: https://solfate.com/faucet');
  console.log('\n📝 Instructions:');
  console.log('   1. Copy the public key above');
  console.log('   2. Go to any faucet URL');
  console.log('   3. Paste your public key and request devnet SOL');
  console.log('   4. Wait for confirmation (~30 seconds)');
  console.log('   5. Come back here and press Enter');

  await prompt('\n✅ Press Enter once you have funded the wallet...');

  console.log('\n\nStep 2: Create Merchant with Funded Wallet');
  console.log('─'.repeat(60));

  // Get merchant details
  const name = await prompt('\nMerchant Name (e.g., "Spartan Coffee"): ');
  const tokenName = await prompt('Token Name (e.g., "Spartan Coffee Coin"): ');
  const tokenSymbol = await prompt('Token Symbol (e.g., "SCC"): ');

  // Generate a new wallet for the merchant (this is different from mint authority)
  const merchantWallet = Keypair.generate();

  const merchantData = {
    name: name || 'Test Coffee Shop',
    walletAddress: merchantWallet.publicKey.toString(),
    color: '#8B4513',
    logoUrl: 'https://example.com/logo.png',
    type: 'coffee',
    tokenName: tokenName || 'Test Coffee Coin',
    tokenSymbol: tokenSymbol || 'TCC'
  };

  console.log('\n📤 Creating merchant...');

  // Set the TEST_MINT_AUTHORITY_SECRET_KEY for this request
  process.env.TEST_MINT_AUTHORITY_SECRET_KEY = JSON.stringify(Array.from(mintAuthority.secretKey));

  try {
    const response = await fetch(`${BASE_URL}/admin/merchants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(merchantData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('\n❌ Failed to create merchant');
      console.error('Status:', response.status);
      console.error('Error:', data.error);
      console.error('Details:', data.details);

      if (data.error?.includes('insufficient funds')) {
        console.log('\n💡 The wallet may not have enough SOL yet.');
        console.log('   • Check the faucet transaction succeeded');
        console.log('   • Wait a few seconds and try running this script again');
        console.log('   • Use the same mint authority: ' + publicKey);
      }

      rl.close();
      process.exit(1);
    }

    console.log('\n✅ Merchant created successfully!\n');
    console.log('═'.repeat(60));
    console.log('Merchant Details:');
    console.log('═'.repeat(60));
    console.log(JSON.stringify(data.data, null, 2));
    console.log('\n📝 Important: Save these details!');
    console.log('   Merchant ID: ' + data.data.id);
    console.log('   Token Mint: ' + data.data.tokenMintAddress);
    console.log('   Merchant Wallet: ' + data.data.walletAddress);
    console.log('\n🎯 You can now use this merchant ID in your tests!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

createMerchant();
