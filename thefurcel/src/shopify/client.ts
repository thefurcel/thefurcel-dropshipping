import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

const apiKey = process.env.SHOPIFY_API_KEY ?? '';
const apiSecretKey = process.env.SHOPIFY_API_SECRET ?? '';
const hostName = (process.env.SHOPIFY_HOST ?? '').replace(/^https?:\/\//, '');
const scopes = (process.env.SHOPIFY_SCOPES ?? '').split(',').map(s => s.trim()).filter(Boolean);

export const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes,
  hostName,
  apiVersion: ApiVersion.July24,
});


