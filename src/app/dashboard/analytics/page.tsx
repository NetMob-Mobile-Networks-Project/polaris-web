'use client';

import { useState } from 'react';
import { MetricsTable } from '@/components/metrics/metrics-table';
import type { MetricsData } from '@/components/metrics/metrics-table';

const timeRanges = [
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
];

const metricTabs = [
  { id: 'network', label: 'Network' },
  { id: 'http', label: 'HTTP' },
  { id: 'sms', label: 'SMS' },
  { id: 'dns', label: 'DNS' },
  { id: 'ping', label: 'Ping' },
];

// Data structures for each metric type
const metricsData: MetricsData = {
  network: [
    {
      id: 'net-1',
      region: 'Tehran North',
      networkType: '5G',
      avgSpeed: '85.2 Mbps',
      signalStrength: '-75 dBm',
      latency: '32 ms',
      uptime: '99.8%',
    },
    {
      id: 'net-2',
      region: 'Tehran South',
      networkType: '4G/LTE',
      avgSpeed: '45.8 Mbps',
      signalStrength: '-82 dBm',
      latency: '38 ms',
      uptime: '98.5%',
    },
    {
      id: 'net-3',
      region: 'Tehran East',
      networkType: '4G/LTE',
      avgSpeed: '52.1 Mbps',
      signalStrength: '-78 dBm',
      latency: '41 ms',
      uptime: '99.2%',
    },
  ],
  http: [
    {
      id: 'http-1',
      endpoint: '/api/users',
      method: 'GET',
      avgResponseTime: '245 ms',
      successRate: '99.2%',
      requestCount: '15,247',
      errorRate: '0.8%',
    },
    {
      id: 'http-2',
      endpoint: '/api/data',
      method: 'POST',
      avgResponseTime: '412 ms',
      successRate: '97.8%',
      requestCount: '8,934',
      errorRate: '2.2%',
    },
    {
      id: 'http-3',
      endpoint: '/api/auth',
      method: 'POST',
      avgResponseTime: '189 ms',
      successRate: '99.9%',
      requestCount: '3,421',
      errorRate: '0.1%',
    },
  ],
  sms: [
    {
      id: 'sms-1',
      carrier: 'Hamrah-e Avval',
      messagesSent: '12,547',
      deliveryRate: '98.5%',
      avgDeliveryTime: '2.3 sec',
      failureRate: '1.5%',
      cost: '$245.67',
    },
    {
      id: 'sms-2',
      carrier: 'Irancell',
      messagesSent: '8,932',
      deliveryRate: '97.2%',
      avgDeliveryTime: '3.1 sec',
      failureRate: '2.8%',
      cost: '$178.42',
    },
    {
      id: 'sms-3',
      carrier: 'RighTel',
      messagesSent: '4,521',
      deliveryRate: '96.8%',
      avgDeliveryTime: '3.8 sec',
      failureRate: '3.2%',
      cost: '$92.15',
    },
  ],
  dns: [
    {
      id: 'dns-1',
      server: '8.8.8.8',
      queries: '45,321',
      avgResponseTime: '12 ms',
      successRate: '99.9%',
      cacheHitRate: '85.2%',
      errors: '45',
    },
    {
      id: 'dns-2',
      server: '1.1.1.1',
      queries: '38,967',
      avgResponseTime: '8 ms',
      successRate: '99.8%',
      cacheHitRate: '87.4%',
      errors: '78',
    },
    {
      id: 'dns-3',
      server: '208.67.222.222',
      queries: '29,845',
      avgResponseTime: '15 ms',
      successRate: '99.6%',
      cacheHitRate: '82.1%',
      errors: '119',
    },
  ],
  ping: [
    {
      id: 'ping-1',
      target: 'google.com',
      avgPing: '23 ms',
      minPing: '18 ms',
      maxPing: '45 ms',
      packetLoss: '0.2%',
      jitter: '2.1 ms',
    },
    {
      id: 'ping-2',
      target: 'cloudflare.com',
      avgPing: '19 ms',
      minPing: '15 ms',
      maxPing: '38 ms',
      packetLoss: '0.1%',
      jitter: '1.8 ms',
    },
    {
      id: 'ping-3',
      target: 'github.com',
      avgPing: '42 ms',
      minPing: '35 ms',
      maxPing: '67 ms',
      packetLoss: '0.5%',
      jitter: '3.2 ms',
    },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('network');

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

      <div className="bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {metricTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <MetricsTable activeTab={activeTab} metricsData={metricsData} />
        </div>
      </div>
    </div>
  );
} 