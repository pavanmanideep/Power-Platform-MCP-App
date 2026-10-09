import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { TableManagementPage } from './pages/TableManagementPage';
import { CreateTableWizardPage } from './pages/CreateTableWizardPage';
import { ImportWizardPage } from './pages/ImportWizardPage';
import { SettingsPage } from './pages/SettingsPage';
import { appTheme } from './theme';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function LoginRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
}

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <TableManagementPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables/new"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <CreateTableWizardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/import"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <ImportWizardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SettingsPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
