import { CreateCheckoutRequestDto } from "src/payment-provider/infrastructure/dto/create-checkout-request.dto";
import { CreateCardTokenInputDto } from "../input/create-card-token-input.dto";
import { CreatePaymentTransactionInputDto } from "../input/create-payment-transaction-input.dto";
import { GetTransactionByIdInputDto } from "../input/get-transaction-by-id-input.dto";
import { CardTokenOutputDto } from "../output/card-token-output.dto";
import { GetTransactionByIdOutputDto } from "../output/get-transaction-by-id-output.dto";
import { MerchantOutputDto } from "../output/merchant-output.dto";
import { PaymentTransactionOutputDto } from "../output/payment-transaction-output.dto";

export interface PaymentProviderPort {
  createCardToken(data: CreateCardTokenInputDto): Promise<CardTokenOutputDto>;
  createPaymentTransaction(data: CreatePaymentTransactionInputDto): Promise<PaymentTransactionOutputDto>;
  getMerchant(): Promise<MerchantOutputDto>;
  executeCheckout(data: CreateCheckoutRequestDto): Promise<PaymentTransactionOutputDto>;
  getTransactionById(input: GetTransactionByIdInputDto): Promise<GetTransactionByIdOutputDto>;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');