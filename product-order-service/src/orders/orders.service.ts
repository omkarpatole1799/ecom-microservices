import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/products/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.customerId = createOrderDto.customerId;
    // initial status is pending
    order.status = OrderStatus.PENDING;

    // Calculate total amount and create order items
    let totalAmount = 0;
    const items = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(`Product not found`);
        }

        if (product.stock < item.quantity) {
          throw new ConflictException(
            `Product ${product.name} has only ${product.stock} items in stock`,
          );
        }

        const orderItem = new OrderItem();
        orderItem.productId = item.productId;
        orderItem.quantity = item.quantity;
        orderItem.price = product.price;

        totalAmount += product.price * item.quantity;

        // Decrease product stock
        product.stock -= item.quantity;
        await this.productRepository.save(product);

        console.debug(product);

        return orderItem;
      }),
    );

    order.totalAmount = totalAmount;
    order.items = items;

    return await this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
    });
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);

    // Validate status transition
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update status of cancelled order');
    }
    if (
      order.status === OrderStatus.DELIVERED &&
      status !== OrderStatus.DELIVERED
    ) {
      throw new BadRequestException('Cannot update status of delivered order');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'], // Ensure items are loaded
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered order');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore product stock when order is cancelled
    await Promise.all(
      order.items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (product) {
          product.stock += item.quantity;
          await this.productRepository.save(product);
          console.debug(
            `Restored ${item.quantity} items to product ${product.name} (${product.id}). New stock: ${product.stock}`,
          );
        }
      }),
    );

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
