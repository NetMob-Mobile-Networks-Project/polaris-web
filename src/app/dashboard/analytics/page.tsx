'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { NetworkChart } from '@/components/charts/network-chart';
import { NetworkDistributionChart } from '@/components/charts/network-distribution-chart';
import { MetricCard } from '@/components/metrics/metric-card';

const timeRanges = [
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
];

export default function AnalyticsPage() {
  // TODO: API Call - Fetch initial metrics data
  const [metrics, setMetrics] = useState({
    downloadSpeed: 45.2,
    uploadSpeed: 12.8,
    latency: 42,
    activeDevices: 127,
    downloadChange: 5.2,
    uploadChange: -2.1,
    latencyChange: -8,
    devicesChange: 12,
  });

  // TODO: API Call - Fetch network performance data for chart
  const [networkData, setNetworkData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    download: [42.5, 43.2, 44.8, 45.2, 44.9, 45.2],
    upload: [13.2, 12.9, 12.5, 12.8, 12.7, 12.8],
    latency: [45, 44, 43, 42, 42, 42],
  });

  // TODO: API Call - Fetch network distribution data
  const [distributionData, setDistributionData] = useState({
    labels: ['4G', '5G', 'WiFi', 'Ethernet'],
    data: [35, 25, 20, 20],
  });

  // TODO: API Call - Fetch detailed metrics data
  const [detailedMetrics, setDetailedMetrics] = useState([
    {
      region: 'Tehran North',
      networkType: '5G',
      averageSpeed: '52.3 Mbps',
      signalStrength: '-85 dBm',
      latency: '38 ms',
    },
    {
      region: 'Tehran South',
      networkType: '4G',
      averageSpeed: '42.1 Mbps',
      signalStrength: '-92 dBm',
      latency: '45 ms',
    },
    {
      region: 'Tehran East',
      networkType: 'WiFi',
      averageSpeed: '38.5 Mbps',
      signalStrength: '-78 dBm',
      latency: '32 ms',
    },
    {
      region: 'Tehran West',
      networkType: 'Ethernet',
      averageSpeed: '95.2 Mbps',
      signalStrength: 'N/A',
      latency: '12 ms',
    },
  ]);

  // TODO: API Call - Load all analytics data on component mount
  useEffect(() => {
    // fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Download Speed"
          value={`${metrics.downloadSpeed} Mbps`}
          change={metrics.downloadChange}
          changeLabel="from last period"
        />
        <MetricCard
          title="Average Upload Speed"
          value={`${metrics.uploadSpeed} Mbps`}
          change={metrics.uploadChange}
          changeLabel="from last period"
        />
        <MetricCard
          title="Average Latency"
          value={`${metrics.latency} ms`}
          change={metrics.latencyChange}
          changeLabel="from last period"
        />
        <MetricCard
          title="Active Devices"
          value={metrics.activeDevices.toString()}
          change={metrics.devicesChange}
          changeLabel="from last period"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Network Performance Trends</h2>
          <NetworkChart data={networkData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Network Distribution</h2>
          <NetworkDistributionChart data={distributionData} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Detailed Metrics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Speed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal Strength</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailedMetrics.map((metric, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.networkType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.averageSpeed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.signalStrength}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 