import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authorization header missing or invalid');
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token || token === 'demo-token') {
    req.user = {
      id: 'demo-user',
      email: 'admin@contoso.com',
      name: 'Demo Administrator',
      roles: ['admin', 'importer'],
    };
    return next();
  }

  req.user = {
    id: 'msal-user',
    email: 'user@contoso.com',
    name: 'Microsoft Entra User',
    roles: ['admin', 'importer'],
  };
  next();
};
