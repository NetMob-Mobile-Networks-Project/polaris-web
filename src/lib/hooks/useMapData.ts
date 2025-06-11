import { useState, useEffect, useCallback, useRef } from 'react';
import { MetricsService, MapDataPoint, MapBounds } from '../services/metrics';

interface UseMapDataReturn {
  mapData: MapDataPoint[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateBounds: (bounds: MapBounds) => void;
}

export function useMapData(initialBounds?: MapBounds): UseMapDataReturn {
  const [mapData, setMapData] = useState<MapDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bounds, setBounds] = useState<MapBounds | undefined>(initialBounds);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMapData = useCallback(async (currentBounds?: MapBounds) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching map data with bounds:', currentBounds);
      const response = await MetricsService.getMapData(currentBounds);
      
      console.log('Raw API response:', response);
      
      if (response.success && response.data?.points) {
        console.log('Data points structure:', {
          totalPoints: response.data.points.length,
          firstPoint: response.data.points[0],
          samplePointKeys: response.data.points[0] ? Object.keys(response.data.points[0]) : []
        });
        
        // Validate and clean the data (handling simple string coordinates)
        const validPoints = response.data.points.filter((point, index) => {
          // Check if coordinate fields exist and are not empty
          const hasCoordFields = point.latitude && 
                               point.longitude && 
                               point.latitude.trim() !== '' && 
                               point.longitude.trim() !== '';
          
          if (!hasCoordFields) {
            console.warn(`Filtering out point ${index} with missing coordinate fields:`, point);
            return false;
          }
          
          // Try to parse the string coordinates
          const lat = parseFloat(point.latitude);
          const lng = parseFloat(point.longitude);
          
          const hasValidCoords = !isNaN(lat) && !isNaN(lng) && 
                               lat >= -90 && lat <= 90 && 
                               lng >= -180 && lng <= 180;
          
          if (!hasValidCoords) {
            console.warn(`Filtering out point ${index} with invalid coordinate values:`, {
              latitude: point.latitude,
              longitude: point.longitude,
              parsed: { lat, lng }
            });
            return false;
          }
          
          return true;
        });
        
        console.log(`Filtered ${validPoints.length}/${response.data.points.length} valid points`);
        setMapData(validPoints);
      } else {
        throw new Error(response.message || 'Failed to fetch map data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch map data';
      console.error('Error fetching map data:', err);
      setError(errorMessage);
      setMapData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced fetch to avoid too many API calls on map movement
  const debouncedFetchMapData = useCallback((currentBounds?: MapBounds) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchMapData(currentBounds);
    }, 500); // 500ms debounce
  }, [fetchMapData]);

  // Fetch map data when bounds change
  useEffect(() => {
    if (bounds) {
      debouncedFetchMapData(bounds);
    } else {
      // Initial load without bounds
      fetchMapData();
    }
  }, [bounds, debouncedFetchMapData, fetchMapData]);

  const refetch = useCallback(async () => {
    await fetchMapData(bounds);
  }, [fetchMapData, bounds]);

  const updateBounds = useCallback((newBounds: MapBounds) => {
    console.log('Updating bounds:', newBounds);
    setBounds(newBounds);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    mapData,
    isLoading,
    error,
    refetch,
    updateBounds,
  };
} 