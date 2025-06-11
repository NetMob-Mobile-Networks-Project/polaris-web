'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { useMapData } from '@/lib/hooks/useMapData';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Import Leaflet map component dynamically to avoid SSR issues
const NetworkMap = dynamic(() => import('@/components/map/network-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>
  ),
});

const mapFilters = [
  { id: 'signal', label: 'Signal Strength' },
  { id: 'quality', label: 'Signal Quality' },
];

// Default thresholds for different metrics
const defaultThresholds = {
  signal: {
    excellent: -70,
    good: -85,
    fair: -100,
    unit: 'dBm'
  },
  quality: {
    excellent: 80,
    good: 60,
    fair: 40,
    unit: '%'
  }
};

interface ThresholdConfig {
  excellent: number;
  good: number;
  fair: number;
  unit: string;
}

interface EditableLegendProps {
  activeMetric: string;
  thresholds: Record<string, ThresholdConfig>;
  onThresholdChange: (metric: string, thresholds: ThresholdConfig) => void;
}

function EditableLegend({ activeMetric, thresholds, onThresholdChange }: EditableLegendProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<ThresholdConfig>(thresholds[activeMetric]);

  const handleEdit = () => {
    setEditValues(thresholds[activeMetric]);
    setIsEditing(true);
  };

  const handleSave = () => {
    onThresholdChange(activeMetric, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(thresholds[activeMetric]);
    setIsEditing(false);
  };

  const handleReset = () => {
    const resetValues = defaultThresholds[activeMetric as keyof typeof defaultThresholds];
    setEditValues(resetValues);
    onThresholdChange(activeMetric, resetValues);
    setIsEditing(false);
  };

  const currentThresholds = thresholds[activeMetric];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Legend</h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="text-xs px-2 py-1 text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded hover:bg-indigo-50"
              >
                Edit
              </button>
              <button
                onClick={handleReset}
                className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50"
              >
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="text-xs px-2 py-1 text-green-600 hover:text-green-800 border border-green-200 rounded hover:bg-green-50"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Excellent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-800">Excellent</span>
          </div>
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <span className="text-xs text-gray-500">≥</span>
                <input
                  type="number"
                  value={editValues.excellent}
                  onChange={(e) => setEditValues({...editValues, excellent: parseFloat(e.target.value) || 0})}
                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500">{currentThresholds.unit}</span>
              </>
            ) : (
              <span className="text-xs text-gray-600">
                ≥ {currentThresholds.excellent} {currentThresholds.unit}
              </span>
            )}
          </div>
        </div>

        {/* Good */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-800">Good</span>
          </div>
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <span className="text-xs text-gray-500">≥</span>
                <input
                  type="number"
                  value={editValues.good}
                  onChange={(e) => setEditValues({...editValues, good: parseFloat(e.target.value) || 0})}
                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500">{currentThresholds.unit}</span>
              </>
            ) : (
              <span className="text-xs text-gray-600">
                ≥ {currentThresholds.good} {currentThresholds.unit}
              </span>
            )}
          </div>
        </div>

        {/* Fair */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
            <span className="text-sm text-gray-800">Fair</span>
          </div>
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <span className="text-xs text-gray-500">≥</span>
                <input
                  type="number"
                  value={editValues.fair}
                  onChange={(e) => setEditValues({...editValues, fair: parseFloat(e.target.value) || 0})}
                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500">{currentThresholds.unit}</span>
              </>
            ) : (
              <span className="text-xs text-gray-600">
                ≥ {currentThresholds.fair} {currentThresholds.unit}
              </span>
            )}
          </div>
        </div>

        {/* Poor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-800">Poor</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">
              &lt; {currentThresholds.fair} {currentThresholds.unit}
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>Note:</strong> Values should be in descending order for signal strength (dBm) and ascending order for quality (%).
        </div>
      )}
    </Card>
  );
}

function MapContent() {
  const [activeFilter, setActiveFilter] = useState('signal');
  const [thresholds, setThresholds] = useState<Record<string, ThresholdConfig>>(defaultThresholds);
  const { mapData, isLoading, error, refetch, updateBounds } = useMapData();

  const handleBoundsChange = (bounds: { minLat: number; maxLat: number; minLong: number; maxLong: number }) => {
    updateBounds({
      minLat: bounds.minLat,
      maxLat: bounds.maxLat,
      minLong: bounds.minLong,
      maxLong: bounds.maxLong,
    });
  };

  const handleThresholdChange = (metric: string, newThresholds: ThresholdConfig) => {
    setThresholds(prev => ({
      ...prev,
      [metric]: newThresholds
    }));
  };

  const handleExportKML = () => {
    // TODO: Implement KML export functionality
    console.log('Exporting KML for:', mapData.length, 'data points');
  };

  // Calculate stats for selected area
  const totalMeasurements = mapData.length;
  const avgSignalStrength = totalMeasurements > 0 
    ? (mapData.reduce((sum, point) => {
        const signalStrength = point.signal_strength || 0;
        return sum + signalStrength;
      }, 0) / totalMeasurements).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Coverage Map</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={handleExportKML}
            disabled={isLoading || totalMeasurements === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Export KML
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Failed to load map data
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={refetch}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <NetworkMap 
              activeMetric={activeFilter} 
              data={mapData}
              isLoading={isLoading}
              error={error}
              onBoundsChange={handleBoundsChange}
              thresholds={thresholds[activeFilter]}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Metric Type</h3>
            <div className="space-y-2">
              {mapFilters.map((filter) => (
                <label key={filter.id} className="flex items-center">
                  <input
                    type="radio"
                    name="metric"
                    value={filter.id}
                    checked={activeFilter === filter.id}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-800">{filter.label}</span>
                </label>
              ))}
            </div>
          </Card>

          <EditableLegend 
            activeMetric={activeFilter}
            thresholds={thresholds}
            onThresholdChange={handleThresholdChange}
          />

          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Current View Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-700">Average Signal Strength</div>
                <div className="text-lg font-medium text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                  ) : (
                    `${avgSignalStrength} ${avgSignalStrength !== 'N/A' ? 'dBm' : ''}`
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-700">Number of Measurements</div>
                <div className="text-lg font-medium text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                  ) : (
                    totalMeasurements.toLocaleString()
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <ProtectedRoute>
      <MapContent />
    </ProtectedRoute>
  );
} 