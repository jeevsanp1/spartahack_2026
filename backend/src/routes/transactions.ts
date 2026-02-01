import { Router } from 'express';
import { Pool } from 'pg';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaUtils } from '../utils/solana';

const router = Router();

// POST /transactions/earn - Mint tokens to user wallet (gasless)
router.post('/earn', async (req, res) => {
  const pool = req.app.locals.db as Pool;
  const connection = req.app.locals.solana as Connection;
  const solanaUtils = new SolanaUtils(connection);
  
  const { userPublicKey, merchantId, amount = 1, proof } = req.body;
  
  // Validation
  if (!userPublicKey || !merchantId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: userPublicKey, merchantId'
    });
  }
  
  try {
    // Validate user public key
    const userPubkey = new PublicKey(userPublicKey);
    
    // Get merchant info
    const merchantResult = await pool.query(`
      SELECT 
        id,
        name,
        token_mint_address,
        encrypted_mint_authority_key
      FROM merchants 
      WHERE id = $1
    `, [merchantId]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      });
    }
    
    const merchant = merchantResult.rows[0];
    const mintAddress = new PublicKey(merchant.token_mint_address);
    
    // Decrypt mint authority
    const mintAuthority = solanaUtils.decryptMintAuthority(merchant.encrypted_mint_authority_key);
    
    // Create and send transaction
    const { transaction, needsATA } = await solanaUtils.createMintTransaction(
      userPubkey,
      mintAddress,
      amount,
      mintAuthority
    );
    
    // Send transaction
    const signature = await connection.sendRawTransaction(transaction.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature);
    
    // Record transaction in database
    await pool.query(`
      INSERT INTO transactions (
        user_public_key,
        merchant_id,
        type,
        amount,
        tx_signature
      ) VALUES ($1, $2, $3, $4, $5)
    `, [userPublicKey, merchantId, 'earn', amount, signature]);
    
    res.json({
      success: true,
      data: {
        signature,
        amount,
        merchantName: merchant.name,
        createdATA: needsATA
      }
    });
    
  } catch (error) {
    console.error('Error processing earn transaction:', error);
    
    let errorMessage = 'Failed to process earn transaction';
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds') || error.message.includes('Attempt to debit an account but found no record of a prior credit')) {
        errorMessage = 'Insufficient funds - mint authority needs SOL to pay transaction fees';
      } else if (error.message.includes('Transaction simulation failed')) {
        errorMessage = 'Transaction failed - likely insufficient SOL for gas fees';
      } else {
        errorMessage = `Transaction failed: ${error.message}`;
      }
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /transactions/redeem - Create redemption transaction for user to sign
router.post('/redeem', async (req, res) => {
  const pool = req.app.locals.db as Pool;
  const connection = req.app.locals.solana as Connection;
  const solanaUtils = new SolanaUtils(connection);
  
  const { userPublicKey, merchantId, amount, burnTokens = true } = req.body;
  
  // Validation
  if (!userPublicKey || !merchantId || !amount) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: userPublicKey, merchantId, amount'
    });
  }
  
  try {
    // Validate user public key
    const userPubkey = new PublicKey(userPublicKey);
    
    // Get merchant info
    const merchantResult = await pool.query(`
      SELECT 
        id,
        name,
        wallet_address,
        token_mint_address
      FROM merchants 
      WHERE id = $1
    `, [merchantId]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      });
    }
    
    const merchant = merchantResult.rows[0];
    const mintAddress = new PublicKey(merchant.token_mint_address);
    const merchantWallet = new PublicKey(merchant.wallet_address);
    
    // Check user has enough tokens
    const currentBalance = await solanaUtils.getTokenBalance(userPubkey, mintAddress);
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Have ${currentBalance}, need ${amount}`
      });
    }
    
    // Create redemption transaction
    const transaction = await solanaUtils.createRedemptionTransaction(
      userPubkey,
      mintAddress,
      merchantWallet,
      amount,
      burnTokens
    );
    
    // Serialize transaction for frontend
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });
    
    res.json({
      success: true,
      data: {
        transaction: serializedTx.toString('base64'),
        amount,
        merchantName: merchant.name,
        burnTokens
      }
    });
    
  } catch (error) {
    console.error('Error creating redeem transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create redeem transaction'
    });
  }
});

export default router;