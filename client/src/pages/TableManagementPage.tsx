import { Alert, Box, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useTables } from '../hooks/useDashboard';
import type { DataverseTable } from '../types';

export function TableManagementPage() {
  const { data, isLoading, error } = useTables();
  const [query, setQuery] = useState('');

  const filteredTables: DataverseTable[] = (data ?? []).filter((table: DataverseTable) => {
    const value = `${table.displayName} ${table.logicalName}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  if (isLoading) return <Alert severity="info">Loading tables...</Alert>;
  if (error) return <Alert severity="error">Unable to load Dataverse tables.</Alert>;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Dataverse Table Management</Typography>
      <TextField
        fullWidth
        label="Search tables"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
      />

      <Stack spacing={2}>
        {filteredTables.map((table: DataverseTable) => (
          <Paper key={table.name} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h6">{table.displayName}</Typography>
                <Typography variant="caption" color="text.secondary">{table.logicalName}</Typography>
              </Box>
              <Chip label={table.ownershipType} color="primary" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip label={`${table.columns.length} columns`} size="small" />
              <Chip label={table.enableNotes ? 'Notes enabled' : 'Notes disabled'} size="small" />
              <Chip label={table.enableActivities ? 'Activities enabled' : 'Activities disabled'} size="small" />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
