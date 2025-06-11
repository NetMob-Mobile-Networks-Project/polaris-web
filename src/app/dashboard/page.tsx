'use client';

import { Card } from '@/components/ui/card';
import { NetworkChart } from '@/components/charts/network-chart';
import { NetworkDistributionChart } from '@/components/charts/network-distribution-chart';
import { DetailedMetricsTable } from '@/components/metrics/detailed-metrics-table';
import type { DetailedMetric } from '@/components/metrics/detailed-metrics-table';

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

const detailedMetrics: DetailedMetric[] = [
  {
    id: 'tehran-north',
    region: 'Tehran North',
    networkType: '5G',
    avgSpeed: '85.2 Mbps',
    signalStrength: '-75 dBm',
    latency: '32 ms',
  },
  {
    id: 'tehran-south',
    region: 'Tehran South',
    networkType: '4G/LTE',
    avgSpeed: '45.8 Mbps',
    signalStrength: '-82 dBm',
    latency: '38 ms',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select className="appearance-none rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Export Data
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
          <h3 className="text-lg font-medium text-gray-800 mb-4">Network Performance Trends</h3>
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
      </div>

      <DetailedMetricsTable metrics={detailedMetrics} />
    </div>
  );
} 