import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  DeliveryRepositoryPort,
  CreateDeliveryResult,
} from 'src/transactions/application/ports/delivery.repository.port';

@Injectable()
export class DeliveryAdapterRepository implements DeliveryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    customerId: string,
    address: string,
    city: string,
  ): Promise<CreateDeliveryResult> {
    const created = await this.prisma.delivery.create({
      data: {
        customerId,
        address,
        city,
      },
    });
    return { id: created.id };
  }
}
