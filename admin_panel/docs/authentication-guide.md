# Authentication API Guide

## Base URL
```
http://localhost:3000/api/auth
```

---

## Endpoints

### 1. Register
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "PUBLIC_USER",
    "createdAt": "2026-04-01T07:00:00.000Z"
  },
  "message": "Registration successful. You can now sign in."
}
```

**Error (409):** User already exists
```json
{
  "success": false,
  "data": null,
  "message": "User with this email already exists"
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PUBLIC_USER",
    "profilePhoto": null,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "Login successful"
}
```

**Error (401):** Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error (403):** Account suspended
```json
{
  "success": false,
  "message": "Account is suspended or banned"
}
```

---

### 3. Refresh Token
**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "Token refreshed successfully"
}
```

**Error (400):** Missing refresh token
```json
{
  "success": false,
  "data": null,
  "message": "Refresh token is required"
}
```

**Error (401):** Invalid or expired token
```json
{
  "success": false,
  "data": null,
  "message": "Invalid or expired refresh token"
}
```

---

## Handling Refresh Token

The access token expires in **15 minutes** (900 seconds). Use the refresh token to get a new one before it expires.

### Flow:
1. Store both `accessToken` and `refreshToken` from login response
2. Use `accessToken` in Authorization header for API requests
3. When `expiresIn` approaches or access token fails, call refresh-token endpoint
4. Replace old tokens with new ones from refresh response

### Authorization Header:
```
Authorization: Bearer <accessToken>
```

### Example:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use access token
curl -X GET http://localhost:3000/api/articles \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Refresh when needed
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

---

## User Roles

| Role | Description |
|------|-------------|
| PUBLIC_USER | Regular user |
| AUTHOR | Content creator |
| ADMIN | Moderator |
| SUPERADMIN | Full admin |
