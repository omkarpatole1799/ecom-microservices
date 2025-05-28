import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/products/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

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
    order.status = 'pending';

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
        return orderItem;
      }),
    );

    order.totalAmount = totalAmount;
    order.items = items;

    return await this.orderRepository.save(order);
  }
}
