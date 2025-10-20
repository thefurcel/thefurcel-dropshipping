import { shopify } from '../shopify/client.js';
import { SupplierLocationService } from './supplier-location.service.js';
import { FulfillmentRequest, FulfillmentResponse, SupplierOrderRequest } from '../types/fulfillment.js';
import { logger } from '../utils/logger.js';

export class FulfillmentService {
  private supplierLocationService: SupplierLocationService;

  constructor() {
    this.supplierLocationService = new SupplierLocationService();
  }

  /**
   * Process a fulfillment request from Shopify
   */
  async processFulfillmentRequest(fulfillmentData: FulfillmentRequest): Promise<FulfillmentResponse> {
    const { fulfillment } = fulfillmentData;
    const { line_items, order_id } = fulfillment;

    logger.info({ orderId: order_id, lineItemCount: line_items.length }, 'Processing fulfillment request');

    try {
      // Group order items by supplier location
      const groupedByLocation = await this.supplierLocationService.groupOrderBySupplierLocation(line_items);
      
      if (groupedByLocation.size === 0) {
        logger.warn({ orderId: order_id }, 'No supplier mappings found for order items');
        return this.createFulfillmentResponse(fulfillment, 'error', 'No supplier mappings found');
      }

      // Process each supplier location separately
      const fulfillmentResults = [];
      for (const [locationId, { location, items }] of groupedByLocation) {
        try {
          const result = await this.processSupplierFulfillment(location, items, order_id);
          fulfillmentResults.push(result);
        } catch (error) {
          logger.error({ error, locationId, orderId: order_id }, 'Failed to process supplier fulfillment');
          fulfillmentResults.push({ success: false, error: error.message });
        }
      }

      // Check if all fulfillments were successful
      const allSuccessful = fulfillmentResults.every(result => result.success);
      const status = allSuccessful ? 'success' : 'error';
      const trackingInfo = this.aggregateTrackingInfo(fulfillmentResults);

      return this.createFulfillmentResponse(
        fulfillment,
        status,
        allSuccessful ? 'Fulfillment processed successfully' : 'Some fulfillments failed',
        trackingInfo
      );

    } catch (error) {
      logger.error({ error, orderId: order_id }, 'Failed to process fulfillment request');
      return this.createFulfillmentResponse(fulfillment, 'error', error.message);
    }
  }

  /**
   * Process fulfillment for a specific supplier location
   */
  private async processSupplierFulfillment(
    location: any,
    items: any[],
    orderId: number
  ): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
    try {
      // Create supplier order request
      const supplierOrder: SupplierOrderRequest = {
        supplierId: location.supplierId,
        supplierLocationId: location.id,
        items: items.map(item => ({
          supplierProductId: item.supplierMapping.supplierProductId,
          supplierVariantId: item.supplierMapping.supplierVariantId,
          quantity: item.quantity,
          cost: item.supplierMapping.cost,
          currency: item.supplierMapping.currency,
        })),
        shippingAddress: {
          name: 'Customer Name', // This should come from the order
          address1: 'Customer Address', // This should come from the order
          city: 'Customer City',
          province: 'Customer Province',
          country: 'Customer Country',
          zip: 'Customer ZIP',
        },
        customerEmail: 'customer@example.com', // This should come from the order
        orderNotes: `Shopify Order #${orderId}`,
      };

      // Submit order to supplier (this would integrate with actual supplier APIs)
      const supplierResponse = await this.submitOrderToSupplier(supplierOrder);
      
      if (supplierResponse.success) {
        logger.info({ 
          supplierId: location.supplierId, 
          orderId, 
          trackingNumber: supplierResponse.trackingNumber 
        }, 'Successfully submitted order to supplier');
        
        return {
          success: true,
          trackingNumber: supplierResponse.trackingNumber,
        };
      } else {
        return {
          success: false,
          error: supplierResponse.error || 'Unknown supplier error',
        };
      }

    } catch (error) {
      logger.error({ error, supplierId: location.supplierId, orderId }, 'Failed to process supplier fulfillment');
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Submit order to supplier (placeholder for actual supplier integration)
   */
  private async submitOrderToSupplier(order: SupplierOrderRequest): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
    // This is a placeholder implementation
    // In production, this would integrate with actual supplier APIs like:
    // - AliExpress API
    // - Alibaba API
    // - Other supplier APIs
    
    logger.info({ 
      supplierId: order.supplierId, 
      itemCount: order.items.length 
    }, 'Submitting order to supplier');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success/failure based on supplier
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (isSuccess) {
      const trackingNumber = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      return {
        success: true,
        trackingNumber,
      };
    } else {
      return {
        success: false,
        error: 'Supplier API temporarily unavailable',
      };
    }
  }

  /**
   * Create fulfillment response for Shopify
   */
  private createFulfillmentResponse(
    originalFulfillment: any,
    status: 'pending' | 'open' | 'success' | 'cancelled' | 'error' | 'failure',
    message: string,
    trackingInfo?: { trackingCompany?: string; trackingNumber?: string; trackingUrl?: string }
  ): FulfillmentResponse {
    return {
      fulfillment: {
        ...originalFulfillment,
        status,
        tracking_company: trackingInfo?.trackingCompany || 'Dropship Service',
        tracking_number: trackingInfo?.trackingNumber || null,
        tracking_url: trackingInfo?.trackingUrl || null,
      },
    };
  }

  /**
   * Aggregate tracking information from multiple suppliers
   */
  private aggregateTrackingInfo(results: Array<{ success: boolean; trackingNumber?: string; error?: string }>): {
    trackingCompany?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  } {
    const successfulResults = results.filter(r => r.success && r.trackingNumber);
    
    if (successfulResults.length === 0) {
      return {};
    }

    if (successfulResults.length === 1) {
      return {
        trackingCompany: 'Dropship Service',
        trackingNumber: successfulResults[0].trackingNumber,
        trackingUrl: `https://tracking.example.com/${successfulResults[0].trackingNumber}`,
      };
    }

    // Multiple tracking numbers - create a combined tracking page
    const trackingNumbers = successfulResults.map(r => r.trackingNumber).join(',');
    return {
      trackingCompany: 'Dropship Service (Multiple)',
      trackingNumber: trackingNumbers,
      trackingUrl: `https://tracking.example.com/combined/${trackingNumbers}`,
    };
  }

  /**
   * Get supplier location service instance
   */
  getSupplierLocationService(): SupplierLocationService {
    return this.supplierLocationService;
  }
}
