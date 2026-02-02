import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<CustomerEntity | null>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
