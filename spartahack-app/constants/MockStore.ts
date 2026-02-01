export type Merchant = {
    id: string;
    name: string;
    balance: number;
    color: string;
    lastVisit: string;
    type: 'coffee' | 'grocery';
};

export const MockStore = {
    merchants: [
        { id: '1', name: 'Spartan Coffee Co.', balance: 4, color: '#FF853E', lastVisit: 'Today', type: 'coffee' },
        { id: '2', name: 'Blue Owl Coffee', balance: 8, color: '#0EA5E9', lastVisit: 'Yesterday', type: 'coffee' },
        { id: '3', name: 'Metropolis Grocers', balance: 3, color: '#10B981', lastVisit: '2 days ago', type: 'grocery' },
        { id: '4', name: 'Foster Coffee', balance: 1, color: '#D946EF', lastVisit: 'Last Week', type: 'coffee' },
    ] as Merchant[],

    incrementBalance: (merchantId: string, amount: number) => {
        const merchant = MockStore.merchants.find(m => m.id === merchantId);
        if (merchant) {
            merchant.balance += amount;
            merchant.lastVisit = 'Just now';
        }
    }
};
