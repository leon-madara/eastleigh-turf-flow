export interface PaymentTracking {
    id: string;
    preOrderId: string;
    amount: number;
    method: 'MPESA' | 'CASH' | 'BANK';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    transactionId?: string;
    createdAt: Date;
}

export interface BulkPreOrder {
    id: string;
    preOrderIds: string[];
    totalAmount: number;
    depositAmount: number;
    remainingBalance: number;
    discount: number;
    status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
    createdAt: Date;
    updatedAt: Date;
}