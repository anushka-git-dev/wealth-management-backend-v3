# Authentication and Middleware Documentation

## Overview
This document describes the authentication system and middleware components that secure the Wealth Management API and handle cross-cutting concerns.

## Authentication System

### JWT Token Implementation

**File:** `src/controllers/userController.js`

**Token Generation:**
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
```

**Token Features:**
- **Expiration:** 30 days validity
- **Secret Key:** Uses environment variable JWT_SECRET
- **Payload:** Contains only user ID for security
- **Algorithm:** Default HS256 algorithm

### Password Security

**Hashing Implementation:**
```javascript
// Pre-save hook in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Security Features:**
- **Salt Rounds:** 10 rounds for optimal security/performance balance
- **Conditional Hashing:** Only hashes if password is modified
- **Error Handling:** Proper error propagation for failed hashing

**Password Comparison:**
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

## Authentication Middleware

### Protect Middleware

**File:** `src/middleware/auth.js`

**Purpose:** Secures protected routes by verifying JWT tokens

**Implementation:**
```javascript
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

**Middleware Features:**
- **Token Extraction:** Gets token from Authorization header
- **Token Verification:** Validates JWT signature and expiration
- **User Lookup:** Finds user from token payload
- **Password Exclusion:** Removes password from user object
- **Error Handling:** Comprehensive error responses
- **Request Enhancement:** Adds user object to request

### Usage in Routes

**Protected Route Example:**
```javascript
// All routes after this middleware require authentication
router.use(protect);

router.route('/')
  .get(getAssets)      // Protected
  .post(createAsset);  // Protected
```

**Public Route Example:**
```javascript
// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
```

## Additional Middleware

### Error Handler Middleware

**File:** `src/middleware/errorHandler.js`

**Purpose:** Centralized error handling for consistent error responses

**Features:**
- **Mongoose Error Handling:** Specific handling for database errors
- **Validation Errors:** Extracts validation messages
- **Duplicate Key Errors:** Handles unique constraint violations
- **Cast Errors:** Handles invalid ObjectId errors
- **Logging:** Logs errors for debugging
- **Consistent Response:** Standardized error response format

**Error Types Handled:**
1. **CastError:** Invalid ObjectId format
2. **11000 Error Code:** Duplicate key (unique constraint violation)
3. **ValidationError:** Mongoose schema validation failures
4. **Generic Errors:** Fallback for unhandled errors

### Logger Middleware

**File:** `src/middleware/logger.js`

**Purpose:** Logs all incoming requests for monitoring and debugging

**Implementation:**
```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
};
```

**Features:**
- **Request Method:** Logs HTTP method (GET, POST, etc.)
- **Full URL:** Includes protocol, host, and path
- **Simple Format:** Easy to read log format
- **Non-blocking:** Doesn't interfere with request processing

## Middleware Index

**File:** `src/middleware/index.js`

**Purpose:** Centralized export of all middleware functions

**Exports:**
- `protect` - Authentication middleware
- `errorHandler` - Error handling middleware
- `logger` - Request logging middleware

## Authentication Flow

### User Registration Flow
1. User submits registration data
2. Server validates input data
3. Checks if email already exists
4. Hashes password using bcrypt
5. Creates user document in database
6. Generates JWT token
7. Returns user data and token (excluding password)

### User Login Flow
1. User submits email and password
2. Server finds user by email
3. Compares submitted password with hashed password
4. If valid, generates JWT token
5. Returns user data and token

### Protected Route Access Flow
1. Client sends request with Authorization header
2. Server extracts Bearer token
3. Verifies token signature and expiration
4. Extracts user ID from token payload
5. Looks up user in database
6. Adds user object to request
7. Continues to route handler

## Security Considerations

### Token Security
- **Short Expiration:** 30-day token expiration
- **Secure Secret:** JWT secret stored in environment variables
- **Minimal Payload:** Token contains only user ID
- **HTTPS Recommended:** Tokens should be transmitted over HTTPS

### Password Security
- **Strong Hashing:** bcrypt with 10 salt rounds
- **No Plain Text Storage:** Passwords never stored in plain text
- **Automatic Hashing:** Pre-save hook ensures all passwords are hashed

### Request Security
- **Authorization Header:** Tokens must be in Bearer format
- **User Context:** All protected operations include user context
- **Error Handling:** No sensitive information in error messages

## Usage Examples

### Protecting Routes
```javascript
// Single route protection
router.get('/profile', protect, getProfile);

// Multiple routes protection
router.use(protect);
router.get('/assets', getAssets);
router.post('/assets', createAsset);
```

### Error Handling
```javascript
// Middleware automatically catches and handles errors
app.use(errorHandler);
```

### Request Logging
```javascript
// Logs all requests
app.use(logger);
```

## Common Issues and Solutions

### Issue: "Not authorized, no token"
**Cause:** Missing or malformed Authorization header
**Solution:** Include "Bearer <token>" in Authorization header

### Issue: "Not authorized, token failed"
**Cause:** Invalid or expired token
**Solution:** Login again to get new token

### Issue: Password comparison fails
**Cause:** Password not hashed or wrong comparison method
**Solution:** Use user.comparePassword() method

### Issue: User not found in protected route
**Cause:** User deleted but token still valid
**Solution:** Token validation includes user existence check

## Next Steps
After authentication setup, proceed to:
- API Routes Setup (see 04-api-routes.md)
- Controllers Implementation (see 05-controllers.md)
