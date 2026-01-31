import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateStockProductService } from 'src/products/application/services/update-stock-product.service';
import { UpdateStockDto } from '../dto/update-stock.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly updateStockProductService: UpdateStockProductService,
  ) {}

  @Patch(':id/update-stock')
  async updateStockProduct(
    @Param('id') id: string,
    @Body() request: UpdateStockDto
  ) {
    const updatedProduct =
      await this.updateStockProductService.execute(id, request);

    return {
      data: updatedProduct,
      operation: 'STOCK_UPDATED',
    };
  }
}
