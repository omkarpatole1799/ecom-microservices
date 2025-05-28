import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { successResponse } from 'src/helpers/response.helper';
import { ApiResponse } from 'src/types/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.ordersService.createOrder(createOrderDto);
    return successResponse(order, 'Successfuly placed new order');
  }
}
