import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateStockDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}