import { Card } from '@/components/ui/card';

export interface DetailedMetric {
  id: string;
  region: string;
  networkType: string;
  avgSpeed: string;
  signalStrength: string;
  latency: string;
}

interface DetailedMetricsTableProps {
  metrics: DetailedMetric[];
}

export function DetailedMetricsTable({ metrics }: DetailedMetricsTableProps) {
  return (
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
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.networkType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgSpeed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.signalStrength}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 