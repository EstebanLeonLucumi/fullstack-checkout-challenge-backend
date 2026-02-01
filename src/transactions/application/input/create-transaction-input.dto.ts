export interface CreateTransactionItemInputDto {
    productId: string;
    quantity: number;
    unitPrice: { amount: number; currency: string };
    totalAmount: number;
}

export interface CreateTransactionInputDto {
    customerId: string;
    deliveryId?: string | null;
    externalTransactionId: string;
    transactionProducts: CreateTransactionItemInputDto[];
    baseFee: { amount: number; currency: string };
    deliveryFee: { amount: number; currency: string };
}
