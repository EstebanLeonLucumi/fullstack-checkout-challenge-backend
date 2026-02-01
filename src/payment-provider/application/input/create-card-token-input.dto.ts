export interface CreateCardTokenInputDto {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
}