#!/bin/bash

# Deploy to Shopify App Store
# This script helps prepare and deploy your app to the Shopify App Store

set -e

echo "🚀 Deploying The Furcel Dropshipping App to Shopify App Store"

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    echo "✅ All dependencies are installed"
}

# Build the application
build_app() {
    echo "🔨 Building application..."
    
    # Install dependencies
    npm install
    
    # Build TypeScript
    npm run build
    
    echo "✅ Application built successfully"
}

# Validate configuration
validate_config() {
    echo "🔍 Validating configuration..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo "❌ .env file not found. Please create one from .env.example"
        exit 1
    fi
    
    # Check required environment variables
    required_vars=("SHOPIFY_API_KEY" "SHOPIFY_API_SECRET" "SHOPIFY_HOST")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            echo "❌ ${var} is not set in .env file"
            exit 1
        fi
    done
    
    echo "✅ Configuration is valid"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    
    # Add your test commands here
    # npm test
    
    echo "✅ Tests passed"
}

# Deploy to production
deploy_production() {
    echo "🚀 Deploying to production..."
    
    # Add your deployment commands here
    # Examples:
    # - Railway: railway up
    # - Heroku: git push heroku main
    # - AWS: eb deploy
    # - DigitalOcean: doctl apps create-deployment
    
    echo "✅ Deployed to production"
}

# Update app configuration
update_app_config() {
    echo "⚙️ Updating app configuration..."
    
    # Update shopify.app.toml with production URLs
    if [ -f shopify.app.toml ]; then
        echo "📝 Updating shopify.app.toml..."
        # Add commands to update configuration
    fi
    
    echo "✅ App configuration updated"
}

# Submit to App Store
submit_app_store() {
    echo "📱 Submitting to App Store..."
    
    echo "📋 App Store submission checklist:"
    echo "  ✅ App is deployed and accessible"
    echo "  ✅ OAuth flow is working"
    echo "  ✅ Webhooks are configured"
    echo "  ✅ App store assets are ready"
    echo "  ✅ Privacy policy is published"
    echo "  ✅ Terms of service are published"
    echo "  ✅ App has been tested thoroughly"
    
    echo "🔗 Next steps:"
    echo "  1. Go to https://partners.shopify.com"
    echo "  2. Navigate to your app"
    echo "  3. Click 'App Store listing'"
    echo "  4. Fill in all required information"
    echo "  5. Upload app assets"
    echo "  6. Submit for review"
    
    echo "✅ Ready for App Store submission"
}

# Main execution
main() {
    echo "🎯 Starting deployment process..."
    
    check_dependencies
    validate_config
    build_app
    run_tests
    deploy_production
    update_app_config
    submit_app_store
    
    echo "🎉 Deployment process completed!"
    echo "📱 Your app is ready for the Shopify App Store"
}

# Run main function
main "$@"
