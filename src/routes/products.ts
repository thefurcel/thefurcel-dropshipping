import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
  res.json({ items: [], total: 0 });
});

router.post('/import', async (req, res) => {
  const { source, url, options } = req.body ?? {};
  res.json({ ok: true, source, url, options, productId: 'stub-product-id' });
});

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const update = req.body;
  res.json({ ok: true, productId, update });
});


