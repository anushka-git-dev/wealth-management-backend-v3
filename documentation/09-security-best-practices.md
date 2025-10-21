# Security Best Practices Documentation

## Overview
This document outlines security best practices for the Wealth Management Backend API, including credential management, data protection, and deployment security.

## Credential Management

### Environment Variables Security

#### ✅ DO: Use Environment Variables
```env
# Store all sensitive data in environment variables
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your_jwt_secret_key_here
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
```

#### ❌ DON'T: Hardcode Credentials
```javascript
// NEVER do this in your code
const mongodb_uri = "mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/wealth-management-app-db";
const jwt_secret = "your-super-secret-jwt-key-2025";
```

### .env File Security

#### Configuration Template
Create a `config-template.env` file with placeholders:
```env
# Server Configuration
PORT=3001

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
```

#### .gitignore Configuration
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development

# AWS credentials
*.pem
*.key
aws-credentials.json

# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

## Documentation Security

### ✅ DO: Use Placeholders in Documentation
```env
# In documentation files, always use placeholders
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your_jwt_secret_key_here
```

### ❌ DON'T: Include Real Credentials in Documentation
```env
# NEVER include actual credentials in documentation
AWS_ACCESS_KEY_ID=your_actual_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

## AWS Security Best Practices

### IAM Configuration

#### Create Dedicated IAM User
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

#### Key Rotation
- Rotate AWS access keys every 90 days
- Use AWS IAM key rotation features
- Monitor key usage in CloudTrail

### Bedrock Model Access

#### Enable Only Required Models
1. Go to AWS Bedrock Console
2. Navigate to "Model access"
3. Request access only to required models:
   - Claude 3 Sonnet (for production)
   - Claude 3 Haiku (for development/fallback)

#### Use Least Privilege Principle
- Grant minimum required permissions
- Use specific model ARNs in IAM policies
- Regularly audit permissions

## Database Security

### MongoDB Atlas Security

#### Network Access
```javascript
// Configure IP whitelist in MongoDB Atlas
// Add only your server's IP addresses
// Use VPC peering for production environments
```

#### Authentication
```javascript
// Use strong passwords
// Enable multi-factor authentication
// Use MongoDB Atlas built-in authentication
```

#### Encryption
```javascript
// Enable encryption at rest
// Use TLS/SSL for connections
// Rotate encryption keys regularly
```

## Application Security

### JWT Security

#### Strong Secret Generation
```javascript
// Generate strong JWT secrets
const crypto = require('crypto');
const jwt_secret = crypto.randomBytes(64).toString('hex');
```

#### Token Expiration
```javascript
// Set appropriate token expiration
const token = jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: '30d', // 30 days
});
```

### Input Validation

#### Sanitize User Input
```javascript
// Always validate and sanitize input
const { name, email, password } = req.body;

// Validate email format
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: 'Invalid email format' });
}
```

#### Prevent Injection Attacks
```javascript
// Use parameterized queries (Mongoose handles this automatically)
const user = await User.findOne({ email: email }); // Safe
// Avoid: User.findOne({ email: `'${email}'` }); // Unsafe
```

## API Security

### Rate Limiting

#### Implement Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### CORS Configuration

#### Production CORS Settings
```javascript
// For production, restrict CORS to specific origins
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

### Error Handling

#### Secure Error Messages
```javascript
// Don't expose sensitive information in error messages
try {
  // Some operation
} catch (error) {
  // Log detailed error for debugging
  console.error('Detailed error:', error);
  
  // Return generic error to client
  res.status(500).json({ 
    message: 'Internal server error' 
  });
}
```

## Deployment Security

### Environment Separation

#### Development Environment
```env
# Development .env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wealth-management-dev
JWT_SECRET=dev_jwt_secret_key
```

#### Production Environment
```env
# Production .env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/wealth-management-prod
JWT_SECRET=super_secure_production_jwt_secret_key
```

### Server Security

#### HTTPS Configuration
```javascript
// Always use HTTPS in production
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

#### Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## Monitoring and Logging

### Security Monitoring

#### Log Security Events
```javascript
// Log authentication attempts
console.log(`Login attempt for user: ${email} from IP: ${req.ip}`);

// Log failed authentication
console.log(`Failed login attempt for user: ${email} from IP: ${req.ip}`);

// Log API access
console.log(`API access: ${req.method} ${req.path} from IP: ${req.ip}`);
```

#### Monitor for Anomalies
```javascript
// Monitor unusual API usage patterns
// Track failed authentication attempts
// Monitor for suspicious requests
```

### AWS CloudWatch Integration
```javascript
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

// Send custom metrics
await cloudwatch.putMetricData({
  Namespace: 'WealthManagement/API',
  MetricData: [{
    MetricName: 'RecommendationRequests',
    Value: 1,
    Unit: 'Count'
  }]
});
```

## Incident Response

### Security Incident Plan

#### Immediate Response
1. **Identify the breach** - Determine scope and impact
2. **Contain the threat** - Isolate affected systems
3. **Assess damage** - Evaluate data exposure
4. **Notify stakeholders** - Inform users if necessary

#### Recovery Steps
1. **Patch vulnerabilities** - Fix security issues
2. **Rotate credentials** - Change all compromised keys
3. **Update security measures** - Implement additional protections
4. **Monitor systems** - Watch for continued threats

### Regular Security Audits

#### Monthly Security Checklist
- [ ] Review access logs
- [ ] Check for unusual API usage
- [ ] Verify impersonation permissions
- [ ] Update dependencies
- [ ] Review security documentation

#### Quarterly Security Review
- [ ] Conduct penetration testing
- [ ] Review and update security policies
- [ ] Train team on security best practices
- [ ] Update incident response plan

## Compliance and Regulations

### Data Protection

#### GDPR Compliance
- Implement data minimization
- Provide data portability
- Enable data deletion
- Obtain explicit consent

#### Financial Data Protection
- Encrypt sensitive financial data
- Implement access controls
- Regular security assessments
- Audit trails for all transactions

### Documentation Requirements

#### Security Documentation
- Maintain security incident logs
- Document security procedures
- Keep compliance records
- Regular security training records

## Conclusion

Security is a continuous process that requires regular attention and updates. By following these best practices, you can significantly reduce the risk of security breaches and protect your users' financial data.

**Key Takeaways:**
1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Implement proper authentication** and authorization
4. **Monitor and log** security events
5. **Regular security audits** and updates
6. **Follow least privilege principle** for access control
7. **Keep dependencies updated** and secure

Remember: Security is not a one-time setup but an ongoing commitment to protecting your application and users.
