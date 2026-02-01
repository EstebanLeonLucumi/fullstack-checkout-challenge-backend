import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateStockProductService } from 'src/products/application/services/update-stock-product.service';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { GetProductByIdService } from 'src/products/application/services/get-product-by-id.service';
import { GetAllProductsService } from 'src/products/application/services/get-all-products.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly updateStockProductService: UpdateStockProductService,
    private readonly getProductService: GetProductByIdService,
    private readonly getAllProductsService: GetAllProductsService,
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

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.getProductService.execute(id);

    return {
      data: product,
      operation: 'PRODUCT_FOUND',
    };
  }

  @Get()
  async getAllProducts() {
    const products = await this.getAllProductsService.execute();

    return {
      data: products,
      operation: 'PRODUCTS_FOUND',
    };
  }
}
