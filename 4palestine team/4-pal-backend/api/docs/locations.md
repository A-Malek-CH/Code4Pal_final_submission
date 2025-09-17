```markdown
# Locations API Documentation

This document describes the API routes defined in `routes/locations.py`.

---

## Base URL
All routes are prefixed with:
```

/locations

```

---

## **1. List Locations**
**Endpoint:**
```

GET /locations

````

**Description:**  
Fetch all locations.

**Response:**
- **200 OK**
```json
{
  "success": true,
  "data": [ { "id": 1, "name": "Location A", ... }, ... ]
}
````

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **2. Get Location**

**Endpoint:**

```
GET /locations/<location_id>
```

**Description:**
Fetch a specific location by ID.

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "id": 1, "name": "Location A", ... }
}
```

* **404 Not Found**

```json
{ "error": "Location not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **3. Create Location**

**Endpoint:**

```
POST /locations/add
```

**Description:**
Create a new location and an associated unverified verification record.

**Request Body (JSON):**

```json
{
  "name": "New Location",
  "address": "Somewhere",
  "city": "CityX"
}
```

**Response:**

* **201 Created**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "location_id": 5,
      "status": "unverified"
    }
  ]
}
```

* **400 Bad Request**

```json
{ "error": "Request body is required" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **4. Verify Location**

**Endpoint:**

```
POST /locations/verify
```

**Description:**
Verify or unverify a location. Requires admin privileges.

**Request Body (JSON):**

```json
{
  "location_id": 5,
  "admin_id": 1,
  "status": "verified"
}
```

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "location_id": 5,
      "status": "verified",
      "verified_by": 1
    }
  ]
}
```

* **400 Bad Request**

```json
{ "error": "Verification status, admin_id and location_id are required" }
```

or

```json
{ "error": "Status must be either 'verified' or 'unverified'" }
```

* **403 Forbidden**

```json
{ "error": "Denied, you do not have the necessary permission" }
```

* **404 Not Found**

```json
{ "error": "Location verification record not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **5. Update Location**

**Endpoint:**

```
PUT /locations/<location_id>
```

**Description:**
Update a location by ID.

**Request Body (JSON):**

```json
{
  "name": "Updated Location",
  "city": "Updated City"
}
```

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "id": 5, "name": "Updated Location", "city": "Updated City" }
}
```

* **404 Not Found**

```json
{ "error": "Location not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

---

## **6. Delete Location**

**Endpoint:**

```
DELETE /locations/<location_id>
```

**Description:**
Delete a location by ID.

**Response:**

* **200 OK**

```json
{
  "success": true,
  "data": { "message": "Location deleted" }
}
```

* **404 Not Found**

```json
{ "error": "Location not found" }
```

* **500 Internal Server Error**

```json
{ "error": "Error message" }
```

```
```
