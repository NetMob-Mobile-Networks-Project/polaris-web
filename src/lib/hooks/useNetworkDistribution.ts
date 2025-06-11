import { useState, useEffect, useCallback } from 'react';
import { MetricsService, NetworkDistributionData, TimeRange } from '../services/metrics';

interface UseNetworkDistributionReturn {
  distributionData: NetworkDistributionData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNetworkDistribution(timeRange: TimeRange): UseNetworkDistributionReturn {
  const [distributionData, setDistributionData] = useState<NetworkDistributionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributionData = useCallback(async (range: TimeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MetricsService.getNetworkDistribution(range);
      if (response.success && response.data) {
        const transformedData = MetricsService.transformDistributionToChartData(response.data);
        setDistributionData(transformedData);
      } else {
        throw new Error(response.message || 'Failed to fetch distribution data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch distribution data';
      setError(errorMessage);
      console.error('Error fetching network distribution data:', err);
      setDistributionData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch distribution data when time range changes
  useEffect(() => {
    fetchDistributionData(timeRange);
  }, [fetchDistributionData, timeRange]);

  const refetch = useCallback(async () => {
    await fetchDistributionData(timeRange);
  }, [fetchDistributionData, timeRange]);

  return {
    distributionData,
    isLoading,
    error,
    refetch,
  };
} 