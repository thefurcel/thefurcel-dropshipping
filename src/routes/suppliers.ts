import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
  res.json({ items: [], total: 0 });
});

router.post('/', async (req, res) => {
  const supplier = req.body;
  res.json({ ok: true, supplierId: 'stub-supplier-id', supplier });
});

router.get('/:supplierId/products', async (req, res) => {
  const { supplierId } = req.params;
  res.json({ supplierId, items: [] });
});


