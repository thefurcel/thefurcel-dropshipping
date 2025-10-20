import { Router } from 'express';
import { router as products } from './products';
import { router as orders } from './orders';
import { router as suppliers } from './suppliers';
import { router as pricing } from './pricing';
import { router as reports } from './reports';
import { router as webhooks } from './webhooks';
import { router as fulfillment } from './fulfillment';
import { router as auth } from './auth';

export const router = Router();

router.use('/products', products);
router.use('/orders', orders);
router.use('/suppliers', suppliers);
router.use('/pricing', pricing);
router.use('/reports', reports);
router.use('/webhooks', webhooks);
router.use('/fulfillment', fulfillment);
router.use('/auth', auth);


