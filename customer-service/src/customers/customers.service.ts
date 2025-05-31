import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { generateToken } from '../helpers/jwt.helper';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });
    await this.customerRepository.save(customer);
    const { password, ...result } = customer;
    return result as Customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    return customer;
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.getCustomerById(id);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer not found`);
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ customer: Omit<Customer, 'password'>; token: string }> {
    const customer = await this.customerRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name'],
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...customerData } = customer;
    const token = generateToken(customerData);

    return {
      customer: customerData,
      token,
    };
  }
}
