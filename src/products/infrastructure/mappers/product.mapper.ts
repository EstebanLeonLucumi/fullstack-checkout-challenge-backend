import { Product as PrismaProduct } from 'src/prisma/client';
import { CurrencyMapper } from './currency-mapper';
import { Product as ProductEntity } from 'src/products/domain/entities/product.entity';
import { Money } from 'src/products/domain/value-objects/money.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductMapper {
  constructor(private readonly currencyMapper: CurrencyMapper) {}

  toDomain(prisma: PrismaProduct): ProductEntity {
    const price = Money.create(
      prisma.amount,
      this.currencyMapper.toDomainCurrency(prisma.currency),
    );

    return new ProductEntity(
      prisma.id,
      prisma.name,
      prisma.description,
      price,
      prisma.image,
      prisma.stock,
    );
  }

  toPrisma(product: ProductEntity): PrismaProduct {
    const currency = this.currencyMapper.toPrismaCurrency(
      product.getPrice().getCurrency(),
    );

    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      amount: product.getPrice().getAmount(),
      currency,
      image: product.getImage(),
      stock: product.getStock(),
      createdAt: product.getCreatedAt(),
      updatedAt: product.getUpdatedAt(),
    };
  }

  toPrismaCreate(product: ProductEntity) {
    return {
      name: product.getName(),
      description: product.getDescription(),
      amount: product.getPrice().getAmount(),
      currency: this.currencyMapper.toPrismaCurrency(
        product.getPrice().getCurrency(),
      ),
      image: product.getImage(),
      stock: product.getStock(),
    };
  }

  toPrismaUpdate(product: ProductEntity) {
    return {
      name: product.getName(),
      description: product.getDescription(),
      amount: product.getPrice().getAmount(),
      currency: this.currencyMapper.toPrismaCurrency(
        product.getPrice().getCurrency(),
      ),
      image: product.getImage(),
      stock: product.getStock(),
      updatedAt: new Date(),
    };
  }
}
