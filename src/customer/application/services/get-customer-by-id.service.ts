import { Injectable } from '@nestjs/common';
import { GetCustomerByIdUseCase } from '../use-cases/get-customer-by-id.use-case';
import { GetCustomerByIdOutputDto } from '../output/get-customer-by-id-output.dto';
import { GetCustomerByIdMapper } from 'src/customer/infrastructure/mappers/get-customer-by-id.mapper';

@Injectable()
export class GetCustomerByIdService {
  constructor(
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly getCustomerByIdMapper: GetCustomerByIdMapper,
  ) {}

  async execute(id: string): Promise<GetCustomerByIdOutputDto | null> {
    const input = this.getCustomerByIdMapper.toInput(id);
    const customer = await this.getCustomerByIdUseCase.execute(input);

    if (customer) {
      return {
        id: customer.getId(),
        email: customer.getEmail(),
        fullName: customer.getFullName(),
        address: customer.getAddress(),
        city: customer.getCity(),
        createdAt: customer.getCreatedAt(),
      };
    }

    return null;
  }
}
