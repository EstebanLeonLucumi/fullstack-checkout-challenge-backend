import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../ports/customer.repository.port';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';
import { CreateCustomerInputDto } from '../input/create-customer-input.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(input: CreateCustomerInputDto): Promise<CustomerEntity> {
    const existing = await this.customerRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const customer = CustomerEntity.create(
      input.email,
      input.fullName,
      input.address ?? null,
      input.city ?? null,
    );

    return this.customerRepository.create(customer);
  }
}
