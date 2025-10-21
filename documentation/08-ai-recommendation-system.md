# AI Recommendation System Documentation

## Overview
This document describes the AWS Bedrock-powered AI recommendation system that provides personalized financial advice using Claude 3 Sonnet. The system analyzes user's financial data from MongoDB and generates intelligent recommendations.

## Architecture

### Components
1. **Data Aggregation Service** - Collects and processes user financial data
2. **Recommendation Service** - Interfaces with AWS Bedrock and Claude 3 Sonnet
3. **Recommendation Controller** - Handles API requests for recommendations
4. **Recommendation Routes** - Exposes recommendation endpoints

### Technology Stack
- **AWS Bedrock** - Managed AI service for foundation models
- **Claude 3 Sonnet** - Anthropic's advanced language model
- **AWS SDK** - Bedrock runtime client
- **MongoDB** - User financial data source

## Implementation Details

### 1. Data Aggregation Service (`src/services/dataAggregationService.js`)

**Purpose:** Collects, processes, and formats user financial data for AI analysis.

**Key Features:**
- Aggregates assets, income, and liabilities data
- Calculates financial metrics (net worth, debt-to-asset ratio, savings rate)
- Categorizes financial data by type
- Assesses risk profile based on asset/liability distribution
- Formats data for AI prompt consumption

**Main Methods:**
```javascript
getUserFinancialData(userId)           // Get comprehensive financial data
calculateTotalAssets(assets)           // Calculate total asset value
calculateTotalIncome(incomes)          // Calculate total income
calculateTotalLiabilities(liabilities) // Calculate total liabilities
categorizeAssets(assets)               // Group assets by category
assessRiskProfile(assets, liabilities) // Determine risk profile
formatDataForAI(financialData)         // Format for AI prompts
```

### 2. Recommendation Service (`src/services/recommendationService.js`)

**Purpose:** Interfaces with AWS Bedrock to generate AI-powered financial recommendations.

**Key Features:**
- Claude 3 Sonnet integration via AWS Bedrock
- Multiple recommendation types (general, investment, debt, savings)
- Financial health scoring
- Personalized goal setting
- Optimized prompt engineering

**Main Methods:**
```javascript
generateRecommendations(userId, type)    // Generate recommendations
getFinancialHealthScore(userId)          // Get health score (1-100)
getFinancialGoals(userId)                // Get personalized goals
callClaude(prompt)                       // Call Claude 3 Sonnet
createPrompt(data, type)                 // Create optimized prompts
```

### 3. Recommendation Controller (`src/controllers/recommendationController.js`)

**Purpose:** Handles HTTP requests for recommendation services.

**Endpoints:**
- `GET /api/recommendations` - General recommendations
- `GET /api/recommendations/health-score` - Financial health score
- `GET /api/recommendations/goals` - Personalized goals
- `GET /api/recommendations/investment` - Investment recommendations
- `GET /api/recommendations/debt` - Debt management advice
- `GET /api/recommendations/savings` - Savings optimization
- `GET /api/recommendations/dashboard` - Comprehensive dashboard data

## API Endpoints

### 1. General Recommendations
```http
GET /api/recommendations?type=general
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_id",
    "recommendationType": "general",
    "timestamp": "2025-01-12T11:35:00.000Z",
    "financialSummary": {
      "totalAssets": 950000,
      "totalIncome": 350000,
      "totalLiabilities": 185000,
      "netWorth": 765000,
      "debtToAssetRatio": "19.47"
    },
    "recommendations": {
      "immediate_actions": ["Build emergency fund", "Review high-interest debt"],
      "short_term_goals": ["Increase savings rate", "Diversify investments"],
      "long_term_strategies": ["Retirement planning", "Tax optimization"],
      "risk_management": ["Insurance review", "Asset allocation"],
      "savings_optimization": ["Automate savings", "High-yield accounts"],
      "debt_reduction": ["Debt consolidation", "Payment prioritization"],
      "investment_opportunities": ["Index funds", "Real estate"],
      "summary": "Strong financial position with opportunities for optimization"
    }
  }
}
```

### 2. Financial Health Score
```http
GET /api/recommendations/health-score
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_id",
    "score": 85,
    "grade": "Good",
    "explanation": "Strong asset base with manageable debt levels",
    "strengths": ["High net worth", "Diversified assets"],
    "concerns": ["High-interest debt", "Low emergency fund"],
    "timestamp": "2025-01-12T11:35:00.000Z"
  }
}
```

### 3. Personalized Goals
```http
GET /api/recommendations/goals
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_id",
    "goals": {
      "short_term_goals": [
        {
          "goal": "Build emergency fund",
          "target_amount": 10000,
          "timeframe": "6 months",
          "priority": "High",
          "action_steps": ["Set up automatic transfers", "Open high-yield savings account"]
        }
      ],
      "medium_term_goals": [
        {
          "goal": "Pay off credit card debt",
          "target_amount": 5000,
          "timeframe": "12 months",
          "priority": "High",
          "action_steps": ["Create payment plan", "Consider debt consolidation"]
        }
      ],
      "long_term_goals": [
        {
          "goal": "Retirement savings",
          "target_amount": 500000,
          "timeframe": "20 years",
          "priority": "Medium",
          "action_steps": ["Maximize 401k contributions", "Open IRA account"]
        }
      ]
    }
  }
}
```

### 4. Dashboard Data
```http
GET /api/recommendations/dashboard
Authorization: Bearer <jwt_token>
```

**Response:** Comprehensive data including recommendations, health score, goals, and financial summary.

## Prompt Engineering

### General Recommendations Prompt
```
You are a professional financial advisor with expertise in personal finance, investment strategies, debt management, and wealth building.

Based on this comprehensive financial profile, provide personalized recommendations covering:
1. Immediate actions (next 30 days)
2. Short-term goals (3-6 months)
3. Long-term strategies (1-2 years)
4. Risk management
5. Savings optimization
6. Debt reduction strategies
7. Investment opportunities

Format response as JSON with specific structure.
```

### Health Score Prompt
```
Based on this financial profile, provide a financial health score from 1-100 considering:
- Debt-to-asset ratio
- Savings rate
- Asset diversification
- Income stability
- Emergency fund adequacy

Respond with JSON format including score, grade, explanation, strengths, and concerns.
```

### Goals Prompt
```
Based on this financial profile, suggest 5-7 personalized SMART goals:
- Specific, Measurable, Achievable, Relevant, Time-bound
- Consider current financial position
- Include action steps for each goal

Respond with JSON format including short-term, medium-term, and long-term goals.
```

## Configuration

### Environment Variables
```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
```

### AWS Bedrock Configuration
- **Model:** Claude 3 Sonnet (anthropic.claude-3-sonnet-20240229-v1:0)
- **Max Tokens:** 4000
- **Temperature:** 0.7
- **Region:** us-east-1

## Data Flow

### 1. Request Flow
```
Client Request → Recommendation Controller → Recommendation Service → Data Aggregation Service → MongoDB
```

### 2. Response Flow
```
MongoDB → Data Aggregation Service → Recommendation Service → AWS Bedrock → Claude 3 Sonnet → Response Processing → Client
```

### 3. Data Processing
1. **Data Collection:** Gather user's assets, income, and liabilities
2. **Data Analysis:** Calculate financial metrics and ratios
3. **Data Categorization:** Group data by categories and types
4. **Risk Assessment:** Determine user's risk profile
5. **Prompt Creation:** Format data for AI consumption
6. **AI Processing:** Send to Claude 3 Sonnet via AWS Bedrock
7. **Response Parsing:** Extract and format recommendations
8. **Client Response:** Return structured recommendations

## Financial Metrics Calculated

### Basic Metrics
- **Total Assets:** Sum of all asset values
- **Total Income:** Sum of all income sources
- **Total Liabilities:** Sum of all debt amounts
- **Net Worth:** Assets minus liabilities
- **Debt-to-Asset Ratio:** (Liabilities / Assets) × 100

### Advanced Metrics
- **Savings Rate:** ((Income - Liabilities) / Income) × 100
- **Monthly Income:** Estimated monthly income from salary sources
- **Monthly Expenses:** Estimated monthly payments for liabilities
- **Risk Profile:** Conservative, Moderate, or High Risk based on asset/liability mix

### Categorization Analysis
- **Asset Categories:** Distribution by type (Cash, Investments, Real Estate, etc.)
- **Income Categories:** Distribution by source (Salary, Business, Investments, etc.)
- **Liability Categories:** Distribution by type with average interest rates

## Error Handling

### Common Errors
1. **AWS Authentication Error:** Invalid credentials or permissions
2. **Bedrock Service Error:** Service unavailable or quota exceeded
3. **Data Aggregation Error:** Missing or invalid user data
4. **Prompt Processing Error:** Invalid response format from Claude

### Error Responses
```json
{
  "success": false,
  "message": "Failed to generate recommendations",
  "error": "Detailed error message"
}
```

## Performance Considerations

### Optimization Strategies
1. **Data Caching:** Cache aggregated financial data
2. **Async Processing:** Use Promise.all for parallel data fetching
3. **Response Streaming:** Stream large responses for better UX
4. **Rate Limiting:** Implement rate limiting for AI requests

### Cost Management
1. **Token Optimization:** Minimize prompt length while maintaining quality
2. **Request Batching:** Batch multiple requests when possible
3. **Caching:** Cache recommendations to reduce API calls
4. **Usage Monitoring:** Track API usage and costs

## Security Considerations

### Data Privacy
1. **User Isolation:** All recommendations are user-specific
2. **Data Encryption:** Financial data encrypted in transit and at rest
3. **Access Control:** JWT-based authentication required
4. **Audit Logging:** Log all recommendation requests

### AWS Security
1. **IAM Roles:** Proper IAM permissions for Bedrock access
2. **VPC Configuration:** Secure network configuration
3. **Encryption:** Data encrypted using AWS KMS
4. **Monitoring:** CloudWatch monitoring and alerting

### Credential Security
1. **Environment Variables:** Store AWS credentials in .env file
2. **Never Commit Credentials:** Use .gitignore to exclude .env from version control
3. **Use Placeholders:** Replace actual credentials with placeholders in documentation
4. **Rotate Keys:** Regularly rotate AWS access keys

## Testing

### Unit Tests
```javascript
// Test data aggregation
const financialData = await dataAggregationService.getUserFinancialData(userId);
expect(financialData.financialSummary.netWorth).toBeDefined();

// Test recommendation generation
const recommendations = await recommendationService.generateRecommendations(userId, 'general');
expect(recommendations.recommendations).toBeDefined();
```

### Integration Tests
```javascript
// Test complete recommendation flow
const response = await request(app)
  .get('/api/recommendations')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);

expect(response.body.success).toBe(true);
expect(response.body.data.recommendations).toBeDefined();
```

### Manual Testing with Postman
1. **Authentication:** Login and get JWT token
2. **Add Sample Data:** Create assets, income, and liabilities
3. **Test Endpoints:** Call all recommendation endpoints
4. **Verify Responses:** Check response format and content

## Future Enhancements

### Planned Features
1. **Recommendation History:** Track recommendation accuracy
2. **Custom Prompts:** User-defined recommendation preferences
3. **Market Integration:** Real-time market data for recommendations
4. **Goal Tracking:** Monitor progress toward financial goals
5. **Notification System:** Alerts for important financial actions

### Technical Improvements
1. **Response Caching:** Cache AI responses for better performance
2. **Batch Processing:** Process multiple users simultaneously
3. **A/B Testing:** Test different prompt strategies
4. **Analytics:** Track recommendation effectiveness
5. **Multi-Model Support:** Support for different AI models

## Troubleshooting

### Common Issues
1. **AWS Credentials:** Verify AWS credentials and permissions
2. **Bedrock Access:** Ensure Bedrock service is enabled in AWS account
3. **Model Availability:** Check if Claude 3 Sonnet is available in region
4. **Data Issues:** Verify user has financial data in database

### Debug Steps
1. Check AWS credentials in environment variables
2. Verify Bedrock service status in AWS console
3. Test data aggregation service independently
4. Check Claude API response format
5. Validate JSON parsing and error handling

## Security Best Practices

### Environment Configuration
```env
# Example .env file (DO NOT commit actual credentials)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### .gitignore Configuration
```gitignore
# Environment variables
.env
.env.local
.env.production

# AWS credentials
*.pem
*.key

# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/
```

### Documentation Security
- **Never include real credentials** in documentation
- **Use placeholders** for all sensitive information
- **Regularly review** documentation for exposed secrets
- **Update placeholders** when showing examples

## Conclusion

The AI recommendation system provides intelligent, personalized financial advice by leveraging AWS Bedrock and Claude 3 Sonnet. The system analyzes comprehensive financial data and generates actionable recommendations across multiple areas of personal finance.

The modular architecture allows for easy extension and modification, while the comprehensive error handling ensures reliable operation. The system is designed to scale with growing user bases and evolving financial needs.

**Important:** Always use placeholder credentials in documentation and store actual credentials securely in environment variables that are never committed to version control.
