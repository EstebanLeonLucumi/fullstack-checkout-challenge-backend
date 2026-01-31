import { UpdateStockMapper } from 'src/products/infrastructure/mappers/update-stock.mapper';
import { UpdateStockProductUseCase } from '../use-cases/update-stock-product.use-case';
import { UpdateStockOutputDto } from '../output/update-stock-output.dto';
import { UpdateStockDto } from 'src/products/infrastructure/dto/update-stock.dto';

export class UpdateStockProductService {
  constructor(
    private readonly useCase: UpdateStockProductUseCase,
    private readonly mapper: UpdateStockMapper,
  ) {}

  async execute(request: UpdateStockDto): Promise<UpdateStockOutputDto> {

    const input = this.mapper.toInput(request.id, request.amount);

    const product = await this.useCase.execute(input);

    return {
      id: product.getId(),
      stock: product.getStock(),
      updatedAt: product.getUpdatedAt(),
    };
  }
}
