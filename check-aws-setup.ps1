# AWS Bedrock Setup Checker
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "🔍 AWS BEDROCK SETUP CHECKER" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "" 

# Check 1: AWS CLI installed
Write-Host "1. Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "   ✅ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ AWS CLI not installed" -ForegroundColor Red
    Write-Host "   Install from: https://aws.amazon.com/cli/" -ForegroundColor White
}

# Check 2: AWS Credentials configured
Write-Host ""
Write-Host "2. Checking AWS Credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
    Write-Host "   ✅ AWS Credentials configured" -ForegroundColor Green
    Write-Host "   User: $($identity.Arn)" -ForegroundColor White
    Write-Host "   Account: $($identity.Account)" -ForegroundColor White
} catch {
    Write-Host "   ❌ AWS Credentials not configured" -ForegroundColor Red
    Write-Host "   Run: aws configure" -ForegroundColor White
}

# Check 3: Default region
Write-Host "`n3. Checking AWS Region..." -ForegroundColor Yellow
try {
    $region = aws configure get region
    Write-Host "   ✅ Default region: $region" -ForegroundColor Green
    if ($region -ne "us-east-2") {
        Write-Host "   ⚠️  WARNING: Should be us-east-2 for this project" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Region not configured" -ForegroundColor Red
}

# Check 4: .env file exists
Write-Host "`n4. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "AWS_ACCESS_KEY_ID") {
        Write-Host "   ✅ AWS_ACCESS_KEY_ID found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_ACCESS_KEY_ID missing" -ForegroundColor Red
    }
    
    if ($envContent -match "AWS_SECRET_ACCESS_KEY") {
        Write-Host "   ✅ AWS_SECRET_ACCESS_KEY found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_SECRET_ACCESS_KEY missing" -ForegroundColor Red
    }
    
    if ($envContent -match "AWS_REGION=us-east-2") {
        Write-Host "   ✅ AWS_REGION set to us-east-2" -ForegroundColor Green
    } elseif ($envContent -match "AWS_REGION") {
        Write-Host "   ⚠️  AWS_REGION found but not us-east-2" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  AWS_REGION not set (will default to us-east-2)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env file NOT found" -ForegroundColor Red
    Write-Host "   Create .env file with AWS credentials" -ForegroundColor White
}

# Check 5: User policies
Write-Host "`n5. Checking IAM User Policies..." -ForegroundColor Yellow
try {
    $policies = aws iam list-attached-user-policies --user-name wealth-management-app-user 2>&1 | ConvertFrom-Json
    if ($policies.AttachedPolicies.Count -gt 0) {
        Write-Host "   ✅ User has $($policies.AttachedPolicies.Count) policy(ies) attached:" -ForegroundColor Green
        foreach ($policy in $policies.AttachedPolicies) {
            Write-Host "      • $($policy.PolicyName)" -ForegroundColor White
        }
    } else {
        Write-Host "   ⚠️  No policies attached to user" -ForegroundColor Yellow
    }
    
    # Check for Bedrock policy
    $hasBedrock = $false
    foreach ($policy in $policies.AttachedPolicies) {
        if ($policy.PolicyName -match "Bedrock") {
            $hasBedrock = $true
            Write-Host "   ✅ Bedrock policy found!" -ForegroundColor Green
        }
    }
    
    if (-not $hasBedrock) {
        Write-Host "   ❌ No Bedrock policy found" -ForegroundColor Red
        Write-Host "   You need to add bedrock:InvokeModel permission" -ForegroundColor White
    }
    
} catch {
    Write-Host "   ⚠️  Cannot check user policies" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check 6: Test Bedrock access
Write-Host "`n6. Testing Bedrock Model Access..." -ForegroundColor Yellow
Write-Host "   Testing if you can invoke Claude 3 Haiku..." -ForegroundColor White

try {
    # Create a test payload
    $testPayload = @{
        anthropic_version = "bedrock-2023-05-31"
        max_tokens = 10
        messages = @(
            @{
                role = "user"
                content = "Hello"
            }
        )
    } | ConvertTo-Json -Depth 10

    # Save to temp file
    $testPayload | Out-File -FilePath "test-payload.json" -Encoding utf8

    # Try to invoke the model
    $result = aws bedrock-runtime invoke-model `
        --model-id anthropic.claude-3-haiku-20240307-v1:0 `
        --body file://test-payload.json `
        --region us-east-2 `
        test-output.json 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ SUCCESS! You can invoke Claude 3 Haiku" -ForegroundColor Green
        Remove-Item "test-payload.json" -ErrorAction SilentlyContinue
        Remove-Item "test-output.json" -ErrorAction SilentlyContinue
    } else {
        Write-Host "   ❌ FAILED to invoke model" -ForegroundColor Red
        Write-Host "   Error: $result" -ForegroundColor Red
        Remove-Item "test-payload.json" -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "   ❌ Error testing Bedrock access" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Remove-Item "test-payload.json" -ErrorAction SilentlyContinue
}

# Summary
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "📋 SUMMARY & NEXT STEPS" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "" 

Write-Host "Most Common Issues:" -ForegroundColor Yellow
Write-Host "1. Model not enabled in Bedrock console (us-east-2)" -ForegroundColor White
Write-Host "   → Go to: https://console.aws.amazon.com/bedrock/" -ForegroundColor Cyan
Write-Host "   → Model access → Manage model access" -ForegroundColor Cyan
Write-Host "   → Enable 'Claude 3 Haiku'`n" -ForegroundColor Cyan

Write-Host "2. Missing IAM permissions" -ForegroundColor White
Write-Host "   → User needs 'bedrock:InvokeModel' permission" -ForegroundColor Cyan
Write-Host "   → See: FIX_AWS_PERMISSIONS.md`n" -ForegroundColor Cyan

Write-Host "3. Wrong region" -ForegroundColor White
Write-Host "   → Must use us-east-2 (Ohio)" -ForegroundColor Cyan
Write-Host "   → Set AWS_REGION=us-east-2 in .env`n" -ForegroundColor Cyan

Write-Host "📖 Detailed Fix Guide: FIX_AWS_PERMISSIONS.md" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "" 


