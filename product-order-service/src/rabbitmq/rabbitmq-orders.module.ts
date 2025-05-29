import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_QUEUE, ORDERS_SERVICE_RMQ } from 'src/helpers/constants';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE_RMQ,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI || 'amqp://localhost:5672'],
          queue: ORDERS_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitOrdersMQModule {}
