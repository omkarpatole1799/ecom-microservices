import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { successResponse } from 'src/helpers/response.helper';
import { Customer } from './entities/customer.entity';
import { ApiResponse } from 'src/types/common';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

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

  @Get()
  async getAllCustomers(): Promise<ApiResponse<Customer[]>> {
    const customers = await this.customerService.getAllCustomers();
    return successResponse(customers, 'Successfully retrieved all customers');
  }

  @Get(':id')
  async getCustomerById(
    @Param('id') id: string,
  ): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.getCustomerById(id);
    return successResponse(customer, 'Successfully retrieved customer');
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.updateCustomer(
      id,
      updateCustomerDto,
    );
    return successResponse(customer, 'Successfully updated customer');
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.customerService.deleteCustomer(id);
    return successResponse(null, 'Successfully deleted customer');
  }
}
