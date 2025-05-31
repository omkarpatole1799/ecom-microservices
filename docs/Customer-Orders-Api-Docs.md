# API documentation

### Product Order Service

-   Base URL : `http://localhost:3001`
    [Note only applicable if running locally]

## Create Order

### Endpoint

`POST`

`/orders`

### Request Body

```
{
    "customerId": "2e81718f-4bbc-4de6-9de3-4aff0b69be35",
    "items": [
        {
            "productId": "7a66de9b-32c7-4dc0-917f-cf6b30e379f2",
            "quantity": 1
        }
    ],
    "address": "test address",
    "name": "omkar patole",
    "phone" :"7020235565"
}
```

### Success Response

```
Code : 201

{
    "success": true,
    "usrMsg": "Successfully placed new order",
    "data": {
        "id": "af8743e6-2b34-4e37-b199-0e1ebc74f695",
        "customerId": "2e81718f-4bbc-4de6-9de3-4aff0b69be35",
        "totalAmount": 1,
        "status": "pending",
        "items": [
            {
                "id": "015af4c9-bac7-45d1-8e53-ff2ca68b8a31",
                "productId": "7a66de9b-32c7-4dc0-917f-cf6b30e379f2",
                "quantity": 1,
                "price": "1"
            }
        ],
        "address": "test address",
        "name": "Teri O'Hara",
        "phone": "722-878-5883",
        "createdAt": "2025-05-31T00:21:40.078Z",
        "updatedAt": "2025-05-31T00:21:40.078Z"
    }
}
```

### Error Response

```
Code: 400

- The error message will be field specific applicable for all request body fields

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Please enter valid mobile number"
}

- For Invalid Bearer Token (JWT token)

Code : 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

---

---

## Get Order By Customer Id

[Note: The API is available in both `Customer Service` and `Product Order Service`]

-   In `Customer Service` it will only return basic info about the order
-   In `Product Order Service` it will return all details of order including items and the quantity

### Endpoint [For Product-Order-Service]

`GET`

`/orders/:id`

### Success Response

```
Code : 201

{
    "success": true,
    "usrMsg": "Successfully placed new order",
    "data": {
        "id": "af8743e6-2b34-4e37-b199-0e1ebc74f695",
        "customerId": "2e81718f-4bbc-4de6-9de3-4aff0b69be35",
        "totalAmount": 1,
        "status": "pending",
        "items": [
            {
                "id": "015af4c9-bac7-45d1-8e53-ff2ca68b8a31",
                "productId": "7a66de9b-32c7-4dc0-917f-cf6b30e379f2",
                "quantity": 1,
                "price": "1"
            }
        ],
        "address": "test address",
        "name": "Teri O'Hara",
        "phone": "722-878-5883",
        "createdAt": "2025-05-31T00:21:40.078Z",
        "updatedAt": "2025-05-31T00:21:40.078Z"
    }
}
```

### Error Response

```
Code: 400

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "No orders found"
}

- For Invalid Bearer Token (JWT token)

Code : 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

### Endpoint [For Customer Service]

`GET`

`/orders/:id`

### Success Response

```
Code : 201

[
    {
        "id": "84aaf14c-7209-4f5e-a7c3-9433cc9c2fd6",
        "customerId": "2e81718f-4bbc-4de6-9de3-4aff0b69be35",
        "totalAmount": "1.00",
        "status": "cancelled",
        "address": "test address",
        "name": "Luis Hirthe",
        "phone": "573-372-8742",
        "createdAt": "2025-05-30T12:38:08.071Z",
        "updatedAt": "2025-05-30T12:38:08.071Z"
    },
    // ...rest of the orders
]
```

### Error Response

```
Code: 400

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "No orders found"
}

- For Invalid Bearer Token (JWT token)

Code : 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

---

---

# Update Order Status

### Endpoint

`PATCH`

`/orders/:id/status`

### Request Body

```
{
    "status": "delivered" | "pending" | "processing" | "shipped" | "cancelled"
}

```

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully updated order status"
}
```

### Error Response

```
Code: 400

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "status must be one of the following values: pending, processing, shipped, delivered, cancelled"
}

- For Invalid Bearer Token (JWT token)

Code : 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

---

---

# Cancel Order

### Endpoint

`PATCH`

`/orders/:id/cancel`

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully cancelled order"
}
```

### Error Response

```
Code: 404

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Order not found"
}

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Cannot cancel delivered order"
}

- For Invalid Bearer Token (JWT token)

Code : 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```
