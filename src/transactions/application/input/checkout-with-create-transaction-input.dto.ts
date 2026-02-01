import { CheckoutTransactionItemInputDto } from './checkout-transaction-item-input.dto';

export interface CheckoutDataDto {
  credit_card: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
  };
  customer_email: string;
  installments: number;
}

export interface CheckoutTransactionInputDto {
  customerId: string;
  deliveryId?: string | null;
  transactionProducts: CheckoutTransactionItemInputDto[];
}

export interface CheckoutWithCreateTransactionInputDto {
  checkout: CheckoutDataDto;
  transaction: CheckoutTransactionInputDto;
}
