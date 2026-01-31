import { Body, Controller, Post } from '@nestjs/common';
import { UpdateStockProductService } from 'src/products/application/services/update-stock-product.service';
import { UpdateStockDto } from '../dto/update-stock.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly updateStockProductService: UpdateStockProductService,
  ) {}

  @Post()
  async updateStockProduct(@Body() request: UpdateStockDto) {
    return this.updateStockProductService.execute(request);
  }
}
