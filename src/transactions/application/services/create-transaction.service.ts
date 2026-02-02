import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { CreateTransactionInputDto } from '../input/create-transaction-input.dto';
import { CreateTransactionOutputDto } from '../output/create-transaction-output.dto';

@Injectable()
export class CreateTransactionService {
  private readonly logger = new Logger(CreateTransactionService.name);

  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async execute(
    input: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    const entity = await this.createTransactionUseCase.execute(input);
    const transactionId = entity.getId();
    this.logger.log(
      `Transaction created: id=${transactionId} customerId=${entity.getCustomerId()} status=${entity.getStatus()}`,
    );

    return {
      id: transactionId,
      status: entity.getStatus(),
      customerId: entity.getCustomerId(),
      deliveryId: entity.getDeliveryId(),
      externalTransactionId: entity.getExternalTransactionId(),
      transactionProducts: entity.getTransactionProducts().map((item) => ({
        id: item.getId(),
        productId: item.getProductId(),
        transactionId: transactionId,
        quantity: item.getQuantity(),
        unitPrice: {
          amount: item.getUnitPrice().getAmount(),
          currency: item.getUnitPrice().getCurrency(),
        },
        totalAmount: item.getTotalAmount(),
      })),
      subtotal: {
        amount: entity.getSubtotal().getAmount(),
        currency: entity.getSubtotal().getCurrency(),
      },
      baseFee: {
        amount: entity.getBaseFee().getAmount(),
        currency: entity.getBaseFee().getCurrency(),
      },
      deliveryFee: {
        amount: entity.getDeliveryFee().getAmount(),
        currency: entity.getDeliveryFee().getCurrency(),
      },
      totalAmount: {
        amount: entity.getTotalAmount().getAmount(),
        currency: entity.getTotalAmount().getCurrency(),
      },
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
