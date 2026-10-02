import type { Request, Response } from 'express';
import dataverseMcpService from '../services/dataverseMcpService.js';
import auditService from '../services/auditService.js';
import logger from '../config/logger.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export const getHealth = (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'Dataverse MCP Data Importer API' });
};

export const getAuthConfig = (_req: Request, res: Response) => {
  res.json({
    clientId: process.env.MSAL_CLIENT_ID ?? '00000000-0000-0000-0000-000000000000',
    tenantId: process.env.MSAL_TENANT_ID ?? '00000000-0000-0000-0000-000000000000',
    authority: process.env.MSAL_AUTHORITY ?? 'https://login.microsoftonline.com/common',
    redirectUri: process.env.CLIENT_URL ?? 'http://localhost:5173',
  });
};

export const getDashboard = async (_req: AuthenticatedRequest, res: Response) => {
  const summary = auditService.getDashboardMetrics();
  const environments = await dataverseMcpService.getEnvironments();
  const tables = await dataverseMcpService.getTables();

  res.json({
    ...summary,
    environments,
    totalTables: tables.length,
  });
};

export const getEnvironments = async (_req: Request, res: Response) => {
  const environments = await dataverseMcpService.getEnvironments();
  res.json(environments);
};

export const listTables = async (_req: Request, res: Response) => {
  const tables = await dataverseMcpService.getTables();
  res.json({ tables });
};

export const getTableMetadata = async (req: Request, res: Response) => {
  const tableName = Array.isArray(req.params.tableName) ? req.params.tableName[0] : req.params.tableName;
  const table = await dataverseMcpService.getTableMetadata(tableName);
  res.json(table);
};

export const createTable = async (req: Request, res: Response) => {
  const tableDefinition = req.body;
  const created = await dataverseMcpService.createTable(tableDefinition);
  logger.info(`Table created: ${created.logicalName}`);
  res.status(201).json(created);
};

export const createColumn = async (req: Request, res: Response) => {
  const tableName = Array.isArray(req.params.tableName) ? req.params.tableName[0] : req.params.tableName;
  const column = await dataverseMcpService.createColumn(tableName, req.body);
  res.status(201).json(column);
};

export const previewImport = async (req: Request, res: Response) => {
  const { records } = req.body;
  const validation = await dataverseMcpService.validateData(records ?? []);
  res.json({ totalRecords: records?.length ?? 0, validation });
};

export const importRecords = async (req: AuthenticatedRequest, res: Response) => {
  const { tableName, records, fileName, environment } = req.body;
  const result = await dataverseMcpService.importRecords(tableName, records ?? []);

  const job = auditService.recordImport({
    user: req.user?.email ?? 'anonymous',
    timestamp: new Date().toISOString(),
    tableName,
    fileName: fileName ?? 'import.csv',
    totalRecords: result.totalRecords,
    successCount: result.successCount,
    failureCount: result.failureCount,
    status: result.failureCount > 0 ? 'failed' : 'completed',
    errorDetails: result.issues.map((issue) => `${issue.field}: ${issue.message}`),
    environment: environment ?? 'Contoso Production',
  });

  res.status(200).json({ job, result });
};

export const getImportHistory = async (_req: Request, res: Response) => {
  res.json({ jobs: auditService.listJobs() });
};
