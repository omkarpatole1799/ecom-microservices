import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from 'src/products/products.module';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    RabbitMQModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
