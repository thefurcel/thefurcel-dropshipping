import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
  res.json({ items: [], total: 0 });
});

router.post('/fulfill/:orderId', async (req, res) => {
  const { orderId } = req.params;
  res.json({ ok: true, orderId, status: 'submitted-to-supplier' });
});

router.get('/tracking/:orderId', async (req, res) => {
  const { orderId } = req.params;
  res.json({ orderId, trackingNumber: 'TRACK123456', carrier: 'StubCarrier' });
});


