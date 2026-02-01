import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();

// GET /merchants - List all merchants with metadata
router.get('/', async (req, res) => {
  const pool = req.app.locals.db as Pool;
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        color,
        logo_url,
        type,
        token_mint_address as "tokenMintAddress"
      FROM merchants 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchants'
    });
  }
});

// GET /merchants/:id - Get specific merchant details
router.get('/:id', async (req, res) => {
  const pool = req.app.locals.db as Pool;
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        wallet_address as "walletAddress",
        token_mint_address as "tokenMintAddress",
        color,
        logo_url as "logoUrl",
        type,
        created_at as "createdAt"
      FROM merchants 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchant'
    });
  }
});

export default router;