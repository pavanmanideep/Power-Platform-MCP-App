export interface Environment {
  id: string;
  name: string;
  url: string;
  tenantId: string;
  type: 'Production' | 'Sandbox' | 'Trial';
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

export interface DataverseTable {
  name: string;
  displayName: string;
  logicalName: string;
  ownershipType: 'user' | 'team';
  enableNotes: boolean;
  enableActivities: boolean;
  primaryNameColumn: string;
  columns: DataverseColumn[];
}

export interface TableDefinition {
  displayName: string;
  logicalName: string;
  schemaName: string;
  enableNotes: boolean;
  enableActivities: boolean;
  ownershipType: 'user' | 'team';
  primaryNameColumn: string;
  columns: Array<{
    name: string;
    displayName: string;
    logicalName: string;
    dataType: DataverseColumn['dataType'];
    required?: boolean;
    maxLength?: number;
    choices?: Array<{ value: string; label: string }>;
    lookupTable?: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: string[];
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
  environments: Environment[];
}

export interface ImportPreviewResult {
  totalRecords: number;
  validation: ValidationResult;
}
