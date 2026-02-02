import { Injectable } from '@nestjs/common';
import { GetCustomerByEmailInputDto } from 'src/customer/application/input/get-customer-by-email-input.dto';

@Injectable()
export class GetCustomerByEmailMapper {
  toInput(email: string): GetCustomerByEmailInputDto {
    return { email: email?.trim().toLowerCase() ?? '' };
  }
}
