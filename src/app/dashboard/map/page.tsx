'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

// Import Leaflet map component dynamically to avoid SSR issues
const NetworkMap = dynamic(() => import('@/components/map/network-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>
  ),
});

const mapFilters = [
  { id: 'signal', label: 'Signal Strength' },
  { id: 'download', label: 'Download Speed' },
  { id: 'upload', label: 'Upload Speed' },
  { id: 'latency', label: 'Latency' },
];

export default function MapPage() {
  // TODO: API Call - Fetch initial map data
  // GET /api/map/data
  const [activeFilter, setActiveFilter] = useState('signal');

  // TODO: API Call - Fetch network types for dropdown
  // GET /api/map/network-types
  const networkTypes = ['All Networks', '4G/LTE', '5G', '3G'];

  // TODO: API Call - Fetch selected area statistics
  // GET /api/map/area-stats
  const areaStats = {
    signalStrength: '-85 dBm',
    downloadSpeed: '42.5 Mbps',
    measurements: 1247,
  };

  // TODO: API Call - Handle network type change
  // GET /api/map/data?networkType={type}
  const handleNetworkTypeChange = async (type: string) => {
    // await fetchMapData(type);
  };

  // TODO: API Call - Handle KML export
  // POST /api/map/export-kml
  const handleExportKML = async () => {
    try {
      // await exportKML();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Coverage Map</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              className="appearance-none rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900"
              onChange={(e) => handleNetworkTypeChange(e.target.value)}
            >
              {networkTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button 
            onClick={handleExportKML}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export KML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <NetworkMap activeMetric={activeFilter} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Map Layers</h3>
            <div className="space-y-2">
              {mapFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeFilter === filter.id
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-800">Excellent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-800">Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
                <span className="text-sm text-gray-800">Fair</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-800">Poor</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Area Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-700">Average Signal Strength</div>
                <div className="text-lg font-medium text-gray-900">{areaStats.signalStrength}</div>
              </div>
              <div>
                <div className="text-sm text-gray-700">Average Download Speed</div>
                <div className="text-lg font-medium text-gray-900">{areaStats.downloadSpeed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-700">Number of Measurements</div>
                <div className="text-lg font-medium text-gray-900">{areaStats.measurements}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 