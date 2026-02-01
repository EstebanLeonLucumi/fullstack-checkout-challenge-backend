import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PAYMENT_PROVIDER, PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { CreateCardTokenDto } from '../dto/create-card-token.dto';
import { PaymentTransactionDto } from '../dto/payment-transaction.dto';

@Controller('payment-provider')
export class PaymentProviderController {
  constructor(
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProviderPort
) {}

  @Post('tokens/cards')
  async createCardToken(@Body() body: CreateCardTokenDto) {
    const result = await this.paymentProvider.createCardToken({
      number: body.number,
      exp_month: body.exp_month,
      exp_year: body.exp_year,
      cvc: body.cvc,
      card_holder: body.card_holder,
    });
    return {
      data: result,
      operation: 'CARD_TOKEN_CREATED',
    };
  }

  @Post('transactions')
  async createPaymentTransaction(@Body() body: PaymentTransactionDto) {
    const result = await this.paymentProvider.createPaymentTransaction({
      acceptance_token: body.acceptance_token,
      accept_personal_auth: body.accept_personal_auth,
      amount_in_cents: body.amount_in_cents,
      currency: body.currency,
      customer_email: body.customer_email,
      reference: body.reference,
      signature: body.signature,
      payment_method: {
        type: body.payment_method.type,
        token: body.payment_method.token,
        installments: body.payment_method.installments,
      },
    });
    return {
      data: result,
      operation: 'CARD_TOKEN_CREATED',
    };
  }
}
