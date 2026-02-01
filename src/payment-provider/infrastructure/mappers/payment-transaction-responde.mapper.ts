import { PaymentTransactionOutputDto } from "src/payment-provider/application/output/payment-transaction-output.dto";
import { PaymentTransactionResponseDto } from "../dto/payment-transaction-response.dto";

export class PaymentTransactionResponseMapper {
    toPaymentTransactionOutput(paymentTransactionResponse: PaymentTransactionResponseDto): PaymentTransactionOutputDto {

        const paymentTransactionOutput: PaymentTransactionOutputDto = {
            id: paymentTransactionResponse.data.id,
            created_at: paymentTransactionResponse.data.created_at,
        };

        return paymentTransactionOutput;
    }
}