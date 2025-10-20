import { Router } from 'express';
import { shopify } from '../shopify/client.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /auth/install
 * Install the app on a shop
 */
router.get('/install', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    // Validate shop domain
    const sanitizedShop = shopify.utils.sanitizeShop(shop as string);
    if (!sanitizedShop) {
      return res.status(400).json({ error: 'Invalid shop domain' });
    }

    logger.info({ shop: sanitizedShop }, 'Installing app on shop');

    const authRoute = await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    res.redirect(authRoute);
  } catch (error) {
    logger.error({ error }, 'Error during app installation');
    res.status(500).json({ error: 'Installation failed' });
  }
});

/**
 * GET /auth/callback
 * Handle OAuth callback from Shopify
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, hmac, shop, state, host } = req.query;

    // Validate the callback
    if (!shopify.auth.callback.isValidCallback(req.query)) {
      logger.warn({ query: req.query }, 'Invalid OAuth callback');
      return res.status(400).json({ error: 'Invalid callback parameters' });
    }

    logger.info({ shop }, 'Processing OAuth callback');

    // Complete the OAuth flow
    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store session (in production, save to database)
    await storeSession(session);

    logger.info({ shop, sessionId: session.id }, 'OAuth completed successfully');

    // Redirect to app with shop and host parameters
    const redirectUrl = `/?shop=${shop}&host=${host}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error({ error }, 'OAuth callback error');
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * GET /auth/logout
 * Logout and clear session
 */
router.get('/logout', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (shop) {
      // Clear session from storage
      await clearSession(shop as string);
      logger.info({ shop }, 'User logged out');
    }

    // Redirect to Shopify admin
    res.redirect(`https://${shop}/admin/apps`);
  } catch (error) {
    logger.error({ error }, 'Logout error');
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /auth/session
 * Get current session info
 */
router.get('/session', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter required' });
    }

    const session = await getSession(shop as string);
    
    if (!session) {
      return res.status(404).json({ error: 'No active session found' });
    }

    res.json({
      shop: session.shop,
      isOnline: session.isOnline,
      scope: session.scope,
      expires: session.expires,
    });
  } catch (error) {
    logger.error({ error }, 'Error getting session');
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// In-memory session storage (replace with database in production)
const sessions = new Map();

async function storeSession(session: any): Promise<void> {
  sessions.set(session.shop, session);
  logger.debug({ shop: session.shop }, 'Session stored');
}

async function getSession(shop: string): Promise<any> {
  return sessions.get(shop);
}

async function clearSession(shop: string): Promise<void> {
  sessions.delete(shop);
  logger.debug({ shop }, 'Session cleared');
}

export { router };
