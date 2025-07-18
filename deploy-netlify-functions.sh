#!/bin/bash

echo "🚀 Preparing Working Hours Calculator for Netlify Functions Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "🔧 Installing Netlify Functions dependencies..."
cd netlify/functions
npm install
cd ../..

echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build files created in 'dist/' directory"
    echo "🔧 Netlify Functions ready in 'netlify/functions/' directory"
    echo ""
    echo "🌐 Ready for Netlify Functions deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://app.netlify.com"
    echo "3. Click 'Add new site' → 'Import an existing project'"
    echo "4. Connect your GitHub repository"
    echo "5. Set build command: npm run build"
    echo "6. Set publish directory: dist"
    echo "7. Set functions directory: netlify/functions"
    echo "8. Add environment variable: JWT_SECRET=your-secret-key-here"
    echo "9. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see NETLIFY-FUNCTIONS-DEPLOYMENT.md"
    echo ""
    echo "🎉 Your app will work entirely on Netlify - no separate backend needed!"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 