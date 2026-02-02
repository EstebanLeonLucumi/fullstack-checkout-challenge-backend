import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GetCustomerByIdService } from 'src/customer/application/services/get-customer-by-id.service';
import { CreateCustomerService } from 'src/customer/application/services/create-customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly getCustomerByIdService: GetCustomerByIdService,
    private readonly createCustomerService: CreateCustomerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() body: CreateCustomerDto) {
    const input = {
      email: body.email.trim().toLowerCase(),
      fullName: body.fullName.trim(),
      address: body.address?.trim() || null,
      city: body.city?.trim() || null,
    };
    const customer = await this.createCustomerService.execute(input);
    return {
      data: customer,
      operation: 'CUSTOMER_CREATED',
    };
  }

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
