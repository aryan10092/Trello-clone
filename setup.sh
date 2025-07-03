#!/bin/bash

# Trello Clone Setup Script
echo "🚀 Setting up Trello Clone..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional - user might use cloud MongoDB)
echo "📋 Checking prerequisites..."

# Setup Backend
echo "⚙️ Setting up backend..."
cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOL
    echo "✅ Created .env file - please update MONGODB_URI and JWT_SECRET"
fi

# Go back to root and setup frontend
cd ..
echo "⚙️ Setting up frontend..."
cd frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Go back to root
cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Start MongoDB (if using local instance)"
echo "2. In one terminal: cd backend && npm start"
echo "3. In another terminal: cd frontend && npm start"
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend will be available at: http://localhost:5000"
echo ""
echo "📖 Check README.md for detailed instructions"
