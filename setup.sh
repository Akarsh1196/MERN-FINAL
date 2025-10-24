#!/bin/bash

echo "🔧 Setting up EventEase..."

# Create environment files
echo "📝 Creating environment files..."
cp env.example .env
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Create missing public files
echo "📁 Creating missing frontend files..."
mkdir -p frontend/public
echo "favicon.ico" > frontend/public/favicon.ico

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update .env with your MongoDB connection string"
echo "2. Run: npm run dev"
echo ""
echo "📝 To get MongoDB connection string:"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create free account and cluster"
echo "3. Get connection string"
echo "4. Update .env file"
