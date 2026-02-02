import { Module } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.port";
import { ProductAdapterRepository } from "./infrastructure/adapters/product-adapter.repository";
import { ProductController } from "./infrastructure/controllers/product.controller";
import { CurrencyMapper } from "./infrastructure/mappers/currency-mapper";
import { PrismaModule } from "../database/prisma.module";
import { ProductMapper } from "./infrastructure/mappers/product.mapper";
import { PrismaService } from "../database/prisma.service";
import { UpdateStockProductUseCase } from "./application/use-cases/update-stock-product.use-case";
import { GetProductByIdUseCase } from "./application/use-cases/get-product-by-id.use-case";
import { GetProductByIdService } from "./application/services/get-product-by-id.service";
import { GetProductByIdMapper } from "./infrastructure/mappers/get-product-by-id.mapper";
import { GetAllProductsService } from "./application/services/get-all-products.service";
import { GetAllProductsUseCase } from "./application/use-cases/get-all-products.use-case";

@Module({
    imports: [PrismaModule],
    providers: [
        PrismaService,
        UpdateStockProductUseCase,
        GetAllProductsUseCase,
        GetProductByIdUseCase,
        GetProductByIdService,
        GetAllProductsService,
        GetProductByIdMapper,
        CurrencyMapper,
        ProductMapper,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductAdapterRepository,
        }
    ],
    controllers: [ProductController],
    exports: [PRODUCT_REPOSITORY, UpdateStockProductUseCase],
})

export class ProductModule {}