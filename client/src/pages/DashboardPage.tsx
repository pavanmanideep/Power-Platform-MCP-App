import { Alert, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { EnvironmentSelector } from '../components/EnvironmentSelector';
import { useMemo, useState } from 'react';
import type { ImportJob } from '../types';

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const [selectedEnvironment, setSelectedEnvironment] = useState('prod-01');

  const summary = useMemo(() => data ?? {
    totalTables: 0,
    recordsImportedToday: 0,
    failedImports: 0,
    activeJobs: 0,
    recentActivities: [],
    environments: [],
  }, [data]);

  if (isLoading) return <Alert severity="info">Loading dashboard data...</Alert>;
  if (error) return <Alert severity="error">Unable to load dashboard data.</Alert>;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Overview</Typography>
        <Paper sx={{ p: 2, minWidth: 320 }}>
          <EnvironmentSelector
            environments={summary.environments}
            value={selectedEnvironment}
            onChange={setSelectedEnvironment}
          />
        </Paper>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Tables" value={String(summary.totalTables)} detail="Across all environments" color="#2563eb" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Records Imported Today" value={String(summary.recordsImportedToday)} detail="Successful imports" color="#16a34a" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Failed Imports" value={String(summary.failedImports)} detail="Needs attention" color="#dc2626" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Jobs" value={String(summary.activeJobs)} detail="In progress" color="#f59e0b" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent activities</Typography>
        <Stack spacing={1}>
          {summary.recentActivities.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
          ) : (
            summary.recentActivities.map((activity: ImportJob) => (
              <Paper key={activity.id} sx={{ p: 2, background: '#f8fafc' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{activity.tableName}</Typography>
                  <Chip label={activity.status} color={activity.status === 'completed' ? 'success' : activity.status === 'failed' ? 'error' : 'warning'} size="small" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {activity.fileName} • {activity.successCount} succeeded • {activity.failureCount} failed
                </Typography>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
