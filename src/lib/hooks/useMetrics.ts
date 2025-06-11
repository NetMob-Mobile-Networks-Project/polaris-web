import { useState, useEffect, useCallback } from 'react';
import { MetricsService, DashboardMetrics, TimeRange } from '../services/metrics';

interface UseMetricsReturn {
  metrics: DashboardMetrics;
  isLoading: boolean;
  error: string | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refetch: () => Promise<void>;
}

export function useMetrics(initialTimeRange: TimeRange = 'last-day'): UseMetricsReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    downloadSpeed: null,
    uploadSpeed: null,
    latency: null,
    availability: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  const fetchMetrics = useCallback(async (range: TimeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await MetricsService.getAllMetrics(range);
      setMetrics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(errorMessage);
      console.error('Error fetching metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch metrics when time range changes
  useEffect(() => {
    fetchMetrics(timeRange);
  }, [fetchMetrics, timeRange]);

  const handleTimeRangeChange = useCallback((newRange: TimeRange) => {
    setTimeRange(newRange);
  }, []);

  const refetch = useCallback(async () => {
    await fetchMetrics(timeRange);
  }, [fetchMetrics, timeRange]);

  return {
    metrics,
    isLoading,
    error,
    timeRange,
    setTimeRange: handleTimeRangeChange,
    refetch,
  };
} 