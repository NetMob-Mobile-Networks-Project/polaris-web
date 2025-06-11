'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapDataPoint } from '@/lib/services/metrics';

interface NetworkMapProps {
  activeMetric: string;
  data?: MapDataPoint[];
  isLoading?: boolean;
  error?: string | null;
  onBoundsChange?: (bounds: { minLat: number; maxLat: number; minLong: number; maxLong: number }) => void;
}

export default function NetworkMap({ activeMetric, data = [], isLoading, error, onBoundsChange }: NetworkMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Initialize map if it hasn't been initialized yet
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([35.6892, 51.3890], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add bounds change listener for ANY map movement
      if (onBoundsChange) {
        const handleBoundsChange = () => {
          if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            onBoundsChange({
              minLat: bounds.getSouth(),
              maxLat: bounds.getNorth(),
              minLong: bounds.getWest(),
              maxLong: bounds.getEast(),
            });
          }
        };

        // Listen to multiple map events to capture any change
        mapRef.current.on('moveend', handleBoundsChange);
        mapRef.current.on('zoomend', handleBoundsChange);
        mapRef.current.on('resize', handleBoundsChange);
        
        // Trigger initial bounds change to load data
        setTimeout(handleBoundsChange, 100);
      }
    }

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    // Handle loading state
    if (isLoading) {
      return;
    }

    // Handle error state
    if (error) {
      console.error('Map data error:', error);
      return;
    }

    // Add markers for each data point with simple field validation
    let validPoints = 0;
    let invalidPoints = 0;

    data.forEach((point, index) => {
      // Convert string coordinates to numbers
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      
      // Validate coordinate ranges
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(`Invalid coordinate values for data point ${index}:`, {
          latitude: point.latitude,
          longitude: point.longitude,
          parsed: { lat, lng }
        });
        invalidPoints++;
        return;
      }

      try {
        const value = getMetricValue(point, activeMetric);
        const color = getColorForValue(value, activeMetric);
        
        const circle = L.circle(
          [lat, lng],
          {
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
            radius: 50,
            weight: 1
          }
        );

        // Format the popup content with all available fields
        const popupContent = `
          <div class="p-3 min-w-[250px] max-w-[300px]">
            <div class="font-bold mb-3 text-gray-800 border-b pb-2">Network Measurement Details</div>
            <div class="space-y-2 text-sm">
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Signal Strength:</span>
                <span class="font-medium text-right">${point.signal_strength || 'N/A'} ${point.signal_strength ? 'dBm' : ''}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Signal Quality:</span>
                <span class="font-medium text-right">${point.signal_quality || 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Technology:</span>
                <span class="font-medium text-right">${point.cellular_technology || 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Operator:</span>
                <span class="font-medium text-right">${point.network_operator_name || 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">MCC-MNC:</span>
                <span class="font-medium text-right">${point.network_operator_mccmnc || 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">LAC:</span>
                <span class="font-medium text-right">${point.lac !== undefined ? point.lac : 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">RAC:</span>
                <span class="font-medium text-right">${point.rac !== undefined ? point.rac : 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">TAC:</span>
                <span class="font-medium text-right">${point.tac !== undefined ? point.tac : 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Cell ID:</span>
                <span class="font-medium text-right">${point.cell_id !== undefined ? point.cell_id : 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">ARFCN:</span>
                <span class="font-medium text-right">${point.arfcn !== undefined ? point.arfcn : 'N/A'}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Coordinates:</span>
                <span class="font-medium text-right">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <span class="text-gray-600 font-medium">Timestamp:</span>
                <span class="font-medium text-right">${point.timestamp ? new Date(point.timestamp).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(circle);
        validPoints++;
      } catch (err) {
        console.error(`Error creating marker for point ${index}:`, err, point);
        invalidPoints++;
      }
    });

    // Log summary for debugging
    if (data.length > 0) {
      console.log(`Map markers: ${validPoints} valid, ${invalidPoints} invalid out of ${data.length} total points`);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend');
        mapRef.current.off('zoomend');
        mapRef.current.off('resize');
      }
    };
  }, [activeMetric, data, isLoading, error, onBoundsChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full z-0" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
            <div className="text-gray-600 text-sm">Loading map data...</div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-red-500 text-sm mb-2">Failed to load map data</div>
            <div className="text-gray-500 text-xs">{error}</div>
          </div>
        </div>
      )}

      {/* Data count indicator */}
      {!isLoading && !error && (
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-3 py-1 rounded-md shadow-sm z-10">
          <div className="text-xs text-gray-600">
            {data.length} measurement{data.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

function getMetricValue(point: MapDataPoint, metric: string): number {
  switch (metric) {
    case 'signal':
      return point.signal_strength || 0;
    case 'quality':
      return point.signal_quality || 0;
    default:
      return point.signal_strength || 0;
  }
}

function getColorForValue(value: number, metric: string): string {
  // Customize these thresholds based on your requirements
  switch (metric) {
    case 'signal':
      if (value >= -70) return '#22c55e'; // green-500 (excellent)
      if (value >= -85) return '#eab308'; // yellow-500 (good)
      if (value >= -100) return '#f97316'; // orange-500 (fair)
      return '#ef4444'; // red-500 (poor)
    
    case 'quality':
      if (value >= 80) return '#22c55e'; // green-500 (excellent)
      if (value >= 60) return '#eab308'; // yellow-500 (good)
      if (value >= 40) return '#f97316'; // orange-500 (fair)
      return '#ef4444'; // red-500 (poor)
    
    default:
      // Default to signal strength thresholds
      if (value >= -70) return '#22c55e';
      if (value >= -85) return '#eab308';
      if (value >= -100) return '#f97316';
      return '#ef4444';
  }
} 