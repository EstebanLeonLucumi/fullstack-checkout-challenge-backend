import { Injectable } from "@nestjs/common";
import { GetProductByIdInputDto } from "src/products/application/input/get-product-by-id-input.dto";
import { Product as ProductEntity } from "src/products/domain/entities/product.entity";
import { GetProductByIdOutputDto } from "src/products/application/output/get-product-by-id-output.dto";
import { ProductMapper } from "./product.mapper";

@Injectable()
export class GetProductByIdMapper {
    constructor(
        private readonly productMapper: ProductMapper,
    ) {}

    toInput(id: string): GetProductByIdInputDto {
        return {
            id,
        };
    }
}