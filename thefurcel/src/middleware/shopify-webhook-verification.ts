import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

/**
 * Middleware to verify Shopify webhook signatures
 */
export function verifyShopifyWebhook(req: Request, res: Response, next: NextFunction) {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!secret) {
    logger.warn('SHOPIFY_WEBHOOK_SECRET not configured, skipping webhook verification');
    return next();
  }

  if (!hmac) {
    logger.warn('Missing X-Shopify-Hmac-Sha256 header');
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  // Convert body to string if it's an object
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  
  // Create HMAC hash
  const hash = crypto
    .createHmac('sha256', secret)
    .update(bodyString, 'utf8')
    .digest('base64');

  // Compare hashes
  if (hash !== hmac) {
    logger.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  logger.debug('Webhook signature verified');
  next();
}

/**
 * Middleware to verify Shopify app proxy requests
 */
export function verifyShopifyAppProxy(req: Request, res: Response, next: NextFunction) {
  const signature = req.query.signature as string;
  const query = { ...req.query };
  delete query.signature;

  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  // Create signature from query parameters
  const sortedQuery = Object.keys(query)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('');

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    logger.warn('SHOPIFY_API_SECRET not configured, skipping app proxy verification');
    return next();
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(sortedQuery, 'utf8')
    .digest('hex');

  if (hash !== signature) {
    logger.warn('Invalid app proxy signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}
