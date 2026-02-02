import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../ports/customer.repository.port';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';
import { GetCustomerByEmailInputDto } from '../input/get-customer-by-email-input.dto';

@Injectable()
export class GetCustomerByEmailUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(
    input: GetCustomerByEmailInputDto,
  ): Promise<CustomerEntity | null> {
    return this.customerRepository.findByEmail(input.email);
  }
}
