export interface GetTransactionResponseDto {
    data: {
        id: string;
        created_at: string;
        finalized_at: string | null;
        amount_in_cents: number;
        reference: string;
        currency: string;
        payment_method_type: string;
        payment_method: {
            type: string;
            extra?: Record<string, unknown>;
        };
        payment_link_id: string | null;
        redirect_url: string | null;
        status: string;
        status_message: string | null;
        merchant: {
            id: number;
            name: string;
            legal_name: string;
            contact_name: string;
            phone_number: string;
            logo_url: string | null;
            legal_id_type: string;
            email: string;
            legal_id: string;
            public_key: string;
        };
        taxes: unknown[];
        tip_in_cents: number | null;
    };
    meta: Record<string, unknown>;
}
