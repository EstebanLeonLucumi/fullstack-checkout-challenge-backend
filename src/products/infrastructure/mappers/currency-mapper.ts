import { Currency as PrismaCurrency } from '@prisma/client';
import { Currency as DomainCurrency } from '../../domain/value-objects/Currency';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyMapper {
  toDomainCurrency(currency: string): DomainCurrency {
    const normalized = currency?.trim().toUpperCase();

    switch (normalized) {
      case DomainCurrency.COP:
        return DomainCurrency.COP;
      case DomainCurrency.USD:
        return DomainCurrency.USD;
      default:
        throw new Error(`Invalid currency: ${currency}`);
    }
  }

  toPrismaCurrency(currency: DomainCurrency): PrismaCurrency {
    switch (currency) {
      case DomainCurrency.COP:
        return PrismaCurrency.COP;
      case DomainCurrency.USD:
        return PrismaCurrency.USD;
    }
  }
}
