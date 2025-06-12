import { useState, useEffect, useCallback } from 'react';
import { MetricsService, DetailedListParams, DetailedListResponse } from '@/lib/services/metrics';

export interface UseAnalyticsDataReturn {
  data: DetailedListResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalyticsData(params: DetailedListParams): UseAnalyticsDataReturn {
  const [data, setData] = useState<DetailedListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (fetchParams: DetailedListParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MetricsService.getDetailedList(fetchParams);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params.start, params.page, params.metric]);

  const refetch = useCallback(() => {
    fetchData(params);
  }, [fetchData, params]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
} 