import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../ports/transaction.repository.port';
import { Transaction as TransactionEntity } from 'src/transactions/domain/entities/transaction.entity';
import { TransactionProduct } from 'src/transactions/domain/entities/transaction-product.entity';
import { Money } from 'src/products/domain/value-objects/money.vo';
import { Currency } from 'src/products/domain/value-objects/currency';
import { CreateTransactionInputDto } from '../input/create-transaction-input.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepositoryPort: TransactionRepositoryPort,
  ) {}

  async execute(input: CreateTransactionInputDto): Promise<TransactionEntity> {
    const transactionProducts = input.transactionProducts.map((item) =>
      TransactionProduct.create({
        productId: item.productId,
        quantity: Math.floor(Number(item.quantity)),
        unitPrice: Money.create(
          Math.floor(Number(item.unitPrice.amount)),
          item.unitPrice.currency as Currency,
        ),
        totalAmount: Math.floor(Number(item.totalAmount)),
      }),
    );

    const baseFee = Money.create(
      Math.floor(Number(input.baseFee.amount)),
      input.baseFee.currency as Currency,
    );
    const deliveryFee = Money.create(
      Math.floor(Number(input.deliveryFee.amount)),
      input.deliveryFee.currency as Currency,
    );

    const transaction = TransactionEntity.create({
      customerId: input.customerId,
      deliveryId: input.deliveryId ?? null,
      externalTransactionId: input.externalTransactionId,
      transactionProducts,
      baseFee,
      deliveryFee,
    });

    return this.transactionRepositoryPort.create(transaction);
  }
}
