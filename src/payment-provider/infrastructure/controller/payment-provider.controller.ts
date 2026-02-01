import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PAYMENT_PROVIDER, PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { CreateCardTokenDto } from '../dto/create-card-token.dto';

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
}
