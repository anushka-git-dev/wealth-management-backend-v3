# AWS Elastic Beanstalk Deployment Guide
## Wealth Management Backend Application

---

## ✅ Completed Setup Steps

### 1. **Project Configuration**
- ✅ Updated `package.json` with Node.js 20 engine specification
- ✅ Created `.ebignore` file to exclude unnecessary files from deployment
- ✅ Created `.ebextensions` configuration directory with:
  - `01_nodejs.config` - Node.js and proxy configuration
  - `02_environment.config` - Environment and health check settings

### 2. **Elastic Beanstalk Initialization**
- ✅ Initialized EB application: `wealth-management-backend`
- ✅ Region: `us-east-1`
- ✅ Platform: Node.js 20 running on 64bit Amazon Linux 2023
- ✅ Environment Name: `wealth-management-env`
- ✅ Instance Type: t2.micro

### 3. **Environment Creation**
- ⏳ Environment is currently being created (takes 5-10 minutes)
- Application version uploaded to S3
- Environment ID: Will be available once creation completes

---

## 📋 Next Steps

### Step 1: Monitor Environment Creation

Check the status of your environment:
```powershell
# Add EB CLI to PATH (if needed in new terminal)
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"

# Check environment status
eb status
```

Expected output when ready:
```
Environment details for: wealth-management-env
  Application name: wealth-management-backend
  Region: us-east-1
  Platform: Node.js 20 running on 64bit Amazon Linux 2023
  Status: Ready
  Health: Green
```

### Step 2: Configure Environment Variables

After the environment is created, set the required environment variables:

```powershell
# Set environment variables one by one
eb setenv MONGODB_URI="your_mongodb_connection_string"
eb setenv JWT_SECRET="your_jwt_secret_key"
eb setenv AWS_ACCESS_KEY_ID="your_aws_access_key"
eb setenv AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
eb setenv AWS_REGION="us-east-1"
eb setenv NODE_ENV="production"
```

**OR** set all at once:
```powershell
eb setenv MONGODB_URI="your_mongodb_connection_string" JWT_SECRET="your_jwt_secret_key" AWS_ACCESS_KEY_ID="your_aws_access_key" AWS_SECRET_ACCESS_KEY="your_aws_secret_key" AWS_REGION="us-east-1" NODE_ENV="production"
```

### Step 3: Deploy Application Updates (Future)

When you need to deploy code changes:
```powershell
eb deploy
```

### Step 4: Open Application in Browser

Once the environment is ready:
```powershell
eb open
```

This will open your application URL in the default browser.

---

## 🔧 Useful EB CLI Commands

### Environment Management
```powershell
# View environment status
eb status

# List all environments
eb list

# View recent logs
eb logs

# SSH into instance (if configured)
eb ssh

# View environment health
eb health

# Terminate environment (careful!)
eb terminate wealth-management-env
```

### Application Management
```powershell
# Deploy application
eb deploy

# Open application in browser
eb open

# View environment console in AWS Console
eb console

# View recent events
eb events
```

### Configuration Management
```powershell
# View current environment variables
eb printenv

# Set environment variable
eb setenv KEY=VALUE

# View configuration
eb config
```

---

## 🌐 Application Endpoints

Once deployed, your API will be accessible at:
```
http://wealth-management-env.<region>.elasticbeanstalk.com
```

### Available API Endpoints:
- `GET /` - Health check / Welcome message
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/assets` - Get all assets (protected)
- `POST /api/assets` - Create asset (protected)
- `GET /api/incomes` - Get all incomes (protected)
- `POST /api/incomes` - Create income (protected)
- `GET /api/liabilities` - Get all liabilities (protected)
- `POST /api/liabilities` - Create liability (protected)

---

## 🔒 Security Considerations

### Environment Variables
- ✅ Never commit `.env` file to version control
- ✅ Use EB environment variables for sensitive data
- ✅ Rotate AWS credentials regularly
- ✅ Use strong JWT secrets

### MongoDB Atlas Setup
1. **Whitelist EB IP Addresses:**
   - Go to MongoDB Atlas → Network Access
   - Add the IP address of your EB environment
   - Or use `0.0.0.0/0` for development (not recommended for production)

2. **Connection String:**
   - Use the MongoDB Atlas connection string in `MONGODB_URI`
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

### AWS Bedrock Access
- Ensure IAM role has permissions for Bedrock API
- Verify Claude 3 Sonnet model is enabled in your AWS account

---

## 📊 Monitoring and Logs

### View Application Logs
```powershell
# View last 100 lines
eb logs

# Follow logs in real-time
eb logs --stream

# View specific log file
eb logs --log-file /var/log/nodejs/nodejs.log
```

### CloudWatch Integration
- Application logs are automatically sent to CloudWatch Logs
- Access via AWS Console → CloudWatch → Log Groups
- Log group: `/aws/elasticbeanstalk/wealth-management-env/`

---

## 🚨 Troubleshooting

### Issue: Environment Creation Failed
**Solution:**
```powershell
# Check events for error details
eb events

# Check logs
eb logs
```

### Issue: Application Not Starting
**Possible causes:**
1. Missing environment variables
2. MongoDB connection failure
3. Port configuration mismatch

**Solution:**
```powershell
# Check environment variables
eb printenv

# Check logs for startup errors
eb logs

# Verify health status
eb health --refresh
```

### Issue: MongoDB Connection Error
**Solution:**
1. Verify MongoDB Atlas IP whitelist includes EB instance IP
2. Check `MONGODB_URI` environment variable is set correctly
3. Test connection string locally first

### Issue: Health Check Failures
**Possible causes:**
- Application not responding on port 8080
- Health check path returning error

**Solution:**
```powershell
# Check health check configuration
eb config

# View detailed health information
eb health --view

# Check application logs
eb logs
```

---

## 💰 Cost Considerations

### Current Configuration:
- **Instance Type:** t2.micro (Free tier eligible)
- **Load Balancer:** Application Load Balancer (ALB)
- **Data Transfer:** Pay as you go

### Free Tier Eligible:
- 750 hours/month of t2.micro instance
- 25 GB of storage
- 1 GB data transfer per month

### To Reduce Costs:
1. Use single instance (no load balancer) for development
2. Terminate environment when not in use
3. Monitor usage in AWS Cost Explorer

---

## 🔄 Scaling Configuration

### Auto Scaling (Future)
To enable auto-scaling, edit `.ebextensions/02_environment.config`:

```yaml
option_settings:
  aws:autoscaling:asg:
    MinSize: 1
    MaxSize: 4
  aws:autoscaling:trigger:
    MeasureName: CPUUtilization
    Statistic: Average
    Unit: Percent
    UpperThreshold: 80
    LowerThreshold: 20
```

Then deploy:
```powershell
eb deploy
```

---

## 📞 Support Resources

### AWS Documentation:
- [Elastic Beanstalk Node.js Guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-nodejs.html)
- [EB CLI Reference](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)

### Project Documentation:
- See `documentation/` folder for comprehensive API documentation
- `00-project-overview.md` - Project architecture
- `07-api-testing-usage.md` - API testing guide

---

## ✨ Quick Command Reference

```powershell
# Check status
eb status

# View logs
eb logs

# Deploy changes
eb deploy

# Open in browser
eb open

# Set environment variables
eb setenv KEY=VALUE

# View all environments
eb list

# SSH into instance
eb ssh

# Terminate environment
eb terminate wealth-management-env
```

---

## 📝 Important Notes

1. **First Deployment:** Environment creation takes 5-10 minutes
2. **Environment Variables:** Must be set after environment creation
3. **MongoDB Access:** Whitelist EB instance IP in MongoDB Atlas
4. **Port Configuration:** Application runs on port 8080 in EB (configured in .ebextensions)
5. **Health Check:** EB checks root endpoint `/` for health status

---

## ✅ Deployment Checklist

- [x] Project configured with Node.js 20
- [x] EB CLI installed and configured
- [x] AWS credentials configured
- [x] EB application initialized
- [x] EB environment creation started
- [ ] Wait for environment creation to complete (5-10 min)
- [ ] Set environment variables
- [ ] Whitelist EB IP in MongoDB Atlas
- [ ] Test application endpoints
- [ ] Monitor logs and health status

---

**Last Updated:** October 23, 2025
**Environment:** wealth-management-env
**Region:** us-east-1
**Platform:** Node.js 20 on Amazon Linux 2023

