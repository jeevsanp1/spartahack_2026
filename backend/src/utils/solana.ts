import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  Keypair
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  createBurnInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from '@solana/spl-token';
import CryptoJS from 'crypto-js';

export class SolanaUtils {
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }
  
  // Decrypt mint authority private key
  decryptMintAuthority(encryptedKey: string): Keypair {
    const encryptionKey = process.env.MASTER_ENCRYPTION_KEY!;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedKey, encryptionKey);
    const secretKeyArray = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
  }
  
  // Check if user has Associated Token Account for mint
  async checkATA(userPublicKey: PublicKey, mintAddress: PublicKey): Promise<boolean> {
    try {
      const ata = await getAssociatedTokenAddress(mintAddress, userPublicKey);
      await getAccount(this.connection, ata);
      return true;
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
        return false;
      }
      throw error;
    }
  }
  
  // Create transaction to mint tokens to user
  async createMintTransaction(
    userPublicKey: PublicKey,
    mintAddress: PublicKey,
    amount: number,
    mintAuthority: Keypair
  ): Promise<{ transaction: Transaction; needsATA: boolean }> {
    const ata = await getAssociatedTokenAddress(mintAddress, userPublicKey);
    const needsATA = !(await this.checkATA(userPublicKey, mintAddress));
    
    const transaction = new Transaction();
    
    // Add create ATA instruction if needed
    if (needsATA) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          mintAuthority.publicKey, // payer
          ata, // ata
          userPublicKey, // owner
          mintAddress // mint
        )
      );
    }
    
    // Add mint instruction
    transaction.add(
      createMintToInstruction(
        mintAddress, // mint
        ata, // destination
        mintAuthority.publicKey, // authority
        amount * Math.pow(10, 9) // amount (assuming 9 decimals)
      )
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = mintAuthority.publicKey;
    
    // Sign with mint authority
    transaction.sign(mintAuthority);
    
    return { transaction, needsATA };
  }
  
  // Create transaction for user to transfer/burn tokens
  async createRedemptionTransaction(
    userPublicKey: PublicKey,
    mintAddress: PublicKey,
    merchantWalletAddress: PublicKey,
    amount: number,
    burnTokens: boolean = false
  ): Promise<Transaction> {
    const userATA = await getAssociatedTokenAddress(mintAddress, userPublicKey);
    
    const transaction = new Transaction();
    
    if (burnTokens) {
      // Burn tokens
      transaction.add(
        createBurnInstruction(
          userATA, // account
          mintAddress, // mint
          userPublicKey, // owner
          amount * Math.pow(10, 9) // amount
        )
      );
    } else {
      // Transfer to merchant
      const merchantATA = await getAssociatedTokenAddress(mintAddress, merchantWalletAddress);
      
      transaction.add(
        createTransferInstruction(
          userATA, // from
          merchantATA, // to
          userPublicKey, // owner
          amount * Math.pow(10, 9) // amount
        )
      );
    }
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPublicKey;
    
    return transaction;
  }
  
  // Get token balance for user
  async getTokenBalance(userPublicKey: PublicKey, mintAddress: PublicKey): Promise<number> {
    try {
      const ata = await getAssociatedTokenAddress(mintAddress, userPublicKey);
      const account = await getAccount(this.connection, ata);
      return Number(account.amount) / Math.pow(10, 9); // Convert from lamports
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
        return 0;
      }
      throw error;
    }
  }
}