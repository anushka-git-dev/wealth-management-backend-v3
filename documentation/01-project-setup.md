# Project Setup Documentation

## Overview
This document describes the initial setup process for the Wealth Management Backend API built with Node.js and Express.js.

## Project Requirements
- **Framework:** Express.js
- **Database:** MongoDB (Cloud Atlas)
- **Authentication:** JWT tokens
- **Port:** 3001 (Frontend runs on 3000)
- **Database Name:** wealth-management-app-db
- **Database URL:** mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

## Step 1: Project Initialization

### Commands Executed
```bash
npm init -y
```

### What This Did
- Created `package.json` file with default configuration
- Set up the project as a Node.js application
- Configured main entry point as `server.js`
- Added start script: `"start": "node server.js"`

### Dependencies Installed
```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
```

**Package Descriptions:**
- **express:** Web framework for Node.js
- **mongoose:** MongoDB object modeling tool
- **dotenv:** Loads environment variables from .env file
- **cors:** Cross-Origin Resource Sharing middleware
- **bcryptjs:** Password hashing library
- **jsonwebtoken:** JWT token creation and verification

## Step 2: Environment Configuration

### .env File Created
```env
PORT=3001
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/wealth-management-app-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-2025
```

### Security Considerations
- Database credentials stored in environment variables
- JWT secret key for token signing
- Port configuration for flexibility

## Step 3: Project Structure Created

### Folder Structure
```
wealth-management-backend-v3/
├── server.js                 # Main application entry point
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (not in git)
├── src/
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware functions
│   ├── models/              # Database models/schemas
│   └── routes/              # API route definitions
└── documentation/           # This documentation folder
```

### Why This Structure?
- **Separation of Concerns:** Each folder has a specific purpose
- **Scalability:** Easy to add new features
- **Maintainability:** Clear organization for team development
- **Best Practices:** Follows Node.js/Express conventions

## Step 4: Database Connection Setup

### Database Configuration File
Created `src/config/db.js` to handle MongoDB connection with:
- Error handling for connection failures
- Proper connection string usage
- Connection status logging

### Connection Features
- Automatic reconnection handling
- Connection error logging
- Graceful shutdown on connection errors

## Common Issues and Solutions

### Issue: "Cannot find module 'express'"
**Cause:** Dependencies not installed
**Solution:** Run `npm install express mongoose dotenv cors bcryptjs jsonwebtoken`

### Issue: Environment variables not loading
**Cause:** Missing .env file
**Solution:** Create .env file with required variables

### Issue: MongoDB connection failed
**Cause:** Incorrect connection string or network issues
**Solution:** Verify MongoDB URI and network connectivity

## Next Steps
After setup completion, proceed to:
1. Database Models Creation (see 02-database-models.md)
2. Authentication Middleware (see 03-authentication.md)
3. API Routes Setup (see 04-api-routes.md)
4. Controllers Implementation (see 05-controllers.md)
5. Server Configuration (see 06-server-configuration.md)
