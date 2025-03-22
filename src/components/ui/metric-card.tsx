import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { Card } from './card';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
}

export function MetricCard({ title, value, change, changeLabel }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className="px-4 py-5">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-gray-900">
          {value}
        </div>

        <div className={`flex items-baseline text-sm font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="flex items-center">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
            )}
            {Math.abs(change)}
          </span>
          <span className="ml-2 text-gray-500">{changeLabel}</span>
        </div>
      </dd>
    </Card>
  );
} 