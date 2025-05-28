import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { successResponse } from 'src/helpers/response.helper';
import { Customer } from './entities/customer.entity';
import { ApiResponse } from 'src/types/common';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ApiResponse<Customer>> {
    console.log(createCustomerDto);
    const customer =
      await this.customerService.createCustomer(createCustomerDto);
    return successResponse(customer, 'Successfully created new customer');
  }
}
