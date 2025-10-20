import { Router } from 'express';
import { FulfillmentService } from '../services/fulfillment.service.js';
import { logger } from '../utils/logger.js';

const router = Router();
const fulfillmentService = new FulfillmentService();

router.post('/orders/create', async (req, res) => {
  try {
    const orderData = req.body;
    logger.info({ orderId: orderData.id }, 'Order created webhook received');
    
    // Here you would typically:
    // 1. Validate the webhook signature
    // 2. Process the order for fulfillment
    // 3. Create fulfillment requests for each line item
    
    res.json({ ok: true });
  } catch (error) {
    logger.error({ error }, 'Error processing order create webhook');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/inventory/update', async (req, res) => {
  try {
    const inventoryData = req.body;
    logger.info({ inventoryItemId: inventoryData.id }, 'Inventory update webhook received');
    
    // Here you would typically:
    // 1. Update your local inventory tracking
    // 2. Sync with supplier inventory levels
    // 3. Update Shopify inventory if needed
    
    res.json({ ok: true });
  } catch (error) {
    logger.error({ error }, 'Error processing inventory update webhook');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/fulfillments/create', async (req, res) => {
  try {
    const fulfillmentData = req.body;
    logger.info({ fulfillmentId: fulfillmentData.id }, 'Fulfillment create webhook received');
    
    // Process the fulfillment request
    const result = await fulfillmentService.processFulfillmentRequest(fulfillmentData);
    
    res.json(result);
  } catch (error) {
    logger.error({ error }, 'Error processing fulfillment create webhook');
    res.status(500).json({ error: 'Internal server error' });
  }
});


