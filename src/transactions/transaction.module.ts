import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PaymentProviderModule } from "src/payment-provider/payment-provider.module";
import { ProductModule } from "src/products/product.module";
import { CustomerModule } from "src/customer/customer.module";
import { CreateTransactionUseCase } from "./application/use-cases/create-transaction.use-case";
import { CreateTransactionService } from "./application/services/create-transaction.service";
import { CheckoutWithCreateTransactionService } from "./application/services/checkout-with-create-transaction.service";
import { TRANSACTION_REPOSITORY } from "./application/ports/transaction.repository.port";
import { DELIVERY_REPOSITORY } from "./application/ports/delivery.repository.port";
import { APP_CONFIG } from "./application/ports/app-config.port";
import { TransactionAdapterRepository } from "./infrastructure/adapters/transaction-adapter.repository";
import { DeliveryAdapterRepository } from "./infrastructure/adapters/delivery-adapter.repository";
import { EnvConfigAdapter } from "./infrastructure/adapters/env-config.adapter";
import { TransactionMapper } from "./infrastructure/mappers/transaction.mapper";
import { TransactionController } from "./infrastructure/controllers/transaction.controller";

@Module({
    imports: [PrismaModule, PaymentProviderModule, ProductModule, CustomerModule],
    controllers: [TransactionController],
    providers: [
        TransactionMapper,
        CreateTransactionUseCase,
        CreateTransactionService,
        CheckoutWithCreateTransactionService,
        {
            provide: APP_CONFIG,
            useClass: EnvConfigAdapter,
        },
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TransactionAdapterRepository,
        },
        {
            provide: DELIVERY_REPOSITORY,
            useClass: DeliveryAdapterRepository,
        },
    ],
})
export class TransactionModule {}