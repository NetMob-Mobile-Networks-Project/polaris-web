import { useState, useEffect, useCallback } from 'react';
import { MetricsService, NetworkChartData, TimeRange } from '../services/metrics';

interface UseNetworkChartReturn {
  chartData: NetworkChartData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNetworkChart(timeRange: TimeRange): UseNetworkChartReturn {
  const [chartData, setChartData] = useState<NetworkChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async (range: TimeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MetricsService.getNetworkHistogram(range);
      if (response.success && response.data) {
        const transformedData = MetricsService.transformHistogramToChartData(response.data);
        setChartData(transformedData);
      } else {
        throw new Error(response.message || 'Failed to fetch histogram data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
      setError(errorMessage);
      console.error('Error fetching network chart data:', err);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch chart data when time range changes
  useEffect(() => {
    fetchChartData(timeRange);
  }, [fetchChartData, timeRange]);

  const refetch = useCallback(async () => {
    await fetchChartData(timeRange);
  }, [fetchChartData, timeRange]);

  return {
    chartData,
    isLoading,
    error,
    refetch,
  };
} 