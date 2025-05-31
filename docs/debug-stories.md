# Omakr Patole - My Debugging Stories

Here are some of the problems I faced while working on the e-commerce system using NestJS microservices, and how I solved them.

# Story: Understanding the Project's Architecture

**What happened:**  
When I first read the assignment, I was not sure how to structure the two microservices or how RabbitMQ would be used to send messages between them.

**What I did:**  
I carefully read the assignment requirements again and noted that there were two separate services: one for Product and Order, and one for Customer. I realized that each of them would have their own database and only communicate through RabbitMQ.

To get a better picture, I drew a simple diagram on paper showing how data would move when a customer places an order. I also watched a few YouTube videos explaining how microservices can talk to each other using RabbitMQ.

refLinks:

1. https://youtu.be/j2S2gBoT7qc?si=tfJhaEtfok2m8ECk
2. https://youtu.be/JJrFm8IrYTQ?si=7DYs9AAEQkxcJ6um

**Solution:**  
This helped me understand that:

-   Product and Order data should be handled in one service
-   Customer data should be handled in another service
-   RabbitMQ can be used to send an event from the order service to the customer service after an order is placed

After this, the structure of the project became much clearer and I could start building the services confidently.

---

---

## Story : Using TypeORM

**What happened:**  
At first, I was really confused about how to use TypeORM to insert data into the database. I wasn’t sure how to create records, how to use save() properly, I also got stuck when trying to seed data with relationships.

**What I did:**  
I explored examples on stack overflow and learned that TypeORM repositories let me create entity instances and save them asynchronously with await repository.save().

---

---

## Story : CORS Issue from Frontend

**What happened:**  
My frontend app couldn’t call the backend API because of a CORS error.

**What I did:**  
I realized I was using `NestFactory.createMicroservice()` which doesn’t allow setting CORS.
But I also wanted to setup a microservice because to connect with RabbitMQ

**Solution:**  
So, I have search on some stack overflow surveys and found the following solutions
I have updatd code to this:

```ts
const app = await NestFactory.create(AppModule);

app.enableCors();
const PORT = process.env.PORT ?? 3000;
console.log(`Customer service is running on port ${PORT}`);
await app.listen(PORT);

const microservices = await app.connectMicroservice<MicroserviceOptions>({
    //configs
});

await app.startAllMicroservices();
```

---

---

## Story: `OrderRepository` Not Found in AppModule

**What happened:**  
I tried to use `OrderRepository` (from TypeORM) in `AppService`, but NestJS threw a runtime error saying the provider was not found.

**What I did:**  
I checked and confirmed that `Order` was registered via `TypeOrmModule.forFeature([Order])` in `OrdersModule`, but it wasn't accessible in `AppModule`.

**Solution:**  
I realized that `OrdersModule` didn’t export the `TypeOrmModule`, so `Repository<Order>` wasn’t available to `AppModule`. I fixed it by updating `OrdersModule` like this:

```ts
@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [TypeOrmModule], // ✅ now available to AppModule
})
export class OrdersModule {}
```

---

---

## Story : Faker FullName Error

**What happened:**  
I was using `faker.person.fullName()` and got this error:  
`TypeError: e.every is not a function`

**What I did:**  
I looked into the issue and found that newer versions of faker need a `sex` value when calling `fullName()`.

**Solution:**  
I tried adding:

```ts
faker.person.fullName({ sex: 'male' });
```

But still the same error is poping up. (I didnt found any solution)

---

## Story : RabbitMQ Messages Not Being Received

**What happened:**  
When an order was placed, the customer microservice didn’t receive the event.

**What I did:**  
I checked my RabbitMQ configuration and saw that the event names didn’t match between services.

**Solution:**  
I updated the listener like this:

```ts
@EventPattern(ORDER_CREATED)
async handleOrderCreated(@Payload() order: CreateOrderDto): Promise<void> {

}
```

---

---

## Story : Foreign Key Not Deleting Related Data

**What happened:**  
When I deleted a orders table the order items related to that order were still in the database. As there was a relation between them.
**What I did:**  
I found that I needed to set `onDelete: 'CASCADE'` in my entity.
**Solution:**  
I added this:

```ts
 @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
```

---

## Story : Seeding Data path issues

**What happened:**  
When I was making seed data due to `seed.ts` was not a nest module it was not recognizing the import paths

**What I did:**  
So I checked the path and updated to the relative paths

```ts
eg.
import { Customer } from '../customers/entities/customer.entity';
```

---

These are just a few examples of the problems I faced and how I fixed them while building this project. I learned a lot through trial and error.
