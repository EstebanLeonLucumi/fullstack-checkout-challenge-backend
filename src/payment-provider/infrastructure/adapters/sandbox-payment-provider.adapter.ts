import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
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
import { GetTransactionByIdMapper } from '../mappers/get-transaction-by-id.mapper';
import { GetTransactionByIdInputDto } from 'src/payment-provider/application/input/get-transaction-by-id-input.dto';
import { GetTransactionByIdOutputDto } from 'src/payment-provider/application/output/get-transaction-by-id-output.dto';
import { GetTransactionResponseDto } from '../dto/get-transaction-response.dto';
import { AxiosError } from 'axios';
import { GetMerchantResponseDto } from '../dto/get-merchant-response.dto';
import { MerchantOutputDto } from 'src/payment-provider/application/output/merchant-output.dto';
import { MerchantMapper } from '../mappers/merchant.mapper';
import { CreateCheckoutRequestDto } from '../dto/create-checkout-request.dto';
import { createHash } from 'crypto';
import { Messages } from 'src/common/utils/messages';

@Injectable()
export class SandboxPaymentProviderAdapter implements PaymentProviderPort {
  private readonly logger = new Logger(SandboxPaymentProviderAdapter.name);
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly paymentType: string = 'CARD';
  private readonly integrityKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly cardTokenMapper: CardTokenMapper,
    private readonly paymentTransactionMapper: PaymentTransactionMapper,
    private readonly merchantMapper: MerchantMapper,
    private readonly getTransactionByIdMapper: GetTransactionByIdMapper,
  ) {
    this.baseUrl = process.env.PAYMENT_PROVIDER_BASE_URL ?? '';
    this.publicKey = process.env.PAYMENT_PROVIDER_PUBLIC_KEY ?? '';
    this.privateKey = process.env.PAYMENT_PROVIDER_PRIVATE_KEY ?? '';
    this.integrityKey = process.env.PAYMENT_PROVIDER_INTEGRITY_KEY ?? '';
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
        this.logger.warn(`Card token failed: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          Messages.PAYMENT_COULD_NOT_BE_PROCESSED,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
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
        this.logger.warn(`Create transaction failed: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          Messages.PAYMENT_COULD_NOT_BE_PROCESSED,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    return outPut;
  }

  async getMerchant(): Promise<MerchantOutputDto> {
    let outPut = null;

    try {
      const response = await firstValueFrom(
        this.httpService.get<GetMerchantResponseDto>(
          `${this.baseUrl}/merchants/${this.publicKey}`,
          {
            headers: {
              Authorization: `Bearer ${this.privateKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const apiResponse = response.data;
      const merchantData = Array.isArray(apiResponse.data)
        ? apiResponse.data[0]
        : apiResponse.data;

      outPut = this.merchantMapper.toOutput({ data: merchantData });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        this.logger.warn(`Get merchant failed: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          Messages.PAYMENT_COULD_NOT_BE_PROCESSED,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    return outPut;
  }

  async executeCheckout(
    data: CreateCheckoutRequestDto,
  ): Promise<PaymentTransactionOutputDto> {
    const creditCardRequest = {
      number: data.credit_card.number,
      exp_month: data.credit_card.exp_month,
      exp_year: data.credit_card.exp_year,
      cvc: data.credit_card.cvc,
      card_holder: data.credit_card.card_holder,
    };

    const merchant = await this.getMerchant();

    const creditCard = await this.createCardToken(creditCardRequest);

    const signature = this.generateSignature(
      data.reference,
      data.amount_in_cents,
      data.currency,
    );

    const paymentTransactionRequest = {
      acceptance_token: merchant.presigned_acceptance_acceptance_token,
      accept_personal_auth:
        merchant.presigned_personal_data_auth_acceptance_token,
      amount_in_cents: data.amount_in_cents,
      currency: data.currency,
      customer_email: data.customer_email,
      reference: data.reference,
      signature,
      payment_method: {
        type: this.paymentType,
        token: creditCard.token,
        installments: data.installments,
      },
    };

    const paymentTransaction = await this.createPaymentTransaction(
      paymentTransactionRequest,
    );

    return paymentTransaction;
  }

  private generateSignature(reference: string, amount: number, currency: string) {
    const signatureRaw =
      reference + amount + currency + this.integrityKey;

    return createHash('sha256').update(signatureRaw).digest('hex');
  }

  async getTransactionById(
    input: GetTransactionByIdInputDto,
  ): Promise<GetTransactionByIdOutputDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<GetTransactionResponseDto>(
          `${this.baseUrl}/transactions/${input.transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${this.privateKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return this.getTransactionByIdMapper.toOutput(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        this.logger.warn(`Get transaction by id failed: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          Messages.PAYMENT_COULD_NOT_BE_PROCESSED,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
