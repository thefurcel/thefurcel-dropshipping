import { Router } from 'express';

export const router = Router();

router.get('/profits', async (_req, res) => {
  res.json({ currency: 'USD', totals: { revenue: 0, cost: 0, profit: 0, marginPct: 0 } });
});


