import { Injectable } from '@nestjs/common';
import { GetCustomerByIdInputDto } from 'src/customer/application/input/get-customer-by-id-input.dto';

@Injectable()
export class GetCustomerByIdMapper {
  toInput(id: string): GetCustomerByIdInputDto {
    return { id };
  }
}
