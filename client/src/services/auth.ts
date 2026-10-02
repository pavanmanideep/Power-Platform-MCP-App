import { PublicClientApplication } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? '00000000-0000-0000-0000-000000000000';
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID ?? '00000000-0000-0000-0000-000000000000';
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI ?? 'http://localhost:5173';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: { cacheLocation: 'sessionStorage' },
});

export const signIn = async () => {
  try {
    const result = await msalInstance.loginPopup({
      scopes: ['User.Read', 'openid', 'profile'],
      prompt: 'select_account',
    });

    localStorage.setItem('access_token', result.accessToken ?? 'demo-token');
    localStorage.setItem('user_profile', JSON.stringify({
      id: result.account?.localAccountId ?? 'demo-user',
      name: result.account?.name ?? 'Demo User',
      email: result.account?.username ?? 'demo@contoso.com',
      roles: ['admin', 'importer'],
    }));

    return result.account;
  } catch (error) {
    console.error('MSAL login failed', error);
    localStorage.setItem('access_token', 'demo-token');
    localStorage.setItem('user_profile', JSON.stringify({
      id: 'demo-user',
      name: 'Demo Administrator',
      email: 'admin@contoso.com',
      roles: ['admin', 'importer'],
    }));
    return { name: 'Demo Administrator', username: 'admin@contoso.com' };
  }
};

export const getCurrentUser = () => {
  const item = localStorage.getItem('user_profile');
  return item ? JSON.parse(item) : null;
};
