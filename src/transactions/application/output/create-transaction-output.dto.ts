export interface CreateTransactionItemOutputDto {
    id: string | null;
    productId: string;
    transactionId: string;
    quantity: number;
    unitPrice: { amount: number; currency: string };
    totalAmount: number;
}

export interface CreateTransactionOutputDto {
    id: string;
    status: string;
    customerId: string;
    deliveryId: string | null;
    externalTransactionId: string;
    transactionProducts: CreateTransactionItemOutputDto[];
    subtotal: { amount: number; currency: string };
    baseFee: { amount: number; currency: string };
    deliveryFee: { amount: number; currency: string };
    totalAmount: { amount: number; currency: string };
    createdAt: Date;
    updatedAt: Date;
}
