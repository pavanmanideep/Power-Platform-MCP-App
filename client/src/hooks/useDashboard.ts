import { useQuery } from '@tanstack/react-query';
import { getDashboard, getEnvironments, getImportHistory, getTables } from '../services/api';

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

export const useEnvironments = () =>
  useQuery({
    queryKey: ['environments'],
    queryFn: getEnvironments,
  });

export const useTables = () =>
  useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
  });

export const useImportHistory = () =>
  useQuery({
    queryKey: ['imports'],
    queryFn: getImportHistory,
  });
