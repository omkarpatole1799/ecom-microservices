import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('customers/login', 'customers/register') // Don't protect these routes
      .forRoutes(CustomersController);
  }
}
