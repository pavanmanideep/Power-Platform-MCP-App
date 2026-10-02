import { Alert, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { createTable } from '../services/api';

const defaultForm = {
  displayName: '',
  logicalName: '',
  schemaName: '',
  enableNotes: true,
  enableActivities: true,
  ownershipType: 'user',
  primaryNameColumn: 'name',
};

export function CreateTableWizardPage() {
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      columns: [{
        name: 'name',
        displayName: 'Name',
        logicalName: 'name',
        dataType: 'Text',
        required: true,
        maxLength: 200,
      }],
    };

    await createTable(payload);
    setMessage(`Table ${form.displayName} was created successfully.`);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 3 }}>Create Dataverse Table</Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Display Name" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Logical Name" value={form.logicalName} onChange={(event) => setForm({ ...form, logicalName: event.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Schema Name" value={form.schemaName} onChange={(event) => setForm({ ...form, schemaName: event.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Primary Name Column" value={form.primaryNameColumn} onChange={(event) => setForm({ ...form, primaryNameColumn: event.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Ownership Type"
              value={form.ownershipType}
              onChange={(event) => setForm({ ...form, ownershipType: event.target.value as 'user' | 'team' })}
            >
              <MenuItem value="user">User Owned</MenuItem>
              <MenuItem value="team">Team Owned</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleSubmit}>Create Table</Button>
          <Button variant="outlined">Save as Draft</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
