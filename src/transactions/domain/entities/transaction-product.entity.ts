import { Messages } from 'src/common/utils/messages';
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
        if (!params.productId) throw new Error(Messages.TRANSACTION_PRODUCT_ID_REQUIRED);
        if (!params.unitPrice) throw new Error(Messages.TRANSACTION_PRODUCT_UNIT_PRICE_REQUIRED);

        const quantity = Math.floor(Number(params.quantity));
        const totalAmount = Math.floor(Number(params.totalAmount));
        if (quantity < 1) throw new Error(Messages.TRANSACTION_PRODUCT_QUANTITY_POSITIVE);
        if (totalAmount < 0) throw new Error(Messages.TRANSACTION_PRODUCT_TOTAL_AMOUNT_NON_NEGATIVE);

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