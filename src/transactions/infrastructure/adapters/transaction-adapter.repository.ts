import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionRepositoryPort } from "src/transactions/application/ports/transaction.repository.port";
import { Transaction as TransactionEntity } from "src/transactions/domain/entities/transaction.entity";
import { TransactionMapper, PrismaTransactionWithProducts } from "../mappers/transaction.mapper";

@Injectable()
export class TransactionAdapterRepository implements TransactionRepositoryPort {

    constructor(
        private readonly prisma: PrismaService,
        private readonly transactionMapper: TransactionMapper,
    ) {

    }

    async findById(id: string): Promise<TransactionEntity | null> {
        const tx = await this.prisma.transaction.findUnique({
            where: { id },
            include: { transactionProducts: true },
        });
        if (!tx) return null;
        return this.transactionMapper.fromPrismaTransactionWithProducts(
            tx as unknown as PrismaTransactionWithProducts,
        );
    }

    async create(transaction: TransactionEntity): Promise<TransactionEntity> {
        const products = transaction.getTransactionProducts();
        const created = await this.prisma.transaction.create({
            data: {
                status: transaction.getStatus(),
                subtotal: transaction.getSubtotal().getAmount(),
                baseFee: transaction.getBaseFee().getAmount(),
                deliveryFee: transaction.getDeliveryFee().getAmount(),
                totalAmount: transaction.getTotalAmount().getAmount(),
                currency: transaction.getTotalAmount().getCurrency(),
                customerId: transaction.getCustomerId(),
                deliveryId: transaction.getDeliveryId(),
                createdAt: transaction.getCreatedAt(),
                updatedAt: transaction.getUpdatedAt(),
                externalTransactionId: transaction.getExternalTransactionId(),
                transactionProducts: {
                    create: products.map((p) => ({
                        productId: p.getProductId(),
                        quantity: p.getQuantity(),
                        unitPrice: p.getUnitPrice().getAmount(),
                        totalAmount: p.getTotalAmount(),
                    })),
                },
            },
            include: { transactionProducts: true },
        });

        return this.transactionMapper.fromPrismaTransactionWithProducts(
            created as unknown as PrismaTransactionWithProducts,
        );
    }

    async update(transaction: TransactionEntity): Promise<TransactionEntity> {
        const id = transaction.getId();
        const deliveryId = transaction.getDeliveryId();
        await this.prisma.transaction.update({
            where: { id },
            data: {
                status: transaction.getStatus(),
                updatedAt: transaction.getUpdatedAt(),
                ...(deliveryId != null && {
                    delivery: { connect: { id: deliveryId } },
                }),
            },
        });
        const updated = await this.prisma.transaction.findUnique({
            where: { id },
            include: { transactionProducts: true },
        });
        if (!updated) return transaction;
        return this.transactionMapper.fromPrismaTransactionWithProducts(
            updated as unknown as PrismaTransactionWithProducts,
        );
    }

}