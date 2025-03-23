'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { NetworkChart } from '@/components/charts/network-chart';
import { NetworkDistributionChart } from '@/components/charts/network-distribution-chart';
import { MetricCard } from '@/components/metrics/metric-card';

const timeRanges = [
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
];

const metrics = [
  {
    id: 'download',
    label: 'Download Speed',
    value: '45.2 Mbps',
    change: '+5.2%',
    isPositive: true,
  },
  {
    id: 'upload',
    label: 'Upload Speed',
    value: '12.8 Mbps',
    change: '-2.1%',
    isPositive: false,
  },
  {
    id: 'latency',
    label: 'Average Latency',
    value: '42 ms',
    change: '-8%',
    isPositive: true,
  },
  {
    id: 'availability',
    label: 'Network Availability',
    value: '99.8%',
    change: '+0.2%',
    isPositive: true,
  },
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="px-4 py-5">
            <dt className="text-sm font-medium text-gray-500">{metric.label}</dt>
            <dd className="mt-1">
              <div className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </div>
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    metric.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </div>
              </div>
            </dd>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Trends</h3>
          <div className="h-80">
            <NetworkChart />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Network Distribution</h3>
          <div className="h-80">
            <NetworkDistributionChart />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Problem Areas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-800">Tehran North - District 1</p>
                <p className="text-sm text-red-700">High latency and packet loss</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                Critical
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800">Tehran East - District 4</p>
                <p className="text-sm text-yellow-700">Low signal strength</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Warning
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Samsung</span>
                <span className="text-sm font-medium text-gray-900">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Xiaomi</span>
                <span className="text-sm font-medium text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Huawei</span>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Others</span>
                <span className="text-sm font-medium text-gray-900">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </Card>
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