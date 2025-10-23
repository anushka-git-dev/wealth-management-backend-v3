# AWS Elastic Beanstalk Environment Creation Script
# Run this in PowerShell

# Set PATH for EB CLI
$env:Path += ";C:\Users\User\AppData\Roaming\Python\Python310\Scripts"

# Navigate to project directory
cd "E:\My-Education\Full-Stack-Dev\AI\AI Assist Vibe Coding-2025\Day-2\wealth-management-backend-v3"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Creating Elastic Beanstalk Environment" -ForegroundColor Cyan
Write-Host "Region: us-east-2 (Ohio)" -ForegroundColor Cyan
Write-Host "Instance Type: t2.micro" -ForegroundColor Cyan
Write-Host "Environment: wealth-mgmt-api" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will take 5-10 minutes. Please wait..." -ForegroundColor Yellow
Write-Host ""

# Create the environment
eb create wealth-mgmt-api --region us-east-2 --instance-type t2.micro --single --timeout 20

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Environment Creation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Get environment details
Write-Host "Getting environment details..." -ForegroundColor Cyan
eb status

Write-Host ""
Write-Host "Getting environment URL..." -ForegroundColor Cyan
aws elasticbeanstalk describe-environments --application-name wealth-management-backend --region us-east-2 --query "Environments[?Status=='Ready'].[EnvironmentName,CNAME]" --output table

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables" -ForegroundColor White
Write-Host "2. Set up MongoDB Atlas IP whitelist" -ForegroundColor White
Write-Host "3. Test the application URL" -ForegroundColor White

