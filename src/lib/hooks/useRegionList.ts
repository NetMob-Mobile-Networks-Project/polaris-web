import { useState, useEffect } from 'react';
import { MetricsService } from '../services/metrics';

export interface RegionMetric {
  id: string;
  region: string;
  average_strength: number;
  average_quality: number;
  measurement_count: number;
  strength_class: string;
  quality_class: string;
}

export function useRegionList() {
  const [metrics, setMetrics] = useState<RegionMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await MetricsService.getRegionList();
      
      // Transform the API response into the format expected by the table
      const transformedMetrics = response.data.regions.map((region) => ({
        id: region.name.toLowerCase().replace(/\s+/g, '-'),
        region: region.name,
        average_strength: region.average_strength,
        average_quality: region.average_quality,
        measurement_count: region.measurement_count,
        strength_class: region.strength_class,
        quality_class: region.quality_class,
      }));

      setMetrics(transformedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch region list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionList();
  }, []);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchRegionList,
  };
} 