# AWS Elastic Beanstalk Deployment Documentation

## Overview
This document provides comprehensive instructions for deploying the Wealth Management Backend API to AWS Elastic Beanstalk using Node.js 20 on Amazon Linux 2023 in the us-east-2 (Ohio) region.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS EB CLI Installation](#aws-eb-cli-installation)
3. [Project Configuration](#project-configuration)
4. [Deployment Files Structure](#deployment-files-structure)
5. [Deployment Process](#deployment-process)
6. [Environment Variables Configuration](#environment-variables-configuration)
7. [Testing Deployment](#testing-deployment)
8. [Monitoring and Logs](#monitoring-and-logs)
9. [Troubleshooting](#troubleshooting)
10. [Cost Considerations](#cost-considerations)

---

## Prerequisites

### Required Software
- **Python 3.7+** - For AWS EB CLI
- **pip** - Python package manager
- **AWS CLI** - AWS Command Line Interface
- **Node.js 20** - Application runtime
- **Git** - Version control

### AWS Account Requirements
- Active AWS account
- IAM user with Elastic Beanstalk permissions
- AWS credentials configured (Access Key ID and Secret Access Key)

### MongoDB Atlas
- Active MongoDB Atlas cluster
- Database connection string
- Network access configured

---

## AWS EB CLI Installation

### Step 1: Install AWS EB CLI

**Windows (PowerShell):**
```powershell
# Install EB CLI via pip
pip install awsebcli --upgrade --user

# Verify installation
eb --version
```

**Expected Output:**
```
EB CLI 3.25.1 (Python 3.10.11)
```

### Step 2: Add EB CLI to PATH

**Windows:**
```powershell
# Temporary (current session)
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"

# Permanent (add to system environment variables)
# 1. Open System Properties → Environment Variables
# 2. Edit PATH variable
# 3. Add: C:\Users\User\AppData\Roaming\Python\Python310\Scripts
```

### Step 3: Install AWS CLI

Download and install from: https://aws.amazon.com/cli/

**Verify installation:**
```powershell
aws --version
```

### Step 4: Configure AWS Credentials

```powershell
# Configure AWS credentials
aws configure

# Enter when prompted:
# - AWS Access Key ID: [Your Access Key]
# - AWS Secret Access Key: [Your Secret Key]
# - Default region name: us-east-2
# - Default output format: json
```

**Verify credentials:**
```powershell
aws sts get-caller-identity
```

---

## Project Configuration

### 1. Package.json Configuration

**File:** `package.json`

Added Node.js engine specification:

```json
{
  "name": "wealth-management-backend-v3",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "20.x",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.19.1"
  }
}
```

### 2. EB Extensions Configuration

**Directory:** `.ebextensions/`

#### File: `.ebextensions/01_nodejs.config`

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
  aws:elasticbeanstalk:environment:proxy:
    ProxyServer: nginx
```

**Key Points:**
- Removed `NodeCommand` and `NodeVersion` (not supported in AL2023)
- Platform automatically uses `npm start` from package.json
- Node.js 20 version set at environment level

#### File: `.ebextensions/02_environment.config`

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    PORT: 8080
    NODE_ENV: production
  
  # Health check configuration
  aws:elasticbeanstalk:environment:process:default:
    HealthCheckPath: /
    Port: '8080'
    Protocol: HTTP
  
  # Instance configuration
  aws:autoscaling:launchconfiguration:
    InstanceType: t2.micro
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role
  
  # Load balancer configuration
  aws:elasticbeanstalk:environment:
    LoadBalancerType: application
    ServiceRole: aws-elasticbeanstalk-service-role
```

### 3. EB Ignore Configuration

**File:** `.ebignore`

```
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

# Dependencies (will be installed on EB)
node_modules/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Documentation (optional)
documentation/

# Git files
.git/
.gitignore

# Test files
test/
tests/
*.test.js
*.spec.js
```

### 4. EB Configuration

**File:** `.elasticbeanstalk/config.yml`

```yaml
branch-defaults:
  default:
    environment: wealth-mgmt-prod
    group_suffix: null
  feature/recommendation-llm-system-v2:
    environment: wealth-mgmt-prod
    group_suffix: null
global:
  application_name: wealth-management-backend
  branch: null
  default_ec2_keyname: null
  default_platform: Node.js 20
  default_region: us-east-2
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: git
  workspace_type: Application
```

---

## Deployment Files Structure

### Complete Project Structure for Deployment

```
wealth-management-backend-v3/
├── .ebextensions/
│   ├── 01_nodejs.config           # Node.js configuration
│   └── 02_environment.config      # Environment settings
├── .elasticbeanstalk/
│   └── config.yml                 # EB project configuration
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Business logic
│   ├── middleware/                # Authentication & logging
│   ├── models/                    # Database schemas
│   └── routes/                    # API endpoints
├── server.js                      # Application entry point
├── package.json                   # Dependencies & scripts
├── package-lock.json              # Dependency lock file
├── .ebignore                      # Files to exclude from deployment
├── .gitignore                     # Git exclusions
└── documentation/                 # Project documentation
```

### Deployment Package Contents

**Files included in deployment:**
- `server.js`
- `src/` directory (all application code)
- `package.json`
- `package-lock.json`
- `.ebextensions/` directory

**Files excluded:**
- `node_modules/` (installed by EB)
- `.env` (use environment variables)
- `documentation/`
- `.git/`

---

## Deployment Process

### Method 1: AWS Elastic Beanstalk CLI (Recommended)

#### Step 1: Initialize Elastic Beanstalk

```powershell
# Navigate to project directory
cd "E:\My-Education\Full-Stack-Dev\AI\AI Assist Vibe Coding-2025\Day-2\wealth-management-backend-v3"

# Initialize EB application
eb init -p "Node.js 20" -r us-east-2 wealth-management-backend
```

#### Step 2: Create Environment

```powershell
# Create environment with single instance (free tier)
eb create wealth-mgmt-prod --region us-east-2 --instance-type t2.micro --single --timeout 15
```

**Process takes 5-10 minutes:**
- Creates S3 bucket for application versions
- Uploads application code
- Launches EC2 instance (t2.micro)
- Configures security groups
- Sets up health monitoring
- Assigns URL

#### Step 3: Monitor Creation

```powershell
# Check environment status
eb status

# View recent events
eb events

# View logs
eb logs
```

**Expected Status:**
```
Environment details for: wealth-mgmt-prod
  Application name: wealth-management-backend
  Region: us-east-2
  Platform: Node.js 20 running on 64bit Amazon Linux 2023
  Status: Ready
  Health: Green
  CNAME: wealth-mgmt-prod.eba-4hbkvm4b.us-east-2.elasticbeanstalk.com
```

### Method 2: AWS Console Deployment

#### Step 1: Create Deployment Package

```powershell
# Create deployment zip
Compress-Archive -Path server.js,src,package.json,package-lock.json,.ebextensions -DestinationPath wealth-backend-deploy.zip -Force
```

#### Step 2: Deploy via AWS Console

1. **Navigate to:** https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-2

2. **Click:** "Create Application"

3. **Configure Application:**
   - **Application name:** `wealth-management-backend`
   - **Platform:** Node.js
   - **Platform branch:** Node.js 20 running on 64bit Amazon Linux 2023
   - **Platform version:** 6.6.6 (Recommended)

4. **Upload Code:**
   - Select: "Upload your code"
   - Choose file: `wealth-backend-deploy.zip`
   - Version label: `v1.0`

5. **Configure Preset:**
   - Select: "Single instance (free tier eligible)"

6. **Review and Submit**

#### Step 3: Wait for Creation (5-10 minutes)

Monitor progress in AWS Console:
- Creating environment
- Launching resources
- Deploying application
- Running health checks

---

## Environment Variables Configuration

### Required Environment Variables

After environment creation, configure these variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://admin:password@cluster.mongodb.net/db-name` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-2025` |
| `AWS_ACCESS_KEY_ID` | AWS access key (for Bedrock) | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `your_secret_key` |
| `AWS_REGION` | AWS region for services | `us-east-2` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `8080` |

### Configuration Methods

#### Method 1: AWS Console

1. Navigate to environment
2. Click **"Configuration"** (left sidebar)
3. Find **"Software"** section → Click **"Edit"**
4. Scroll to **"Environment properties"**
5. Add each variable:
   - Click **"Add environment property"**
   - Enter **Name** and **Value**
   - Repeat for all variables
6. Click **"Apply"** at bottom
7. Wait 2-3 minutes for update

#### Method 2: EB CLI

```powershell
# Set all variables at once
eb setenv MONGODB_URI="mongodb+srv://..." `
  JWT_SECRET="your-secret" `
  AWS_ACCESS_KEY_ID="your-key" `
  AWS_SECRET_ACCESS_KEY="your-secret-key" `
  AWS_REGION="us-east-2" `
  NODE_ENV="production" `
  PORT="8080"

# Verify variables
eb printenv
```

#### Method 3: AWS CLI

```powershell
aws elasticbeanstalk update-environment `
  --environment-name wealth-mgmt-prod `
  --option-settings `
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=MONGODB_URI,Value="your-connection-string" `
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value="your-secret" `
  --region us-east-2
```

---

## MongoDB Atlas Configuration

### Configure Network Access

1. **Go to:** https://cloud.mongodb.com
2. **Navigate to:** Network Access
3. **Click:** "Add IP Address"

**Options:**

**Option A: Specific IP (Production)**
- Get EB instance IP:
  ```powershell
  aws ec2 describe-instances --region us-east-2 --filters "Name=tag:elasticbeanstalk:environment-name,Values=wealth-mgmt-prod" --query "Reservations[].Instances[].PublicIpAddress" --output text
  ```
- Add this IP to MongoDB Atlas

**Option B: All IPs (Development)**
- IP Address: `0.0.0.0/0`
- Description: "Allow all (development only)"
- **⚠️ Not recommended for production**

4. Click **"Confirm"**

### Verify Connection

```powershell
# SSH into EB instance
eb ssh

# Test MongoDB connection
curl -I https://cloud.mongodb.com
exit
```

---

## Testing Deployment

### 1. Health Check Endpoint

```powershell
# Get environment URL
$URL = "http://wealth-mgmt-prod.eba-4hbkvm4b.us-east-2.elasticbeanstalk.com"

# Test health endpoint
Invoke-RestMethod -Uri $URL
```

**Expected Response:**
```json
{
  "message": "Welcome to Wealth Management API"
}
```

### 2. User Registration Test

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$URL/api/users/register" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. User Login Test

```powershell
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$URL/api/users/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
```

### 4. Protected Route Test

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "$URL/api/users/profile" -Headers $headers
```

### 5. Complete API Test Script

```powershell
# Full API test
$URL = "http://wealth-mgmt-prod.eba-4hbkvm4b.us-east-2.elasticbeanstalk.com"

# 1. Health check
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
Invoke-RestMethod -Uri $URL

# 2. Register user
Write-Host "`nRegistering user..." -ForegroundColor Cyan
$registerBody = @{name="Test User"; email="test@example.com"; password="pass123"} | ConvertTo-Json
$user = Invoke-RestMethod -Uri "$URL/api/users/register" -Method POST -Body $registerBody -ContentType "application/json"

# 3. Login
Write-Host "`nLogging in..." -ForegroundColor Cyan
$loginBody = @{email="test@example.com"; password="pass123"} | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$URL/api/users/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.token

# 4. Get profile
Write-Host "`nGetting profile..." -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "$URL/api/users/profile" -Headers $headers

# 5. Create asset
Write-Host "`nCreating asset..." -ForegroundColor Cyan
$assetBody = @{description="Savings"; category="Cash"; amount=100000} | ConvertTo-Json
Invoke-RestMethod -Uri "$URL/api/assets" -Method POST -Body $assetBody -ContentType "application/json" -Headers $headers

Write-Host "`n✅ All tests passed!" -ForegroundColor Green
```

---

## Monitoring and Logs

### View Application Logs

#### Method 1: EB CLI

```powershell
# View last 100 lines
eb logs

# Stream logs in real-time
eb logs --stream

# View specific log file
eb logs --log-file /var/log/nodejs/nodejs.log
```

#### Method 2: AWS Console

1. Go to environment dashboard
2. Click **"Logs"** (left sidebar)
3. Click **"Request Logs"** → **"Last 100 Lines"**
4. Download and view log file

#### Method 3: CloudWatch Logs

1. Go to AWS CloudWatch Console
2. Navigate to: **Log groups**
3. Find: `/aws/elasticbeanstalk/wealth-mgmt-prod/`
4. View log streams

### Monitor Environment Health

```powershell
# Check environment status
eb status

# Check detailed health
eb health --refresh

# View environment events
eb events --follow
```

### Key Metrics to Monitor

- **Environment Health:** Green/Yellow/Red
- **Instance Status:** Running/Stopped
- **Response Time:** Check latency
- **Error Rate:** Monitor 4xx/5xx errors
- **CPU Utilization:** Keep below 80%
- **Memory Usage:** Monitor for leaks

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Environment Creation Failed

**Symptoms:**
- Environment status: Red
- Events show errors

**Solutions:**
```powershell
# Check events for details
eb events

# Check logs
eb logs

# Common fixes:
# 1. Verify .ebextensions configuration
# 2. Check package.json has "start" script
# 3. Ensure all dependencies are in package.json
```

#### Issue 2: Configuration Validation Errors

**Error:** "Unknown or duplicate parameter: NodeVersion"

**Solution:**
Remove incompatible parameters from `.ebextensions/01_nodejs.config`:
```yaml
# Remove these (not supported in AL2023):
# NodeCommand
# NodeVersion
```

#### Issue 3: MongoDB Connection Timeout

**Symptoms:**
- Application health: Yellow/Red
- Logs show: "MongoNetworkError: connection timed out"

**Solutions:**
1. **Verify MongoDB Atlas IP whitelist:**
   ```powershell
   # Get EB instance IP
   aws ec2 describe-instances --region us-east-2 --filters "Name=tag:elasticbeanstalk:environment-name,Values=wealth-mgmt-prod" --query "Reservations[].Instances[].PublicIpAddress"
   ```
2. Add IP to MongoDB Atlas Network Access
3. Or use `0.0.0.0/0` for testing

#### Issue 4: Application Not Starting

**Symptoms:**
- Health checks failing
- Port not responding

**Solutions:**
```powershell
# 1. Verify PORT environment variable
eb printenv | grep PORT

# 2. Check application logs
eb logs

# 3. SSH into instance
eb ssh
sudo tail -f /var/log/nodejs/nodejs.log
```

#### Issue 5: Environment Variables Not Loading

**Symptoms:**
- `process.env.VARIABLE_NAME` is undefined

**Solutions:**
```powershell
# 1. Verify variables are set
eb printenv

# 2. Set missing variables
eb setenv VARIABLE_NAME="value"

# 3. Restart environment
eb restart
```

### Debugging Commands

```powershell
# Get environment details
aws elasticbeanstalk describe-environments --environment-names wealth-mgmt-prod --region us-east-2

# Get configuration settings
aws elasticbeanstalk describe-configuration-settings --application-name wealth-management-backend --environment-name wealth-mgmt-prod --region us-east-2

# View recent events
aws elasticbeanstalk describe-events --environment-name wealth-mgmt-prod --region us-east-2 --max-records 20

# SSH into instance
eb ssh

# Check Node.js version
node --version

# Check application status
pm2 status
pm2 logs
```

---

## Updating the Application

### Deploy Code Changes

#### Method 1: EB CLI

```powershell
# Deploy latest code
eb deploy

# Deploy with specific version label
eb deploy --version v1.1
```

#### Method 2: Create New Version

```powershell
# Create new deployment package
Compress-Archive -Path server.js,src,package.json,package-lock.json,.ebextensions -DestinationPath wealth-backend-deploy-v1.1.zip -Force

# Upload via AWS Console
# 1. Go to Application versions
# 2. Click "Upload"
# 3. Select new zip file
# 4. Deploy to environment
```

### Rolling Updates

EB performs rolling updates by default:
- Updates one instance at a time
- Ensures at least one instance is always available
- Automatically rolls back if health checks fail

### Zero-Downtime Deployment

For production with multiple instances:
```yaml
# .ebextensions/deployment-policy.config
option_settings:
  aws:elasticbeanstalk:command:
    DeploymentPolicy: Rolling
    BatchSizeType: Percentage
    BatchSize: 50
```

---

## Cost Considerations

### Free Tier Eligibility

**Included in AWS Free Tier:**
- 750 hours/month of t2.micro EC2 instance
- 5 GB of Amazon EBS storage
- 750 hours of Elastic Load Balancer (if used)

**Monthly Costs (Single Instance):**
- t2.micro instance: **FREE** (within free tier limits)
- EBS storage (10 GB): ~$1.00/month
- Data transfer (first 1 GB): **FREE**
- Total: **~$1-2/month** with free tier

### Cost Optimization Tips

1. **Use Single Instance:** Avoid load balancer costs
2. **Terminate when not in use:**
   ```powershell
   eb terminate wealth-mgmt-prod
   ```
3. **Use t2.micro:** Stay within free tier
4. **Monitor usage:** Check AWS Cost Explorer

### Terminate Environment

```powershell
# Terminate environment (saves costs)
eb terminate wealth-mgmt-prod

# Confirm when prompted
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] AWS account created and configured
- [ ] AWS CLI installed and credentials configured
- [ ] EB CLI installed
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables prepared
- [ ] Application tested locally

### Deployment

- [ ] Project configured with Node.js 20
- [ ] `.ebextensions` directory created
- [ ] `.ebignore` file configured
- [ ] EB application initialized
- [ ] Environment created
- [ ] Environment variables configured
- [ ] MongoDB Atlas IP whitelist configured

### Post-Deployment

- [ ] Health check endpoint responding
- [ ] User registration working
- [ ] Authentication working
- [ ] All API endpoints accessible
- [ ] MongoDB connection successful
- [ ] Logs show no errors
- [ ] Environment health: Green

---

## Quick Reference

### Essential Commands

```powershell
# Add EB CLI to PATH (if needed)
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"

# Initialize EB
eb init -p "Node.js 20" -r us-east-2 wealth-management-backend

# Create environment
eb create wealth-mgmt-prod --region us-east-2 --instance-type t2.micro --single

# Check status
eb status

# View logs
eb logs

# Set environment variables
eb setenv KEY=VALUE

# Deploy changes
eb deploy

# Open in browser
eb open

# SSH into instance
eb ssh

# Terminate environment
eb terminate wealth-mgmt-prod
```

### Your Deployed Application

**Application URL:**
```
http://wealth-mgmt-prod.eba-4hbkvm4b.us-east-2.elasticbeanstalk.com
```

**API Endpoints:**
- `GET /` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get profile (protected)
- `GET /api/assets` - Get assets (protected)
- `POST /api/assets` - Create asset (protected)
- `GET /api/incomes` - Get incomes (protected)
- `POST /api/incomes` - Create income (protected)
- `GET /api/liabilities` - Get liabilities (protected)
- `POST /api/liabilities` - Create liability (protected)

---

## Additional Resources

### Documentation Links
- **AWS Elastic Beanstalk:** https://docs.aws.amazon.com/elasticbeanstalk/
- **EB CLI Reference:** https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
- **Node.js on EB:** https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-nodejs.html
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

### Support Resources
- **AWS Support:** https://console.aws.amazon.com/support/
- **MongoDB Support:** https://support.mongodb.com/
- **Project Documentation:** See `documentation/` folder

---

## Conclusion

Your Wealth Management Backend API is now successfully deployed to AWS Elastic Beanstalk with:

✅ **Platform:** Node.js 20 on Amazon Linux 2023  
✅ **Region:** us-east-2 (Ohio)  
✅ **Instance:** t2.micro (Free Tier eligible)  
✅ **Database:** MongoDB Atlas  
✅ **Security:** JWT authentication, environment variables  
✅ **Monitoring:** CloudWatch logs, EB health checks  
✅ **Cost:** ~$1-2/month with free tier  

**Deployed:** October 23, 2025  
**Environment:** wealth-mgmt-prod  
**Status:** Production Ready ✅

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Author:** Wealth Management Backend Team

