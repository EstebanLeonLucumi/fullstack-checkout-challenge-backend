import { Injectable, NotFoundException } from '@nestjs/common';
import { Messages } from 'src/common/utils/messages';
import { ProductRepositoryPort } from 'src/products/application/ports/product.repository.port';
import { Product as ProductEntity } from 'src/products/domain/entities/product.entity';
import { PrismaService } from '../../../database/prisma.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductAdapterRepository implements ProductRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productMapper: ProductMapper,
  ) {}

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) return null;

    const productDomain = this.productMapper.toDomain(product);

    return productDomain;
  }

  async findAll(): Promise<ProductEntity[]> {
    const productsExists = await this.prisma.product.findMany();

    if (!productsExists) {
      return [];
    }

    const products = productsExists.map((product) =>
      this.productMapper.toDomain(product),
    );

    return products;
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const productExist = await this.findById(product.getId());

    if (!productExist) {
      throw new NotFoundException(Messages.PRODUCT_NOT_FOUND_CANNOT_UPDATE);
    }

    const updateProductPrisma = {
      stock: product.getStock(),
      updatedAt: new Date(),
    };

    const updated = await this.prisma.product.update({
      where: {
        id: product.getId(),
      },
      data: updateProductPrisma,
    });

    const updatedProductDomain = this.productMapper.toDomain(updated);

    return updatedProductDomain;
  }
}
