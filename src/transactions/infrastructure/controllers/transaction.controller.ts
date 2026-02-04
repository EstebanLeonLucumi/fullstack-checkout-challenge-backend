import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionService } from 'src/transactions/application/services/create-transaction.service';
import { CheckoutWithCreateTransactionService } from 'src/transactions/application/services/checkout-with-create-transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CheckoutWithCreateTransactionDto } from '../dto/checkout-with-create-transaction.dto';
import { CreateTransactionInputDto } from 'src/transactions/application/input/create-transaction-input.dto';
import { CheckoutWithCreateTransactionInputDto } from 'src/transactions/application/input/checkout-with-create-transaction-input.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly checkoutWithCreateTransactionService: CheckoutWithCreateTransactionService,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionDto) {
    const input: CreateTransactionInputDto = {
      customerId: body.customerId,
      deliveryId: body.deliveryId ?? undefined,
      externalTransactionId: body.externalTransactionId,
      transactionProducts: body.transactionProducts.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: { amount: item.unitPrice.amount, currency: item.unitPrice.currency },
        totalAmount: item.totalAmount,
      })),
      baseFee: { amount: body.baseFee.amount, currency: body.baseFee.currency },
      deliveryFee: {
        amount: body.deliveryFee.amount,
        currency: body.deliveryFee.currency,
      },
    };
    const data = await this.createTransactionService.execute(input);
    return {
      data,
      operation: 'TRANSACTION_CREATED',
    };
  }

  @Post('checkout')
  async checkout(@Body() body: CheckoutWithCreateTransactionDto) {
    const input: CheckoutWithCreateTransactionInputDto = {
      checkout: body.checkout,
      transaction: {
        customerId: body.transaction.customerId,
        deliveryId: body.transaction.deliveryId ?? undefined,
        transactionProducts: body.transaction.transactionProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    };
    const data = await this.checkoutWithCreateTransactionService.execute(input);
    return {
      status: data.status,
      orderNumber: data.externalTransactionId,
    };
  }
}
