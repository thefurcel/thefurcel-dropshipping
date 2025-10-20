import { SupplierLocation, ProductSupplierMapping } from '../types/fulfillment.js';
import { logger } from '../utils/logger.js';

// In-memory storage for demo purposes
// In production, this should be replaced with a database
const supplierLocations: Map<string, SupplierLocation> = new Map();
const productMappings: Map<string, ProductSupplierMapping> = new Map();

export class SupplierLocationService {
  /**
   * Create or update a supplier location
   */
  async createOrUpdateLocation(location: Omit<SupplierLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierLocation> {
    const id = location.supplierId + '_' + location.address.city;
    const now = new Date();
    
    const existingLocation = supplierLocations.get(id);
    
    const supplierLocation: SupplierLocation = {
      ...location,
      id,
      createdAt: existingLocation?.createdAt || now,
      updatedAt: now,
    };
    
    supplierLocations.set(id, supplierLocation);
    logger.info({ locationId: id, supplierId: location.supplierId }, 'Supplier location created/updated');
    
    return supplierLocation;
  }

  /**
   * Get supplier location by ID
   */
  async getLocationById(locationId: string): Promise<SupplierLocation | null> {
    return supplierLocations.get(locationId) || null;
  }

  /**
   * Get all locations for a supplier
   */
  async getLocationsBySupplier(supplierId: string): Promise<SupplierLocation[]> {
    return Array.from(supplierLocations.values())
      .filter(location => location.supplierId === supplierId && location.isActive);
  }

  /**
   * Map a Shopify product variant to a supplier
   */
  async mapProductToSupplier(mapping: Omit<ProductSupplierMapping, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductSupplierMapping> {
    const id = mapping.shopifyVariantId + '_' + mapping.supplierId;
    const now = new Date();
    
    const productMapping: ProductSupplierMapping = {
      ...mapping,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    productMappings.set(id, productMapping);
    logger.info({ mappingId: id, shopifyVariantId: mapping.shopifyVariantId, supplierId: mapping.supplierId }, 'Product mapped to supplier');
    
    return productMapping;
  }

  /**
   * Get supplier mapping for a Shopify product variant
   */
  async getSupplierMapping(shopifyVariantId: string): Promise<ProductSupplierMapping | null> {
    // Find mapping by Shopify variant ID
    for (const mapping of productMappings.values()) {
      if (mapping.shopifyVariantId === shopifyVariantId && mapping.isActive) {
        return mapping;
      }
    }
    return null;
  }

  /**
   * Get supplier location for a Shopify product variant
   */
  async getLocationForVariant(shopifyVariantId: string): Promise<SupplierLocation | null> {
    const mapping = await this.getSupplierMapping(shopifyVariantId);
    if (!mapping) {
      logger.warn({ shopifyVariantId }, 'No supplier mapping found for variant');
      return null;
    }

    const location = await this.getLocationById(mapping.supplierLocationId);
    if (!location) {
      logger.warn({ supplierLocationId: mapping.supplierLocationId }, 'Supplier location not found');
      return null;
    }

    return location;
  }

  /**
   * Get all supplier mappings for an order
   */
  async getMappingsForOrder(lineItems: any[]): Promise<Map<string, { mapping: ProductSupplierMapping; location: SupplierLocation }>> {
    const mappings = new Map();
    
    for (const item of lineItems) {
      const mapping = await this.getSupplierMapping(item.variant_id.toString());
      if (mapping) {
        const location = await this.getLocationById(mapping.supplierLocationId);
        if (location) {
          mappings.set(item.variant_id.toString(), { mapping, location });
        }
      }
    }
    
    return mappings;
  }

  /**
   * Group order items by supplier location
   */
  async groupOrderBySupplierLocation(lineItems: any[]): Promise<Map<string, { location: SupplierLocation; items: any[] }>> {
    const mappings = await this.getMappingsForOrder(lineItems);
    const grouped = new Map();
    
    for (const [variantId, { mapping, location }] of mappings) {
      const locationKey = location.id;
      
      if (!grouped.has(locationKey)) {
        grouped.set(locationKey, { location, items: [] });
      }
      
      const item = lineItems.find(item => item.variant_id.toString() === variantId);
      if (item) {
        grouped.get(locationKey).items.push({
          ...item,
          supplierMapping: mapping,
        });
      }
    }
    
    return grouped;
  }

  /**
   * Initialize with sample data for demo purposes
   */
  async initializeSampleData(): Promise<void> {
    // Sample supplier locations
    await this.createOrUpdateLocation({
      supplierId: 'aliexpress_china',
      name: 'AliExpress China Warehouse',
      address: {
        address1: '123 Supplier Street',
        city: 'Shenzhen',
        province: 'Guangdong',
        country: 'China',
        zip: '518000',
      },
      phone: '+86-755-12345678',
      email: 'warehouse@aliexpress.com',
      isActive: true,
    });

    await this.createOrUpdateLocation({
      supplierId: 'alibaba_china',
      name: 'Alibaba China Hub',
      address: {
        address1: '456 Factory Road',
        city: 'Guangzhou',
        province: 'Guangdong',
        country: 'China',
        zip: '510000',
      },
      phone: '+86-20-87654321',
      email: 'orders@alibaba.com',
      isActive: true,
    });

    await this.createOrUpdateLocation({
      supplierId: 'aliexpress_us',
      name: 'AliExpress US Warehouse',
      address: {
        address1: '789 Distribution Blvd',
        city: 'Los Angeles',
        province: 'California',
        country: 'United States',
        zip: '90001',
      },
      phone: '+1-323-555-0123',
      email: 'us-warehouse@aliexpress.com',
      isActive: true,
    });

    logger.info('Sample supplier locations initialized');
  }
}
