/**
 * Script to verify encryption/decryption is working
 * This helps debug the "Malformed UTF-8 data" error
 *
 * Run: npx ts-node check-encryption.ts
 */

import CryptoJS from 'crypto-js';
import { Keypair } from '@solana/web3.js';

// Your encryption key from environment
const MASTER_ENCRYPTION_KEY = process.env.MASTER_ENCRYPTION_KEY || 'test-key-123';

console.log('🔐 Encryption Key Test\n');
console.log('Using MASTER_ENCRYPTION_KEY:', MASTER_ENCRYPTION_KEY ? '✓ Set' : '✗ Not set');
console.log('Key length:', MASTER_ENCRYPTION_KEY.length, 'characters\n');

// Test 1: Create a test keypair and encrypt/decrypt it
console.log('Test 1: Encrypt and Decrypt a test keypair');
console.log('─'.repeat(50));

const testKeypair = Keypair.generate();
console.log('Generated test keypair:', testKeypair.publicKey.toString());

// Encrypt it
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(Array.from(testKeypair.secretKey)),
  MASTER_ENCRYPTION_KEY
).toString();

console.log('Encrypted (first 50 chars):', encrypted.substring(0, 50) + '...');

// Try to decrypt it
try {
  const decryptedBytes = CryptoJS.AES.decrypt(encrypted, MASTER_ENCRYPTION_KEY);
  const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
  const secretKeyArray = JSON.parse(decryptedString);
  const recoveredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));

  console.log('✅ Decryption successful!');
  console.log('Recovered keypair:', recoveredKeypair.publicKey.toString());
  console.log('Match:', testKeypair.publicKey.toString() === recoveredKeypair.publicKey.toString() ? '✅ YES' : '❌ NO');
} catch (error: any) {
  console.log('❌ Decryption failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Show how to create TEST_MINT_AUTHORITY_SECRET_KEY
console.log('Test 2: Generate TEST_MINT_AUTHORITY_SECRET_KEY');
console.log('─'.repeat(50));

const mintAuthority = Keypair.generate();
console.log('\nGenerated Mint Authority Public Key:');
console.log(mintAuthority.publicKey.toString());
console.log('\nAdd this to your production .env file:');
console.log('\nTEST_MINT_AUTHORITY_SECRET_KEY=\'' + JSON.stringify(Array.from(mintAuthority.secretKey)) + '\'');
console.log('\n⚠️  IMPORTANT: Fund this wallet on Solana devnet:');
console.log('   https://faucet.solana.com/');
console.log('   Address:', mintAuthority.publicKey.toString());

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Instructions for fixing the issue
console.log('How to Fix the "Malformed UTF-8 data" Error:\n');
console.log('Option A: Match the encryption key');
console.log('  1. Find the original MASTER_ENCRYPTION_KEY used when creating merchants');
console.log('  2. Set it on your production server');
console.log('  3. Restart the server\n');

console.log('Option B: Use a pre-funded test mint authority (easier)');
console.log('  1. Run this script to generate a keypair');
console.log('  2. Fund that address on devnet (https://faucet.solana.com/)');
console.log('  3. Add TEST_MINT_AUTHORITY_SECRET_KEY to production .env');
console.log('  4. Delete old merchants and create new ones');
console.log('  5. New merchants will use the pre-funded authority\n');
