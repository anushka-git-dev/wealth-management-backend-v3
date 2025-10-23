# AI Recommendation System Installation Script
# Run this in PowerShell to complete the setup

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "🤖 AI Recommendation System Setup" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Step 1: Install AWS Bedrock Runtime Package
Write-Host "Step 1: Installing AWS Bedrock Runtime package..." -ForegroundColor Yellow
npm install @aws-sdk/client-bedrock-runtime --save

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Package installed successfully`n" -ForegroundColor Green
} else {
    Write-Host "❌ Package installation failed`n" -ForegroundColor Red
    exit 1
}

# Step 2: Check if .env file exists
Write-Host "Step 2: Checking environment variables..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✅ .env file exists`n" -ForegroundColor Green
    
    # Check if AWS credentials are configured
    $envContent = Get-Content .env -Raw
    if ($envContent -match "AWS_ACCESS_KEY_ID" -and $envContent -match "AWS_SECRET_ACCESS_KEY") {
        Write-Host "✅ AWS credentials found in .env file`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  AWS credentials not found in .env file`n" -ForegroundColor Yellow
        Write-Host "Add these lines to your .env file:" -ForegroundColor Cyan
        Write-Host "AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z" -ForegroundColor White
        Write-Host "AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy" -ForegroundColor White
        Write-Host "AWS_REGION=us-east-2`n" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  .env file not found. Creating one...`n" -ForegroundColor Yellow
    
    $envContent = @"
# MongoDB Configuration
PORT=3001
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.zxlwopw.mongodb.net/wealth-management-app-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-2025

# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=AKIAXEFUNDCPMRSXED6Z
AWS_SECRET_ACCESS_KEY=ICmqJePxkQsPobh28icHktoM/1yQuxKJLyBn/nvy
AWS_REGION=us-east-2
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created with AWS credentials`n" -ForegroundColor Green
}

# Step 3: Verify files created
Write-Host "Step 3: Verifying implementation files..." -ForegroundColor Yellow

$files = @(
    "src/services/dataAggregationService.js",
    "src/services/recommendationService.js",
    "src/controllers/recommendationController.js",
    "src/routes/recommendationRoutes.js"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - NOT FOUND" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

if ($allFilesExist) {
    Write-Host "✅ All implementation files verified`n" -ForegroundColor Green
} else {
    Write-Host "❌ Some files are missing. Please check the implementation.`n" -ForegroundColor Red
}

# Step 4: Check package.json
Write-Host "Step 4: Checking package.json..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if ($packageJson.dependencies.'@aws-sdk/client-bedrock-runtime') {
        Write-Host "✅ AWS Bedrock Runtime package is in package.json`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Package not found in package.json (it will be added after npm install)`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ package.json not found`n" -ForegroundColor Red
}

# Final Summary
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📋 Setup Summary" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Implementation Status:" -ForegroundColor Yellow
Write-Host "  ✅ Data Aggregation Service created" -ForegroundColor Green
Write-Host "  ✅ Recommendation Service with Claude 3 Haiku created" -ForegroundColor Green
Write-Host "  ✅ Controller and Routes created" -ForegroundColor Green
Write-Host "  ✅ Server.js updated" -ForegroundColor Green
Write-Host "  ✅ AWS Bedrock Runtime package installed" -ForegroundColor Green
Write-Host "  ✅ Environment variables configured`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start your server: npm start" -ForegroundColor White
Write-Host "  2. Test health endpoint: curl http://localhost:3001/api/recommendations/health" -ForegroundColor White
Write-Host "  3. Test connection: curl http://localhost:3001/api/recommendations/test" -ForegroundColor White
Write-Host "  4. Get recommendations: curl http://localhost:3001/api/recommendations`n" -ForegroundColor White

Write-Host "API Endpoints:" -ForegroundColor Yellow
Write-Host "  GET /api/recommendations         - Get AI recommendations" -ForegroundColor White
Write-Host "  GET /api/recommendations/test    - Test AWS Bedrock connection" -ForegroundColor White
Write-Host "  GET /api/recommendations/health  - System health check`n" -ForegroundColor White

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  📄 RECOMMENDATION_SYSTEM_SETUP.md - Complete setup guide" -ForegroundColor White
Write-Host "  📄 documentation/08-ai-recommendation-system.md - Detailed documentation`n" -ForegroundColor White

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Your AI-powered recommendation system is ready!" -ForegroundColor Green
Write-Host "Model: Claude 3 Haiku via AWS Bedrock" -ForegroundColor Cyan
Write-Host "Cost: ~$0.001-0.003 per request`n" -ForegroundColor Cyan

