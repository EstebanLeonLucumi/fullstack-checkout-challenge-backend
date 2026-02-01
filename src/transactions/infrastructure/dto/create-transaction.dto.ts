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

export class MoneyDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}

export class CreateTransactionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsObject()
  @ValidateNested()
  @Type(() => MoneyDto)
  unitPrice: MoneyDto;

  @IsNumber()
  totalAmount: number;
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  deliveryId?: string | null;

  @IsString()
  @IsNotEmpty()
  externalTransactionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  transactionProducts: CreateTransactionItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => MoneyDto)
  baseFee: MoneyDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MoneyDto)
  deliveryFee: MoneyDto;
}
