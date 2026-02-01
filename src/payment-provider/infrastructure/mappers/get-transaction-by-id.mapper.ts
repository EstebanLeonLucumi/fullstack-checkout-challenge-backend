import { GetTransactionByIdOutputDto } from 'src/payment-provider/application/output/get-transaction-by-id-output.dto';
import { GetTransactionResponseDto } from '../dto/get-transaction-response.dto';

export class GetTransactionByIdMapper {
  toOutput(response: GetTransactionResponseDto): GetTransactionByIdOutputDto {
    const d = response.data;
    return {
      id: d.id,
      created_at: d.created_at,
      finalized_at: d.finalized_at ?? null,
      amount_in_cents: d.amount_in_cents,
      reference: d.reference,
      currency: d.currency,
      payment_method_type: d.payment_method_type,
      payment_method: {
        type: d.payment_method.type,
        extra: d.payment_method.extra,
      },
      payment_link_id: d.payment_link_id ?? null,
      redirect_url: d.redirect_url ?? null,
      status: d.status,
      status_message: d.status_message ?? null,
      merchant: {
        id: d.merchant.id,
        name: d.merchant.name,
        legal_name: d.merchant.legal_name,
        contact_name: d.merchant.contact_name,
        phone_number: d.merchant.phone_number,
        logo_url: d.merchant.logo_url ?? null,
        legal_id_type: d.merchant.legal_id_type,
        email: d.merchant.email,
        legal_id: d.merchant.legal_id,
        public_key: d.merchant.public_key,
      },
      taxes: d.taxes ?? [],
      tip_in_cents: d.tip_in_cents ?? null,
    };
  }
}
