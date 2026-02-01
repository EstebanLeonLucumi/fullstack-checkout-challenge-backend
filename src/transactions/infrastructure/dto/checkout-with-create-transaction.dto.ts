import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutRequestDto } from './checkout-request.dto';

export class CheckoutTransactionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CheckoutTransactionDataDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  deliveryId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutTransactionItemDto)
  transactionProducts: CheckoutTransactionItemDto[];
}

export class CheckoutWithCreateTransactionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutRequestDto)
  checkout: CheckoutRequestDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutTransactionDataDto)
  transaction: CheckoutTransactionDataDto;
}
