import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerUseCase } from '../use-cases/create-customer.use-case';
import { CreateCustomerOutputDto } from '../output/create-customer-output.dto';
import { CreateCustomerInputDto } from '../input/create-customer-input.dto';

@Injectable()
export class CreateCustomerService {
  private readonly logger = new Logger(CreateCustomerService.name);

  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  async execute(input: CreateCustomerInputDto): Promise<CreateCustomerOutputDto> {
    const customer = await this.createCustomerUseCase.execute(input);
    this.logger.log(
      `Customer created: id=${customer.getId()} email=${customer.getEmail()}`,
    );
    return {
      id: customer.getId(),
      email: customer.getEmail(),
      fullName: customer.getFullName(),
      address: customer.getAddress(),
      city: customer.getCity(),
      createdAt: customer.getCreatedAt(),
    };
  }
}
