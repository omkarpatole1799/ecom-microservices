# API documentation [Product API]

### Product Order Service

-   Base URL : `http://localhost:3001`
    [Note only applicable if running locally]

## Create Product

### Endpoint

`POST`

`/products`

### Request Body

```
{
    "name" : "My Product",
    "description":  "My product description",
    "price": 19.99,
    "stock": 200
}
```

### Success Response

```
Code : 201

{
    "success": true,
    "usrMsg": "Successfully created product.",
    "data": {
        "id": "fbe0df08-c096-4968-9599-cffc85afe1fa",
        "name": "Tasty Steel Ball",
        "description": "Repellat sapiente nesciunt aut dolorem rerum rem. Odio ea exercitationem maiores dolorem. Et id minus dolor tempora est repellat enim libero unde. Autem adipisci ipsa placeat voluptate culpa occaecati error.",
        "price": 595.93,
        "stock": 20,
        "isActive": true,
        "createdAt": "2025-05-31T00:42:07.776Z",
        "updatedAt": "2025-05-31T00:42:07.776Z"
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
    "errMsg": "Product stock should be positive"
}

```

---

---

# Update Product

### Endpoint

`PUT`

`/products/:id`

### Request Body

```
{
    "name" : "Woodland shoe 2.1",
    "description":  "Rought and tough shoe",
    "price": 19.99,
    "stock": 100
}
```

### Success Response

```
Code : 200

{
    "id": "88e13fef-0f2b-48fc-b2ef-59e71136cdb7",
    "name": "Woodland shoe 2.1",
    "description": "Rought and tough shoe",
    "price": 19.99,
    "stock": 100,
    "isActive": true,
    "createdAt": "2025-05-29T09:08:08.613Z",
    "updatedAt": "2025-05-29T09:08:08.613Z"
}
```

### Error Response

```
Code: 400

- The error message will be field specific applicable for all request body fields

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Product stock should be positive"
}

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Product not found"
}

```

---

---

## All Products

### Endpoint

`GET`

`/products`

### Success Response

```
Code : 200

[
    {
        "id": "3f610bdc-1938-4830-9c9b-f41aeda49665",
        "name": "Unbranded Soft Towels",
        "description": "Sunt et quia dolor hic aut illum aliquam suscipit doloremque. Eos dicta temporibus dolor autem magni voluptas eaque commodi. Et laborum inventore vel velit voluptas tempore.",
        "price": "240",
        "stock": 88,
        "isActive": true,
        "createdAt": "2025-05-29T09:08:09.051Z",
        "updatedAt": "2025-05-29T09:08:09.051Z"
    },
    // ... rest of the products
]
```

### Error Response

```
Code: 404


{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "No products found"
}

```

---

---

## Product By Id

### Endpoint

`GET`

`/products/:id`

### Success Response

```
Code : 200

{
    "id": "3f610bdc-1938-4830-9c9b-f41aeda49665",
    "name": "Unbranded Soft Towels",
    "description": "Sunt et quia dolor hic aut illum aliquam suscipit doloremque. Eos dicta temporibus dolor autem magni voluptas eaque commodi. Et laborum inventore vel velit voluptas tempore.",
    "price": "240",
    "stock": 88,
    "isActive": true,
    "createdAt": "2025-05-29T09:08:09.051Z",
    "updatedAt": "2025-05-29T09:08:09.051Z"
}
```

### Error Response

```
Code: 404


{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "No product found"
}

```

---

---

## Delete Product By Id

### Endpoint

`DELETE`

`/products/:id`

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully deleted",
    "data": null
}
```

### Error Response

```
Code: 404


{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "No product found"
}

```
