import { API_BASE_URL } from '@/constants/Api';
import axios from 'axios';

// Types
export interface Merchant {
    id: string;
    name: string;
    color: string;
    logo_url: string;
    type: string;
    tokenMintAddress: string;
}

export interface UserBalance {
    merchantId: string;
    merchantName: string;
    tokenMintAddress: string;
    balance: number;
    color: string;
    type: string;
}

export interface Transaction {
    id: string;
    type: 'earn' | 'redeem';
    amount: string;
    description: string;
    merchantName: string;
    merchantColor: string;
    timestamp: string;
}

// API Client
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // 5 seconds timeout
});

export const ApiService = {
    // Merchants
    getMerchants: async (): Promise<Merchant[]> => {
        try {
            const response = await api.get('/merchants');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching merchants:', error);
            throw error;
        }
    },

    getMerchant: async (id: string): Promise<Merchant> => {
        try {
            const response = await api.get(`/merchants/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching merchant:', error);
            throw error;
        }
    },

    // Transactions
    earnTokens: async (userPublicKey: string, merchantId: string, amount: number = 1) => {
        try {
            const response = await api.post('/transactions/earn', {
                userPublicKey,
                merchantId,
                amount,
            });
            return response.data;
        } catch (error) {
            console.error('Error earning tokens:', error);
            throw error;
        }
    },

    redeemTokens: async (userPublicKey: string, merchantId: string, amount: number) => {
        try {
            const response = await api.post('/transactions/redeem', {
                userPublicKey,
                merchantId,
                amount,
            });
            return response.data;
        } catch (error) {
            console.error('Error redeeming tokens:', error);
            throw error;
        }
    },

    // Users
    getUserBalances: async (publicKey: string): Promise<UserBalance[]> => {
        try {
            const response = await api.get(`/users/${publicKey}/balances`);
            return response.data.data.balances;
        } catch (error) {
            console.error('Error fetching balances:', error);
            return []; // Return empty on error for now
        }
    },

    getUserHistory: async (publicKey: string, limit: number = 50, offset: number = 0): Promise<Transaction[]> => {
        try {
            const response = await api.get(`/users/${publicKey}/history`, {
                params: { limit, offset }
            });
            return response.data.data.history;
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    }
};
