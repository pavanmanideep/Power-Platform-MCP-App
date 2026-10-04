import { PublicClientApplication } from '@azure/msal-browser';
import type { AuthenticationResult } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? '00000000-0000-0000-0000-000000000000';
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID ?? '00000000-0000-0000-0000-000000000000';
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin;
const placeholderId = '00000000-0000-0000-0000-000000000000';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: { cacheLocation: 'sessionStorage' },
});

const msalInitialization = msalInstance.initialize();

const storeAuthentication = (result: AuthenticationResult) => {
  if (!result.account || !result.accessToken) {
    throw new Error('Microsoft Entra ID did not return an account and access token.');
  }

  localStorage.setItem('access_token', result.accessToken);
  localStorage.setItem('user_profile', JSON.stringify({
    id: result.account.localAccountId,
    name: result.account.name ?? result.account.username,
    email: result.account.username,
    roles: ['admin', 'importer'],
  }));
};

export const initializeAuth = async () => {
  if (localStorage.getItem('access_token') === 'demo-token') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  }

  await msalInitialization;
  const result = await msalInstance.handleRedirectPromise();
  if (result) {
    storeAuthentication(result);
  }
};

export const signIn = async (): Promise<void> => {
  if (clientId === placeholderId || tenantId === placeholderId) {
    throw new Error('Microsoft Entra ID is not configured. Add the client and tenant IDs to the root .env file.');
  }

  await msalInitialization;
  await msalInstance.loginRedirect({
    scopes: ['User.Read', 'openid', 'profile'],
    prompt: 'select_account',
  });
};

export const getCurrentUser = () => {
  const item = localStorage.getItem('user_profile');
  return item ? JSON.parse(item) : null;
};
