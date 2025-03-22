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
  const [activeFilter, setActiveFilter] = useState('signal');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Network Coverage Map</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>All Networks</option>
            <option>4G/LTE</option>
            <option>5G</option>
            <option>3G</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Map Layers</h3>
            <div className="space-y-2">
              {mapFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeFilter === filter.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Excellent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
                <span className="text-sm text-gray-600">Fair</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Poor</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Area Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Average Signal Strength</div>
                <div className="text-lg font-medium text-gray-900">-85 dBm</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Average Download Speed</div>
                <div className="text-lg font-medium text-gray-900">42.5 Mbps</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Number of Measurements</div>
                <div className="text-lg font-medium text-gray-900">1,247</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 