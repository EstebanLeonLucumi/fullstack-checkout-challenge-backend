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

export class MoneyDto {
  @Transform(({ value }) => (typeof value === 'number' ? Math.floor(value) : Math.floor(Number(value) || 0)))
  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

export class CreateTransactionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Transform(({ value }) => (typeof value === 'number' ? Math.floor(value) : Math.floor(Number(value) || 0)))
  @IsInt()
  @Min(1)
  quantity: number;

  @IsObject()
  @ValidateNested()
  @Type(() => MoneyDto)
  unitPrice: MoneyDto;

  @Transform(({ value }) => (typeof value === 'number' ? Math.floor(value) : Math.floor(Number(value) || 0)))
  @IsInt()
  @Min(0)
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
