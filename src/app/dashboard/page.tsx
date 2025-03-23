'use client';

import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/metrics/metric-card';
import { NetworkChart } from '@/components/charts/network-chart';

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
        <MetricCard
          title="Average Download Speed"
          value="45.2 Mbps"
          change={+5.2}
          changeLabel="from last period"
        />
        <MetricCard
          title="Average Upload Speed"
          value="12.8 Mbps"
          change={-2.1}
          changeLabel="from last period"
        />
        <MetricCard
          title="Average Latency"
          value="42 ms"
          change={-8}
          changeLabel="from last period"
        />
        <MetricCard
          title="Active Devices"
          value="127"
          change={+12}
          changeLabel="from last period"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Network Performance Trends</h3>
          <div className="h-80">
            <NetworkChart />
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Active Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-900">High Latency Detected</p>
                <p className="text-sm text-red-800">Region: Tehran North</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-red-900 bg-red-100 rounded-full">
                Critical
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">Low Signal Strength</p>
                <p className="text-sm text-yellow-800">Region: Tehran East</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-yellow-900 bg-yellow-100 rounded-full">
                Warning
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 