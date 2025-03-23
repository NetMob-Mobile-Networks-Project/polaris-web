'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { NetworkChart } from '@/components/charts/network-chart';
import { MetricCard } from '@/components/metrics/metric-card';
import { AlertList } from '@/components/alerts/alert-list';

export default function DashboardPage() {
  // TODO: API Call - Fetch initial metrics data
  // GET /api/analytics/metrics
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
  // GET /api/analytics/network-data
  const [networkData, setNetworkData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    download: [42.5, 43.2, 44.8, 45.2, 44.9, 45.2],
    upload: [13.2, 12.9, 12.5, 12.8, 12.7, 12.8],
    latency: [45, 44, 43, 42, 42, 42],
  });

  // TODO: API Call - Fetch active alerts
  // GET /api/dashboard/alerts
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      title: 'High Latency Detected',
      message: 'Network latency has exceeded 100ms threshold',
      severity: 'warning' as const,
      timestamp: '2024-02-20T10:30:00Z',
    },
    {
      id: '2',
      title: 'Low Signal Strength',
      message: 'Signal strength is below -90dBm in sector A',
      severity: 'critical' as const,
      timestamp: '2024-02-20T10:25:00Z',
    },
  ]);

  // TODO: API Call - Fetch network distribution data
  // GET /api/analytics/distribution
  const [distributionData, setDistributionData] = useState({ labels: [], data: [] });

  // TODO: API Call - Fetch detailed metrics data
  // GET /api/analytics/detailed-metrics
  const [detailedMetrics, setDetailedMetrics] = useState([]);

  // TODO: API Call - Load all analytics data on component mount
  // GET /api/analytics
  useEffect(() => {
    // fetchAnalyticsData();
  }, []);

  // TODO: API Call - Fetch initial thresholds from backend
  // GET /api/settings/thresholds
  const [thresholds, setThresholds] = useState([]);

  // TODO: API Call - Fetch initial sync interval from backend
  // GET /api/settings/sync-interval
  const [syncInterval, setSyncInterval] = useState('300');

  // TODO: API Call - Fetch initial map settings from backend
  // GET /api/settings/map
  const [mapSettings, setMapSettings] = useState({});

  // TODO: API Call - Fetch initial export settings from backend
  // GET /api/settings/export
  const [exportSettings, setExportSettings] = useState({});

  // TODO: API Call - Load all settings on component mount
  // GET /api/settings
  useEffect(() => {
    // fetchSettings();
  }, []);

  // TODO: API Call - Save all settings to backend
  // POST /api/settings
  const handleSaveSettings = async () => {
    try {
      // await saveSettings({...});
    } catch (error) {
      // Handle error
    }
  };

  // TODO: API Call - Fetch initial devices data
  // GET /api/map/devices
  const [devices, setDevices] = useState([]);

  const [timeRange, setTimeRange] = useState('24h');

  const timeRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
  ];

  // TODO: API Call - Load all map data on component mount
  // GET /api/map
  useEffect(() => {
    // fetchMapData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Network Overview</h1>
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h2>
          <AlertList alerts={alerts} />
        </Card>
      </div>
    </div>
  );
} 