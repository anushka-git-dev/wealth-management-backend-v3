# Database Models Documentation

## Overview
This document describes the MongoDB models created for the Wealth Management application, including schema definitions, validations, and relationships.

## Database Collections

The application uses 4 main collections that correspond to the MongoDB models:

### 1. Users Collection

**File:** `src/models/User.js`

**Schema Structure:**
```javascript
{
  name: String (required, trimmed)
  email: String (required, unique, trimmed, lowercase, validated)
  password: String (required, min 6 characters)
  timestamps: true (createdAt, updatedAt)
}
```

**Key Features:**
- **Password Hashing:** Automatic bcrypt hashing before saving
- **Email Validation:** Regex pattern validation for email format
- **Password Comparison:** Method to compare plain text with hashed password
- **Pre-save Hook:** Automatically hashes password before database save

**Validation Rules:**
- Name: Required field, automatically trimmed
- Email: Required, unique, trimmed, lowercase, must match email regex
- Password: Required, minimum 6 characters

**Security Features:**
- Passwords are never stored in plain text
- Email addresses are normalized (lowercase)
- Built-in password comparison method for authentication

### 2. Assets Collection

**File:** `src/models/Asset.js`

**Schema Structure:**
```javascript
{
  userId: ObjectId (required, references User)
  description: String (required, trimmed)
  category: String (required, trimmed)
  amount: Number (required, minimum 0)
  dateAdded: Date (default: current date)
  timestamps: true
}
```

**Key Features:**
- **User Association:** Each asset belongs to a specific user
- **Amount Validation:** Ensures non-negative values
- **Automatic Dating:** dateAdded field defaults to current date
- **Indexing:** Compound index on userId and category for performance

**Validation Rules:**
- userId: Required, must be valid ObjectId
- description: Required, automatically trimmed
- category: Required, automatically trimmed
- amount: Required, must be non-negative number

### 3. Income Collection

**File:** `src/models/Income.js`

**Schema Structure:**
```javascript
{
  userId: ObjectId (required, references User)
  description: String (required, trimmed)
  category: String (required, trimmed)
  amount: Number (required, minimum 0)
  dateAdded: Date (default: current date)
  timestamps: true
}
```

**Key Features:**
- **User Association:** Each income record belongs to a specific user
- **Amount Validation:** Ensures non-negative values
- **Automatic Dating:** dateAdded field defaults to current date
- **Indexing:** Compound index on userId and category for performance

**Validation Rules:**
- userId: Required, must be valid ObjectId
- description: Required, automatically trimmed
- category: Required, automatically trimmed
- amount: Required, must be non-negative number

### 4. Liabilities Collection

**File:** `src/models/Liability.js`

**Schema Structure:**
```javascript
{
  userId: ObjectId (required, references User)
  description: String (required, trimmed)
  category: String (required, trimmed)
  amount: Number (required, minimum 0)
  interestRate: Number (required, minimum 0)
  dateAdded: Date (default: current date)
  timestamps: true
}
```

**Key Features:**
- **User Association:** Each liability belongs to a specific user
- **Interest Rate:** Additional field for liability-specific data
- **Amount Validation:** Ensures non-negative values
- **Automatic Dating:** dateAdded field defaults to current date
- **Indexing:** Compound index on userId and category for performance

**Validation Rules:**
- userId: Required, must be valid ObjectId
- description: Required, automatically trimmed
- category: Required, automatically trimmed
- amount: Required, must be non-negative number
- interestRate: Required, must be non-negative number

## Model Index File

**File:** `src/models/index.js`

**Purpose:** Centralized export of all models for easy importing

**Exports:**
- User
- Asset
- Income
- Liability

## Database Relationships

### User Relationships
- **One-to-Many:** One user can have multiple assets
- **One-to-Many:** One user can have multiple income records
- **One-to-Many:** One user can have multiple liabilities

### Data Flow
1. User creates account → User document created
2. User adds asset → Asset document created with userId reference
3. User adds income → Income document created with userId reference
4. User adds liability → Liability document created with userId reference

## Performance Optimizations

### Indexing Strategy
- **Compound Indexes:** Created on userId + category for faster queries
- **Single Field Indexes:** userId fields are automatically indexed by MongoDB
- **Query Optimization:** Indexes support common query patterns

### Data Validation
- **Pre-save Validation:** Mongoose validates data before saving
- **Type Checking:** Automatic type conversion and validation
- **Custom Validators:** Email format validation, minimum length requirements

## Security Considerations

### Data Protection
- **Password Hashing:** bcrypt with salt rounds (10)
- **Input Sanitization:** Automatic trimming of string fields
- **Type Safety:** Mongoose schema prevents type-based attacks

### Access Control
- **User Isolation:** All financial data is tied to specific users
- **No Cross-User Access:** Queries always filter by userId

## Usage Examples

### Creating a User
```javascript
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword123"
});
```

### Adding an Asset
```javascript
const asset = await Asset.create({
  userId: user._id,
  description: "Savings Account - HNB",
  category: "Cash/Savings",
  amount: 950000
});
```

### Querying User's Assets
```javascript
const userAssets = await Asset.find({ userId: user._id });
```

## Common Issues and Solutions

### Issue: Validation Error on Save
**Cause:** Required fields missing or invalid data types
**Solution:** Check schema requirements and data types

### Issue: Duplicate Email Error
**Cause:** Email field has unique constraint
**Solution:** Check if user already exists or use different email

### Issue: Password Not Hashing
**Cause:** Pre-save hook not working
**Solution:** Ensure password field is modified before save

## Next Steps
After model creation, proceed to:
- Authentication Middleware (see 03-authentication.md)
- API Routes Setup (see 04-api-routes.md)
