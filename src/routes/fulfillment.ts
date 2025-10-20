import { Router } from 'express';
import { FulfillmentService } from '../services/fulfillment.service.js';
import { SupplierLocationService } from '../services/supplier-location.service.js';
import { logger } from '../utils/logger.js';

const router = Router();
const fulfillmentService = new FulfillmentService();
const supplierLocationService = fulfillmentService.getSupplierLocationService();

// Initialize sample data
supplierLocationService.initializeSampleData();

/**
 * POST /api/fulfillment/process
 * Process a fulfillment request from Shopify
 */
router.post('/process', async (req, res) => {
  try {
    const fulfillmentData = req.body;
    
    if (!fulfillmentData.fulfillment) {
      return res.status(400).json({ error: 'Invalid fulfillment data' });
    }

    logger.info({ 
      orderId: fulfillmentData.fulfillment.order_id,
      fulfillmentId: fulfillmentData.fulfillment.id 
    }, 'Received fulfillment request');

    const result = await fulfillmentService.processFulfillmentRequest(fulfillmentData);
    
    res.json(result);
  } catch (error) {
    logger.error({ error }, 'Failed to process fulfillment request');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/fulfillment/locations
 * Get all supplier locations
 */
router.get('/locations', async (req, res) => {
  try {
    const supplierId = req.query.supplierId as string;
    
    let locations;
    if (supplierId) {
      locations = await supplierLocationService.getLocationsBySupplier(supplierId);
    } else {
      // Get all locations (this would need to be implemented in the service)
      locations = [];
    }
    
    res.json({ locations });
  } catch (error) {
    logger.error({ error }, 'Failed to get supplier locations');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/fulfillment/locations
 * Create a new supplier location
 */
router.post('/locations', async (req, res) => {
  try {
    const locationData = req.body;
    
    const location = await supplierLocationService.createOrUpdateLocation(locationData);
    
    res.json({ location });
  } catch (error) {
    logger.error({ error }, 'Failed to create supplier location');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/fulfillment/mappings
 * Get product-to-supplier mappings
 */
router.get('/mappings', async (req, res) => {
  try {
    const variantId = req.query.variantId as string;
    
    if (variantId) {
      const mapping = await supplierLocationService.getSupplierMapping(variantId);
      res.json({ mapping });
    } else {
      res.json({ mappings: [] }); // Would need to implement getAllMappings
    }
  } catch (error) {
    logger.error({ error }, 'Failed to get product mappings');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/fulfillment/mappings
 * Create a product-to-supplier mapping
 */
router.post('/mappings', async (req, res) => {
  try {
    const mappingData = req.body;
    
    const mapping = await supplierLocationService.mapProductToSupplier(mappingData);
    
    res.json({ mapping });
  } catch (error) {
    logger.error({ error }, 'Failed to create product mapping');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/fulfillment/location-for-variant/:variantId
 * Get supplier location for a specific product variant
 */
router.get('/location-for-variant/:variantId', async (req, res) => {
  try {
    const { variantId } = req.params;
    
    const location = await supplierLocationService.getLocationForVariant(variantId);
    
    if (!location) {
      return res.status(404).json({ error: 'No supplier location found for this variant' });
    }
    
    res.json({ location });
  } catch (error) {
    logger.error({ error, variantId: req.params.variantId }, 'Failed to get location for variant');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/fulfillment/test-order
 * Test endpoint to simulate order processing
 */
router.post('/test-order', async (req, res) => {
  try {
    const { lineItems } = req.body;
    
    if (!lineItems || !Array.isArray(lineItems)) {
      return res.status(400).json({ error: 'lineItems array is required' });
    }

    // Create a mock fulfillment request
    const mockFulfillmentData = {
      fulfillment: {
        id: Math.floor(Math.random() * 1000000),
        order_id: Math.floor(Math.random() * 1000000),
        status: 'pending',
        created_at: new Date().toISOString(),
        service: {
          id: 1,
          name: 'Dropship Service',
          service_name: 'dropship_service',
        },
        tracking_company: null,
        tracking_number: null,
        tracking_url: null,
        line_items: lineItems,
        location_id: 1,
        origin_address: {
          id: 1,
          address1: '123 Test Street',
          address2: null,
          city: 'Test City',
          province: 'Test Province',
          country: 'Test Country',
          zip: '12345',
          phone: null,
          name: null,
          company: null,
          country_code: 'TC',
          country_name: 'Test Country',
          province_code: 'TP',
        },
        destination_address: {
          id: 2,
          address1: '456 Customer Street',
          address2: null,
          city: 'Customer City',
          province: 'Customer Province',
          country: 'Customer Country',
          zip: '54321',
          phone: null,
          name: 'Test Customer',
          company: null,
          country_code: 'CC',
          country_name: 'Customer Country',
          province_code: 'CP',
        },
        line_items_by_fulfillment_order: [],
        fulfillment_orders: [],
      },
    };

    const result = await fulfillmentService.processFulfillmentRequest(mockFulfillmentData);
    
    res.json(result);
  } catch (error) {
    logger.error({ error }, 'Failed to process test order');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router };
