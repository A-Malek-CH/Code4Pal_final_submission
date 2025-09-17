# 4PAL Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Token Types
- **User Tokens**: Access regular user endpoints
- **Contributor Tokens**: Access contributor-specific endpoints  
- **Admin Tokens**: Full access to all endpoints including user/contributor management

Admin tokens are obtained through separate admin authentication endpoints (`/admin/auth/*`) and provide elevated privileges including the ability to update/delete any user or contributor account.

---

# Authentication Endpoints

## 1. User Registration
**POST** `/auth/register/user`

Register a new user account.

### Request Body
```json
{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "preferred_language": "en"
}
```

### Response
**Status: 201 Created**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "+1234567890",
            "user_type": "registered",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:24.157588",
            "created_at": "2025-09-16T00:03:24.157588"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "ADDpTOP6zo6zopiQonNtvWbftZmRZ1Oi...",
        "token_type": "Bearer"
    }
}
```

### Error Responses
**Status: 400 Bad Request**
```json
{
    "success": false,
    "message": "Email and password are required"
}
```

**Status: 409 Conflict**
```json
{
    "success": false,
    "message": "User with this email already exists"
}
```

---

## 2. Contributor Registration
**POST** `/auth/register/contributor`

Register a new contributor account.

### Request Body
```json
{
    "email": "contributor@example.com",
    "password": "securepassword123",
    "first_name": "Jane",
    "last_name": "Smith",
    "contributor_type": "individual",
    "motivation": "I want to help my community"
}
```

### Response
**Status: 201 Created**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 2,
            "email": "contributor@example.com",
            "first_name": "Jane",
            "last_name": "Smith",
            "phone_number": null,
            "user_type": "contributor",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:25.085478",
            "created_at": "2025-09-16T00:03:25.085478"
        },
        "contributor": {
            "id": 1,
            "user_id": 2,
            "contributor_type": "individual",
            "verification_status": "pending",
            "verified": false,
            "motivation": "I want to help my community",
            "created_at": "2025-09-16T00:03:25.393452"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "ls40vkKvS_D5P9I6ELDkMT0fsh9YaqH4...",
        "token_type": "Bearer"
    }
}
```

### Error Responses
**Status: 400 Bad Request**
```json
{
    "success": false,
    "message": "Email, password, and contributor_type are required"
}
```

---

## 3. User Login
**POST** `/auth/login/user`

Authenticate a user.

### Request Body
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "+1234567890",
            "user_type": "registered",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:24.157588",
            "created_at": "2025-09-16T00:03:24.157588"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "IVVYNY10lMzxfcx-RHBsNx1RUKLBP4NE...",
        "token_type": "Bearer"
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

---

## 4. Contributor Login
**POST** `/auth/login/contributor`

Authenticate a contributor.

### Request Body
```json
{
    "email": "contributor@example.com",
    "password": "securepassword123"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 2,
            "email": "contributor@example.com",
            "first_name": "Jane",
            "last_name": "Smith",
            "phone_number": null,
            "user_type": "contributor",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:25.085478",
            "created_at": "2025-09-16T00:03:25.085478"
        },
        "contributor": {
            "id": 1,
            "user_id": 2,
            "contributor_type": "individual",
            "verification_status": "approved",
            "verified": true,
            "motivation": "I want to help my community",
            "created_at": "2025-09-16T00:03:25.393452"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "ls40vkKvS_D5P9I6ELDkMT0fsh9YaqH4...",
        "token_type": "Bearer"
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

**Status: 403 Forbidden**
```json
{
    "success": false,
    "message": "Contributor account is not verified yet"
}
```

---

## 5. Token Refresh
**POST** `/auth/refresh`

Get a new access token using a refresh token.

### Request Body
```json
{
    "refresh_token": "your-refresh-token-here"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "Bearer"
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Invalid or expired refresh token"
}
```

---

## 6. Logout
**POST** `/auth/logout`

Invalidate a refresh token (logout).

### Headers
```
Authorization: Bearer <access_token>
```

### Request Body
```json
{
    "refresh_token": "your-refresh-token-here"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "Logged out successfully"
    }
}
```

---

## 7. Get Current User
**GET** `/auth/me`

Get information about the currently authenticated user.

### Headers
```
Authorization: Bearer <access_token>
```

### Response (User)
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "+1234567890",
            "user_type": "registered",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:24.157588",
            "created_at": "2025-09-16T00:03:24.157588"
        }
    }
}
```

### Response (Contributor)
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "user": {
            "id": 2,
            "email": "contributor@example.com",
            "first_name": "Jane",
            "last_name": "Smith",
            "phone_number": null,
            "user_type": "contributor",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:25.085478",
            "created_at": "2025-09-16T00:03:25.085478"
        },
        "contributor": {
            "id": 1,
            "user_id": 2,
            "contributor_type": "individual",
            "verification_status": "approved",
            "verified": true,
            "motivation": "I want to help my community",
            "created_at": "2025-09-16T00:03:25.393452"
        }
    }
}
```

---

## 8. Change Password
**POST** `/auth/change-password`

Change password for authenticated user or contributor.

### Headers
```
Authorization: Bearer <access_token>
```

### Request Body
```json
{
    "current_password": "oldpassword123",
    "new_password": "newpassword456"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "Password changed successfully"
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Current password is incorrect"
}
```

---

# Admin Authentication Endpoints

## 9. Admin Login
**POST** `/admin/auth/login`

Admin login with email and password. Returns both access and refresh tokens.

### Request Body
```json
{
    "email": "admin@example.com",
    "password": "adminpassword123"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "def502004a7b8c9d1e2f3g4h5i6j7k8l9m0n1o2p...",
        "admin": {
            "id": 1,
            "email": "admin@example.com",
            "name": "Admin User"
        }
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

---

## 10. Admin Profile
**GET** `/admin/auth/profile`

Get admin profile information.

### Headers
```
Authorization: Bearer <admin_access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "admin": {
            "id": 1,
            "email": "admin@example.com",
            "name": "Admin User"
        }
    }
}
```

---

## 11. Admin Token Refresh
**POST** `/admin/auth/refresh`

Refresh admin access token using refresh token.

### Request Body
```json
{
    "refresh_token": "def502004a7b8c9d1e2f3g4h5i6j7k8l9m0n1o2p..."
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "admin": {
            "id": 1,
            "email": "admin@example.com",
            "name": "Admin User"
        }
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Invalid or expired refresh token"
}
```

---

## 12. Admin Logout
**POST** `/admin/auth/logout`

Admin logout - invalidates the refresh token.

### Headers
```
Authorization: Bearer <admin_access_token>
```

### Request Body
```json
{
    "refresh_token": "def502004a7b8c9d1e2f3g4h5i6j7k8l9m0n1o2p..."
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "Logged out successfully"
    }
}
```

---

## 13. Admin Change Password
**POST** `/admin/auth/change-password`

Change admin password.

### Headers
```
Authorization: Bearer <admin_access_token>
```

### Request Body
```json
{
    "current_password": "oldadminpassword",
    "new_password": "newadminpassword123"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "Password changed successfully"
    }
}
```

### Error Responses
**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "Current password is incorrect"
}
```

**Status: 400 Bad Request**
```json
{
    "success": false,
    "message": "New password must be at least 8 characters long"
}
```

---

# User Management Endpoints

## 14. List Users
**GET** `/users`

Get list of all users (protected route).

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": [
        {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "+1234567890",
            "user_type": "registered",
            "is_email_verified": false,
            "is_phone_verified": false,
            "preferred_language": "en",
            "registration_date": "2025-09-16T00:03:24.157588",
            "created_at": "2025-09-16T00:03:24.157588"
        }
    ]
}
```

---

## 15. Get User by ID
**GET** `/users/{user_id}`

Get specific user by ID (protected route).

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "+1234567890",
        "user_type": "registered",
        "is_email_verified": false,
        "is_phone_verified": false,
        "preferred_language": "en",
        "registration_date": "2025-09-16T00:03:24.157588",
        "created_at": "2025-09-16T00:03:24.157588"
    }
}
```

### Error Responses
**Status: 404 Not Found**
```json
{
    "success": false,
    "message": "User not found"
}
```

---

## 16. Update User
**PUT** `/users/{user_id}`

Update user information. Users can only update their own profile, but admins can update any user and modify restricted fields like `user_type`.

### Headers
```
Authorization: Bearer <access_token>
```

### Request Body
```json
{
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "phone_number": "+9876543210",
    "preferred_language": "fr"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John Updated",
        "last_name": "Doe Updated",
        "phone_number": "+9876543210",
        "user_type": "registered",
        "is_email_verified": false,
        "is_phone_verified": false,
        "preferred_language": "fr",
        "registration_date": "2025-09-16T00:03:24.157588",
        "created_at": "2025-09-16T00:03:24.157588"
    }
}
```

### Error Responses
**Status: 403 Forbidden**
```json
{
    "success": false,
    "message": "Unauthorized to update this user"
}
```

---

## 17. Delete User
**DELETE** `/users/{user_id}`

Delete user account. Users can only delete their own profile, but admins can delete any user account.

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "User deleted"
    }
}
```

### Error Responses
**Status: 403 Forbidden**
```json
{
    "success": false,
    "message": "Unauthorized to delete this user"
}
```

---

# Contributor Management Endpoints

## 18. List Contributors
**GET** `/contributors`

Get list of all contributors (protected route).

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": [
        {
            "id": 1,
            "user_id": 2,
            "contributor_type": "individual",
            "verification_status": "approved",
            "verified": true,
            "motivation": "I want to help my community",
            "created_at": "2025-09-16T00:03:25.393452"
        }
    ]
}
```

---

## 19. Get Contributor by ID
**GET** `/contributors/{contributor_id}`

Get specific contributor by ID (protected route).

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "id": 1,
        "user_id": 2,
        "contributor_type": "individual",
        "verification_status": "approved",
        "verified": true,
        "motivation": "I want to help my community",
        "created_at": "2025-09-16T00:03:25.393452"
    }
}
```

---

## 20. Update Contributor
**PUT** `/contributors/{contributor_id}`

Update contributor information. Contributors can only update their own profile, but admins can update any contributor and modify restricted fields like `verification_status` and `verified`.

### Headers
```
Authorization: Bearer <access_token>
```

### Request Body
```json
{
    "motivation": "Updated motivation text",
    "contributor_type": "organization"
}
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "id": 1,
        "user_id": 2,
        "contributor_type": "organization",
        "verification_status": "approved",
        "verified": true,
        "motivation": "Updated motivation text",
        "created_at": "2025-09-16T00:03:25.393452"
    }
}
```

---

## 21. Delete Contributor
**DELETE** `/contributors/{contributor_id}`

Delete contributor account. Contributors can only delete their own profile, but admins can delete any contributor account.

### Headers
```
Authorization: Bearer <access_token>
```

### Response
**Status: 200 OK**
```json
{
    "success": true,
    "message": null,
    "data": {
        "message": "Contributor deleted"
    }
}
```

---

# Common Error Responses

## Authentication Errors

**Status: 401 Unauthorized**
```json
{
    "success": false,
    "message": "No token provided"
}
```

```json
{
    "success": false,
    "message": "Token has expired"
}
```

```json
{
    "success": false,
    "message": "Invalid token"
}
```

**Status: 403 Forbidden**
```json
{
    "success": false,
    "message": "Insufficient permissions"
}
```

## Validation Errors

**Status: 400 Bad Request**
```json
{
    "success": false,
    "message": "Password must be at least 8 characters long"
}
```

```json
{
    "success": false,
    "message": "Invalid contributor type"
}
```

## Server Errors

**Status: 500 Internal Server Error**
```json
{
    "success": false,
    "message": "Internal server error"
}
```

---

# Frontend Integration Guide

## 1. Authentication Flow

### Registration/Login
```javascript
// User Registration
const registerUser = async (userData) => {
    const response = await fetch('http://localhost:5000/api/auth/register/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    
    if (response.status === 201) {
        const data = await response.json();
        // Store tokens securely
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        return data.data;
    }
    
    throw new Error('Registration failed');
};

// User Login
const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        return data.data;
    }
    
    throw new Error('Login failed');
};
```

### Making Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
    
    if (response.status === 401) {
        // Token expired, try refresh
        const refreshed = await refreshToken();
        if (refreshed) {
            // Retry original request
            return makeAuthenticatedRequest(url, options);
        } else {
            // Redirect to login
            window.location.href = '/login';
            return;
        }
    }
    
    return response;
};
```

### Token Refresh
```javascript
const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        
        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    // Refresh failed, clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
};
```

### Logout
```javascript
const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    
    try {
        await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
    } catch (error) {
        console.error('Logout request failed:', error);
    }
    
    // Clear tokens regardless of request success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
};
```

## 2. Status Code Handling

```javascript
const handleApiResponse = async (response) => {
    switch (response.status) {
        case 200:
            return await response.json();
        case 201:
            return await response.json();
        case 400:
            const error400 = await response.json();
            throw new Error(error400.message);
        case 401:
            // Handle authentication error
            await refreshToken() || redirectToLogin();
            break;
        case 403:
            throw new Error('Insufficient permissions');
        case 404:
            throw new Error('Resource not found');
        case 409:
            const error409 = await response.json();
            throw new Error(error409.message);
        case 500:
            throw new Error('Server error. Please try again later.');
        default:
            throw new Error('Unexpected error occurred');
    }
};
```

This documentation provides exact status codes, request/response formats, and frontend integration examples to make your frontend development smooth and consistent! 🚀