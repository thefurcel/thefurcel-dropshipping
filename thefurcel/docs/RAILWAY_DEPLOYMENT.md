# Railway Deployment Guide

This guide will help you deploy your dropshipping app to Railway.

## Prerequisites

- Node.js 18+ installed
- Railway account (free at [railway.app](https://railway.app))
- Your app code in a Git repository

## Method 1: Using Railway CLI (Recommended)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Project
```bash
railway init
```

### Step 4: Deploy
```bash
railway up
```

### Step 5: Set Environment Variables
```bash
railway variables set SHOPIFY_API_KEY=your_api_key
railway variables set SHOPIFY_API_SECRET=your_secret
railway variables set SHOPIFY_HOST=https://your-app.railway.app
railway variables set SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders,write_fulfillments,read_fulfillments
railway variables set NODE_ENV=production
```

## Method 2: Using Railway Web Dashboard

### Step 1: Prepare Your Repository
1. Push your code to GitHub
2. Make sure you have a `package.json` file
3. Ensure your app has a start script

### Step 2: Deploy via Web Interface
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js app

### Step 3: Configure Environment Variables
In the Railway dashboard:
1. Go to your project
2. Click on "Variables" tab
3. Add these variables:
   ```
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_secret
   SHOPIFY_HOST=https://your-app.railway.app
   SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders,write_fulfillments,read_fulfillments
   NODE_ENV=production
   PORT=3000
   ```

### Step 4: Deploy
1. Railway will automatically build and deploy your app
2. You'll get a URL like: `https://your-app-name.railway.app`
3. Use this URL as your Shopify app URL

## Method 3: Using Railway Template

### Step 1: Use Railway Template
1. Go to [railway.app/templates](https://railway.app/templates)
2. Search for "Node.js" template
3. Click "Deploy from Template"
4. Connect your GitHub account

### Step 2: Customize
1. Replace the template code with your app code
2. Update `package.json` if needed
3. Add environment variables

## Post-Deployment Configuration

### 1. Get Your App URL
After deployment, Railway will provide you with a URL like:
`https://thefurcel-dropshipping-production.railway.app`

### 2. Update Shopify App Configuration
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Navigate to your app
3. Update these URLs:
   - **App URL:** `https://your-app.railway.app`
   - **Redirect URL:** `https://your-app.railway.app/auth/callback`
   - **Webhook URLs:**
     - `https://your-app.railway.app/api/webhooks/orders/create`
     - `https://your-app.railway.app/api/webhooks/fulfillments/create`
     - `https://your-app.railway.app/api/webhooks/inventory/update`

### 3. Test Your Deployment
```bash
# Test health endpoint
curl https://your-app.railway.app/health

# Test API endpoints
curl https://your-app.railway.app/api/products
```

## Railway-Specific Features

### 1. Automatic HTTPS
Railway provides automatic HTTPS certificates for all deployments.

### 2. Environment Variables
Set environment variables in the Railway dashboard or via CLI:
```bash
railway variables set KEY=value
```

### 3. Logs
View logs in the Railway dashboard or via CLI:
```bash
railway logs
```

### 4. Custom Domains
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check your `package.json` has correct scripts
   - Ensure all dependencies are listed
   - Check build logs in Railway dashboard

2. **App Won't Start:**
   - Verify `PORT` environment variable is set
   - Check start script in `package.json`
   - Review application logs

3. **Environment Variables Not Working:**
   - Ensure variables are set in Railway dashboard
   - Check variable names match your code
   - Redeploy after adding variables

### Debug Commands
```bash
# View logs
railway logs

# Check status
railway status

# View variables
railway variables

# Connect to project
railway link
```

## Cost Information

- **Free Tier:** 500 hours/month, $5 credit
- **Pro Plan:** $5/month per developer
- **Usage-based pricing** for additional resources

## Next Steps

After successful deployment:
1. Test all endpoints
2. Configure Shopify app settings
3. Set up monitoring
4. Prepare for App Store submission

Your app will be accessible at: `https://your-app-name.railway.app`
