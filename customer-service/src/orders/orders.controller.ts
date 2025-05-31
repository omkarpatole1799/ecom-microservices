import { Controller, Get, Param } from '@nestjs/common';
import { GetOrderByIdDto } from './dto/get-orders-by-id.dto';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_CREATED, ORDER_UPDATED } from 'src/helpers/constants';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './dto/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  getOrders(@Param('id') id: string): Promise<Order[]> {
    return this.ordersService.getOrdersById(id);
  }

  // orders related
  @MessagePattern(ORDER_CREATED)
  async handleOrderCreated(@Payload() order: CreateOrderDto): Promise<void> {
    console.log('Order is crated');
    console.log(order, 'created');
    await this.ordersService.orderCreated(order);
  }

  @MessagePattern(ORDER_UPDATED)
  async handleOrderUpdated(@Payload() order: UpdateOrderDto): Promise<void> {
    console.log('Order is crated');
    console.log(order, 'created');
    await this.ordersService.orderUpdated(order);
  }
}
