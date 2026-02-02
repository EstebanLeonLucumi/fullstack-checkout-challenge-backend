import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from 'src/customer/application/ports/customer.repository.port';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';
import { PrismaService } from '../../../prisma/prisma.service';
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

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const normalized = email?.trim().toLowerCase();
    if (!normalized) return null;
    const customer = await this.prisma.customer.findUnique({
      where: { email: normalized },
    });
    if (!customer) return null;
    return this.customerMapper.toDomain(customer);
  }

  async create(customer: CustomerEntity): Promise<CustomerEntity> {
    const data = this.customerMapper.toPrismaCreate(customer);
    const created = await this.prisma.customer.create({ data });
    return this.customerMapper.toDomain(created);
  }
}
