# Working AI Recommendation Endpoints

## ✅ IMPLEMENTED ENDPOINTS (3 Total)

### 1. Health Check
**Endpoint:** `GET /api/recommendations/health`  
**Purpose:** Check if the recommendation system is operational  
**Authentication:** None (Public)  

**Postman Example:**
```
GET http://localhost:3001/api/recommendations/health
```

**Expected Response:**
```json
{
  "success": true,
  "service": "Financial Recommendation System",
  "status": "operational",
  "model": "Claude 3 Haiku (anthropic.claude-3-haiku-20240307-v1:0)",
  "provider": "AWS Bedrock",
  "region": "us-east-2",
  "timestamp": "2025-10-23T16:30:00.000Z",
  "endpoints": {
    "recommendations": "/api/recommendations",
    "test": "/api/recommendations/test",
    "health": "/api/recommendations/health"
  }
}
```

---

### 2. Test AWS Bedrock Connection
**Endpoint:** `GET /api/recommendations/test`  
**Purpose:** Test connection to AWS Bedrock service  
**Authentication:** None (Public)  

**Postman Example:**
```
GET http://localhost:3001/api/recommendations/test
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "AWS Bedrock connection successful",
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "response": "Connection successful"
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "message": "AWS Bedrock connection failed",
  "error": "Error details..."
}
```

---

### 3. Get AI Recommendations
**Endpoint:** `GET /api/recommendations`  
**Purpose:** Get AI-powered financial recommendations based on all data in database  
**Authentication:** None (Public)  

**Postman Example:**
```
GET http://localhost:3001/api/recommendations
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Build an emergency fund covering 3-6 months of expenses...",
      "Pay off high-interest debt first...",
      "Diversify your investment portfolio...",
      "Contribute regularly to retirement accounts...",
      "Review and optimize your budget monthly...",
      "Consider increasing your income...",
      "Protect your assets with appropriate insurance..."
    ],
    "financialSummary": {
      "totalAssets": 150000,
      "totalIncome": 60000,
      "totalLiabilities": 25000,
      "netWorth": 125000,
      "debtToAssetRatio": 16.67,
      "savingsRate": 58.33
    },
    "breakdown": {
      "assets": {
        "total": 150000,
        "count": 3,
        "categories": {}
      },
      "income": {
        "total": 60000,
        "count": 2,
        "categories": {}
      },
      "liabilities": {
        "total": 25000,
        "count": 2,
        "categories": {},
        "averageInterestRate": "12.50"
      }
    },
    "timestamp": "2025-10-23T16:30:00.000Z"
  }
}
```

---

## ❌ NON-EXISTENT ENDPOINTS

These endpoints were mentioned in old documentation but **were NEVER implemented**:

- ❌ `/api/recommendations/health-score` - Does NOT exist
- ❌ `/api/recommendations/goals` - Does NOT exist
- ❌ `/api/recommendations/investment` - Does NOT exist
- ❌ `/api/recommendations/debt` - Does NOT exist
- ❌ `/api/recommendations/savings` - Does NOT exist
- ❌ `/api/recommendations/dashboard` - Does NOT exist

**These will return 404 errors if you try to access them.**

---

## 🧪 Testing Order

Follow this order to test your implementation:

### Step 1: Health Check
```bash
GET http://localhost:3001/api/recommendations/health
```
✅ Should return system status immediately

### Step 2: Connection Test
```bash
GET http://localhost:3001/api/recommendations/test
```
✅ Should test AWS Bedrock and return connection status

### Step 3: Get Recommendations (Requires AWS credentials and data)
```bash
GET http://localhost:3001/api/recommendations
```
✅ Should return AI-generated recommendations

---

## 🔧 Requirements

### For ALL endpoints to work:
1. ✅ Server running (`npm start`)
2. ✅ MongoDB connected
3. ✅ Environment variables configured

### For `/test` and `/` endpoints to work:
4. ✅ AWS credentials in `.env` file:
   ```env
   AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
   AWS_SECRET_ACCESS_KEY=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
   AWS_REGION=us-east-2
   ```

### For `/` endpoint to return meaningful recommendations:
5. ✅ Financial data in MongoDB (assets, income, liabilities)

---

## 📝 Postman Collection JSON

Copy and paste this into Postman:

```json
{
  "info": {
    "name": "Wealth Management - AI Recommendations",
    "description": "AI-powered financial recommendations using AWS Bedrock and Claude 3 Haiku",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/recommendations/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "recommendations", "health"]
        },
        "description": "Check if the recommendation system is operational"
      }
    },
    {
      "name": "2. Test AWS Bedrock Connection",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/recommendations/test",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "recommendations", "test"]
        },
        "description": "Test connection to AWS Bedrock service"
      }
    },
    {
      "name": "3. Get AI Recommendations",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/recommendations",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "recommendations"]
        },
        "description": "Get AI-powered financial recommendations"
      }
    }
  ]
}
```

---

## 🚀 Quick Start

1. **Start your server:**
   ```bash
   npm start
   ```

2. **Open Postman**

3. **Test endpoints in order:**
   - First: `/health` (should always work)
   - Second: `/test` (requires AWS credentials)
   - Third: `/` (requires AWS credentials + data)

4. **Check server console logs** for detailed information

---

## 📊 Expected Status Codes

| Endpoint | Success | Error |
|----------|---------|-------|
| `/health` | 200 | 500 |
| `/test` | 200 | 500 |
| `/` | 200 | 500 |

---

## 🐛 Troubleshooting

### Issue: 404 Not Found
**Cause:** You're using a non-existent endpoint  
**Solution:** Use only the 3 endpoints listed above

### Issue: 500 Internal Server Error on `/test` or `/`
**Cause:** Missing AWS credentials  
**Solution:** Add AWS credentials to `.env` file

### Issue: Empty or generic recommendations
**Cause:** No data in MongoDB  
**Solution:** Add some financial data first (assets, income, liabilities)

### Issue: Server not running
**Cause:** Node.js server not started  
**Solution:** Run `npm start` in terminal

---

## 📖 Documentation

For complete documentation, see:
- `documentation/08-ai-recommendation-system.md` - Full technical documentation
- `RECOMMENDATION_SYSTEM_COMPLETE.md` - Implementation summary
- `NEXT_STEPS_RECOMMENDATION.txt` - Quick start guide

---

**Last Updated:** October 23, 2025  
**Model:** Claude 3 Haiku  
**Endpoints:** 3 working endpoints  
**Status:** ✅ Production Ready

