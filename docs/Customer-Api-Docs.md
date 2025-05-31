# API documentation (Auth / Register)

### Customer Service

-   Base URL : `http://localhost:3000`
    [Note: Only valid if your running locally]

## Login

### Endpoint

`POST`

`/customers/login`

### Request Body

```
{
    "email": "omkar@gmail.com",
    "password": "Om#010799"
}
```

### Success Response

```
Code : 201

{
    "success": true,
    "usrMsg": "Successfully logged in",
    "data": {
        "customer": {
            "id": "ccf52e51-f4a1-4cb4-91a1-10a85ed9e6e2",
            "name": "Omkar Patole",
            "email": "omkar@gmail.com"
        },
        "token": "<token>"
    }
}
```

### Error Response

```
Code: 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid credentials"
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

## Register (Signup)

### Endpoint

`POST`

`/customers/register`

### Request Body

```
{
    "name": "omkar patole",
    "email": "omkar@gmail.com",
    "address": "Nashik, Maharashtra",
    "phone": "7020235565",
    "password": "Test@1234"
}
```

### Success Response

```
Code : 201

{
    "success": true,
    "usrMsg": "Successfully created new customer",
    "data": {
        "id": "2d6dba5b-9e92-4e0f-868f-be5c39f7b23e",
        "name": "omkar patole",
        "email": "omkar@gmail.com",
        "address": "Nashik, Maharashtra",
        "phone": "7020235565",
        "createdAt": "2025-05-30T23:41:42.221Z",
        "updatedAt": "2025-05-30T23:41:42.221Z"
    }
}
```

### Error Response

```
Code: 400

- Return the field name and the error message(eg. required or validation failed for the particular field)

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Password is required"
}
```

---

---

## Update (User)

### Endpoint

`PATCH`

`/customers/:id`

### Request Body

```
{
    "name": "Suraj Ghodke",
    "email": "suraj1@email.com",
    "address": "Nashik",
    "phone": "7020235565",
    "password": "Test@1234"
}
```

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully updated customer",
    "data": {
        "id": "e126d03b-de25-4eb0-b7ee-d09de8aa04c6",
        "name": "Suraj Ghodke",
        "email": "suraj1@email.com",
        "address": "Nashik",
        "phone": "7020235565",
        "password": "Test@1234",
        "createdAt": "2025-05-30T23:45:39.048Z",
        "updatedAt": "2025-05-30T23:45:39.048Z"
    }
}
```

### Error Response

```
Code: 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

---

---

## Delete (User)

### Endpoint

`DELETE`

`/customers/:id`

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully deleted customer",
    "data": null
}
```

### Error Response

```
Code: 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```

---

---

## Get By ID (User)

### Endpoint

`GET`

`/customers/:id`

### Success Response

```
Code : 200

{
    "success": true,
    "usrMsg": "Successfully retrieved customer",
    "data": {
        "id": "31abb94e-f316-4260-b77c-9952e993f4ec",
        "name": "Price.Runolfsson",
        "email": "omkar@gmail.com",
        "address": "382 Samantha Summit",
        "phone": "576-293-9384",
        "createdAt": "2025-05-30T23:48:11.578Z",
        "updatedAt": "2025-05-30T23:48:11.578Z"
    }
}
```

### Error Response

```
Code: 401

{
    "success": false,
    "usrMsg": "An error occurred",
    "errMsg": "Invalid token"
}
```
