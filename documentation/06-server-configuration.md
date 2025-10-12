# Server Configuration Documentation

## Overview
This document describes the main server configuration, middleware setup, and how all components are integrated to create the complete Wealth Management API server.

## Main Server File

**File:** `server.js`

This is the entry point of the application that orchestrates all components.

### Server Configuration Breakdown

#### 1. Dependencies and Imports
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import middleware
const { errorHandler, logger } = require('./src/middleware');

// Import routes
const { userRoutes, assetRoutes, incomeRoutes, liabilityRoutes } = require('./src/routes');

// Connect to MongoDB
const connectDB = require('./src/config/db');
connectDB();
```

**Key Components:**
- **Express:** Web framework
- **CORS:** Cross-origin resource sharing
- **dotenv:** Environment variable loading
- **Middleware:** Custom middleware functions
- **Routes:** API route modules
- **Database:** MongoDB connection

#### 2. Express Application Setup
```javascript
// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
```

**Middleware Stack (Order Matters):**
1. **CORS:** Enables cross-origin requests from frontend
2. **express.json():** Parses JSON request bodies
3. **logger:** Logs all incoming requests

#### 3. Route Configuration
```javascript
// Routes
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/liabilities', liabilityRoutes);
```

**Route Prefixes:**
- `/api/users` - Authentication and profile management
- `/api/assets` - Asset management
- `/api/incomes` - Income tracking
- `/api/liabilities` - Liability management

#### 4. Welcome Route
```javascript
// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Wealth Management API' });
});
```

**Purpose:** Health check endpoint for server status verification

#### 5. Error Handling
```javascript
// Error handler
app.use(errorHandler);
```

**Placement:** Must be after all routes for proper error catching

#### 6. Server Startup
```javascript
// Set port and start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Features:**
- Environment variable port configuration
- Fallback to port 3001
- Startup confirmation logging

## Database Configuration

**File:** `src/config/db.js`

### Connection Setup
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**Features:**
- Asynchronous connection handling
- Environment variable usage for connection string
- Connection success logging
- Graceful error handling with process exit
- Host information logging for debugging

## Environment Configuration

**File:** `.env`

### Required Environment Variables
```env
PORT=3001
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/wealth-management-app-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-2025
```

**Variable Descriptions:**
- **PORT:** Server listening port (default: 3001)
- **MONGODB_URI:** Complete MongoDB connection string with database name
- **JWT_SECRET:** Secret key for JWT token signing and verification

### Security Considerations
- **Environment Isolation:** Sensitive data separated from code
- **Database Credentials:** Stored in environment variables
- **JWT Secret:** Strong secret key for token security
- **Port Flexibility:** Configurable port for different environments

## Middleware Configuration

### CORS Configuration
```javascript
app.use(cors());
```

**Default CORS Settings:**
- **Origin:** Allows all origins (suitable for development)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization
- **Credentials:** Not included (can be added if needed)

**For Production:** Consider restricting origins:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

### JSON Parsing
```javascript
app.use(express.json());
```

**Features:**
- Parses JSON request bodies
- Sets body size limit (default: 100kb)
- Automatic Content-Type detection

### Request Logging
```javascript
app.use(logger);
```

**Log Format:** `METHOD PROTOCOL://HOST/PATH`

## Route Integration

### Route Module Structure
Each route module exports an Express router with configured endpoints:

```javascript
// Example: userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;
```

### Route Registration
Routes are registered with specific prefixes:
```javascript
app.use('/api/users', userRoutes);
```

This creates endpoints like:
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile`

## Error Handling Configuration

### Global Error Handler
```javascript
app.use(errorHandler);
```

**Placement:** Must be the last middleware to catch all errors

**Error Types Handled:**
- Mongoose validation errors
- Cast errors (invalid ObjectId)
- Duplicate key errors
- Generic server errors

## Package.json Configuration

**File:** `package.json`

### Scripts Section
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

## Server Startup Process

### 1. Environment Loading
- Loads `.env` file variables
- Sets up environment configuration

### 2. Database Connection
- Connects to MongoDB Atlas
- Logs connection status
- Exits on connection failure

### 3. Express Application Setup
- Creates Express app instance
- Configures middleware stack
- Registers all routes

### 4. Error Handling Setup
- Configures global error handler
- Ensures proper error catching

### 5. Server Listening
- Starts listening on configured port
- Logs server startup confirmation

## Development vs Production Configuration

### Development Features
- **CORS:** Allows all origins
- **Logging:** Console logging enabled
- **Error Details:** Full error messages in responses

### Production Considerations
- **CORS:** Restrict to specific origins
- **Logging:** Use proper logging service
- **Error Handling:** Sanitize error messages
- **Environment Variables:** Use secure secret management
- **HTTPS:** Enable SSL/TLS
- **Rate Limiting:** Add rate limiting middleware

## Troubleshooting Common Issues

### Issue: "Cannot find module"
**Cause:** Dependencies not installed
**Solution:** Run `npm install`

### Issue: "MongoDB connection failed"
**Cause:** Invalid connection string or network issues
**Solution:** Verify MONGODB_URI and network connectivity

### Issue: "Port already in use"
**Cause:** Another process using port 3001
**Solution:** Change PORT in .env or kill existing process

### Issue: "Environment variables not loading"
**Cause:** Missing .env file or incorrect format
**Solution:** Create .env file with proper format

### Issue: "CORS errors from frontend"
**Cause:** CORS not properly configured
**Solution:** Check CORS middleware configuration

## Performance Considerations

### Database Connection
- **Connection Pooling:** Mongoose handles connection pooling
- **Connection Limits:** Default limits suitable for most applications
- **Reconnection:** Automatic reconnection on connection loss

### Middleware Order
- **Critical:** Error handler must be last
- **CORS:** Should be early in middleware stack
- **Parsing:** JSON parsing before route handlers

### Memory Usage
- **JSON Limit:** Default 100kb body limit
- **Connection Limits:** Mongoose default connection limits
- **Error Handling:** Proper error cleanup

## Security Configuration

### Authentication
- **JWT Tokens:** Secure token-based authentication
- **Password Hashing:** bcrypt with salt rounds
- **Token Expiration:** 30-day token lifetime

### Data Protection
- **User Isolation:** All data filtered by user ID
- **Input Validation:** Mongoose schema validation
- **Error Sanitization:** No sensitive data in error messages

### Network Security
- **HTTPS Ready:** Compatible with HTTPS deployment
- **CORS Control:** Configurable origin restrictions
- **Environment Variables:** Secure credential storage

## Next Steps
After server configuration, the application is ready for:
- API Testing (see 07-api-testing.md)
- Frontend Integration (see 08-frontend-integration.md)
- Deployment (see 09-deployment.md)
