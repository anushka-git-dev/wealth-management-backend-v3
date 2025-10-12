# API Routes Documentation

## Overview
This document describes all API routes available in the Wealth Management application, including endpoints, HTTP methods, authentication requirements, and request/response formats.

## Route Structure

The application follows RESTful API design principles with the following route prefixes:
- `/api/users` - User authentication and profile management
- `/api/assets` - Asset management
- `/api/incomes` - Income tracking
- `/api/liabilities` - Liability management

## User Routes

**File:** `src/routes/userRoutes.js`

### Public Routes (No Authentication Required)

#### 1. User Registration
- **Endpoint:** `POST /api/users/register`
- **Purpose:** Create a new user account
- **Authentication:** None required
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "_id": "68de4bac96fee0f0db4dcef0",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses:**
  - 400: User already exists or validation errors
  - 500: Server error

#### 2. User Login
- **Endpoint:** `POST /api/users/login`
- **Purpose:** Authenticate user and receive access token
- **Authentication:** None required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68de4bac96fee0f0db4dcef0",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses:**
  - 401: Invalid email or password
  - 500: Server error

### Protected Routes (Authentication Required)

#### 3. Get User Profile
- **Endpoint:** `GET /api/users/profile`
- **Purpose:** Retrieve current user's profile information
- **Authentication:** Bearer token required
- **Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68de4bac96fee0f0db4dcef0",
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

#### 4. Update User Profile
- **Endpoint:** `PUT /api/users/profile`
- **Purpose:** Update current user's profile information
- **Authentication:** Bearer token required
- **Request Body (all fields optional):**
  ```json
  {
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "password": "newpassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68de4bac96fee0f0db4dcef0",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## Asset Routes

**File:** `src/routes/assetRoutes.js`

All asset routes require authentication. The middleware automatically filters assets by the authenticated user's ID.

### Asset Management Endpoints

#### 1. Get All Assets
- **Endpoint:** `GET /api/assets`
- **Purpose:** Retrieve all assets for the authenticated user
- **Authentication:** Bearer token required
- **Success Response (200):**
  ```json
  [
    {
      "_id": "68de4c4096fee0f0db4dcefe",
      "userId": "68de4bac96fee0f0db4dcef0",
      "description": "Savings Account - HNB",
      "category": "Cash/Savings",
      "amount": 950000,
      "dateAdded": "2025-09-26T09:00:00.000Z",
      "createdAt": "2025-01-12T11:35:00.000Z",
      "updatedAt": "2025-01-12T11:35:00.000Z"
    }
  ]
  ```

#### 2. Create New Asset
- **Endpoint:** `POST /api/assets`
- **Purpose:** Add a new asset for the authenticated user
- **Authentication:** Bearer token required
- **Request Body:**
  ```json
  {
    "description": "Investment Portfolio",
    "category": "Investments",
    "amount": 500000
  }
  ```
- **Success Response (201):**
  ```json
  {
    "_id": "68de4c4096fee0f0db4dcefe",
    "userId": "68de4bac96fee0f0db4dcef0",
    "description": "Investment Portfolio",
    "category": "Investments",
    "amount": 500000,
    "dateAdded": "2025-01-12T11:35:00.000Z",
    "createdAt": "2025-01-12T11:35:00.000Z",
    "updatedAt": "2025-01-12T11:35:00.000Z"
  }
  ```

#### 3. Get Single Asset
- **Endpoint:** `GET /api/assets/:id`
- **Purpose:** Retrieve a specific asset by ID
- **Authentication:** Bearer token required
- **URL Parameters:** `id` - Asset ObjectId
- **Success Response (200):** Same as create asset response
- **Error Responses:**
  - 404: Asset not found or doesn't belong to user

#### 4. Update Asset
- **Endpoint:** `PUT /api/assets/:id`
- **Purpose:** Update an existing asset
- **Authentication:** Bearer token required
- **URL Parameters:** `id` - Asset ObjectId
- **Request Body (all fields optional):**
  ```json
  {
    "description": "Updated Savings Account",
    "category": "Cash/Savings",
    "amount": 1000000
  }
  ```

#### 5. Delete Asset
- **Endpoint:** `DELETE /api/assets/:id`
- **Purpose:** Remove an asset
- **Authentication:** Bearer token required
- **URL Parameters:** `id` - Asset ObjectId
- **Success Response (200):**
  ```json
  {
    "message": "Asset removed"
  }
  ```

## Income Routes

**File:** `src/routes/incomeRoutes.js`

All income routes follow the same pattern as asset routes with identical authentication and structure.

### Income Management Endpoints

#### 1. Get All Incomes
- **Endpoint:** `GET /api/incomes`
- **Authentication:** Bearer token required

#### 2. Create New Income
- **Endpoint:** `POST /api/incomes`
- **Authentication:** Bearer token required
- **Request Body:**
  ```json
  {
    "description": "Monthly salary",
    "category": "Salary",
    "amount": 350000
  }
  ```

#### 3. Get Single Income
- **Endpoint:** `GET /api/incomes/:id`
- **Authentication:** Bearer token required

#### 4. Update Income
- **Endpoint:** `PUT /api/incomes/:id`
- **Authentication:** Bearer token required

#### 5. Delete Income
- **Endpoint:** `DELETE /api/incomes/:id`
- **Authentication:** Bearer token required

## Liability Routes

**File:** `src/routes/liabilityRoutes.js`

Liability routes include an additional `interestRate` field in the request/response.

### Liability Management Endpoints

#### 1. Get All Liabilities
- **Endpoint:** `GET /api/liabilities`
- **Authentication:** Bearer token required

#### 2. Create New Liability
- **Endpoint:** `POST /api/liabilities`
- **Authentication:** Bearer token required
- **Request Body:**
  ```json
  {
    "description": "Credit Card - HNB",
    "category": "Credit Card",
    "amount": 185000,
    "interestRate": 28
  }
  ```

#### 3. Get Single Liability
- **Endpoint:** `GET /api/liabilities/:id`
- **Authentication:** Bearer token required

#### 4. Update Liability
- **Endpoint:** `PUT /api/liabilities/:id`
- **Authentication:** Bearer token required

#### 5. Delete Liability
- **Endpoint:** `DELETE /api/liabilities/:id`
- **Authentication:** Bearer token required

## Route Protection Implementation

### Authentication Middleware Usage
```javascript
// All routes after this middleware require authentication
router.use(protect);

router.route('/')
  .get(getAssets)      // Protected
  .post(createAsset);  // Protected

router.route('/:id')
  .get(getAssetById)   // Protected
  .put(updateAsset)    // Protected
  .delete(deleteAsset); // Protected
```

### User Data Isolation
- All protected routes automatically filter by `userId`
- Users can only access their own data
- No cross-user data access is possible

## Error Handling

### Standard Error Responses
- **401 Unauthorized:** Missing or invalid authentication token
- **404 Not Found:** Resource not found or doesn't belong to user
- **400 Bad Request:** Validation errors or malformed requests
- **500 Internal Server Error:** Server-side errors

### Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Route Index

**File:** `src/routes/index.js`

Centralized export of all route modules for easy importing in the main server file.

## API Testing

### Using curl Examples

#### Register User
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login User
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get Assets (with token)
```bash
curl -X GET http://localhost:3001/api/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Asset
```bash
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"description":"Savings Account","category":"Cash/Savings","amount":100000}'
```

## Next Steps
After route setup, proceed to:
- Controllers Implementation (see 05-controllers.md)
- Server Configuration (see 06-server-configuration.md)
