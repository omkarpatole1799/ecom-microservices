import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDERS_SERVICE_RMQ } from 'src/helpers/constants';
import { Product } from 'src/products/products.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/update-order-status.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @Inject(ORDERS_SERVICE_RMQ) private readonly client: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.customerId = createOrderDto.customerId;
    order.name = createOrderDto.name;
    order.address = createOrderDto.address;
    order.phone = createOrderDto.phone;
    // initial status is pending
    order.status = OrderStatus.PENDING;

    // calculate total amount and create order items
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

        // decrease product stock
        product.stock -= item.quantity;
        await this.productRepository.save(product);

        console.debug(product);

        return orderItem;
      }),
    );

    order.totalAmount = totalAmount;
    order.items = items;

    const savedOrder = await this.orderRepository.save(order);

    // publish order created event
    this.client.emit('order.created', savedOrder);

    return savedOrder;
  }

  async getAllOrders(id: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId: id },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
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
