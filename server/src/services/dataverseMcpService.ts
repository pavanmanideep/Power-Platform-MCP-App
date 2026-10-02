import type { ColumnDefinition, DataverseColumn, DataverseTable, Environment, ImportRecord, TableDefinition, ValidationIssue, ValidationResult } from '../types/index.js';

class DataverseMcpService {
  private environments: Environment[] = [
    { id: 'prod-01', name: 'Contoso Production', url: 'https://contoso.crm.dynamics.com', tenantId: 'tenant-prod', type: 'Production' },
    { id: 'sandbox-01', name: 'Contoso Sandbox', url: 'https://contoso-sandbox.crm.dynamics.com', tenantId: 'tenant-sandbox', type: 'Sandbox' },
    { id: 'trial-01', name: 'Innovation Trial', url: 'https://innovation.crm.dynamics.com', tenantId: 'tenant-trial', type: 'Trial' },
  ];

  private readonly tables: DataverseTable[] = [
    {
      name: 'account',
      displayName: 'Account',
      logicalName: 'account',
      schemaName: 'account',
      ownershipType: 'user',
      enableNotes: true,
      enableActivities: true,
      primaryNameColumn: 'name',
      columns: [
        { name: 'name', displayName: 'Name', logicalName: 'name', dataType: 'Text', required: true, maxLength: 200 },
        { name: 'websiteurl', displayName: 'Website', logicalName: 'websiteurl', dataType: 'Text', maxLength: 200 },
        { name: 'annualrevenue', displayName: 'Annual Revenue', logicalName: 'annualrevenue', dataType: 'Currency' },
      ],
    },
    {
      name: 'contact',
      displayName: 'Contact',
      logicalName: 'contact',
      schemaName: 'contact',
      ownershipType: 'user',
      enableNotes: true,
      enableActivities: true,
      primaryNameColumn: 'fullname',
      columns: [
        { name: 'fullname', displayName: 'Full Name', logicalName: 'fullname', dataType: 'Text', required: true, maxLength: 200 },
        { name: 'emailaddress1', displayName: 'Email', logicalName: 'emailaddress1', dataType: 'Text', maxLength: 200 },
      ],
    },
  ];

  async getEnvironments() {
    return this.environments;
  }

  async getTables() {
    return this.tables.map((table) => ({
      name: table.name,
      displayName: table.displayName,
      logicalName: table.logicalName,
      ownershipType: table.ownershipType,
      enableNotes: table.enableNotes,
      enableActivities: table.enableActivities,
      primaryNameColumn: table.primaryNameColumn,
      columns: table.columns,
    }));
  }

  async getTableMetadata(tableName: string) {
    const table = this.tables.find((item) => item.name === tableName || item.logicalName === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found.`);
    }

    return { ...table, metadata: { ...table.metadata, rowCount: 850 } };
  }

  async createTable(tableDefinition: TableDefinition) {
    const name = tableDefinition.logicalName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const newTable: DataverseTable = {
      name,
      displayName: tableDefinition.displayName,
      logicalName: name,
      schemaName: tableDefinition.schemaName || name,
      ownershipType: tableDefinition.ownershipType,
      enableNotes: tableDefinition.enableNotes,
      enableActivities: tableDefinition.enableActivities,
      primaryNameColumn: tableDefinition.primaryNameColumn || 'name',
      columns: tableDefinition.columns.map((column) => ({
        name: column.logicalName?.toLowerCase() || column.name,
        displayName: column.displayName,
        logicalName: column.logicalName || column.name,
        dataType: column.dataType,
        required: column.required,
        maxLength: column.maxLength,
        choices: column.choices,
        lookupTable: column.lookupTable,
      })),
    };

    this.tables.push(newTable);
    return newTable;
  }

  async createColumn(tableName: string, columnDefinition: ColumnDefinition) {
    const table = this.tables.find((item) => item.name === tableName || item.logicalName === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found.`);
    }

    const column: DataverseColumn = {
      name: columnDefinition.logicalName || columnDefinition.name,
      displayName: columnDefinition.displayName,
      logicalName: columnDefinition.logicalName || columnDefinition.name,
      dataType: columnDefinition.dataType,
      required: columnDefinition.required,
      maxLength: columnDefinition.maxLength,
      choices: columnDefinition.choices,
      lookupTable: columnDefinition.lookupTable,
    };

    table.columns.push(column);
    return column;
  }

  async importRecords(tableName: string, records: ImportRecord[]) {
    const validated = await this.validateData(records);
    const successCount = Math.max(0, records.length - validated.issues.filter((issue) => issue.severity === 'error').length);

    return {
      tableName,
      totalRecords: records.length,
      successCount,
      failureCount: records.length - successCount,
      valid: validated.valid,
      issues: validated.issues,
    };
  }

  async validateData(records: ImportRecord[]): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    for (let i = 0; i < records.length; i += 1) {
      const row = records[i];
      if (!row || typeof row !== 'object') {
        issues.push({ rowIndex: i, field: 'record', message: 'Row is empty or invalid.', severity: 'error' });
        continue;
      }

      if (!row.name && !row.fullname && !row.customername) {
        issues.push({ rowIndex: i, field: 'name', message: 'Required name column is missing.', severity: 'error' });
      }

      if (row.annualrevenue !== undefined && typeof row.annualrevenue === 'string' && Number.isNaN(Number(row.annualrevenue))) {
        issues.push({ rowIndex: i, field: 'annualrevenue', message: 'Annual revenue must be numeric.', severity: 'error' });
      }

      if (row.isactive !== undefined && typeof row.isactive === 'string' && !['true', 'false', 'yes', 'no'].includes(String(row.isactive).toLowerCase())) {
        issues.push({ rowIndex: i, field: 'isactive', message: 'Boolean value is invalid.', severity: 'error' });
      }
    }

    return {
      valid: issues.filter((issue) => issue.severity === 'error').length === 0,
      issues,
      errorCount: issues.filter((issue) => issue.severity === 'error').length,
      warningCount: issues.filter((issue) => issue.severity === 'warning').length,
    };
  }

  async getTableColumns(tableName: string) {
    const table = await this.getTableMetadata(tableName);
    return table.columns;
  }

  async callTool(toolName: string, parameters: Record<string, unknown>) {
    if (toolName === 'get_tables') {
      return { success: true, data: await this.getTables() };
    }

    if (toolName === 'create_table') {
      return { success: true, data: await this.createTable(parameters as unknown as TableDefinition) };
    }

    if (toolName === 'import_records') {
      return { success: true, data: await this.importRecords(String(parameters.table ?? ''), Array.isArray(parameters.records) ? parameters.records as ImportRecord[] : []) };
    }

    return { success: true, data: [] };
  }
}

export default new DataverseMcpService();
