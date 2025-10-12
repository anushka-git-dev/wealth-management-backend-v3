# Controllers Documentation

## Overview
This document describes the controller functions that handle business logic for the Wealth Management API. Controllers are responsible for processing requests, interacting with the database, and returning appropriate responses.

## Controller Architecture

Controllers follow the MVC (Model-View-Controller) pattern where:
- **Models** handle data structure and database operations
- **Controllers** contain business logic and request handling
- **Routes** define API endpoints and delegate to controllers

## User Controller

**File:** `src/controllers/userController.js`

### Authentication Functions

#### 1. registerUser
```javascript
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Create new user account
**Features:**
- Validates email uniqueness
- Automatic password hashing (via model pre-save hook)
- Returns user data with JWT token
- Comprehensive error handling

#### 2. loginUser
```javascript
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Authenticate existing user
**Features:**
- Email-based user lookup
- Secure password comparison using bcrypt
- Returns user data with fresh JWT token
- Generic error message for security

#### 3. generateToken
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
```

**Purpose:** Create JWT token for authenticated sessions
**Features:**
- 30-day token expiration
- Uses environment variable for secret
- Minimal payload (only user ID)

### Profile Management Functions

#### 4. getProfile
```javascript
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Retrieve current user's profile
**Features:**
- Uses authenticated user ID from middleware
- Excludes password from response
- Handles user not found scenario

#### 5. updateProfile
```javascript
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Update user profile information
**Features:**
- Selective field updates (only provided fields)
- Password hashing on update (via model pre-save hook)
- Returns fresh JWT token after update
- Preserves existing values for unspecified fields

## Asset Controller

**File:** `src/controllers/assetController.js`

### Asset Management Functions

#### 1. getAssets
```javascript
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user._id });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Retrieve all assets for authenticated user
**Features:**
- Automatic user filtering via userId
- Returns complete asset array
- Simple error handling

#### 2. getAssetById
```javascript
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      res.json(asset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Retrieve specific asset by ID
**Features:**
- Dual filtering: asset ID and user ID
- Prevents cross-user access
- Proper 404 handling

#### 3. createAsset
```javascript
const createAsset = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const asset = await Asset.create({
      userId: req.user._id,
      description,
      category,
      amount,
      dateAdded: new Date()
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Create new asset for user
**Features:**
- Automatic userId assignment from authenticated user
- Manual dateAdded setting for explicit control
- 201 status code for successful creation

#### 4. updateAsset
```javascript
const updateAsset = async (req, res) => {
  try {
    const { description, category, amount } = req.body;

    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      asset.description = description || asset.description;
      asset.category = category || asset.category;
      asset.amount = amount || asset.amount;

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Update existing asset
**Features:**
- Selective field updates
- Preserves existing values for unspecified fields
- User ownership verification
- Returns updated asset data

#### 5. deleteAsset
```javascript
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (asset) {
      await asset.remove();
      res.json({ message: 'Asset removed' });
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Purpose:** Delete asset
**Features:**
- User ownership verification before deletion
- Confirmation message on successful deletion
- Prevents unauthorized deletions

## Income Controller

**File:** `src/controllers/incomeController.js`

The income controller follows the exact same pattern as the asset controller with identical function structures and features. The only difference is the model used (Income instead of Asset).

### Income Management Functions

1. **getIncomes** - Retrieve all incomes for user
2. **getIncomeById** - Retrieve specific income by ID
3. **createIncome** - Create new income record
4. **updateIncome** - Update existing income
5. **deleteIncome** - Delete income record

## Liability Controller

**File:** `src/controllers/liabilityController.js`

The liability controller follows the same pattern as asset and income controllers but includes an additional `interestRate` field.

### Liability Management Functions

1. **getLiabilities** - Retrieve all liabilities for user
2. **getLiabilityById** - Retrieve specific liability by ID
3. **createLiability** - Create new liability with interest rate
4. **updateLiability** - Update existing liability
5. **deleteLiability** - Delete liability record

#### createLiability Example
```javascript
const createLiability = async (req, res) => {
  try {
    const { description, category, amount, interestRate } = req.body;

    const liability = await Liability.create({
      userId: req.user._id,
      description,
      category,
      amount,
      interestRate,
      dateAdded: new Date()
    });

    res.status(201).json(liability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Key Difference:** Includes `interestRate` field in creation and updates.

## Controller Index

**File:** `src/controllers/index.js`

Centralized export of all controller modules for easy importing.

## Common Patterns

### Error Handling Pattern
All controllers follow a consistent error handling pattern:
```javascript
try {
  // Controller logic
} catch (error) {
  res.status(500).json({ message: 'Server error', error: error.message });
}
```

### User Data Isolation Pattern
All protected controllers ensure user data isolation:
```javascript
// Always filter by userId
const data = await Model.find({ userId: req.user._id });
```

### Response Pattern
Consistent response formats:
- **Success:** Return data or confirmation message
- **Error:** Return error message with appropriate status code
- **Not Found:** Return 404 with descriptive message

## Security Features

### Data Protection
- **User Isolation:** All operations filtered by authenticated user ID
- **Input Validation:** Mongoose schema validation handles input sanitization
- **Error Sanitization:** No sensitive information in error messages

### Authentication Integration
- **Middleware Dependency:** All protected controllers rely on auth middleware
- **User Context:** `req.user` provides authenticated user information
- **Automatic Filtering:** User ID automatically applied to all database operations

## Performance Considerations

### Database Queries
- **Efficient Filtering:** All queries include userId for optimal indexing
- **Selective Updates:** Only modified fields are updated
- **Proper Indexing:** Database indexes support common query patterns

### Error Handling
- **Early Returns:** Validation errors return immediately
- **Comprehensive Coverage:** All operations wrapped in try-catch blocks
- **Consistent Format:** Standardized error response structure

## Next Steps
After controller implementation, proceed to:
- Server Configuration (see 06-server-configuration.md)
- API Testing (see 07-api-testing.md)
