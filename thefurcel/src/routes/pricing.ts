import { Router } from 'express';

export const router = Router();

router.get('/rules', async (_req, res) => {
  res.json({ rules: [] });
});

router.post('/rules', async (req, res) => {
  const rule = req.body;
  res.json({ ok: true, ruleId: 'stub-rule-id', rule });
});

router.post('/reprice', async (_req, res) => {
  res.json({ ok: true, updated: 0 });
});


