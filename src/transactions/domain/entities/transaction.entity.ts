import { Messages } from 'src/common/utils/messages';
import { Money } from 'src/products/domain/value-objects/money.vo';
import { TransactionStatus } from '../value-objects/transaction-status';
import { TransactionProduct } from './transaction-product.entity';
import { TransactionCalculator } from '../services/transaction-calculator';

export class Transaction {
  constructor(
    private readonly id: string | null,
    private readonly status: TransactionStatus,
    private readonly customerId: string,
    private readonly deliveryId: string | null,
    private readonly externalTransactionId: string,

    private readonly transactionProducts: TransactionProduct[],

    private readonly subtotal: Money,
    private readonly baseFee: Money,
    private readonly deliveryFee: Money,
    private readonly totalAmount: Money,

    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    customerId: string;
    deliveryId?: string | null;
    externalTransactionId: string;
    transactionProducts: TransactionProduct[];
    baseFee: Money;
    deliveryFee: Money;
  }): Transaction {
    if (!params.customerId)
      throw new Error(Messages.TRANSACTION_CUSTOMER_ID_REQUIRED);

    if (!params.externalTransactionId)
      throw new Error(Messages.TRANSACTION_ID_REQUIRED);

    if (!params.transactionProducts?.length)
      throw new Error(Messages.TRANSACTION_AT_LEAST_ONE_ITEM);

    const currency = params.baseFee.getCurrency();

    TransactionCalculator.validateSameCurrency(params.transactionProducts, currency);

    const subTotal = TransactionCalculator.calculateSubtotal(
      params.transactionProducts,
      currency,
    );

    const total = TransactionCalculator.calculateTotal(
      subTotal,
      params.baseFee,
      params.deliveryFee,
    );

    return new Transaction(
      null,
      TransactionStatus.PENDING,
      params.customerId,
      params.deliveryId ?? null,
      params.externalTransactionId,
      params.transactionProducts,
      subTotal,
      params.baseFee,
      params.deliveryFee,
      total,
    );
  }

  getId(): string {
    return this.id;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getDeliveryId(): string | null {
    return this.deliveryId;
  }

  getExternalTransactionId(): string {
    return this.externalTransactionId;
  }

  getTransactionProducts(): TransactionProduct[] {
    return this.transactionProducts;
  }

  getSubtotal(): Money {
    return this.subtotal;
  }

  getBaseFee(): Money {
    return this.baseFee;
  }

  getDeliveryFee(): Money {
    return this.deliveryFee;
  }

  getTotalAmount(): Money {
    return this.totalAmount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  withStatus(newStatus: TransactionStatus): Transaction {
    return new Transaction(
      this.id,
      newStatus,
      this.customerId,
      this.deliveryId,
      this.externalTransactionId,
      this.transactionProducts,
      this.subtotal,
      this.baseFee,
      this.deliveryFee,
      this.totalAmount,
      this.createdAt,
      new Date(),
    );
  }

  withDeliveryId(deliveryId: string): Transaction {
    return new Transaction(
      this.id,
      this.status,
      this.customerId,
      deliveryId,
      this.externalTransactionId,
      this.transactionProducts,
      this.subtotal,
      this.baseFee,
      this.deliveryFee,
      this.totalAmount,
      this.createdAt,
      new Date(),
    );
  }
}
