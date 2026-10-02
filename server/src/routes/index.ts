import { Router } from 'express';
import { createColumn, createTable, getAuthConfig, getDashboard, getEnvironments, getHealth, getImportHistory, getTableMetadata, importRecords, listTables, previewImport } from '../controllers/dataverseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/health', getHealth);
router.get('/auth/config', getAuthConfig);
router.get('/dashboard', requireAuth, getDashboard);
router.get('/environments', requireAuth, getEnvironments);
router.get('/tables', requireAuth, listTables);
router.get('/tables/:tableName', requireAuth, getTableMetadata);
router.post('/tables', requireAuth, createTable);
router.post('/tables/:tableName/columns', requireAuth, createColumn);
router.post('/imports/preview', requireAuth, previewImport);
router.post('/imports', requireAuth, importRecords);
router.get('/imports/history', requireAuth, getImportHistory);

export default router;
