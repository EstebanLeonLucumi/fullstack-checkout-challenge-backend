import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Messages } from 'src/common/utils/messages';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../ports/product.repository.port';
import { UpdateStockInputDto } from '../input/update-stock-input.dto';
import { Product as ProductEntity } from 'src/products/domain/entities/product.entity';

@Injectable()
export class UpdateStockProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(input: UpdateStockInputDto): Promise<ProductEntity> {
    
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      throw new NotFoundException(Messages.PRODUCT_NOT_FOUND_CANNOT_UPDATE_STOCK);
    }

    const productWithStockDecreased = product.decreaseStock(input.amount);

    const updatedProduct = await this.productRepository.update(productWithStockDecreased);

    return updatedProduct;
  }
}
