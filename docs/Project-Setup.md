### Project Setup

-   To run project locally follow the following instructions.

1. Clone repository

```
git clone https://github.com/omkarpatole1799/ecom-microservices.git
```

2. Install packages and run project

### Customer Service

```
cd customer-service
npm install
npm run start:dev

// It will get start on port number 3000
```

### Product-Order-Service

```
cd product-order-service
npm install

// It will get start on port number 3001
```

### Client

```
cd frontend
npm install

// It will get start on port number 3002
```

### Docker

```
docker-compose up -d

// It will start the RabbmitMQ and postgres database for both the services
```
