#!/bin/bash

# EventEase - Fixed Startup Script
# This script handles common issues and starts the application

echo "🚀 Starting EventEase Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Kill any existing processes on ports 3000 and 5001
print_status "Checking for existing processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
    print_warning "Killing existing process on port 3000"
    lsof -ti:3000 | xargs kill -9
fi

if lsof -ti:5001 > /dev/null 2>&1; then
    print_warning "Killing existing process on port 5001"
    lsof -ti:5001 | xargs kill -9
fi

# Check if .env files exist
print_status "Checking environment files..."

if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_warning "Please update .env with your MongoDB connection string"
fi

if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env file not found. Creating from template..."
    cp backend/env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    print_warning "frontend/.env file not found. Creating from template..."
    cp frontend/env.example frontend/.env
fi

# Install dependencies
print_status "Installing dependencies..."

# Install root dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing root dependencies..."
    npm install
fi

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

print_success "Dependencies installed successfully"

# Check if MongoDB URI is configured
if grep -q "mongodb+srv://username:password" .env; then
    print_warning "MongoDB URI not configured. Please update .env file with your MongoDB Atlas connection string"
    print_warning "You can get your connection string from MongoDB Atlas dashboard"
fi

# Start the application
print_status "Starting EventEase application..."

# Use the fixed server if it exists, otherwise use the original
if [ -f "backend/server-fixed.js" ]; then
    print_status "Using enhanced server configuration..."
    cd backend
    npm run dev-fixed &
    BACKEND_PID=$!
    cd ..
else
    print_status "Using standard server configuration..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
fi

# Wait a moment for backend to start
sleep 3

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

print_success "EventEase is starting up!"
print_status "Backend PID: $BACKEND_PID"
print_status "Frontend PID: $FRONTEND_PID"

# Function to handle cleanup on exit
cleanup() {
    print_status "Shutting down EventEase..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "EventEase stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_success "🎉 EventEase is running!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:5001"
print_status "API Health: http://localhost:5001/api/health"
print_status ""
print_status "Press Ctrl+C to stop the application"

# Wait for processes
wait
