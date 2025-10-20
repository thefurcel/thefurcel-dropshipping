# Fulfillment Service Integration

This document explains how the fulfillment service works and how to integrate it with Shopify.

## Overview

The fulfillment service allows your Shopify app to act as a fulfillment service provider. When customers place orders, the app automatically:

1. Identifies the supplier for each product
2. Retrieves the supplier's original shipping location
3. Processes the order with the appropriate supplier
4. Provides tracking information back to Shopify

## Architecture

```
Shopify Order → Webhook → Fulfillment Service → Supplier API → Tracking Info → Shopify
```

## Key Components

### 1. Supplier Location Service (`src/services/supplier-location.service.ts`)
- Manages supplier locations and addresses
- Maps Shopify products to suppliers
- Tracks product-to-supplier relationships

### 2. Fulfillment Service (`src/services/fulfillment.service.ts`)
- Processes fulfillment requests from Shopify
- Groups orders by supplier location
- Submits orders to suppliers
- Aggregates tracking information

### 3. Fulfillment API Routes (`src/routes/fulfillment.ts`)
- REST API endpoints for managing fulfillment
- Test endpoints for development
- Location and mapping management

## API Endpoints

### Fulfillment Processing
- `POST /api/fulfillment/process` - Process a fulfillment request
- `POST /api/fulfillment/test-order` - Test order processing

### Supplier Locations
- `GET /api/fulfillment/locations` - Get supplier locations
- `POST /api/fulfillment/locations` - Create supplier location
- `GET /api/fulfillment/location-for-variant/:variantId` - Get location for variant

### Product Mappings
- `GET /api/fulfillment/mappings` - Get product mappings
- `POST /api/fulfillment/mappings` - Create product mapping

## Setup Instructions

### 1. Configure Shopify App

In your Shopify Partner Dashboard:

1. **Enable Fulfillment Service:**
   - Go to your app settings
   - Enable "Fulfillment service" capability
   - Set fulfillment service URL: `https://your-app.com/api/fulfillment/process`

2. **Configure Webhooks:**
   - Order creation: `https://your-app.com/api/webhooks/orders/create`
   - Fulfillment creation: `https://your-app.com/api/webhooks/fulfillments/create`
   - Inventory updates: `https://your-app.com/api/webhooks/inventory/update`

### 2. Environment Variables

Add to your `.env` file:

```bash
# Shopify webhook verification
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Existing Shopify variables
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_HOST=https://your-app.com
```

### 3. Initialize Supplier Data

The service includes sample data for testing. In production, you'll need to:

1. **Add Supplier Locations:**
```bash
curl -X POST https://your-app.com/api/fulfillment/locations \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "aliexpress_china",
    "name": "AliExpress China Warehouse",
    "address": {
      "address1": "123 Supplier Street",
      "city": "Shenzhen",
      "province": "Guangdong",
      "country": "China",
      "zip": "518000"
    },
    "phone": "+86-755-12345678",
    "email": "warehouse@aliexpress.com",
    "isActive": true
  }'
```

2. **Map Products to Suppliers:**
```bash
curl -X POST https://your-app.com/api/fulfillment/mappings \
  -H "Content-Type: application/json" \
  -d '{
    "shopifyProductId": "123456789",
    "shopifyVariantId": "987654321",
    "supplierId": "aliexpress_china",
    "supplierProductId": "aliexpress_123",
    "supplierVariantId": "aliexpress_123_red",
    "supplierLocationId": "aliexpress_china_Shenzhen",
    "cost": 15.99,
    "currency": "USD",
    "isActive": true
  }'
```

## Testing

### 1. Test Order Processing

```bash
curl -X POST https://your-app.com/api/fulfillment/test-order \
  -H "Content-Type: application/json" \
  -d '{
    "lineItems": [
      {
        "variant_id": 987654321,
        "title": "Test Product",
        "quantity": 2,
        "sku": "TEST-001",
        "price": "29.99"
      }
    ]
  }'
```

### 2. Test Location Lookup

```bash
curl https://your-app.com/api/fulfillment/location-for-variant/987654321
```

## Integration with Shopify

### 1. Enable Fulfillment Service

In your Shopify admin:

1. Go to Settings → Shipping and delivery
2. Add a new fulfillment service
3. Set service name: "Dropship Service"
4. Set API endpoint: `https://your-app.com/api/fulfillment/process`
5. Enable "Track inventory levels"

### 2. Assign Products to Fulfillment Service

For each product you want to fulfill:

1. Go to the product in Shopify admin
2. In the "Shipping" section, select "Dropship Service"
3. Set inventory tracking to "Track inventory"

### 3. Test Order Flow

1. Create a test order in your Shopify store
2. The webhook will trigger fulfillment processing
3. Check logs for fulfillment status
4. Verify tracking information is returned

## Production Considerations

### 1. Database Integration

Replace in-memory storage with a database:

```typescript
// Example with Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierLocationService {
  async createOrUpdateLocation(location: SupplierLocation) {
    return await prisma.supplierLocation.upsert({
      where: { id: location.id },
      update: location,
      create: location,
    });
  }
}
```

### 2. Supplier API Integration

Implement actual supplier API calls:

```typescript
// Example for AliExpress API
private async submitOrderToSupplier(order: SupplierOrderRequest) {
  const response = await axios.post('https://api.aliexpress.com/fulfillment', {
    apiKey: process.env.ALIEXPRESS_API_KEY,
    order: {
      items: order.items,
      shippingAddress: order.shippingAddress,
      customerEmail: order.customerEmail,
    },
  });
  
  return {
    success: response.data.success,
    trackingNumber: response.data.trackingNumber,
  };
}
```

### 3. Error Handling

Implement robust error handling:

- Retry failed supplier API calls
- Queue failed orders for manual processing
- Send notifications for critical errors
- Log all fulfillment attempts

### 4. Monitoring

Set up monitoring for:

- Fulfillment success rates
- Supplier API response times
- Failed order processing
- Webhook delivery status

## Troubleshooting

### Common Issues

1. **No supplier mapping found:**
   - Ensure products are mapped to suppliers
   - Check variant IDs match exactly

2. **Supplier API failures:**
   - Verify API credentials
   - Check supplier API status
   - Implement retry logic

3. **Webhook not received:**
   - Verify webhook URL is accessible
   - Check webhook signature verification
   - Ensure HTTPS is enabled

### Debug Commands

```bash
# Check fulfillment service health
curl https://your-app.com/health

# Test webhook endpoint
curl -X POST https://your-app.com/api/webhooks/fulfillments/create \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-Sha256: test" \
  -d '{"fulfillment": {"id": 1, "order_id": 1, "line_items": []}}'

# View supplier locations
curl https://your-app.com/api/fulfillment/locations
```

## Security

1. **Webhook Verification:** Always verify Shopify webhook signatures
2. **API Authentication:** Secure all API endpoints
3. **Data Encryption:** Encrypt sensitive supplier data
4. **Rate Limiting:** Implement rate limiting for API endpoints
5. **HTTPS Only:** Ensure all communications use HTTPS
