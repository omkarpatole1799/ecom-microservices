import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    RabbitMQModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Different port than product service
      username: 'dev',
      password: 'dev123',
      database: 'customer_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
