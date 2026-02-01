import { Transaction as TransactionEntity } from "src/transactions/domain/entities/transaction.entity";

export interface TransactionRepositoryPort {
    findById(id: string): Promise<TransactionEntity | null>;
    create(transaction: TransactionEntity): Promise<TransactionEntity>;
    update(transaction: TransactionEntity): Promise<TransactionEntity>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');