#!/bin/bash

# MC Taxi Calculator - Vercel Environment Variables Setup
# This script sets up environment variables for Vercel deployment

echo "🚀 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

echo "📝 Setting environment variables for Vercel..."

# Set the API URL for the frontend
vercel env add NEXT_PUBLIC_API_URL production << 'EOF'
http://35.74.250.160:3001
EOF

# Set the API URL for preview deployments
vercel env add NEXT_PUBLIC_API_URL preview << 'EOF'
http://35.74.250.160:3001
EOF

# Set the API URL for development
vercel env add NEXT_PUBLIC_API_URL development << 'EOF'
http://35.74.250.160:3001
EOF

echo "✅ Vercel environment variables set successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Redeploy your Vercel application to apply the changes"
echo "2. Or run: vercel --prod to deploy immediately"
echo ""
echo "📋 Current environment variables:"
vercel env ls
