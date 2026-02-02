import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { CustomerAdapterRepository } from './infrastructure/adapters/customer-adapter.repository';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { CustomerMapper } from './infrastructure/mappers/customer.mapper';
import { GetCustomerByIdMapper } from './infrastructure/mappers/get-customer-by-id.mapper';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { GetCustomerByIdService } from './application/services/get-customer-by-id.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaService,
    GetCustomerByIdUseCase,
    GetCustomerByIdService,
    GetCustomerByIdMapper,
    CustomerMapper,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerAdapterRepository,
    },
  ],
  controllers: [CustomerController],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomerModule {}
