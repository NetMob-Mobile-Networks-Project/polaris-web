'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

const timeRanges = [
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Export Report
          </button>
        </div>
      </div>


      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Network Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Speed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Signal Strength</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Latency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tehran North</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5G</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">85.2 Mbps</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-75 dBm</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32 ms</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tehran South</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4G/LTE</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45.8 Mbps</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-82 dBm</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">38 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 