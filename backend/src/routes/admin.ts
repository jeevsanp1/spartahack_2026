import { Router } from 'express';
import { Pool } from 'pg';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import CryptoJS from 'crypto-js';

const router = Router();

// POST /merchants - Create new merchant (admin only)
router.post('/merchants', async (req, res) => {
  const pool = req.app.locals.db as Pool;
  const connection = req.app.locals.solana as Connection;
  
  const { name, walletAddress, color, logoUrl, type, tokenName, tokenSymbol } = req.body;
  
  // Validation
  if (!name || !walletAddress || !tokenName || !tokenSymbol) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, walletAddress, tokenName, tokenSymbol'
    });
  }
  
  try {
    // Validate wallet address
    new PublicKey(walletAddress);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid wallet address'
    });
  }
  
  try {
    // Use pre-funded keypair for testing, or generate new one
    let mintAuthority: Keypair;
    
    if (process.env.TEST_MINT_AUTHORITY_SECRET_KEY) {
      // Use pre-funded test keypair
      try {
        const secretKey = JSON.parse(process.env.TEST_MINT_AUTHORITY_SECRET_KEY);
        mintAuthority = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log('Using pre-funded test mint authority:', mintAuthority.publicKey.toString());
      } catch (parseError) {
        console.error('Error parsing TEST_MINT_AUTHORITY_SECRET_KEY:', parseError);
        console.log('Falling back to generating new keypair');
        mintAuthority = Keypair.generate();
        console.log('Generated new mint authority (needs funding):', mintAuthority.publicKey.toString());
      }
    } else {
      // Generate new keypair (will need funding)
      mintAuthority = Keypair.generate();
      console.log('Generated new mint authority (needs funding):', mintAuthority.publicKey.toString());
    }
    
    // Create token mint on Solana
    const mint = await createMint(
      connection,
      mintAuthority, // payer (will need to fund this)
      mintAuthority.publicKey, // mint authority
      null, // freeze authority (none)
      9 // decimals
    );
    
    // Encrypt private key
    const encryptionKey = process.env.MASTER_ENCRYPTION_KEY!;
    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      JSON.stringify(Array.from(mintAuthority.secretKey)),
      encryptionKey
    ).toString();
    
    // Insert merchant into database
    const result = await pool.query(`
      INSERT INTO merchants (
        name, 
        wallet_address, 
        token_mint_address, 
        encrypted_mint_authority_key,
        color, 
        logo_url, 
        type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, wallet_address as "walletAddress", token_mint_address as "tokenMintAddress"
    `, [name, walletAddress, mint.toString(), encryptedPrivateKey, color, logoUrl, type]);
    
    // Also insert token metadata
    await pool.query(`
      INSERT INTO tokens (
        merchant_id,
        name,
        symbol,
        decimals,
        mint_address
      ) VALUES ($1, $2, $3, $4, $5)
    `, [result.rows[0].id, tokenName, tokenSymbol, 9, mint.toString()]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creating merchant:', error);
    
    // More detailed error messages
    let errorMessage = 'Failed to create merchant';
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds') || error.message.includes('Attempt to debit an account but found no record of a prior credit')) {
        errorMessage = 'Insufficient funds - mint authority needs SOL for rent and transaction fees';
      } else if (error.message.includes('Transaction simulation failed')) {
        errorMessage = 'Solana transaction failed - likely insufficient funds for rent';
      } else {
        errorMessage = `Creation failed: ${error.message}`;
      }
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;