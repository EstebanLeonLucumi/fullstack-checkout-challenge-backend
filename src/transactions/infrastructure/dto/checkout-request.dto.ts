import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCardTokenDto } from 'src/payment-provider/infrastructure/dto/create-card-token.dto';

export class CheckoutRequestDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCardTokenDto)
  credit_card: CreateCardTokenDto;

  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;
}
