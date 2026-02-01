import { Injectable } from "@nestjs/common";
import { GetProductByIdUseCase } from "../use-cases/get-product-by-id.use-case";
import { Product as ProductEntity } from "src/products/domain/entities/product.entity";
import { GetProductByIdOutputDto } from "../output/get-product-by-id-output.dto";
import { GetProductByIdInputDto } from "../input/get-product-by-id-input.dto";
import { GetProductByIdMapper } from "src/products/infrastructure/mappers/get-product-by-id.mapper";

@Injectable()
export class GetProductByIdService {

    constructor(
        private readonly getProductByIdUseCase: GetProductByIdUseCase,
        private readonly getProductByIdMapper: GetProductByIdMapper,
    ) {}

    async execute(id: string): Promise<GetProductByIdOutputDto | null> {

       const input = this.getProductByIdMapper.toInput(id);

        const product = await this.getProductByIdUseCase.execute(input);

        if (product) {
            return {
                id: product.getId(),
                name: product.getName(),
                description: product.getDescription(),
                price: {
                    amount: product.getPrice().getAmount(),
                    currency: product.getPrice().getCurrency(),
                },
                image: product.getImage(),
                stock: product.getStock(),
                createdAt: product.getCreatedAt(),
                updatedAt: product.getUpdatedAt(),
            };
        }

        return null;
    }

}