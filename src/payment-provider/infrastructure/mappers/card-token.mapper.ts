import { CreateCardTokenInputDto } from "src/payment-provider/application/input/create-card-token-input.dto";
import { CardTokenRequestDto } from "../dto/card-token-request.dto";
import { CardTokenOutputDto } from "src/payment-provider/application/output/card-token-output.dto";

export interface CardTokenResponseDto {
    data: {
        id: string;
    }
}

export class CardTokenMapper {
    toRequest(input: CreateCardTokenInputDto): CardTokenRequestDto {
        return {
            number: input.number,
            exp_month: input.exp_month,
            exp_year: input.exp_year,
            cvc: input.cvc,
            card_holder: input.card_holder,
        }
    }

    toOutput(response: CardTokenResponseDto): CardTokenOutputDto {

        const token = response.data?.id ?? '';

        return { token }

    }
}