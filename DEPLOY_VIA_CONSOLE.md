# Deploy to Elastic Beanstalk via AWS Console

## Quick Deployment Guide for us-east-2 (Ohio)

---

## Step 1: Create Deployment Package

Run this in PowerShell:

```powershell
cd "E:\My-Education\Full-Stack-Dev\AI\AI Assist Vibe Coding-2025\Day-2\wealth-management-backend-v3"

# Create a zip file excluding unnecessary files
Compress-Archive -Path server.js,src,package.json,package-lock.json,.ebextensions -DestinationPath wealth-backend-deploy.zip -Force
```

---

## Step 2: Create Application in AWS Console

1. **Go to AWS Console**: https://console.aws.amazon.com/elasticbeanstalk
2. **Select Region**: Choose **us-east-2 (Ohio)** from top-right dropdown
3. **Click**: "Create Application"

### Application Settings:
- **Application name**: `wealth-management-backend`
- **Platform**: Node.js
- **Platform branch**: Node.js 20 running on 64bit Amazon Linux 2023
- **Platform version**: (Latest)

### Application Code:
- Select: **Upload your code**
- **Version label**: `v1.0`
- Click **"Choose file"** and select `wealth-backend-deploy.zip`

### Presets:
- Select: **Single instance (free tier eligible)**

### Click "Next" →

---

## Step 3: Configure Service Access

### Service Role:
- **Use an existing service role**: `aws-elasticbeanstalk-service-role`
- If not available, select: **Create and use new service role**

### EC2 Instance Profile:
- **Select**: `aws-elasticbeanstalk-ec2-role`
- If not available, create one with these permissions:
  - AWSElasticBeanstalkWebTier
  - AWSElasticBeanstalkWorkerTier
  - AWSElasticBeanstalkMulticontainerDocker

### Click "Skip to Review" →

---

## Step 4: Review and Create

1. **Review** all settings
2. **Click**: "Submit"
3. **Wait**: 5-10 minutes for environment creation

---

## Step 5: Configure Environment Variables (After Creation)

1. Go to your environment
2. Click **"Configuration"** in left menu
3. Find **"Software"** section → Click **"Edit"**
4. Scroll to **"Environment properties"**

### Add these variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `AWS_REGION` | `us-east-2` |
| `NODE_ENV` | `production` |
| `PORT` | `8080` |

5. **Click**: "Apply"
6. **Wait**: for environment to update (2-3 minutes)

---

## Step 6: Get Your Application URL

1. In the environment dashboard, you'll see:
   - **Domain/URL**: Something like `wealth-mgmt-api.us-east-2.elasticbeanstalk.com`
   
2. **Click the URL** or copy it

3. **Test it** in your browser - you should see:
   ```json
   {"message": "Welcome to Wealth Management API"}
   ```

---

## Step 7: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to: **Network Access**
3. Click: **"Add IP Address"**
4. Add: `0.0.0.0/0` (for development)
5. Click: **"Confirm"**

---

## Testing Your Deployment

### Test Health Endpoint:
```powershell
$url = "http://your-app-url.us-east-2.elasticbeanstalk.com"
Invoke-RestMethod -Uri $url
```

### Test User Registration:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/users/register" -Method POST -Body $body -ContentType "application/json"
```

---

## Viewing Logs

### Via AWS Console:
1. Go to your environment
2. Click **"Logs"** in left menu
3. Click **"Request Logs"** → **"Last 100 Lines"**
4. **Click** the download link when ready

### Via EB CLI:
```powershell
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"
eb logs
```

---

## Updating Your Application (Future Deployments)

### Option A: Via Console
1. Go to environment
2. Click **"Upload and deploy"**
3. Upload new `.zip` file
4. Click **"Deploy"**

### Option B: Via EB CLI
```powershell
cd "E:\My-Education\Full-Stack-Dev\AI\AI Assist Vibe Coding-2025\Day-2\wealth-management-backend-v3"
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"
eb deploy
```

---

## Troubleshooting

### Environment Health is Red/Yellow:
1. Check logs for errors
2. Verify environment variables are set
3. Ensure MongoDB connection string is correct
4. Check MongoDB Atlas IP whitelist

### Application Not Responding:
1. Verify app is running on port 8080
2. Check health check path is `/`
3. Review application logs

### MongoDB Connection Failed:
1. Verify `MONGODB_URI` is set correctly
2. Check MongoDB Atlas cluster is running
3. Verify IP `0.0.0.0/0` is whitelisted in Atlas

---

## Cost Information

- **t2.micro instance**: FREE (750 hours/month in free tier)
- **Single instance**: No load balancer costs
- **Estimated cost**: ~$0-5/month with free tier

---

## Important URLs

- **AWS Console**: https://console.aws.amazon.com/elasticbeanstalk
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Your Application**: Will be provided after creation

---

## Quick Command Reference

```powershell
# Add EB CLI to PATH
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"

# Check status
eb status

# View logs
eb logs

# Open in browser
eb open

# Deploy changes
eb deploy

# Set environment variable
eb setenv KEY=VALUE
```

---

**Note**: This method gives you full visibility of the deployment process through the AWS Console web interface.

