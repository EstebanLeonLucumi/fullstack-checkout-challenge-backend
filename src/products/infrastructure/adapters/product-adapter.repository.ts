import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from 'src/products/application/ports/product.repository.port';
import { Product as ProductEntity } from 'src/products/domain/entities/product.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductAdapterRepository implements ProductRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productMapper: ProductMapper,
  ) {}

  private readonly products: ProductEntity[] = [];

  async findById(id: string): Promise<ProductEntity | null | undefined> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    const productDomain = this.productMapper.toDomain(product);

    return productDomain;
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany();

    if (!products) {
      return [];
    }

    products.forEach((product) => {
      const productDomain = this.productMapper.toDomain(product);
      this.products.push(productDomain);
    });

    return this.products;
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const productToUpdate = this.findById(product.getId());

    if (!productToUpdate) {
      throw new Error('No se puede actualizar un producto que no existe');
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
