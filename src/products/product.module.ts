import { Module } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.port";
import { ProductAdapterRepository } from "./infrastructure/adapters/product-adapter.repository";
import { ProductController } from "./infrastructure/controllers/product.controller";
import { CurrencyMapper } from "./infrastructure/mappers/currency-mapper";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductMapper } from "./infrastructure/mappers/product.mapper";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateStockProductUseCase } from "./application/use-cases/update-stock-product.use-case";
import { UpdateStockProductService } from "./application/services/update-stock-product.service";
import { UpdateStockMapper } from "./infrastructure/mappers/update-stock.mapper";

@Module({
    imports: [PrismaModule],
    providers: [
        PrismaService,
        UpdateStockProductUseCase,
        UpdateStockProductService,
        UpdateStockMapper,
        CurrencyMapper,
        ProductMapper,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductAdapterRepository,
        }
    ],
    controllers: [ProductController],
})

export class ProductModule {}