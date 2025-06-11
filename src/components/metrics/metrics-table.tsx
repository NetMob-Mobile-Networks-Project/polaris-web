import { Card } from '@/components/ui/card';

// TypeScript interfaces for different metric types
export interface NetworkMetric {
  id: string;
  region: string;
  networkType: string;
  avgSpeed: string;
  signalStrength: string;
  latency: string;
  uptime: string;
}

export interface HttpMetric {
  id: string;
  endpoint: string;
  method: string;
  avgResponseTime: string;
  successRate: string;
  requestCount: string;
  errorRate: string;
}

export interface SmsMetric {
  id: string;
  carrier: string;
  messagesSent: string;
  deliveryRate: string;
  avgDeliveryTime: string;
  failureRate: string;
  cost: string;
}

export interface DnsMetric {
  id: string;
  server: string;
  queries: string;
  avgResponseTime: string;
  successRate: string;
  cacheHitRate: string;
  errors: string;
}

export interface PingMetric {
  id: string;
  target: string;
  avgPing: string;
  minPing: string;
  maxPing: string;
  packetLoss: string;
  jitter: string;
}

export interface MetricsData {
  network: NetworkMetric[];
  http: HttpMetric[];
  sms: SmsMetric[];
  dns: DnsMetric[];
  ping: PingMetric[];
}

interface MetricsTableProps {
  activeTab: string;
  metricsData: MetricsData;
}

export function MetricsTable({ activeTab, metricsData }: MetricsTableProps) {
  const getTableContent = () => {
    switch (activeTab) {
      case 'network':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Network Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Speed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Signal Strength</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Latency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Uptime</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsData.network.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.networkType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgSpeed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.signalStrength}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.latency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'http':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Request Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Error Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsData.http.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.endpoint}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {metric.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgResponseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.successRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.requestCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.errorRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'sms':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Messages Sent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Delivery Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Delivery Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Failure Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsData.sms.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.carrier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.messagesSent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.deliveryRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgDeliveryTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.failureRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'dns':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">DNS Server</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Queries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Cache Hit Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Errors</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsData.dns.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.server}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.queries}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgResponseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.successRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.cacheHitRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'ping':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Avg Ping</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Min Ping</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Max Ping</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Packet Loss</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Jitter</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsData.ping.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgPing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.minPing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.maxPing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.packetLoss}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.jitter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        {getTableContent()}
      </div>
    </Card>
  );
} 