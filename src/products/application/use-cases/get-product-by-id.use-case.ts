import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../ports/product.repository.port";
import { Product as ProductEntity } from "src/products/domain/entities/product.entity";
import { GetProductByIdInputDto } from "../input/get-product-by-id-input.dto";


@Injectable()
export class GetProductByIdUseCase {

    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepositoryPort,
    ) {}

    async execute(input: GetProductByIdInputDto): Promise<ProductEntity | null> {
        return this.productRepository.findById(input.id);
    }

}