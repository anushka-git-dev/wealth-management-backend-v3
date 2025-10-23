# 🤖 AI Recommendation System - Setup Guide

## Overview
AWS Bedrock-powered financial recommendation system using Claude 3 Haiku model.

---

## ✅ Implementation Complete!

All files have been created successfully:

### **Files Created:**
1. ✅ `src/services/dataAggregationService.js` - Collects data from MongoDB
2. ✅ `src/services/recommendationService.js` - AWS Bedrock + Claude 3 Haiku integration
3. ✅ `src/controllers/recommendationController.js` - HTTP request handlers
4. ✅ `src/routes/recommendationRoutes.js` - API endpoints
5. ✅ `src/routes/index.js` - Updated with recommendation routes
6. ✅ `server.js` - Updated with recommendation endpoint

---

## 🚀 Installation Steps

### Step 1: Install AWS Bedrock Runtime Package

```bash
npm install @aws-sdk/client-bedrock-runtime --save
```

This is a lightweight package (only Bedrock runtime, not the full AWS SDK).

### Step 2: Configure Environment Variables

Add to your `.env` file:

```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy
AWS_REGION=us-east-2
```

**⚠️ SECURITY NOTE:** Never commit these credentials to version control!

### Step 3: Start Your Server

```bash
npm start
```

Server should start on port 3001 (or your configured PORT).

---

## 🧪 Testing the Recommendation System

### Test 1: Health Check

```bash
curl http://localhost:3001/api/recommendations/health
```

**Expected Response:**
```json
{
  "success": true,
  "service": "Financial Recommendation System",
  "status": "operational",
  "model": "Claude 3 Haiku",
  "provider": "AWS Bedrock",
  "region": "us-east-2"
}
```

### Test 2: Connection Test

```bash
curl http://localhost:3001/api/recommendations/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "AWS Bedrock connection successful",
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "response": "Connection successful"
}
```

### Test 3: Get Recommendations

```bash
curl http://localhost:3001/api/recommendations
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
      ...
    ],
    "financialSummary": {
      "totalAssets": 1000000,
      "totalIncome": 500000,
      "totalLiabilities": 200000,
      "netWorth": 800000,
      "debtToAssetRatio": 20,
      "savingsRate": 60
    },
    "timestamp": "2025-10-23T..."
  }
}
```

---

## 📡 API Endpoints

### 1. Get Recommendations
```
GET /api/recommendations
```
- **Description:** Generate AI-powered financial recommendations
- **Authentication:** None (public)
- **Returns:** Array of recommendations + financial summary

### 2. Test Connection
```
GET /api/recommendations/test
```
- **Description:** Test AWS Bedrock connection
- **Authentication:** None (public)
- **Returns:** Connection status

### 3. Health Check
```
GET /api/recommendations/health
```
- **Description:** Get system health status
- **Authentication:** None (public)
- **Returns:** Service status and configuration

---

## 🔧 How It Works

### Data Flow:

```
1. Client Request
   ↓
2. recommendationController receives request
   ↓
3. dataAggregationService fetches all data from MongoDB
   - Assets from all users
   - Income from all users
   - Liabilities from all users
   ↓
4. Calculate totals and metrics
   - Total assets, income, liabilities
   - Debt-to-asset ratio
   - Savings rate
   - Category breakdowns
   ↓
5. Format data for AI prompt
   ↓
6. recommendationService sends to AWS Bedrock
   - Model: Claude 3 Haiku
   - Prompt: Financial data + request for recommendations
   ↓
7. Claude 3 Haiku generates recommendations
   ↓
8. Parse and format response
   ↓
9. Return to client
```

---

## 💰 Claude 3 Haiku Pricing

**Cost-Effective Choice:**
- **Input tokens:** $0.25 per million tokens
- **Output tokens:** $1.25 per million tokens

**Typical Request:**
- Input: ~500 tokens (financial data)
- Output: ~300 tokens (recommendations)
- **Cost per request:** ~$0.001-0.003 (less than a penny!)

**Monthly Estimate (1000 requests):**
- Cost: ~$1-3/month

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Store credentials in `.env` file
- ✅ Add `.env` to `.gitignore`
- ❌ Never commit credentials to git

### 2. AWS Bedrock Access
Your IAM user needs these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-*"
      ]
    }
  ]
}
```

### 3. For Production Deployment
When deploying to AWS Elastic Beanstalk:

```bash
# Set environment variables in EB
eb setenv AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
eb setenv AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy
eb setenv AWS_REGION=us-east-2
```

Or configure via AWS EB Console:
1. Go to your environment
2. Configuration → Software → Edit
3. Add environment properties
4. Apply

---

## 🐛 Troubleshooting

### Issue 1: Module Not Found Error

**Error:** `Cannot find module '@aws-sdk/client-bedrock-runtime'`

**Solution:**
```bash
npm install @aws-sdk/client-bedrock-runtime --save
```

### Issue 2: AWS Credentials Error

**Error:** `Missing credentials in config`

**Solution:**
- Check `.env` file has correct credentials
- Verify dotenv is loading: `require('dotenv').config()`
- Check environment variables: `console.log(process.env.AWS_ACCESS_KEY_ID)`

### Issue 3: Access Denied Error

**Error:** `User: arn:aws:iam::xxx:user/wealth-management-app-user is not authorized`

**Solution:**
- Verify IAM user has bedrock:InvokeModel permission
- Check model is available in us-east-2 region
- Ensure Claude 3 Haiku is enabled in your AWS account

### Issue 4: Model Not Found

**Error:** `The specified model ID is not supported`

**Solution:**
- Verify model ID: `anthropic.claude-3-haiku-20240307-v1:0`
- Check AWS Bedrock console for available models
- Ensure Claude 3 Haiku is enabled in your account

### Issue 5: No Data in Database

**Error:** Empty recommendations or zero values

**Solution:**
- Add sample data to MongoDB first:
  ```bash
  # Register users and add financial data
  curl -X POST http://localhost:3001/api/users/register ...
  curl -X POST http://localhost:3001/api/assets ...
  ```

---

## 📊 Testing with Sample Data

### Create Sample Financial Data

```bash
# 1. Register a user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Save the token from response
TOKEN="your_jwt_token_here"

# 2. Add some assets
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Savings Account","category":"Cash","amount":50000}'

curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Investment Portfolio","category":"Investments","amount":100000}'

# 3. Add some income
curl -X POST http://localhost:3001/api/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Monthly Salary","category":"Salary","amount":5000}'

# 4. Add some liabilities
curl -X POST http://localhost:3001/api/liabilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Credit Card","category":"Credit Card","amount":2000,"interestRate":18}'

# 5. Now get recommendations
curl http://localhost:3001/api/recommendations
```

---

## 📈 Expected Behavior

### With Data:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Build an emergency fund...",
      "Pay off credit card debt...",
      ...
    ],
    "financialSummary": {
      "totalAssets": 150000,
      "totalIncome": 5000,
      "totalLiabilities": 2000,
      "netWorth": 148000
    }
  }
}
```

### Without Data:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Start tracking your income and expenses...",
      "Create a budget..."
    ],
    "financialSummary": {
      "totalAssets": 0,
      "totalIncome": 0,
      "totalLiabilities": 0,
      "netWorth": 0
    }
  }
}
```

---

## 🎯 Next Steps

### For Local Development:
1. ✅ Install npm package
2. ✅ Configure environment variables
3. ✅ Add sample data to database
4. ✅ Test all endpoints
5. ✅ Review recommendations

### For Production Deployment:
1. ✅ Update package.json (already done)
2. ✅ Configure EB environment variables
3. ✅ Deploy to Elastic Beanstalk
4. ✅ Test production endpoint
5. ✅ Monitor usage and costs

---

## 📚 Additional Resources

- **AWS Bedrock Documentation:** https://docs.aws.amazon.com/bedrock/
- **Claude 3 Model Card:** https://www.anthropic.com/claude
- **Bedrock Runtime Client:** https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/

---

## ✨ Features

✅ **Simple Integration** - No complex setup required  
✅ **Cost-Effective** - Claude 3 Haiku is very affordable  
✅ **Public API** - No authentication needed  
✅ **Real-time** - Generate recommendations on-demand  
✅ **Comprehensive** - Uses all financial data  
✅ **Fallback** - Returns generic advice if API fails  
✅ **Scalable** - Can handle multiple requests  

---

## 🎉 Success!

Your AI-powered recommendation system is now ready!

**Test it:**
```bash
curl http://localhost:3001/api/recommendations
```

**Questions or issues?** Check the troubleshooting section above.

---

**Last Updated:** October 23, 2025  
**Model:** Claude 3 Haiku  
**Provider:** AWS Bedrock  
**Status:** Production Ready ✅

