import { CreatePaymentTransactionInputDto } from "src/payment-provider/application/input/create-payment-transaction-input.dto";
import { PaymentTransactionRequestDto } from "../dto/payment-transaction-request.dto";
import { PaymentTransactionOutputDto } from "src/payment-provider/application/output/payment-transaction-output.dto";
import { PaymentTransactionResponseDto } from "../dto/payment-transaction-response.dto";

export class PaymentTransactionMapper {
    toRequest(input: CreatePaymentTransactionInputDto): PaymentTransactionRequestDto {
        return {
            acceptance_token: input.acceptance_token,
            accept_personal_auth: input.accept_personal_auth,
            amount_in_cents: input.amount_in_cents,
            currency: input.currency,
            customer_email: input.customer_email,
            reference: input.reference,
            signature: input.signature,
            payment_method: {
                type: input.payment_method.type,
                token: input.payment_method.token,
                installments: input.payment_method.installments,
            }
        }
    }

    toOutput(response: PaymentTransactionResponseDto): PaymentTransactionOutputDto {
        return {
            id: response.data.id,
            created_at: response.data.created_at,
        };
    }
}