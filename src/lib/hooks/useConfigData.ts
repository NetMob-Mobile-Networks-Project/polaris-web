import { useState, useEffect, useCallback } from 'react';
import { MetricsService, ClientConfigResponse, UpdateConfigRequest } from '@/lib/services/metrics';

export interface UseConfigDataReturn {
  config: ClientConfigResponse | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
  refetch: () => void;
  updateConfig: (newConfig: UpdateConfigRequest) => Promise<boolean>;
}

export function useConfigData(): UseConfigDataReturn {
  const [config, setConfig] = useState<ClientConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MetricsService.getClientConfig();
      setConfig(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
      console.error('Error fetching configuration:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (newConfig: UpdateConfigRequest): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const response = await MetricsService.updateClientConfig(newConfig);
      setConfig(response.data);
      return true;
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update configuration');
      console.error('Error updating configuration:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const refetch = useCallback(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    isUpdating,
    updateError,
    refetch,
    updateConfig
  };
} 