export type OwnershipType = 'user' | 'team';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  roles: string[];
}

export interface Environment {
  id: string;
  name: string;
  url: string;
  tenantId: string;
  type: 'Production' | 'Sandbox' | 'Trial';
}

export interface DataverseTable {
  name: string;
  displayName: string;
  logicalName: string;
  schemaName?: string;
  ownershipType: OwnershipType;
  enableNotes: boolean;
  enableActivities: boolean;
  primaryNameColumn: string;
  columns: DataverseColumn[];
  metadata?: Record<string, unknown>;
}

export interface DataverseColumn {
  name: string;
  displayName: string;
  logicalName: string;
  dataType: 'Text' | 'MultilineText' | 'Number' | 'Decimal' | 'Currency' | 'DateTime' | 'Choice' | 'YesNo' | 'Lookup' | 'AutoNumber';
  required?: boolean;
  maxLength?: number;
  choices?: Array<{ value: string; label: string }>;
  lookupTable?: string;
}

export interface ColumnDefinition {
  name: string;
  displayName: string;
  logicalName: string;
  dataType: DataverseColumn['dataType'];
  required?: boolean;
  maxLength?: number;
  choices?: Array<{ value: string; label: string }>;
  lookupTable?: string;
}

export interface TableDefinition {
  displayName: string;
  logicalName: string;
  schemaName: string;
  enableNotes: boolean;
  enableActivities: boolean;
  ownershipType: OwnershipType;
  primaryNameColumn: string;
  columns: ColumnDefinition[];
}

export interface ImportRecord {
  [key: string]: string | number | boolean | null;
}

export interface ValidationIssue {
  rowIndex: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
}

export interface MappingTemplate {
  id: string;
  name: string;
  sourceTable: string;
  targetTable: string;
  mappings: Record<string, string>;
}

export interface ImportJob {
  id: string;
  user: string;
  timestamp: string;
  tableName: string;
  fileName: string;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  errorDetails: string[];
  environment: string;
}

export interface DashboardSummary {
  totalTables: number;
  recordsImportedToday: number;
  failedImports: number;
  activeJobs: number;
  recentActivities: ImportJob[];
}
