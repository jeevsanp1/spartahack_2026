import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaUtils } from '../utils/solana';
import { MOCK_BALANCES, MOCK_HISTORY } from '../mockDb';

const router = Router();

// GET /users/:publicKey/balances - Get token balances mapped to merchants
router.get('/:publicKey/balances', async (req: Request, res: Response) => {
  const pool = req.app.locals.db as Pool;
  const connection = req.app.locals.solana as Connection;
  const solanaUtils = new SolanaUtils(connection);

  const { publicKey } = req.params;

  if (!process.env.DATABASE_URL) {
    return res.json({
      success: true,
      data: {
        userPublicKey: publicKey,
        balances: MOCK_BALANCES
      }
    });
  }

  try {
    // Validate public key
    const userPubkey = new PublicKey(publicKey);

    // Get all merchants
    const merchantsResult = await pool.query(`
      SELECT 
        id,
        name,
        token_mint_address,
        color,
        type
      FROM merchants
      ORDER BY name
    `);

    const balances = [];

    // Check balance for each merchant's token
    for (const merchant of merchantsResult.rows) {
      try {
        const mintAddress = new PublicKey(merchant.token_mint_address);
        const balance = await solanaUtils.getTokenBalance(userPubkey, mintAddress);

        if (balance > 0) { // Only include tokens with positive balance
          balances.push({
            merchantId: merchant.id,
            merchantName: merchant.name,
            tokenMintAddress: merchant.token_mint_address,
            balance,
            color: merchant.color,
            type: merchant.type
          });
        }
      } catch (error) {
        console.error(`Error getting balance for merchant ${merchant.id}:`, error);
        // Continue with other merchants
      }
    }

    res.json({
      success: true,
      data: {
        userPublicKey: publicKey,
        balances
      }
    });

  } catch (error) {
    console.error('Error fetching user balances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user balances'
    });
  }
});

// GET /users/:publicKey/history - Get transaction history in readable format
router.get('/:publicKey/history', async (req: Request, res: Response) => {
  const pool = req.app.locals.db as Pool;
  const { publicKey } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  if (!process.env.DATABASE_URL) {
    return res.json({
      success: true,
      data: {
        userPublicKey: publicKey,
        history: MOCK_HISTORY,
        pagination: { total: MOCK_HISTORY.length, limit: Number(limit), offset: Number(offset) }
      }
    });
  }

  try {
    // Validate public key
    new PublicKey(publicKey);

    // Get transaction history from database
    const historyResult = await pool.query(`
      SELECT 
        t.id,
        t.type,
        t.amount,
        t.tx_signature as "txSignature",
        t.created_at as "createdAt",
        m.name as "merchantName",
        m.color as "merchantColor",
        m.type as "merchantType"
      FROM transactions t
      JOIN merchants m ON t.merchant_id = m.id
      WHERE t.user_public_key = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `, [publicKey, limit, offset]);

    // Format history for readability
    const history = historyResult.rows.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.type === 'earn'
        ? `Earned ${tx.amount} token${tx.amount === 1 ? '' : 's'} at ${tx.merchantName}`
        : `Redeemed ${tx.amount} token${tx.amount === 1 ? '' : 's'} at ${tx.merchantName}`,
      merchantName: tx.merchantName,
      merchantColor: tx.merchantColor,
      merchantType: tx.merchantType,
      txSignature: tx.txSignature,
      timestamp: tx.createdAt
    }));

    // Get total count for pagination
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM transactions
      WHERE user_public_key = $1
    `, [publicKey]);

    res.json({
      success: true,
      data: {
        userPublicKey: publicKey,
        history,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user history'
    });
  }
});

export default router;