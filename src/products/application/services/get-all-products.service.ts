import { Injectable } from "@nestjs/common";
import { GetAllProductsUseCase } from "../use-cases/get-all-products.use-case";
import { GetAllProductsOutputDto } from "../output/get-all-products-output.dto";

@Injectable()
export class GetAllProductsService {

    constructor(
        private readonly getAllProductsUseCase: GetAllProductsUseCase,
    ){}

    async execute(): Promise<GetAllProductsOutputDto[]> {

        const products = await this.getAllProductsUseCase.execute();

        if (products) {
            return products.map((product) => {
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
            });
        }

        return null;
    }

}