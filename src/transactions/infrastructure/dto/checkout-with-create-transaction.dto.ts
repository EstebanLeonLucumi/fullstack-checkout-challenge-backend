import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CheckoutRequestDto } from './checkout-request.dto';

export class CheckoutTransactionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Transform(({ value }) => (typeof value === 'number' ? Math.floor(value) : Math.floor(Number(value) || 0)))
  @IsInt()
  @Min(1)
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
