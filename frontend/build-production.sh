#!/bin/bash

# Production Build Script for Task Management Dashboard
# This script installs axios for production deployment and builds the app

echo "🚀 Starting production build..."

# Install axios for production
echo "📦 Installing axios for production deployment..."
npm install axios@^1.9.0

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Production build completed!"
echo "📁 Build files are in the 'build' directory"
echo "🌐 Deploy the 'build' directory to your hosting platform" 