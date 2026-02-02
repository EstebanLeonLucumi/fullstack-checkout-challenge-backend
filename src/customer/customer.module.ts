import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { CustomerAdapterRepository } from './infrastructure/adapters/customer-adapter.repository';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { CustomerMapper } from './infrastructure/mappers/customer.mapper';
import { GetCustomerByIdMapper } from './infrastructure/mappers/get-customer-by-id.mapper';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { GetCustomerByIdService } from './application/services/get-customer-by-id.service';
import { GetCustomerByEmailMapper } from './infrastructure/mappers/get-customer-by-email.mapper';
import { GetCustomerByEmailUseCase } from './application/use-cases/get-customer-by-email.use-case';
import { GetCustomerByEmailService } from './application/services/get-customer-by-email.service';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { CreateCustomerService } from './application/services/create-customer.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaService,
    GetCustomerByIdUseCase,
    GetCustomerByIdService,
    GetCustomerByEmailUseCase,
    GetCustomerByEmailService,
    GetCustomerByIdMapper,
    GetCustomerByEmailMapper,
    CreateCustomerUseCase,
    CreateCustomerService,
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
