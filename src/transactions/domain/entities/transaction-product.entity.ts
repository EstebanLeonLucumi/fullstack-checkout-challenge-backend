import { Money } from "src/products/domain/value-objects/money.vo";

export class TransactionProduct {
    constructor(
        private readonly id: string | null,
        private readonly productId: string,
        private readonly transactionId: string,
        private readonly quantity: number,
        private readonly unitPrice: Money,
        private readonly totalAmount: number,
    ){}

    static create(params: {
        productId: string;
        transactionId?: string;
        quantity: number;
        unitPrice: Money;
        totalAmount: number;
    }): TransactionProduct {
        if (!params.productId) throw new Error("productId is required");
        if (!params.unitPrice) throw new Error("unitPrice is required");

        const quantity = Math.floor(Number(params.quantity));
        const totalAmount = Math.floor(Number(params.totalAmount));
        if (quantity < 1) throw new Error("quantity must be a positive integer");
        if (totalAmount < 0) throw new Error("totalAmount cannot be negative");

        const transactionId = params.transactionId ?? '';

        return new TransactionProduct(
            null,
            params.productId,
            transactionId,
            quantity,
            params.unitPrice,
            totalAmount,
        );
    }

    getId(): string {
        return this.id;
    }

    getProductId(): string {
        return this.productId;
    }

    getTransactionId(): string {
        return this.transactionId;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getUnitPrice(): Money {
        return this.unitPrice;
    }

    getTotalAmount(): number {
        return this.totalAmount;
    }
}