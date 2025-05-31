import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/dto/order.entity';
import { Repository } from 'typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getOrdersById(id: string): Promise<Order[]> {
    if (!id) {
      throw new BadRequestException('Invalid order id');
    }
    const _ordersList = await this.ordersRepository.find({
      where: { customerId: id },
    });
    console.log(_ordersList);
    return _ordersList;
  }

  async orderCreated(order: CreateOrderDto): Promise<Order> {
    const _order = this.ordersRepository.create(order);
    const createdOrder = await this.ordersRepository.save(_order);

    return createdOrder;
  }

  async orderUpdated(order: UpdateOrderDto): Promise<void> {
    const { status, orderId } = order;
    const _findOrder = await this.ordersRepository.findOneBy({ id: orderId });
    if (!_findOrder) {
      throw new NotFoundException('Order not found');
    }

    _findOrder.status = status;
    await this.ordersRepository.save(_findOrder);
  }
}
