# API Testing and Usage Documentation

## Overview
This document provides comprehensive testing instructions and usage examples for the Wealth Management API. It includes curl commands, Postman collections, and frontend integration examples.

## Prerequisites

### Server Requirements
- Node.js backend running on `http://localhost:3001`
- MongoDB database connected
- All dependencies installed

### Testing Tools
- **curl:** Command-line HTTP client
- **Postman:** GUI-based API testing tool
- **Browser:** For simple GET requests
- **Frontend Application:** For integration testing

## API Testing Guide

### 1. Server Health Check

#### Basic Server Status
```bash
curl http://localhost:3001/
```

**Expected Response:**
```json
{
  "message": "Welcome to Wealth Management API"
}
```

**Status Code:** 200 OK

### 2. User Authentication Testing

#### Register New User
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4bac96fee0f0db4dcef0",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Code:** 201 Created

#### Login Existing User
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4bac96fee0f0db4dcef0",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Code:** 200 OK

#### Get User Profile (Protected Route)
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "_id": "68de4bac96fee0f0db4dcef0",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Status Code:** 200 OK

#### Update User Profile (Protected Route)
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4bac96fee0f0db4dcef0",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Code:** 200 OK

### 3. Asset Management Testing

#### Get All Assets (Protected Route)
```bash
curl -X GET http://localhost:3001/api/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
[]
```

**Status Code:** 200 OK (Empty array for new user)

#### Create New Asset (Protected Route)
```bash
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Savings Account - HNB",
    "category": "Cash/Savings",
    "amount": 950000
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4c4096fee0f0db4dcefe",
  "userId": "68de4bac96fee0f0db4dcef0",
  "description": "Savings Account - HNB",
  "category": "Cash/Savings",
  "amount": 950000,
  "dateAdded": "2025-01-12T11:35:00.000Z",
  "createdAt": "2025-01-12T11:35:00.000Z",
  "updatedAt": "2025-01-12T11:35:00.000Z"
}
```

**Status Code:** 201 Created

#### Get Single Asset (Protected Route)
```bash
curl -X GET http://localhost:3001/api/assets/68de4c4096fee0f0db4dcefe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:** Same as create asset response

**Status Code:** 200 OK

#### Update Asset (Protected Route)
```bash
curl -X PUT http://localhost:3001/api/assets/68de4c4096fee0f0db4dcefe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Updated Savings Account",
    "amount": 1000000
  }'
```

**Expected Response:** Updated asset object

**Status Code:** 200 OK

#### Delete Asset (Protected Route)
```bash
curl -X DELETE http://localhost:3001/api/assets/68de4c4096fee0f0db4dcefe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Asset removed"
}
```

**Status Code:** 200 OK

### 4. Income Management Testing

#### Create New Income (Protected Route)
```bash
curl -X POST http://localhost:3001/api/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Monthly salary",
    "category": "Salary",
    "amount": 350000
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4c2396fee0f0db4dcef6",
  "userId": "68de4bac96fee0f0db4dcef0",
  "description": "Monthly salary",
  "category": "Salary",
  "amount": 350000,
  "dateAdded": "2025-01-12T11:35:00.000Z",
  "createdAt": "2025-01-12T11:35:00.000Z",
  "updatedAt": "2025-01-12T11:35:00.000Z"
}
```

**Status Code:** 201 Created

#### Get All Incomes (Protected Route)
```bash
curl -X GET http://localhost:3001/api/incomes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:** Array of income objects

**Status Code:** 200 OK

### 5. Liability Management Testing

#### Create New Liability (Protected Route)
```bash
curl -X POST http://localhost:3001/api/liabilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Credit Card - HNB",
    "category": "Credit Card",
    "amount": 185000,
    "interestRate": 28
  }'
```

**Expected Response:**
```json
{
  "_id": "68de4c5a96fee0f0db4dcf06",
  "userId": "68de4bac96fee0f0db4dcef0",
  "description": "Credit Card - HNB",
  "category": "Credit Card",
  "amount": 185000,
  "interestRate": 28,
  "dateAdded": "2025-01-12T11:35:00.000Z",
  "createdAt": "2025-01-12T11:35:00.000Z",
  "updatedAt": "2025-01-12T11:35:00.000Z"
}
```

**Status Code:** 201 Created

#### Get All Liabilities (Protected Route)
```bash
curl -X GET http://localhost:3001/api/liabilities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:** Array of liability objects

**Status Code:** 200 OK

## Error Testing

### Authentication Errors

#### Missing Token
```bash
curl -X GET http://localhost:3001/api/assets
```

**Expected Response:**
```json
{
  "message": "Not authorized, no token"
}
```

**Status Code:** 401 Unauthorized

#### Invalid Token
```bash
curl -X GET http://localhost:3001/api/assets \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "message": "Not authorized, token failed"
}
```

**Status Code:** 401 Unauthorized

### Validation Errors

#### Invalid Email Format
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "password": "password123"
  }'
```

**Expected Response:** Validation error message

**Status Code:** 400 Bad Request

#### Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Test Asset"
  }'
```

**Expected Response:** Validation error message

**Status Code:** 400 Bad Request

### Not Found Errors

#### Non-existent Resource
```bash
curl -X GET http://localhost:3001/api/assets/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Asset not found"
}
```

**Status Code:** 404 Not Found

## Postman Collection Setup

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:3001`
- `token`: (will be set after login)

### Collection Structure
```
Wealth Management API
├── Authentication
│   ├── Register User
│   ├── Login User
│   ├── Get Profile
│   └── Update Profile
├── Assets
│   ├── Get All Assets
│   ├── Create Asset
│   ├── Get Asset by ID
│   ├── Update Asset
│   └── Delete Asset
├── Income
│   ├── Get All Incomes
│   ├── Create Income
│   ├── Get Income by ID
│   ├── Update Income
│   └── Delete Income
└── Liabilities
    ├── Get All Liabilities
    ├── Create Liability
    ├── Get Liability by ID
    ├── Update Liability
    └── Delete Liability
```

### Pre-request Scripts
For protected routes, add this pre-request script:
```javascript
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### Test Scripts
For login endpoint, add this test script to save token:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    pm.environment.set("userId", response._id);
}
```

## Frontend Integration Examples

### JavaScript/Fetch API

#### Authentication Service
```javascript
class AuthService {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (response.ok) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    if (response.ok) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }
}
```

#### Asset Service
```javascript
class AssetService {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.authService = new AuthService(baseURL);
  }

  async getAssets() {
    const response = await fetch(`${this.baseURL}/api/assets`, {
      headers: this.authService.getAuthHeaders(),
    });
    return response.json();
  }

  async createAsset(assetData) {
    const response = await fetch(`${this.baseURL}/api/assets`, {
      method: 'POST',
      headers: this.authService.getAuthHeaders(),
      body: JSON.stringify(assetData),
    });
    return response.json();
  }

  async updateAsset(id, assetData) {
    const response = await fetch(`${this.baseURL}/api/assets/${id}`, {
      method: 'PUT',
      headers: this.authService.getAuthHeaders(),
      body: JSON.stringify(assetData),
    });
    return response.json();
  }

  async deleteAsset(id) {
    const response = await fetch(`${this.baseURL}/api/assets/${id}`, {
      method: 'DELETE',
      headers: this.authService.getAuthHeaders(),
    });
    return response.json();
  }
}
```

### React Integration Example

#### API Client Hook
```javascript
import { useState, useEffect } from 'react';

const useAPI = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const apiCall = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  };
  
  return { apiCall, token, setToken };
};
```

#### Component Usage
```javascript
const AssetsList = () => {
  const [assets, setAssets] = useState([]);
  const { apiCall } = useAPI();
  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await apiCall('/assets');
        setAssets(data);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };
    
    fetchAssets();
  }, [apiCall]);
  
  return (
    <div>
      {assets.map(asset => (
        <div key={asset._id}>
          <h3>{asset.description}</h3>
          <p>Amount: {asset.amount}</p>
          <p>Category: {asset.category}</p>
        </div>
      ))}
    </div>
  );
};
```

## Performance Testing

### Load Testing with curl
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET http://localhost:3001/api/assets \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" &
done
wait
```

### Response Time Testing
```bash
# Measure response time
curl -w "@curl-format.txt" -X GET http://localhost:3001/api/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Create `curl-format.txt`:
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

## Troubleshooting Common Issues

### Issue: Connection Refused
**Cause:** Server not running
**Solution:** Start server with `node server.js`

### Issue: CORS Errors
**Cause:** Frontend origin not allowed
**Solution:** Check CORS configuration in server.js

### Issue: Token Expired
**Cause:** JWT token past expiration date
**Solution:** Login again to get new token

### Issue: Database Connection Failed
**Cause:** MongoDB URI incorrect or network issues
**Solution:** Verify MONGODB_URI in .env file

### Issue: Validation Errors
**Cause:** Missing required fields or invalid data types
**Solution:** Check request body against schema requirements

## Best Practices

### Security
- Always use HTTPS in production
- Store tokens securely (localStorage for development)
- Implement token refresh mechanism
- Validate all input data

### Performance
- Use appropriate HTTP methods
- Implement pagination for large datasets
- Cache frequently accessed data
- Monitor response times

### Error Handling
- Implement proper error boundaries
- Provide user-friendly error messages
- Log errors for debugging
- Handle network failures gracefully

## Next Steps
After API testing, proceed to:
- Frontend Integration (see 08-frontend-integration.md)
- Deployment (see 09-deployment.md)
