import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class PaymentMethod {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    installments: number;
}

export class PaymentTransactionDto {

    @IsString()
    @IsNotEmpty()
    acceptance_token: string;

    @IsString()
    @IsNotEmpty()
    accept_personal_auth: string;

    @IsNumber()
    @IsNotEmpty()
    amount_in_cents: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsNotEmpty()
    customer_email: string;

    @IsString()
    @IsNotEmpty()
    reference: string;

    @IsString()
    @IsNotEmpty()
    signature: string;

    @IsObject()
    @IsNotEmpty()
    payment_method: PaymentMethod

}