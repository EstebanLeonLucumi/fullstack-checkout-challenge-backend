export class GetMerchantResponseDto {
    data: {
        id: string;
        name: string;
        presigned_acceptance: {
            acceptance_token: string;
        },
        presigned_personal_data_auth: {
            acceptance_token: string;
        }
    }
}