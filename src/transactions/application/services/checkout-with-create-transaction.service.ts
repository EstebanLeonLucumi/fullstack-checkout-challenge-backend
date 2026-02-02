import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PAYMENT_PROVIDER, PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { GetTransactionByIdInputDto } from 'src/payment-provider/application/input/get-transaction-by-id-input.dto';
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from 'src/products/application/ports/product.repository.port';
import { TRANSACTION_REPOSITORY, TransactionRepositoryPort } from '../ports/transaction.repository.port';
import { DELIVERY_REPOSITORY, DeliveryRepositoryPort } from '../ports/delivery.repository.port';
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from 'src/customer/application/ports/customer.repository.port';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { UpdateStockProductUseCase } from 'src/products/application/use-cases/update-stock-product.use-case';
import { CreateTransactionInputDto } from '../input/create-transaction-input.dto';
import { CheckoutWithCreateTransactionInputDto } from '../input/checkout-with-create-transaction-input.dto';
import { CreateTransactionOutputDto } from '../output/create-transaction-output.dto';
import { TransactionStatus } from 'src/transactions/domain/value-objects/transaction-status';
import { Transaction as TransactionEntity } from 'src/transactions/domain/entities/transaction.entity';
import { APP_CONFIG, AppConfigPort } from '../ports/app-config.port';
import { ORDER_REFERENCE, OrderReferencePort } from '../ports/order-reference.port';
import { Messages } from 'src/common/utils/messages';

const POLL_INTERVAL_MS = 5000;
const TIMEOUT_MS = 5 * 60 * 1000;
const INITIAL_WAIT_MS = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class CheckoutWithCreateTransactionService {
  private readonly logger = new Logger(CheckoutWithCreateTransactionService.name);

  constructor(
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProviderPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(APP_CONFIG)
    private readonly appConfig: AppConfigPort,
    @Inject(ORDER_REFERENCE)
    private readonly orderReference: OrderReferencePort,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateStockProductUseCase: UpdateStockProductUseCase,
  ) {}

  async execute(
    input: CheckoutWithCreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    const reference = await this.orderReference.getNextReference();
    this.logger.log(
      `Checkout started: customerId=${input.transaction.customerId} reference=${reference}`,
    );

    const transactionProducts = await Promise.all(
      input.transaction.transactionProducts.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new NotFoundException(Messages.PRODUCT_NOT_FOUND_ID(item.productId));
        }
        const quantity = Math.floor(Number(item.quantity));
        if (quantity < 1) {
          throw new BadRequestException(Messages.QUANTITY_MUST_BE_POSITIVE);
        }
        const amount = Math.floor(Number(product.getPrice().getAmount()));
        const totalAmount = Math.floor(quantity * amount);
        return {
          productId: item.productId,
          quantity,
          unitPrice: { amount, currency: this.appConfig.getCurrency() },
          totalAmount,
        };
      }),
    );

    const subtotalInCents = Math.floor(
      transactionProducts.reduce((acc, item) => acc + item.totalAmount, 0),
    );
    const amountInCents = Math.floor(
      subtotalInCents +
        Math.floor(this.appConfig.getBaseFee()) +
        Math.floor(this.appConfig.getDeliveryFee()),
    );

    const customerId = input.transaction.customerId;
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      this.logger.warn(`Checkout failed: customer not found customerId=${customerId}`);
      throw new BadRequestException(Messages.CUSTOMER_NOT_FOUND_BAD_REQUEST);
    }

    const amountInCentsWholePesos = Math.floor(amountInCents / 100) * 100;
    const checkoutPayload = {
      ...input.checkout,
      amount_in_cents: amountInCentsWholePesos,
      currency: this.appConfig.getCurrency(),
      reference,
      customer_email: customer.getEmail(),
    };

    let checkoutResult;
    try {
      checkoutResult = await this.paymentProvider.executeCheckout(checkoutPayload);
      this.logger.log(
        `Payment provider checkout success: externalTransactionId=${checkoutResult.id} reference=${reference}`,
      );
    } catch (error) {
      this.logger.error(
        `Payment provider checkout failed: reference=${reference} - ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }

    const externalTransactionId = checkoutResult.id;
    const transactionInput: CreateTransactionInputDto = {
      customerId: input.transaction.customerId,
      deliveryId: input.transaction.deliveryId,
      externalTransactionId,
      transactionProducts,
      baseFee: {
        amount: this.appConfig.getBaseFee(),
        currency: this.appConfig.getCurrency(),
      },
      deliveryFee: {
        amount: this.appConfig.getDeliveryFee(),
        currency: this.appConfig.getCurrency(),
      },
    };
    const created = await this.createTransactionUseCase.execute(transactionInput);
    this.logger.log(
      `Transaction created (checkout): id=${created.getId()} externalTransactionId=${externalTransactionId}`,
    );

    for (const item of transactionProducts) {
      await this.updateStockProductUseCase.execute({
        id: item.productId,
        amount: Math.floor(item.quantity),
      });
    }

    await sleep(INITIAL_WAIT_MS);

    const startTime = Date.now();
    let finalStatus: string = TransactionStatus.PENDING;

    while (true) {
      const wompiInput: GetTransactionByIdInputDto = {
        transactionId: externalTransactionId,
      };
      const wompiTx = await this.paymentProvider.getTransactionById(wompiInput);

      if (wompiTx.status !== 'PENDING') {
        finalStatus = wompiTx.status;
        this.logger.log(
          `Checkout final status: transactionId=${created.getId()} status=${finalStatus}`,
        );
        break;
      }

      if (Date.now() - startTime >= TIMEOUT_MS) {
        finalStatus = TransactionStatus.DECLINED;
        this.logger.warn(
          `Checkout timeout: transactionId=${created.getId()} status=DECLINED (timeout)`,
        );
        break;
      }

      await sleep(POLL_INTERVAL_MS);
    }

    const entity = await this.transactionRepository.findById(created.getId());
    if (!entity) {
      throw new InternalServerErrorException(
        Messages.TRANSACTION_COULD_NOT_BE_UPDATED,
      );
    }
    const normalizedStatus =
      typeof finalStatus === 'string' ? finalStatus.toUpperCase() : finalStatus;
    let entityUpdated = entity.withStatus(normalizedStatus as TransactionStatus);

    if (normalizedStatus === TransactionStatus.APPROVED) {
      const customerId = entity.getCustomerId();
      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        throw new BadRequestException(
          Messages.CUSTOMER_NOT_FOUND_FOR_DELIVERY,
        );
      }
      const address = customer.getAddress();
      const city = customer.getCity();
      if (!address?.trim() || !city?.trim()) {
        throw new BadRequestException(
          Messages.ADDRESS_AND_CITY_REQUIRED,
        );
      }
      const delivery = await this.deliveryRepository.create(
        customerId,
        address.trim(),
        city.trim(),
      );
      this.logger.log(
        `Delivery created: deliveryId=${delivery.id} transactionId=${entity.getId()}`,
      );
      entityUpdated = entityUpdated.withDeliveryId(delivery.id);
    }

    const updated = await this.transactionRepository.update(entityUpdated);
    this.logger.log(
      `Checkout completed: transactionId=${updated.getId()} status=${updated.getStatus()}`,
    );

    return this.toOutput(updated);
  }

  private toOutput(entity: TransactionEntity): CreateTransactionOutputDto {
    const transactionId = entity.getId();
    return {
      id: transactionId,
      status: entity.getStatus(),
      customerId: entity.getCustomerId(),
      deliveryId: entity.getDeliveryId(),
      externalTransactionId: entity.getExternalTransactionId(),
      transactionProducts: entity.getTransactionProducts().map((item) => ({
        id: item.getId(),
        productId: item.getProductId(),
        transactionId,
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
