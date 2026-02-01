import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCardTokenInputDto } from 'src/payment-provider/application/input/create-card-token-input.dto';
import { CardTokenOutputDto } from 'src/payment-provider/application/output/card-token-output.dto';
import { PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { CardTokenRequestDto } from '../dto/card-token-request.dto';
import { HttpService } from '@nestjs/axios';
import {
  CardTokenMapper,
  CardTokenResponseDto,
} from '../mappers/card-token.mapper';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentTransactionInputDto } from 'src/payment-provider/application/input/create-payment-transaction-input.dto';
import { PaymentTransactionOutputDto } from 'src/payment-provider/application/output/payment-transaction-output.dto';
import { PaymentTransactionMapper } from '../mappers/payment-transaction.mapper';
import { PaymentTransactionResponseDto } from '../dto/payment-transaction-response.dto';
import { AxiosError } from 'axios';

@Injectable()
export class SandboxPaymentProviderAdapter implements PaymentProviderPort {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly cardTokenMapper: CardTokenMapper,
    private readonly paymentTransactionMapper: PaymentTransactionMapper,
  ) {
    this.baseUrl = process.env.PAYMENT_PROVIDER_BASE_URL ?? '';
    this.publicKey = process.env.PAYMENT_PROVIDER_PUBLIC_KEY ?? '';
    this.privateKey = process.env.PAYMENT_PROVIDER_PRIVATE_KEY ?? '';
  }

  async createCardToken(
    data: CreateCardTokenInputDto,
  ): Promise<CardTokenOutputDto> {

    const request = this.cardTokenMapper.toRequest(data);

    let outPut = null;

    try {
      const response = await firstValueFrom(
        this.httpService.post<CardTokenResponseDto>(
          `${this.baseUrl}/tokens/cards`,
          request,
          {
            headers: {
              Authorization: `Bearer ${this.publicKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const apiResponse = response.data;

      outPut = this.cardTokenMapper.toOutput(apiResponse);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          {
            message: 'Error del proveedor de pagos',
            providerError: error.response.data,
          },
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
    }

    return outPut;
  }

  async createPaymentTransaction(
    input: CreatePaymentTransactionInputDto,
  ): Promise<PaymentTransactionOutputDto> {
    const request = this.paymentTransactionMapper.toRequest(input);

    let outPut = null;

    try {
      const response = await firstValueFrom(
        this.httpService.post<PaymentTransactionResponseDto>(
          `${this.baseUrl}/transactions`,
          request,
          {
            headers: {
              Authorization: `Bearer ${this.privateKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const apiResponse = response.data;

      outPut = this.paymentTransactionMapper.toOutput(apiResponse);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          {
            message: 'Error del proveedor de pagos',
            providerError: error.response.data,
          },
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
    }

    return outPut;
  }

  getTransactionById(transactionId: string): any {
    return transactionId;
  }
}
