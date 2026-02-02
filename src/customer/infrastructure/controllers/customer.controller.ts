import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GetCustomerByIdService } from 'src/customer/application/services/get-customer-by-id.service';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly getCustomerByIdService: GetCustomerByIdService,
  ) {}

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const customer = await this.getCustomerByIdService.execute(id);

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return {
      data: customer,
      operation: 'CUSTOMER_FOUND',
    };
  }
}
