## Overview

### Frontend

-   Written in `Next.js`
-   Responsible for login, registration, products view, cart view, checkout order, orders history

### Backend

-   Written in `Nest.js`
-   Consists of two microservices
    `Product Order Service`
    &
    `Customer Service`
-   Uses `Rabbit MQ` for communication between microservices

### Database

-   `Postgres` databse with `TypeORM` for wrting queries

### Docker

-   For `Rabbit MQ`
-   For `Postgres` DB

---

### Project flow

-   User can login, register, view products, view cart, checkout, view orders list and status of orders.
-   When user adds items to the cart an API is called in product-order-service which stores the information of cart-items.
-   When user checks out the order he enters the information about the delivery location and basic contact information and API is called of product-order-service which checks and validates the information, stock availablity of the product and places order.
-   After order is placed the the product-order-service emits the event in RabbitMQ about order placed.
-   Customer-Service is listening for the same event triggered by product-order-service and saves the basic order infromation into database.
-   Simillary, when order status gets updated the event is triggered again by product-order-service and customer-order service listenes the event and updates the order status in to database.

---

## Backend Services

### Customer Service

-   Responsible for login, registration, orders CRUD operations

### Product Order Service

-   Responsible for registration of product, order placement, product stock validations

---

### Overview [Order]

1. Client [Places order] ==>
2. Product Order Service [Process order and product stock validations] ==>
3. RabbmitMQ[Listens events] ==>
4. Customer Service[Stores information about the order and status updates]

### Overview [Login]

1. Client [Login request] ==>
2. Customer Service [Validates and sanitize the information & checks if user exsists] ==>
3. Generate JWT token ==>
4. Client [Receives JWT token and logs in the user]

### Overview [Register]

1. Client [Register request] ==>
2. Customer Service [Validates and sanitize the information & saved the information to database] ==> send response about registration
