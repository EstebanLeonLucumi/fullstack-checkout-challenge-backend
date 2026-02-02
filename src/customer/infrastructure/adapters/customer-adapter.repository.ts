import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from 'src/customer/application/ports/customer.repository.port';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerAdapterRepository implements CustomerRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) return null;

    return this.customerMapper.toDomain(customer);
  }
}
