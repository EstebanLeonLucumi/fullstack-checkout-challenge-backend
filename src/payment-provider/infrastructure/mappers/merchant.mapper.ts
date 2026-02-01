import { MerchantOutputDto } from "src/payment-provider/application/output/merchant-output.dto";
import { GetMerchantResponseDto } from "../dto/get-merchant-response.dto";

export class MerchantMapper {
    toOutput(response: GetMerchantResponseDto): MerchantOutputDto {
        return {
            id: response.data.id,
            name: response.data.name,
            presigned_acceptance_acceptance_token: response.data.presigned_acceptance.acceptance_token,
            presigned_personal_data_auth_acceptance_token: response.data.presigned_personal_data_auth.acceptance_token,
        };
    }
}