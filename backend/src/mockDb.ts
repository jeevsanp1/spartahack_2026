export const MOCK_MERCHANTS = [
    {
        id: "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
        name: "Spartan Coffee Co.",
        color: "#FF853E",
        logo_url: "https://example.com/logo.png",
        type: "coffee",
        tokenMintAddress: "MockMintAddress123"
    },
    {
        id: "mock-merchant-2",
        name: "Blue Owl Coffee",
        color: "#0EA5E9",
        logo_url: "https://example.com/logo.png",
        type: "coffee",
        tokenMintAddress: "MockMintAddress456"
    },
    {
        id: "mock-merchant-3",
        name: "Metropolis Grocers",
        color: "#10B981",
        logo_url: "https://example.com/logo.png",
        type: "grocery",
        tokenMintAddress: "MockMintAddress789"
    },
    {
        id: "mock-merchant-4",
        name: "Foster Coffee",
        color: "#D946EF",
        logo_url: "https://example.com/logo.png",
        type: "coffee",
        tokenMintAddress: "MockMintAddress000"
    }
];

export const MOCK_HISTORY = [
    {
        id: "mock-tx-1",
        type: "earn",
        amount: 1,
        description: "Earned 1 token at Spartan Coffee",
        merchantName: "Spartan Coffee",
        merchantColor: "#8B4513",
        merchantType: "coffee",
        txSignature: "mock-signature-123",
        timestamp: new Date().toISOString()
    }
];

export const MOCK_BALANCES = [
    {
        merchantId: "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
        merchantName: "Spartan Coffee Co.",
        tokenMintAddress: "MockMintAddress123",
        balance: 4,
        color: "#FF853E",
        type: "coffee"
    },
    {
        merchantId: "mock-merchant-2",
        merchantName: "Blue Owl Coffee",
        tokenMintAddress: "MockMintAddress456",
        balance: 8,
        color: "#0EA5E9",
        type: "coffee"
    },
    {
        merchantId: "mock-merchant-3",
        merchantName: "Metropolis Grocers",
        tokenMintAddress: "MockMintAddress789",
        balance: 3,
        color: "#10B981",
        type: "grocery"
    },
    {
        merchantId: "mock-merchant-4",
        merchantName: "Foster Coffee",
        tokenMintAddress: "MockMintAddress000",
        balance: 1,
        color: "#D946EF",
        type: "coffee"
    }
];
