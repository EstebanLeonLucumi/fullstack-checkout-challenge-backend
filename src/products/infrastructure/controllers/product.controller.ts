import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Messages } from 'src/common/utils/messages';
import { GetProductByIdService } from 'src/products/application/services/get-product-by-id.service';
import { GetAllProductsService } from 'src/products/application/services/get-all-products.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductService: GetProductByIdService,
    private readonly getAllProductsService: GetAllProductsService,
  ) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.getProductService.execute(id);

    if (!product) {
      throw new NotFoundException(Messages.PRODUCT_NOT_FOUND);
    }

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
