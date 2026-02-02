import { Injectable } from '@nestjs/common';
import { Customer as PrismaCustomer } from 'src/prisma/client';
import { Customer as CustomerEntity } from 'src/customer/domain/entities/customer.entity';

@Injectable()
export class CustomerMapper {
  toDomain(prisma: PrismaCustomer): CustomerEntity {
    return new CustomerEntity(
      prisma.id,
      prisma.email,
      prisma.full_name,
      prisma.createdAt,
    );
  }
}
