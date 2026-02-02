import { Currency } from "./Currency";

export class Money {
    private readonly amount: number;
    private readonly currency: Currency;

    constructor(amount: number, currency: Currency) {
        this.amount = amount;
        this.currency = currency;
    }

    static create(amount: number, currency: Currency) {
        const intAmount = Math.floor(Number(amount));
        if (intAmount < 0) {
            throw new Error('La cantidad de dinero no puede ser negativa');
        }
        if (!currency?.trim()) {
            throw new Error('El código de moneda no puede estar vacía');
        }
        return new Money(intAmount, currency);
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): Currency {
        return this.currency;
    }
}