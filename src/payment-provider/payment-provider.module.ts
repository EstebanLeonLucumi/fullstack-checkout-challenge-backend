import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CardTokenMapper } from "./infrastructure/mappers/card-token.mapper";
import { SandboxPaymentProviderAdapter } from "./infrastructure/adapters/sandbox-payment-provider.adapter";
import { PAYMENT_PROVIDER } from './application/ports/payment-provider.port';
import { PaymentProviderController } from "./infrastructure/controller/payment-provider.controller";
import { PaymentTransactionResponseMapper } from "./infrastructure/mappers/payment-transaction-responde.mapper";
import { PaymentTransactionMapper } from "./infrastructure/mappers/payment-transaction.mapper";
import { MerchantMapper } from "./infrastructure/mappers/merchant.mapper";

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [
        PaymentProviderController
    ],
    providers: [
        CardTokenMapper,
        PaymentTransactionResponseMapper,
        PaymentTransactionMapper,
        MerchantMapper,
        SandboxPaymentProviderAdapter,
        {
            provide: PAYMENT_PROVIDER,
            useClass: SandboxPaymentProviderAdapter
        }
    ],
    exports: [PAYMENT_PROVIDER],
})

export class PaymentProviderModule {}