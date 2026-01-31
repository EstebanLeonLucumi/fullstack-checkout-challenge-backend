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
        transactionId: string;
        quantity: number;
        unitPrice: Money;
        totalAmount: number;
    }): TransactionProduct {
        if (!params.productId) throw new Error("productId is required");
        if (!params.transactionId) throw new Error("transactionId is required");
        if (!params.quantity) throw new Error("quantity is required");
        if (!params.unitPrice) throw new Error("unitPrice is required");
        if (!params.totalAmount) throw new Error("totalAmount is required");

        return new TransactionProduct(
            null,
            params.productId,
            params.transactionId,
            params.quantity,
            params.unitPrice,
            params.totalAmount,
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