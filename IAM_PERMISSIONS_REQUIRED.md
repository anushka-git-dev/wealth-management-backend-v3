# IAM Permissions Required for AWS Bedrock Integration

## Overview
This document lists all IAM permissions needed for the `wealth-management-app-user` to successfully use the AI Recommendation System powered by AWS Bedrock and Claude 3 Haiku.

---

## 🎯 REQUIRED PERMISSIONS (Minimum)

### 1. Core Permission for Bedrock

**Permission:** `bedrock:InvokeModel`

**Why:** This is the ONLY permission required to call Claude 3 Haiku via AWS Bedrock Runtime API.

**What it allows:**
- Send requests to Claude 3 Haiku model
- Receive AI-generated responses
- Use the Bedrock Runtime API

**What it does NOT allow:**
- Managing Bedrock configurations
- Creating/deleting models
- Accessing other AWS services

---

## 📋 MINIMAL IAM POLICY (RECOMMENDED)

### Option 1: Minimal Policy (Most Secure)

**Use this if you only want to allow Claude 3 Haiku in us-east-2:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowClaudeHaikuInvoke",
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

**Details:**
- ✅ Only allows Claude 3 Haiku model
- ✅ Only in us-east-2 region
- ✅ Most secure (least privilege principle)
- ✅ Recommended for production

---

### Option 2: Allow All Claude 3 Haiku Versions

**Use this if you want to allow any version of Claude 3 Haiku:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowClaudeHaikuInvoke",
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

**Details:**
- ✅ Allows any version of Claude 3 Haiku (current and future)
- ✅ Only in us-east-2 region
- ✅ More flexible for model updates
- ✅ Good balance of security and flexibility

---

### Option 3: Allow All Claude Models (Less Restrictive)

**Use this if you might switch between Claude models:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAllClaudeModels",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-*"
      ]
    }
  ]
}
```

**Details:**
- ✅ Allows Claude 3 Haiku, Sonnet, Opus
- ✅ Only in us-east-2 region
- ⚠️ More permissive (higher cost risk)
- ⚠️ User can switch to expensive models

---

### Option 4: Allow All Bedrock Models (NOT Recommended)

**Only use this for development/testing:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAllBedrockModels",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-2::foundation-model/*"
      ]
    }
  ]
}
```

**Details:**
- ✅ Allows all Bedrock models (Claude, Llama, Mistral, etc.)
- ⚠️ Very permissive
- ❌ NOT recommended for production
- ❌ High cost risk

---

## 🔧 HOW TO ADD THESE PERMISSIONS

### Method 1: Inline Policy (Recommended for this project)

**Step-by-step:**

1. **Go to IAM Console:**
   ```
   https://console.aws.amazon.com/iam/
   ```

2. **Navigate to user:**
   - Click "Users" in left sidebar
   - Find and click: `wealth-management-app-user`

3. **Add inline policy:**
   - Click "Add permissions" dropdown
   - Select "Create inline policy"
   - Click "JSON" tab

4. **Paste policy:**
   - Copy one of the policies above (Option 2 recommended)
   - Paste into the JSON editor
   - Click "Next"

5. **Name and create:**
   - Policy name: `BedrockClaudeHaikuAccess`
   - Click "Create policy"

**Advantages:**
- ✅ Policy attached directly to user
- ✅ Easy to manage
- ✅ Clear what permissions this user has
- ✅ Good for small projects

---

### Method 2: Managed Policy (Better for multiple users)

**Step-by-step:**

1. **Create managed policy:**
   - Go to IAM Console → Policies
   - Click "Create policy"
   - Click "JSON" tab
   - Paste policy (Option 2 recommended)
   - Click "Next"

2. **Name the policy:**
   - Policy name: `BedrockClaudeHaikuInvokePolicy`
   - Description: `Allow invoking Claude 3 Haiku model in us-east-2`
   - Click "Create policy"

3. **Attach to user:**
   - Go to Users → `wealth-management-app-user`
   - Click "Add permissions" → "Attach policies directly"
   - Search for `BedrockClaudeHaikuInvokePolicy`
   - Check the box
   - Click "Add permissions"

**Advantages:**
- ✅ Reusable across multiple users
- ✅ Centralized management
- ✅ Better for teams
- ✅ Good for scaling

---

## 📊 PERMISSION BREAKDOWN

### What `bedrock:InvokeModel` Allows:

| Action | Allowed? | Description |
|--------|----------|-------------|
| Call Claude 3 Haiku | ✅ Yes | Send prompts and get responses |
| Invoke model via API | ✅ Yes | Use BedrockRuntime.InvokeModel |
| Use in your app | ✅ Yes | Integrate in Node.js backend |
| View model in console | ❌ No | Requires bedrock:ListFoundationModels |
| List available models | ❌ No | Requires bedrock:ListFoundationModels |
| Manage model access | ❌ No | Requires bedrock:* permissions |
| Create custom models | ❌ No | Requires bedrock:CreateModelCustomizationJob |

### What is NOT Included:

These permissions are **NOT required** for your project but are common in broader Bedrock usage:

```json
// NOT NEEDED - These are for viewing/managing, not invoking
{
  "Action": [
    "bedrock:ListFoundationModels",      // List available models
    "bedrock:GetFoundationModel",        // Get model details
    "bedrock:ListModelCustomizationJobs", // List fine-tuning jobs
    "bedrock:GetModelCustomizationJob",   // Get job details
    "bedrock:InvokeModelWithResponseStream", // Streaming responses
    "bedrock:CreateModelCustomizationJob",  // Fine-tune models
    "bedrock:DeleteModelCustomizationJob",  // Delete fine-tuning jobs
    "bedrock:PutModelInvocationLoggingConfiguration" // Configure logging
  ]
}
```

---

## 🎯 RECOMMENDED POLICY FOR YOUR PROJECT

**Copy and use this one:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowClaudeHaikuInvoke",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "us-east-2"
        }
      }
    }
  ]
}
```

**Why this policy?**
- ✅ Allows Claude 3 Haiku (any version)
- ✅ Restricted to us-east-2 region only
- ✅ Includes condition to enforce region
- ✅ Follows least privilege principle
- ✅ Cost-effective (can't accidentally use expensive models)
- ✅ Secure (minimal permissions)

---

## 🔐 SECURITY BEST PRACTICES

### 1. Least Privilege Principle
- ✅ **DO:** Grant only `bedrock:InvokeModel`
- ❌ **DON'T:** Grant `bedrock:*` (all Bedrock permissions)

### 2. Resource Restrictions
- ✅ **DO:** Specify exact model or model family
- ❌ **DON'T:** Use wildcard for all models (`foundation-model/*`)

### 3. Region Restrictions
- ✅ **DO:** Add condition to restrict to us-east-2
- ❌ **DON'T:** Allow access to all regions

### 4. Service Restrictions
- ✅ **DO:** Create separate IAM users for different services
- ❌ **DON'T:** Add multiple service permissions to one user

### 5. Regular Audits
- ✅ **DO:** Review IAM policies quarterly
- ✅ **DO:** Monitor CloudTrail logs for unusual activity
- ✅ **DO:** Rotate access keys every 90 days

---

## 🧪 VERIFY PERMISSIONS

### Check Current Permissions:

```bash
# List all policies attached to user
aws iam list-attached-user-policies --user-name wealth-management-app-user

# List inline policies
aws iam list-user-policies --user-name wealth-management-app-user

# Get specific inline policy
aws iam get-user-policy --user-name wealth-management-app-user --policy-name BedrockClaudeHaikuAccess
```

### Test Permissions:

```bash
# Test if user can invoke Claude 3 Haiku
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}' \
  --region us-east-2 \
  test-output.json

# Success: Creates test-output.json with response
# Failure: Shows AccessDenied error
```

---

## 📋 POLICY COMPARISON

| Policy Option | Models Allowed | Region | Security | Flexibility | Recommended? |
|---------------|----------------|--------|----------|-------------|--------------|
| **Option 1** | Claude 3 Haiku (exact version) | us-east-2 | ⭐⭐⭐⭐⭐ | ⭐⭐ | Production |
| **Option 2** | Claude 3 Haiku (all versions) | us-east-2 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ **Best Choice** |
| **Option 3** | All Claude models | us-east-2 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Development |
| **Option 4** | All Bedrock models | us-east-2 | ⭐⭐ | ⭐⭐⭐⭐⭐ | Testing only |

---

## 🆘 TROUBLESHOOTING

### Error: "Access Denied"

**Check:**
1. ✅ Policy has `bedrock:InvokeModel` action
2. ✅ Resource ARN matches your model
3. ✅ Region is us-east-2 in both policy and request
4. ✅ Policy is actually attached to the user
5. ✅ No explicit Deny policies blocking access

### Error: "Model not found"

**Check:**
1. ✅ Model is enabled in Bedrock console (us-east-2)
2. ✅ Model ID is correct in Resource ARN
3. ✅ You're calling the correct region

### Error: "Explicit deny in identity-based policy"

**Check:**
1. ✅ Look for Deny policies attached to user
2. ✅ Check permission boundaries
3. ✅ Check organization SCPs (Service Control Policies)
4. ✅ Contact AWS admin if you can't modify policies

---

## 📚 ADDITIONAL RESOURCES

### AWS Documentation:
- [AWS Bedrock IAM Permissions](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html)
- [IAM Policy Examples for Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/security_iam_id-based-policy-examples.html)
- [Bedrock InvokeModel API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html)

### Cost Monitoring:
- [AWS Cost Explorer](https://console.aws.amazon.com/cost-management/home)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [Claude 3 Haiku Pricing](https://aws.amazon.com/bedrock/claude/)

---

## 💰 COST CONTROL (Optional)

If you want to prevent excessive costs, add budget conditions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowClaudeHaikuWithLimit",
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

**Additional Cost Controls:**
1. Set up AWS Budgets alerts
2. Monitor usage in CloudWatch
3. Use Cost Explorer to track Bedrock costs
4. Implement rate limiting in your application

---

## ✅ SUMMARY

### For Your Project, You Need:

**Minimum Required:**
- ✅ IAM Permission: `bedrock:InvokeModel`
- ✅ Resource: `arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-*`
- ✅ Region: `us-east-2`

**Policy Name:**
- `BedrockClaudeHaikuAccess` (inline policy)

**Attachment:**
- Attached to: `wealth-management-app-user`

**That's it!** Just this one permission is all you need! 🎉

---

## 🚀 QUICK SETUP COMMAND (AWS CLI)

If you prefer command-line, run this:

```bash
# Create policy file
cat > bedrock-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-*"
    }
  ]
}
EOF

# Attach inline policy to user
aws iam put-user-policy \
  --user-name wealth-management-app-user \
  --policy-name BedrockClaudeHaikuAccess \
  --policy-document file://bedrock-policy.json

# Verify
aws iam get-user-policy \
  --user-name wealth-management-app-user \
  --policy-name BedrockClaudeHaikuAccess
```

---

**Last Updated:** October 23, 2025  
**User:** wealth-management-app-user  
**Required Permission:** bedrock:InvokeModel  
**Status:** ✅ Simple and clear!

