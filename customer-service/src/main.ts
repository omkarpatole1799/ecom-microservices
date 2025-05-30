import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './helpers/http-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERS_QUEUE } from './helpers/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const PORT = process.env.PORT ?? 3000;
  console.log(`Customer service is running on port ${PORT}`);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);

  const microservices = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: ORDERS_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
