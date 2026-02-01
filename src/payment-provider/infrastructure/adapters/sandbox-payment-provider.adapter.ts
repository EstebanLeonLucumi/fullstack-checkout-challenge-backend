import { Inject, Injectable } from '@nestjs/common';
import { CreateCardTokenInputDto } from 'src/payment-provider/application/input/create-card-token-input.dto';
import { CardTokenOutputDto } from 'src/payment-provider/application/output/card-token-output.dto';
import { PaymentProviderPort } from 'src/payment-provider/application/ports/payment-provider.port';
import { CardTokenRequestDto } from '../dto/card-token-request.dto';
import { HttpService } from '@nestjs/axios';
import { CardTokenMapper, CardTokenResponseDto } from '../mappers/card-token.mapper';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SandboxPaymentProviderAdapter implements PaymentProviderPort {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly cardTokenMapper: CardTokenMapper,
  ) {
    this.baseUrl = process.env.PAYMENT_PROVIDER_BASE_URL ?? '';
    this.publicKey = process.env.PAYMENT_PROVIDER_PUBLIC_KEY ?? '';
    this.privateKey = process.env.PAYMENT_PROVIDER_PRIVATE_KEY ?? '';
  }

  async createCardToken(data: CreateCardTokenInputDto): Promise<CardTokenOutputDto> {

    const request = this.cardTokenMapper.toRequest(data);

    const response = await firstValueFrom(
        this.httpService.post<CardTokenResponseDto>(
            `${this.baseUrl}/tokens/cards`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${this.publicKey}`,
                    'Content-Type': 'application/json',
                }
            }
        )
    )

    const apiResponse = response.data;

    return this.cardTokenMapper.toOutput(apiResponse);
  }

  createPaymentTransaction(data: any): any {
    return data;
  }

  getTransactionById(transactionId: string): any {
    return transactionId;
  }
}
