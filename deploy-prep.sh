#!/bin/bash

echo "🚀 Preparing Working Hours Calculator for Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build files created in 'dist/' directory"
    echo ""
    echo "🌐 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://app.netlify.com"
    echo "3. Click 'Add new site' → 'Import an existing project'"
    echo "4. Connect your GitHub repository"
    echo "5. Set build command: npm run build"
    echo "6. Set publish directory: dist"
    echo "7. Add environment variable: VITE_API_URL=https://your-backend-url.com"
    echo "8. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 