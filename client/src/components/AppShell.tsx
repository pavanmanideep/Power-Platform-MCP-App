import { AppBar, Box, Drawer, Divider, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Dashboard, TableChart, UploadFile, AddBox, Settings, Logout } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navigation = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Table Management', path: '/tables', icon: <TableChart /> },
  { label: 'Create Table', path: '/tables/new', icon: <AddBox /> },
  { label: 'Import Wizard', path: '/import', icon: <UploadFile /> },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#0f172a',
            color: '#e2e8f0',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dataverse MCP
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
        <List>
          {navigation.map((item) => (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                color: '#e2e8f0',
                '&.Mui-selected': { backgroundColor: '#1d4ed8' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton onClick={handleLogout} sx={{ color: '#e2e8f0' }}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, background: '#f5f7fb' }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(15,23,42,0.08)', background: '#ffffff' }}
        >
          <Toolbar>
            <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Dataverse MCP Data Importer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile') ?? '{}').email : 'Not signed in'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
