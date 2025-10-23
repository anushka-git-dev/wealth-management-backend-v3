# 🚀 Quick Start Deployment Guide - us-east-2 (Ohio)

## ✅ Files Ready for Deployment

Your deployment package is ready: `wealth-backend-deploy.zip` (22.9 KB)

---

## 🎯 **FASTEST METHOD**: Deploy via AWS Console (5 minutes)

### Step 1: Open AWS Elastic Beanstalk Console

Click this link: https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-2

**Make sure the region shows: Ohio (us-east-2)**

---

### Step 2: Create New Application

1. Click **"Create Application"** button

2. Fill in the form:

#### Configure environment:
- **Application name**: `wealth-management-backend`
- **Environment name**: `wealth-mgmt-api` (or auto-generated)

#### Platform:
- **Platform**: Node.js
- **Platform branch**: Node.js 20 running on 64bit Amazon Linux 2023
- **Platform version**: (Recommended - latest)

#### Application code:
- Select: **Upload your code**
- Click **"Choose file"**
- Navigate to: `E:\My-Education\Full-Stack-Dev\AI\AI Assist Vibe Coding-2025\Day-2\wealth-management-backend-v3\`
- Select: `wealth-backend-deploy.zip`
- **Version label**: `v1.0`

#### Presets:
- Select: ⭐ **Single instance (free tier eligible)**

3. Click **"Next"** OR **"Skip to Review"** then **"Submit"**

---

### Step 3: Wait for Creation (5-8 minutes)

You'll see a progress screen showing:
- ✅ Creating environment
- ✅ Launching EC2 instance
- ✅ Deploying application
- ✅ Health checks

**Status will change from:**
- 🟡 Yellow (Launching) → 🟢 Green (Ready)

---

### Step 4: Get Your Application URL

Once the environment is **Ready** (Green), you'll see your URL:

**Format**: `http://wealth-mgmt-api.us-east-2.elasticbeanstalk.com`

Click the URL to test - you should see:
```json
{"message": "Welcome to Wealth Management API"}
```

---

### Step 5: Configure Environment Variables

1. In your environment dashboard, click **"Configuration"** (left sidebar)

2. Find **"Software"** section → Click **"Edit"**

3. Scroll down to **"Environment properties"**

4. Add these variables (click "+ Add environment property" for each):

```
MONGODB_URI = mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/wealth-management-app-db?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = your-super-secret-jwt-key-2025

AWS_ACCESS_KEY_ID = (your AWS access key)

AWS_SECRET_ACCESS_KEY = (your AWS secret key)

AWS_REGION = us-east-2

NODE_ENV = production

PORT = 8080
```

5. Click **"Apply"** at the bottom

6. Wait 2-3 minutes for environment to update

---

### Step 6: Configure MongoDB Atlas

1. Go to: https://cloud.mongodb.com

2. Select your cluster: **Cluster0**

3. Click **"Network Access"** in left menu

4. Click **"Add IP Address"**

5. For testing, add: `0.0.0.0/0` (allows all IPs)
   - Or get specific IP from EB environment and add that

6. Click **"Confirm"**

---

## 🧪 Test Your Deployment

### Test 1: Health Check
Open browser and go to:
```
http://your-app-url.us-east-2.elasticbeanstalk.com/
```

Expected: `{"message": "Welcome to Wealth Management API"}`

### Test 2: User Registration via PowerShell
```powershell
$url = "http://your-app-url.us-east-2.elasticbeanstalk.com"
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/users/register" -Method POST -Body $body -ContentType "application/json"
```

### Test 3: Via curl
```powershell
curl http://your-app-url.us-east-2.elasticbeanstalk.com/
```

---

## 📊 Verify Deployment

✅ Environment Status: Green  
✅ Health: Ok  
✅ Application responds to requests  
✅ Environment variables set  
✅ MongoDB connection working  

---

## 🔍 View Application Logs

1. In environment dashboard, click **"Logs"** (left sidebar)
2. Click **"Request Logs"** → **"Last 100 Lines"**
3. Click the download link when ready
4. Open the log file to see application output

---

## 📱 Your Application Endpoints

Once deployed, all these endpoints will be available:

**Base URL**: `http://wealth-mgmt-api.us-east-2.elasticbeanstalk.com`

### Authentication:
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

### Assets:
- `GET /api/assets` - Get all assets (protected)
- `POST /api/assets` - Create asset (protected)
- `GET /api/assets/:id` - Get single asset (protected)
- `PUT /api/assets/:id` - Update asset (protected)
- `DELETE /api/assets/:id` - Delete asset (protected)

### Income:
- `GET /api/incomes` - Get all incomes (protected)
- `POST /api/incomes` - Create income (protected)
- `GET /api/incomes/:id` - Get single income (protected)
- `PUT /api/incomes/:id` - Update income (protected)
- `DELETE /api/incomes/:id` - Delete income (protected)

### Liabilities:
- `GET /api/liabilities` - Get all liabilities (protected)
- `POST /api/liabilities` - Create liability (protected)
- `GET /api/liabilities/:id` - Get single liability (protected)
- `PUT /api/liabilities/:id` - Update liability (protected)
- `DELETE /api/liabilities/:id` - Delete liability (protected)

---

## 💰 Cost Estimate

- **t2.micro instance**: FREE (750 hours/month in AWS Free Tier)
- **Single instance deployment**: No load balancer costs
- **Total cost**: $0/month (within Free Tier limits)

---

## 🔄 Future Updates

When you make code changes:

1. Create new zip file:
   ```powershell
   Compress-Archive -Path server.js,src,package.json,package-lock.json,.ebextensions -DestinationPath wealth-backend-deploy.zip -Force
   ```

2. In AWS Console:
   - Go to your environment
   - Click **"Upload and deploy"**
   - Choose the new zip file
   - Click **"Deploy"**

OR use EB CLI:
```powershell
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"
eb deploy
```

---

## ❓ Troubleshooting

### Environment Health is Yellow/Red:
1. Check logs in AWS Console
2. Verify all environment variables are set
3. Check MongoDB connection string
4. Ensure MongoDB Atlas IP is whitelisted

### Can't access application:
1. Verify environment status is "Ready"
2. Check the URL is correct
3. Ensure security groups allow HTTP (port 80)

### MongoDB connection errors:
1. Verify MONGODB_URI in environment variables
2. Check MongoDB Atlas cluster is running
3. Verify IP whitelist in MongoDB Atlas
4. Test connection string locally first

---

## 📞 Support Resources

- **AWS EB Console**: https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-2
- **MongoDB Atlas**: https://cloud.mongodb.com
- **EB Documentation**: https://docs.aws.amazon.com/elasticbeanstalk/

---

## ✨ Success Checklist

- [ ] Application created in AWS Console
- [ ] Environment is Green and Ready
- [ ] Application URL is accessible
- [ ] Health check returns welcome message
- [ ] All environment variables configured
- [ ] MongoDB Atlas IP whitelisted
- [ ] Test API endpoints working
- [ ] Logs show no errors

---

## 🎉 You're Done!

Your Wealth Management Backend API is now live at:

**http://[your-env-name].us-east-2.elasticbeanstalk.com**

---

**Created**: October 23, 2025  
**Region**: us-east-2 (Ohio)  
**Platform**: Node.js 20  
**Instance**: t2.micro (Free Tier)  
**Deployment**: Single instance

