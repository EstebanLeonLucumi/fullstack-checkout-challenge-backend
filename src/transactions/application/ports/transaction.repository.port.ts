import { Transaction } from "src/transactions/domain/entities/transaction.entity";

export interface TransactionRepositoryPort {
    findById(id: string): Promise<Transaction | null | undefined>;
    findAll(): Promise<Transaction[]>;
    create(transaction: Transaction): Promise<Transaction>;
    update(transaction: Transaction): Promise<Transaction>;
    delete(id: string): Promise<void>;
}