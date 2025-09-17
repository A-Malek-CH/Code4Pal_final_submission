```markdown
# Users API Documentation

This document describes the API routes defined in `routes/users.py`.

---

## Base URL
All routes are prefixed with:
```

/users

```

---

## **1. List Users**
**Endpoint:**
```

GET /users

````

**Description:**  
Fetch all users.

**Response:**
- **200 OK**
```json
{
  "success": true,
  "data": [ { "id": 1, "email": "test@example.com", ... }, ... ]
}
````

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **2. Get User**

**Endpoint:**

```
GET /users/<user_id>
```

**Description:**
Fetch a specific user by ID.

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "id": 1, "email": "test@example.com", ... }
}
```

* **404 Not Found**

```json
{ "error": "User not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **3. Create User**

**Endpoint:**

```
POST /users/add
```

**Description:**
Creates a new user, sends a confirmation email with a code, and stores a verification record.

**Request Body (JSON):**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**

* **201 Created**

```json
{
  "message": "User created, confirmation code sent",
  "user": { "id": 1, "email": "johndoe@example.com", ... }
}
```

* **400 Bad Request**

```json
{ "error": "Email is required" }
```

* **500 Internal Server Error**

```json
{ "error": "User created but failed to send confirmation email" }
```

or

```json
{ "error": "User created but failed to store verification record" }
```

---

## **4. Verify Email**

**Endpoint:**

```
POST /users/verify_email
```

**Description:**
Verifies a user's email using the confirmation code.

**Request Body (JSON):**

```json
{
  "email": "johndoe@example.com",
  "code": "123456"
}
```

**Response:**

* **200 OK**

```json
{
  "success": true,
  "message": "User email verified successfully",
  "data": { "id": 1, "email": "johndoe@example.com", "is_email_verified": true, "user_type": "registered" }
}
```

* **400 Bad Request**

```json
{ "error": "Email and code are required" }
```

or

```json
{ "error": "Invalid confirmation code" }
```

or

```json
{ "error": "Confirmation code has expired" }
```

* **404 Not Found**

```json
{ "error": "No verification request found for this email" }
```

* **500 Internal Server Error**

```json
{ "error": "Internal server error" }
```

---

## **5. Resend Confirmation Code**

**Endpoint:**

```
POST /users/resend_code
```

**Description:**
Resends a new confirmation code for email verification.

**Request Body (JSON):**

```json
{
  "email": "johndoe@example.com"
}
```

**Response:**

* **200 OK**

```json
{
  "success": true,
  "message": "New confirmation code sent",
  "data": { "user_id": 1, "email": "johndoe@example.com" }
}
```

* **400 Bad Request**

```json
{ "error": "Email is required" }
```

* **404 Not Found**

```json
{ "error": "User not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Failed to send confirmation email" }
```

---

## **6. Update User**

**Endpoint:**

```
PUT /users/<user_id>
```

**Description:**
Update a user's data.

**Request Body (JSON):**

```json
{
  "first_name": "Updated",
  "last_name": "User"
}
```

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "id": 1, "first_name": "Updated", "last_name": "User" }
}
```

* **404 Not Found**

```json
{ "error": "User not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **7. Delete User**

**Endpoint:**

```
DELETE /users/<user_id>
```

**Description:**
Delete a user by ID.

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "message": "User deleted" }
}
```

* **404 Not Found**

```json
{ "error": "User not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

```
```
