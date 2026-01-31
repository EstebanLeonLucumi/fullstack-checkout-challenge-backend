import { Product as ProductEntity } from "src/products/domain/entities/product.entity";

export interface ProductRepositoryPort {
    findById(id: string): Promise<ProductEntity | null | undefined>;
    findAll(): Promise<ProductEntity[]>;
    update(product: ProductEntity): Promise<ProductEntity>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');