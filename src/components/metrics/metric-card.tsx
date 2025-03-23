interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
}

export function MetricCard({ title, value, change, changeLabel }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-1">
        <div className="flex items-baseline">
          <div className="text-xl font-semibold text-gray-900">
            {value}
          </div>
          <div
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">{changeLabel}</p>
      </div>
    </div>
  );
} 