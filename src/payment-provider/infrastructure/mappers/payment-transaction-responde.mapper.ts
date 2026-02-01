import { PaymentTransactionOutputDto } from "src/payment-provider/application/output/payment-transaction-output.dto";
import { PaymentTransactionResponseDto } from "../dto/payment-transaction-response.dto";

export class PaymentTransactionResponseMapper {
    toPaymentTransactionOutput(paymentTransactionResponse: PaymentTransactionResponseDto): PaymentTransactionOutputDto {

        const paymentTransactionOutput: PaymentTransactionOutputDto = {
            id: paymentTransactionResponse.id,
            status: paymentTransactionResponse.status,
        };

        return paymentTransactionOutput;
    }
}