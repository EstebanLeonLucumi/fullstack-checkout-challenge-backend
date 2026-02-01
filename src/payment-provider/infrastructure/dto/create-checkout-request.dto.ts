import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { CreateCardTokenDto } from "./create-card-token.dto";

export class CreateCheckoutRequestDto {
    @IsObject()
    @IsNotEmpty()
    credit_card : CreateCardTokenDto;

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

    @IsNumber()
    @IsNotEmpty()
    installments: number;
}