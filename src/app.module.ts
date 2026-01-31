import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { TransactionModule } from './transactions/transaction.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductModule, PrismaModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
