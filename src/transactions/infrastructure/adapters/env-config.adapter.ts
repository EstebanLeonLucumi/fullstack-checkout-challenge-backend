import { Injectable } from '@nestjs/common';
import { AppConfigPort } from 'src/transactions/application/ports/app-config.port';
import { CURRENCY, BASE_FEE, DELIVERY_FEE } from 'src/config/currency';

@Injectable()
export class EnvConfigAdapter implements AppConfigPort {
  getCurrency(): string {
    return CURRENCY;
  }

  getBaseFee(): number {
    return BASE_FEE;
  }

  getDeliveryFee(): number {
    return DELIVERY_FEE;
  }
}
