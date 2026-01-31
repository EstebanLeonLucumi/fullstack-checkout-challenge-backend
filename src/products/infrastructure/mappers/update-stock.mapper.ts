import { Injectable } from '@nestjs/common';
import { UpdateStockInputDto } from 'src/products/application/input/update-stock-input.dto';

@Injectable()
export class UpdateStockMapper {
  toInput(productId: string, amount: number): UpdateStockInputDto {
    return {
      id: productId,
      amount,
    };
  }
}
