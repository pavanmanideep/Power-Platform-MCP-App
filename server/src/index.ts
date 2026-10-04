import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import router from './routes/index.js';
import logger from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(morgan('combined'));
app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Dataverse MCP Data Importer API listening on http://localhost:${port}`);
});
