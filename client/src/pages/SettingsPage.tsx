import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useEnvironments } from '../hooks/useDashboard';
import type { Environment } from '../types';

export function SettingsPage() {
  const { data } = useEnvironments();

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">Authentication</Typography>
          <Typography variant="body2">Microsoft Entra ID with MSAL is configured for SSO and secured access tokens.</Typography>
          <Divider />
          <Typography variant="subtitle2" color="text.secondary">Available environments</Typography>
          {(data ?? []).map((environment: Environment) => (
            <Typography key={environment.id} variant="body2">
              {environment.name} • {environment.url} • {environment.type}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
