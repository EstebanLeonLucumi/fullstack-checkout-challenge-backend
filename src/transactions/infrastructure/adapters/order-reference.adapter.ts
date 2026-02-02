import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Messages } from 'src/common/utils/messages';
import { PrismaService } from 'src/database/prisma.service';
import { OrderReferencePort } from '../../application/ports/order-reference.port';

const COUNTER_ID = 'singleton';
const PAD_LENGTH = 3;

@Injectable()
export class OrderReferenceAdapter implements OrderReferencePort {
  constructor(private readonly prisma: PrismaService) {}

  async getNextReference(): Promise<string> {
    const nextValue = await this.prisma.$transaction(async (tx) => {
      const row = await tx.orderReferenceCounter.findUnique({
        where: { id: COUNTER_ID },
      });
      if (!row) {
        throw new InternalServerErrorException(
          Messages.ORDER_REFERENCE_UNAVAILABLE,
        );
      }
      const updated = await tx.orderReferenceCounter.update({
        where: { id: COUNTER_ID },
        data: { nextValue: row.nextValue + 1 },
      });
      return updated.nextValue;
    });
    return `order_${String(nextValue).padStart(PAD_LENGTH, '0')}`;
  }
}
