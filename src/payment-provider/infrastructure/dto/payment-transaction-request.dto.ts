export class PaymentTransactionRequestDto {
    acceptance_token: string;
    accept_personal_auth: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    reference: string;
    signature: string;
    payment_method: {
        type: string;
        token: string;
        installments: number;
    }
}