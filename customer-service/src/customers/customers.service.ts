import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../helpers/jwt.helper';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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

  // orders related
  async orderCreated(order: CreateOrderDto): Promise<Order> {
    const _order = this.orderRepository.create(order);
    const createdOrder = await this.orderRepository.save(_order);

    return createdOrder;
  }

  async orderUpdated(order: UpdateOrderDto): Promise<void> {
    const { status, orderId } = order;
    const _findOrder = await this.orderRepository.findOneBy({ id: orderId });
    if (!_findOrder) {
      throw new NotFoundException('Order not found');
    }

    _findOrder.status = status;
    await this.orderRepository.save(_findOrder);
  }
}
