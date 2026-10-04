import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { signIn } from '../services/auth';

export function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      await signIn();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Microsoft Entra ID sign-in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
      <Card sx={{ minWidth: 420, p: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Sign in to Dataverse MCP
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Securely access Dataverse environments and import data without leaving your workflow.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button variant="contained" size="large" onClick={handleLogin} disabled={isSigningIn} fullWidth>
            {isSigningIn && <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />}
            Sign in with Microsoft Entra ID
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
