import { Money } from "src/products/domain/value-objects/money.vo";
import { TransactionProduct } from "../entities/transaction-product.entity";
import { Currency } from "src/products/domain/value-objects/Currency";

export class TransactionCalculator {
    static validateSameCurrency(products: TransactionProduct[], currency: string) {
    for (const item of products) {
      if (item.getUnitPrice().getCurrency() !== currency) {
        throw new Error("Todos los productos deben tener la misma moneda");
      }
    }
  }

  static calculateSubtotal(products: TransactionProduct[], currency: Currency): Money {
    const subtotalAmount = products.reduce(
      (acc, item) => acc + item.getTotalAmount(),
      0,
    );

    return Money.create(subtotalAmount, currency);
  }

  static calculateTotal(subtotal: Money, baseFee: Money, deliveryFee: Money): Money {
    const currency = subtotal.getCurrency();

    return Money.create(
      subtotal.getAmount() + baseFee.getAmount() + deliveryFee.getAmount(),
      currency,
    );
  }
}