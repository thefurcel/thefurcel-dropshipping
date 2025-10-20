import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router as apiRouter } from './routes/index';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, version: '0.1.0' });
});

app.use('/api', apiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info({ port }, 'Server listening');
});


