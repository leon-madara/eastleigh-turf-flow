export interface PreOrder3 {
    id: string;
    productId: string;
    productName: string;
    brokerId: string;
    clientName: string;
    squareMeters: number;
    discount: number;
    depositAmount: number;
    remainingBalance: number;
    status: 'PENDING' | 'DEPOSIT_RECEIVED' | 'AWAITING_BALANCE' | 'READY' | 'COMPLETED' | 'CANCELLED';
    expectedDeliveryDate: Date;
    isPriority: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PreOrderFormData3 {
    productId: string;
    clientName: string;
    squareMeters: number;
    discount: number;
    depositAmount: number;
    expectedDeliveryDate: Date;
}

export type InquiryType = 'PRICE' | 'STOCK' | 'BULK_PRICING';
export type InquiryStatus = 'PENDING' | 'RESPONDED' | 'CLOSED';

export interface Inquiry {
    id: string;
    brokerId: string;
    type: InquiryType;
    productId: string;
    productName: string;
    quantity?: number;
    message: string;
    suggestedPrice?: number;
    bargainPrice?: number;
    response?: string;
    status: InquiryStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface InquiryFormData {
    type: InquiryType;
    productId: string;
    quantity?: number;
    suggestedPrice?: number;
    bargainPrice?: number;
    message: string;
}