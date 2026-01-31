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
    private readonly wompiTransactionId: string,

    private readonly product: TransactionProduct[],

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
    wompiTransactionId: string;
    products: TransactionProduct[];
    baseFee: Money;
    deliveryFee: Money;
  }): Transaction {
    if (!params.customerId) 
      throw new Error('El id del cliente es obligatorio');

    if (!params.wompiTransactionId)
      throw new Error('El id de la transacción es obligatorio');

    if (!params.products?.length)
      throw new Error('La transacción debe tener al menos un producto');

    const currency = params.baseFee.getCurrency();

    // Validación de moneda consistente
    TransactionCalculator.validateSameCurrency(params.products, currency);

    const subTotal = TransactionCalculator.calculateSubtotal(
      params.products,
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
      params.wompiTransactionId,
      params.products,
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

  getWompiTransactionId(): string {
    return this.wompiTransactionId;
  }

  getProducts(): TransactionProduct[] {
    return this.product;
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
}
