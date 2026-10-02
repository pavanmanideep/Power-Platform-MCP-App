import { Alert, Button, Card, CardContent, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { previewImport, runImport } from '../services/api';

export function ImportWizardPage() {
  const [tableName, setTableName] = useState('account');
  const [fileName, setFileName] = useState('');
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [validation, setValidation] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.name.toLowerCase().endsWith('.csv')) {
      const text = await file.text();
      const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true });
      setRecords(parsed.data as Record<string, unknown>[]);
      return;
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });
    setRecords(json);
  };

  const handlePreview = async () => {
    const preview = await previewImport(records);
    setValidation(preview.validation);
  };

  const handleImport = async () => {
    const response = await runImport({ tableName, fileName, records, environment: 'Contoso Production' });
    setResult(response);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Import Wizard</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Dataverse Table" value={tableName} onChange={(event) => setTableName(event.target.value)}>
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="contact">Contact</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="file" inputProps={{ accept: '.csv,.xlsx,.xls' }} onChange={handleFile} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" onClick={handlePreview}>Validate Data</Button>
            <Button variant="outlined" onClick={handleImport}>Import Records</Button>
          </Stack>
        </CardContent>
      </Card>

      {validation && (
        <Alert severity={validation.valid ? 'success' : 'warning'}>
          {validation.valid ? 'Validation passed.' : `${validation.errorCount} errors and ${validation.warningCount} warnings detected.`}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Import summary</Typography>
          <Typography variant="body2">Success: {result.result.successCount} • Failed: {result.result.failureCount} • Total: {result.result.totalRecords}</Typography>
        </Paper>
      )}

      {records.length > 0 && (
        <Paper sx={{ p: 2, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{fileName}</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(records[0]).map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  {Object.keys(row).map((key) => (
                    <TableCell key={key}>{String(row[key] ?? '')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}
