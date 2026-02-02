import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../ports/customer.repository.port';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';
import { GetCustomerByIdInputDto } from '../input/get-customer-by-id-input.dto';

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(
    input: GetCustomerByIdInputDto,
  ): Promise<CustomerEntity | null> {
    return this.customerRepository.findById(input.id);
  }
}
