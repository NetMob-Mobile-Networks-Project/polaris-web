import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { NetworkChart } from '@/components/charts/network-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Network Overview</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network Performance Trends</h3>
          <div className="h-80">
            <NetworkChart />
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-4">
            {/* Placeholder for alerts list */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-800">High Latency Detected</p>
                <p className="text-sm text-red-700">Region: Tehran North</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                Critical
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Signal Strength</p>
                <p className="text-sm text-yellow-700">Region: Tehran East</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Warning
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 