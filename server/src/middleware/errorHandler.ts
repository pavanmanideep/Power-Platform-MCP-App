import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};
