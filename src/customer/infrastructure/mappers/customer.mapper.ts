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
      prisma.address ?? null,
      prisma.city ?? null,
    );
  }

  toPrismaCreate(customer: CustomerEntity): {
    email: string;
    full_name: string;
    address?: string | null;
    city?: string | null;
  } {
    return {
      email: customer.getEmail(),
      full_name: customer.getFullName(),
      address: customer.getAddress(),
      city: customer.getCity(),
    };
  }
}
