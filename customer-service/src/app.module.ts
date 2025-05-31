import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    RabbitMQModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Different port than product service
      username: 'postgres',
      password: 'postgres',
      database: 'customer_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CustomersModule,
    OrdersModule,
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
