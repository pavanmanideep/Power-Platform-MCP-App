import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAuthConfig = async () => {
  const { data } = await api.get('/auth/config');
  return data;
};

export const getDashboard = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

export const getEnvironments = async () => {
  const { data } = await api.get('/environments');
  return data;
};

export const getTables = async () => {
  const { data } = await api.get('/tables');
  return data.tables;
};

export const getTableMetadata = async (tableName: string) => {
  const { data } = await api.get(`/tables/${tableName}`);
  return data;
};

export const createTable = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/tables', payload);
  return data;
};

export const createColumn = async (tableName: string, payload: Record<string, unknown>) => {
  const { data } = await api.post(`/tables/${tableName}/columns`, payload);
  return data;
};

export const previewImport = async (records: Record<string, unknown>[]) => {
  const { data } = await api.post('/imports/preview', { records });
  return data;
};

export const runImport = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/imports', payload);
  return data;
};

export const getImportHistory = async () => {
  const { data } = await api.get('/imports/history');
  return data.jobs;
};

export default api;
