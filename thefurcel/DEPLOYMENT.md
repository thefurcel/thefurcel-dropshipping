# Deployment Guide for The Furcel Dropshipping App

This guide covers multiple deployment options for your Shopify dropshipping app backend.

## Prerequisites

1. **Node.js 18+** - Install from [nodejs.org](https://nodejs.org/)
2. **Git** - For version control
3. **Shopify Partner Account** - Create at [partners.shopify.com](https://partners.shopify.com)
4. **HTTPS Domain** - Required for Shopify apps

## Option 1: Railway (Recommended for Beginners)

Railway offers easy deployment with automatic HTTPS and database integration.

### Steps:
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set SHOPIFY_API_KEY=your_api_key
   railway variables set SHOPIFY_API_SECRET=your_secret
   railway variables set SHOPIFY_HOST=https://your-app.railway.app
   railway variables set SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders
   ```

4. **Get your app URL** and configure in Shopify Partner Dashboard

## Option 2: Heroku

### Steps:
1. **Install Heroku CLI** from [devcenter.heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set SHOPIFY_API_KEY=your_api_key
   heroku config:set SHOPIFY_API_SECRET=your_secret
   heroku config:set SHOPIFY_HOST=https://your-app-name.herokuapp.com
   heroku config:set SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

## Option 3: DigitalOcean App Platform

### Steps:
1. **Connect GitHub Repository** to DigitalOcean
2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Source Directory: `/`
3. **Set Environment Variables** in the dashboard
4. **Deploy** automatically on git push

## Option 4: AWS (Advanced)

### Using AWS Elastic Beanstalk:
1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   eb init
   eb create production
   ```

3. **Set Environment Variables:**
   ```bash
   eb setenv SHOPIFY_API_KEY=your_api_key
   eb setenv SHOPIFY_API_SECRET=your_secret
   eb setenv SHOPIFY_HOST=https://your-app.region.elasticbeanstalk.com
   ```

4. **Deploy:**
   ```bash
   eb deploy
   ```

## Option 5: Vercel (Serverless)

### Steps:
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/server.js"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## Shopify App Configuration

### 1. Create Shopify App:
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Create new app
3. Set app URL to your deployed backend URL
4. Set allowed redirection URLs

### 2. Required Environment Variables:
```bash
SHOPIFY_API_KEY=your_api_key_from_partners_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partners_dashboard
SHOPIFY_HOST=https://your-deployed-app.com
SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders
```

### 3. Webhook Configuration:
Set up webhooks in your Shopify app settings:
- **Order Creation:** `https://your-app.com/api/webhooks/orders/create`
- **Inventory Update:** `https://your-app.com/api/webhooks/inventory/update`

## Database Setup (Optional)

For production, add a database:

### PostgreSQL with Railway:
```bash
railway add postgresql
```

### MongoDB Atlas:
1. Create cluster at [mongodb.com](https://mongodb.com)
2. Get connection string
3. Add to environment variables

## SSL/HTTPS Requirements

- **Required for Shopify apps**
- Most platforms provide automatic SSL
- For custom domains, use Let's Encrypt or Cloudflare

## Monitoring & Logs

### Railway:
```bash
railway logs
```

### Heroku:
```bash
heroku logs --tail
```

### AWS:
```bash
eb logs
```

## Local Development Setup

1. **Install Node.js 18+**
2. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd thefurcel
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

## Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database connected (if using)
- [ ] Webhooks configured in Shopify
- [ ] Error monitoring set up (Sentry recommended)
- [ ] Logging configured
- [ ] Backup strategy in place

## Troubleshooting

### Common Issues:
1. **CORS errors:** Ensure your frontend domain is whitelisted
2. **Webhook failures:** Check webhook URLs and authentication
3. **API rate limits:** Implement proper rate limiting
4. **Memory issues:** Monitor memory usage and scale accordingly

### Debug Commands:
```bash
# Check if app is running
curl https://your-app.com/health

# Test webhook endpoint
curl -X POST https://your-app.com/api/webhooks/orders/create \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## Next Steps After Deployment

1. **Add Authentication:** Implement Shopify OAuth flow
2. **Database Integration:** Add Prisma or similar ORM
3. **Background Jobs:** Implement queue system for order processing
4. **Frontend:** Build React admin interface
5. **Testing:** Add unit and integration tests
6. **CI/CD:** Set up automated deployment pipeline

## Cost Estimates

- **Railway:** $5-20/month (includes database)
- **Heroku:** $7-25/month (basic dyno)
- **DigitalOcean:** $12-24/month
- **AWS:** $10-50/month (varies by usage)
- **Vercel:** Free tier available, $20+/month for pro

Choose the option that best fits your budget and technical requirements!
