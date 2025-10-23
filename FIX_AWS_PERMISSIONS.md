# Fix AWS Bedrock Permission Issue

## 🔴 Current Error
```
User: arn:aws:iam::490004617374:user/wealth-management-app-user 
is not authorized to perform: bedrock:InvokeModel 
with an explicit deny in an identity-based policy
```

## ✅ SOLUTION - Step by Step

### Step 1: Check Your `.env` File

Create/update your `.env` file with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-connection-string

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy
AWS_REGION=us-east-2
```

**IMPORTANT:** Set `AWS_REGION=us-east-2` (NOT us-east-1)

---

### Step 2: Fix IAM Permissions in AWS Console

#### Option A: Use AWS Console (Recommended)

1. **Go to AWS IAM Console:**
   - https://console.aws.amazon.com/iam/

2. **Navigate to Users:**
   - Click "Users" in left sidebar
   - Find `wealth-management-app-user`
   - Click on the username

3. **Add Permissions:**
   - Click "Add permissions" button
   - Choose "Attach policies directly"
   - Click "Create policy" (opens new tab)

4. **Create Bedrock Policy:**
   - Click "JSON" tab
   - Paste this policy:

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
        "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

5. **Save Policy:**
   - Click "Next"
   - Policy name: `BedrockClaudeHaikuAccess`
   - Description: `Allow invoking Claude 3 Haiku model in us-east-2`
   - Click "Create policy"

6. **Attach Policy to User:**
   - Go back to user permissions tab
   - Refresh the policy list
   - Search for `BedrockClaudeHaikuAccess`
   - Check the box
   - Click "Add permissions"

---

#### Option B: Use AWS CLI (Alternative)

1. **Create policy file `bedrock-policy.json`:**
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
        "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

2. **Create the policy:**
```bash
aws iam create-policy \
  --policy-name BedrockClaudeHaikuAccess \
  --policy-document file://bedrock-policy.json
```

3. **Attach policy to user:**
```bash
aws iam attach-user-policy \
  --user-name wealth-management-app-user \
  --policy-arn arn:aws:iam::490004617374:policy/BedrockClaudeHaikuAccess
```

---

### Step 3: Check for Explicit Deny Policies

The error mentions "explicit deny" - this means there might be a policy that's blocking access.

1. **In IAM Console:**
   - Go to user `wealth-management-app-user`
   - Check "Permissions" tab
   - Look for any policies with "Deny" statements

2. **Common problematic policies:**
   - Policies that deny all Bedrock access
   - Service Control Policies (SCPs) at organization level
   - Permission boundaries

3. **If you find a Deny policy:**
   - Either remove it (if you have permission)
   - Or modify it to exclude Bedrock access
   - Or contact your AWS admin

---

### Step 4: Enable Claude 3 Haiku in Bedrock Console

1. **Go to AWS Bedrock Console:**
   - https://console.aws.amazon.com/bedrock/

2. **IMPORTANT: Switch to us-east-2 (Ohio) region**
   - Top-right corner, select "US East (Ohio)"

3. **Request Model Access:**
   - Click "Model access" in left sidebar (under "Bedrock configurations")
   - Click "Manage model access" button
   - Find "Anthropic" section
   - Check the box for "Claude 3 Haiku"
   - Click "Request model access" at bottom
   - Click "Submit"

4. **Wait for Approval:**
   - Usually instant for Claude 3 Haiku
   - Status should change from "Not available" to "Access granted"
   - Refresh page if needed

---

### Step 5: Verify Your IAM User Permissions

Run this command to check current policies:

```powershell
aws iam list-attached-user-policies --user-name wealth-management-app-user
```

Expected output should include:
```json
{
  "AttachedPolicies": [
    {
      "PolicyName": "BedrockClaudeHaikuAccess",
      "PolicyArn": "arn:aws:iam::490004617374:policy/BedrockClaudeHaikuAccess"
    }
  ]
}
```

---

### Step 6: Restart Your Server

After making AWS changes:

1. **Stop your server** (Ctrl+C in terminal)

2. **Verify `.env` file has correct values:**
   ```env
   AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
   AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy
   AWS_REGION=us-east-2
   ```

3. **Restart server:**
   ```bash
   npm start
   ```

4. **Test again in Postman:**
   ```
   GET http://localhost:3001/api/recommendations/test
   ```

---

## 🔍 Troubleshooting

### Issue 1: Still getting permission denied

**Check:**
- ✅ Model access is granted in Bedrock console for us-east-2
- ✅ IAM policy is attached to the correct user
- ✅ No Deny policies are blocking access
- ✅ `.env` file has `AWS_REGION=us-east-2`
- ✅ Server restarted after changes

### Issue 2: Wrong region (us-east-1 vs us-east-2)

**Solution:**
- Set `AWS_REGION=us-east-2` in `.env` file
- Enable model access in us-east-2 region in Bedrock console
- Update IAM policy to use us-east-2 in the ARN

### Issue 3: Model not available in region

**Solution:**
- Go to Bedrock console
- Switch to us-east-2
- Request model access for Claude 3 Haiku
- Wait for approval (usually instant)

### Issue 4: Organization-level restrictions

**If your AWS account is part of an organization:**
- You might have Service Control Policies (SCPs) blocking Bedrock
- Contact your AWS organization admin
- They need to allow Bedrock access at the organization level

---

## ✅ Expected Success Response

After fixing permissions, you should see:

```json
{
  "success": true,
  "message": "AWS Bedrock connection successful",
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "response": "Connection successful"
}
```

---

## 📊 Quick Checklist

Before testing again, verify:

- [ ] `.env` file exists in project root
- [ ] `.env` has AWS credentials
- [ ] `.env` has `AWS_REGION=us-east-2`
- [ ] IAM policy created with `bedrock:InvokeModel` permission
- [ ] Policy attached to `wealth-management-app-user`
- [ ] No Deny policies blocking access
- [ ] Claude 3 Haiku enabled in Bedrock console (us-east-2)
- [ ] Model access status is "Access granted"
- [ ] Server restarted after changes

---

## 🆘 Need More Help?

If you're still stuck:

1. **Check IAM Policy Simulator:**
   - https://policysim.aws.amazon.com/
   - Simulate `bedrock:InvokeModel` action for your user

2. **Check CloudTrail Logs:**
   - See exactly why the request is being denied
   - Look for AccessDenied events

3. **Verify with AWS CLI:**
   ```bash
   aws bedrock-runtime invoke-model \
     --model-id anthropic.claude-3-haiku-20240307-v1:0 \
     --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":10,"messages":[{"role":"user","content":"Hello"}]}' \
     --region us-east-2 \
     output.txt
   ```

---

## 📝 Alternative: Use Different AWS Credentials

If the current user has restrictions you can't change:

1. **Create a new IAM user** with proper permissions
2. **Generate new access keys**
3. **Update `.env` file** with new credentials
4. **Restart server**

---

**Most Common Solution:** Enable Claude 3 Haiku model access in Bedrock console for us-east-2 region! 🎯

