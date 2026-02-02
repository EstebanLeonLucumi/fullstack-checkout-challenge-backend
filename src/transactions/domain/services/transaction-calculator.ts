import { Messages } from 'src/common/utils/messages';
import { Money } from "src/products/domain/value-objects/money.vo";
import { TransactionProduct } from "../entities/transaction-product.entity";
import { Currency } from 'src/products/domain/value-objects/currency';

export class TransactionCalculator {
    static validateSameCurrency(transactionProducts: TransactionProduct[], currency: string) {
    for (const item of transactionProducts) {
      if (item.getUnitPrice().getCurrency() !== currency) {
        throw new Error(Messages.TRANSACTION_SAME_CURRENCY);
      }
    }
  }

  static calculateSubtotal(transactionProducts: TransactionProduct[], currency: Currency): Money {
    const subtotalAmount = transactionProducts.reduce(
      (acc, item) => acc + item.getTotalAmount(),
      0,
    );
    return Money.create(Math.floor(subtotalAmount), currency);
  }

  static calculateTotal(subtotal: Money, baseFee: Money, deliveryFee: Money): Money {
    const currency = subtotal.getCurrency();
    const total =
      Math.floor(subtotal.getAmount()) +
      Math.floor(baseFee.getAmount()) +
      Math.floor(deliveryFee.getAmount());
    return Money.create(total, currency);
  }
}