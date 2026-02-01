import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import merchantsRouter from './routes/merchants';
import adminRouter from './routes/admin';
import transactionsRouter from './routes/transactions';
import usersRouter from './routes/users';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Make connections available to routes
app.locals.db = pool;
app.locals.solana = connection;

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'STAMPD Backend is running',
    timestamp: new Date().toISOString(),
    network: process.env.SOLANA_RPC_URL?.includes('devnet') ? 'devnet' : 'mainnet'
  });
});

// Routes
app.use('/merchants', merchantsRouter);
app.use('/admin', adminRouter);
app.use('/transactions', transactionsRouter);
app.use('/users', usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 STAMPD Backend running on port ${PORT}`);
  console.log(`📡 Connected to Solana: ${process.env.SOLANA_RPC_URL}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

export default app;