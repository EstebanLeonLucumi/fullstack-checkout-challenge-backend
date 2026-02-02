import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  create(customer: CustomerEntity): Promise<CustomerEntity>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
