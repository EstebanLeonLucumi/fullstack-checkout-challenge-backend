import { Injectable } from '@nestjs/common';
import { GetCustomerByEmailUseCase } from '../use-cases/get-customer-by-email.use-case';
import { GetCustomerByEmailOutputDto } from '../output/get-customer-by-email-output.dto';
import { GetCustomerByEmailMapper } from 'src/customer/infrastructure/mappers/get-customer-by-email.mapper';

@Injectable()
export class GetCustomerByEmailService {
  constructor(
    private readonly getCustomerByEmailUseCase: GetCustomerByEmailUseCase,
    private readonly getCustomerByEmailMapper: GetCustomerByEmailMapper,
  ) {}

  async execute(email: string): Promise<GetCustomerByEmailOutputDto | null> {
    const input = this.getCustomerByEmailMapper.toInput(email);
    const customer = await this.getCustomerByEmailUseCase.execute(input);

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
