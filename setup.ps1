# Trello Clone Setup Script for Windows
Write-Host "🚀 Setting up Trello Clone..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Setup Backend
Write-Host "⚙️ Setting up backend..." -ForegroundColor Cyan
Set-Location backend

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Create .env file if it doesn't exist
if (!(Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ Created .env file - please update MONGODB_URI and JWT_SECRET" -ForegroundColor Green
}

# Go back to root and setup frontend
Set-Location ..
Write-Host "⚙️ Setting up frontend..." -ForegroundColor Cyan
Set-Location frontend

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Go back to root
Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB (if using local instance)"
Write-Host "2. In one PowerShell: cd backend; npm start"
Write-Host "3. In another PowerShell: cd frontend; npm start"
Write-Host ""
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔧 Backend will be available at: http://localhost:5000" -ForegroundColor Blue
Write-Host ""
Write-Host "📖 Check README.md for detailed instructions" -ForegroundColor Yellow
