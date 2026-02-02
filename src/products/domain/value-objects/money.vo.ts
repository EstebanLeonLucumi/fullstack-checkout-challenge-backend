import { Messages } from 'src/common/utils/messages';
import { Currency } from './currency';

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
            throw new Error(Messages.MONEY_AMOUNT_NON_NEGATIVE);
        }
        if (!currency?.trim()) {
            throw new Error(Messages.MONEY_CURRENCY_REQUIRED);
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