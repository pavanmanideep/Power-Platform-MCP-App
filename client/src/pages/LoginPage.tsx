import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/auth';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signIn();
    navigate('/');
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
          <Button variant="contained" size="large" onClick={handleLogin} fullWidth>
            Sign in with Microsoft Entra ID
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
