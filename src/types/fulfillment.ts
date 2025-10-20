export interface SupplierLocation {
  id: string;
  supplierId: string;
  name: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSupplierMapping {
  id: string;
  shopifyProductId: string;
  shopifyVariantId: string;
  supplierId: string;
  supplierProductId: string;
  supplierVariantId?: string;
  supplierLocationId: string;
  cost: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FulfillmentRequest {
  fulfillment: {
    id: number;
    order_id: number;
    status: string;
    created_at: string;
    service: {
      id: number;
      name: string;
      service_name: string;
    };
    tracking_company: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    line_items: Array<{
      id: number;
      variant_id: number;
      title: string;
      quantity: number;
      sku: string;
      variant_title: string;
      vendor: string;
      fulfillment_service: string;
      product_id: number;
      requires_shipping: boolean;
      taxable: boolean;
      gift_card: boolean;
      name: string;
      variant_inventory_management: string;
      properties: any[];
      product_exists: boolean;
      fulfillable_quantity: number;
      grams: number;
      price: string;
      total_discount: string;
      fulfillment_status: string | null;
      price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      total_discount_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      discount_allocations: any[];
      duties: any[];
      admin_graphql_api_id: string;
      tax_lines: any[];
    }>;
    location_id: number;
    origin_address: {
      id: number;
      address1: string;
      address2: string | null;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string | null;
      name: string | null;
      company: string | null;
      country_code: string;
      country_name: string;
      province_code: string;
    };
    destination_address: {
      id: number;
      address1: string;
      address2: string | null;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string | null;
      name: string | null;
      company: string | null;
      country_code: string;
      country_name: string;
      province_code: string;
    };
    line_items_by_fulfillment_order: any[];
    fulfillment_orders: any[];
  };
}

export interface FulfillmentResponse {
  fulfillment: {
    id: number;
    order_id: number;
    status: 'pending' | 'open' | 'success' | 'cancelled' | 'error' | 'failure';
    created_at: string;
    service: {
      id: number;
      name: string;
      service_name: string;
    };
    tracking_company: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    line_items: any[];
    location_id: number;
    origin_address: any;
    destination_address: any;
    line_items_by_fulfillment_order: any[];
    fulfillment_orders: any[];
  };
}

export interface SupplierOrderRequest {
  supplierId: string;
  supplierLocationId: string;
  items: Array<{
    supplierProductId: string;
    supplierVariantId?: string;
    quantity: number;
    cost: number;
    currency: string;
  }>;
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  };
  customerEmail: string;
  orderNotes?: string;
}
