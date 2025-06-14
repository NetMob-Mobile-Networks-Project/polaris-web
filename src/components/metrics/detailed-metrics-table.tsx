import { Card } from '@/components/ui/card';

export interface DetailedMetric {
  id: string;
  region: string;
  average_strength: number;
  average_quality: number;
  measurement_count: number;
  strength_class: string;
  quality_class: string;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Signal Strength</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Measurements count</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.average_strength.toFixed(1)} dBm ({metric.strength_class})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.average_quality.toFixed(1)} dBm ({metric.quality_class})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.measurement_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 