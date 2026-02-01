import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionRepositoryPort } from "src/transactions/application/ports/transaction.repository.port";
import { TransactionProduct } from "src/transactions/domain/entities/transaction-product.entity";
import { Transaction as TransactionEntity } from "src/transactions/domain/entities/transaction.entity";
import { TransactionStatus } from 'src/transactions/domain/value-objects/transaction-status';

@Injectable()
export class TransactionAdapterRepository implements TransactionRepositoryPort {

    constructor(
        private readonly prisma: PrismaService,
    ) {

    }

    async findById(id: string): Promise<TransactionEntity | null> {
        return undefined;
    }

    async findAll(): Promise<TransactionEntity[]> {
        return [];
    }

    async create(transaction: TransactionEntity): Promise<TransactionEntity> {

        const created = await this.prisma.transaction.create({
            data: {
                status: transaction.getStatus(),
                customerId: transaction.getCustomerId(),
                deliveryId: transaction.getDeliveryId(),
                wompiTransactionId: transaction.getWompiTransactionId(),
                subtotal: transaction.getSubtotal().getAmount(),
                baseFee: transaction.getBaseFee().getAmount(),
                deliveryFee: transaction.getDeliveryFee().getAmount(),
                totalAmount: transaction.getTotalAmount().getAmount(),
                createdAt: transaction.getCreatedAt(),
                updatedAt: transaction.getUpdatedAt(),
            },
        });

        // const subTotal = this.moneyMapper.toDomainMoney(transaction.getSubtotal());
        // const baseFee = this.moneyMapper.toPrismaMoney(transaction.getBaseFee());
        // const deliveryFee = this.moneyMapper.toPrismaMoney(transaction.getDeliveryFee());
        // const totalAmount = this.moneyMapper.toPrismaMoney(transaction.getTotalAmount());

        return null;
    }

    async update(transaction: TransactionEntity): Promise<TransactionEntity> {
        return transaction;
    }

    async delete(id: string): Promise<void> {
        return;
    }

}