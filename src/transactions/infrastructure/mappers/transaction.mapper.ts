import { Injectable } from '@nestjs/common';
import { Transaction as TransactionEntity } from 'src/transactions/domain/entities/transaction.entity';
import { TransactionProduct } from 'src/transactions/domain/entities/transaction-product.entity';
import { TransactionStatus } from 'src/transactions/domain/value-objects/transaction-status';
import { Money } from 'src/products/domain/value-objects/money.vo';
import { Currency } from 'src/products/domain/value-objects/currency';

export interface PrismaTransactionCreated {
  id: string;
  status: string;
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  customerId: string;
  deliveryId: string | null;
  externalTransactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaTransactionProductRow {
  id: string;
  productId: string;
  transactionId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface PrismaTransactionWithProducts extends PrismaTransactionCreated {
  transactionProducts: PrismaTransactionProductRow[];
}

@Injectable()
export class TransactionMapper {
  fromPrismaTransactionWithProducts(
    tx: PrismaTransactionWithProducts,
  ): TransactionEntity {
    const currency = tx.currency as Currency;
    const transactionProducts = (tx.transactionProducts ?? []).map((p) =>
      TransactionProduct.create({
        productId: p.productId,
        transactionId: p.transactionId,
        quantity: p.quantity,
        unitPrice: this.toMoney(p.unitPrice, currency),
        totalAmount: p.totalAmount,
      }),
    );
    return this.toDomainEntity(tx, transactionProducts);
  }

  toDomainEntity(
    created: PrismaTransactionCreated,
    transactionProducts: TransactionProduct[],
  ): TransactionEntity {
    const currency = created.currency as Currency;
    const subtotal = this.toMoney(created.subtotal, currency);
    const baseFee = this.toMoney(created.baseFee, currency);
    const deliveryFee = this.toMoney(created.deliveryFee, currency);
    const totalAmount = this.toMoney(created.totalAmount, currency);

    return new TransactionEntity(
      created.id,
      created.status as TransactionStatus,
      created.customerId,
      created.deliveryId,
      created.externalTransactionId,
      transactionProducts,
      subtotal,
      baseFee,
      deliveryFee,
      totalAmount,
      created.createdAt,
      created.updatedAt,
    );
  }

  private toMoney(amount: number, currency: Currency): Money {
    return Money.create(Math.floor(Number(amount)), currency);
  }
}
