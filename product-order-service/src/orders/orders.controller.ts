import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { successResponse } from 'src/helpers/response.helper';
import { ApiResponse } from 'src/types/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.ordersService.createOrder(createOrderDto);
    return successResponse(order, 'Successfully placed new order');
  }

  @Get()
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    const orders = await this.ordersService.getAllOrders();
    return successResponse(orders, 'Successfully retrieved all orders');
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<ApiResponse<Order>> {
    const order = await this.ordersService.getOrderById(id);
    return successResponse(order, 'Successfully retrieved order');
  }

  @Get('customer/:customerId')
  async getCustomerOrders(
    @Param('customerId') customerId: string,
  ): Promise<ApiResponse<Order[]>> {
    const orders = await this.ordersService.getCustomerOrders(customerId);
    return successResponse(orders, 'Successfully retrieved customer orders');
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.ordersService.updateOrderStatus(
      id,
      updateOrderStatusDto.status,
    );
    return successResponse(order, 'Successfully updated order status');
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string): Promise<ApiResponse<Order>> {
    const order = await this.ordersService.cancelOrder(id);
    return successResponse(order, 'Successfully cancelled order');
  }
}
