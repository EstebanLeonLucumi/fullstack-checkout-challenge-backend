import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PAYMENT_PROVIDER, PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { CreateCheckoutRequestDto } from '../dto/create-checkout-request.dto';

@Controller('payment-provider')
export class PaymentProviderController {
  constructor(
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProviderPort
) {}

  @Post('checkout')
  async executeCheckout(@Body() body: CreateCheckoutRequestDto) {
    const result = await this.paymentProvider.executeCheckout(body);
    return {
      data: result,
      operation: 'CHECKOUT_SUCCESS',
    };
  }
}
