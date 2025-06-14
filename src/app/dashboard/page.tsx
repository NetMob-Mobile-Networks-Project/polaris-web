'use client';

import { Card } from '@/components/ui/card';
import { NetworkChart } from '@/components/charts/network-chart';
import { NetworkDistributionChart } from '@/components/charts/network-distribution-chart';
import { DetailedMetricsTable } from '@/components/metrics/detailed-metrics-table';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useMetrics } from '@/lib/hooks/useMetrics';
import { useNetworkChart } from '@/lib/hooks/useNetworkChart';
import { useNetworkDistribution } from '@/lib/hooks/useNetworkDistribution';
import { TimeRange } from '@/lib/services/metrics';
import { useRegionList } from '@/lib/hooks/useRegionList';


const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: 'last-hour', label: 'Last Hour' },
  { value: 'last-day', label: 'Last 24 Hours' },
  { value: 'last-week', label: 'Last 7 Days' },
  { value: 'last-month', label: 'Last 30 Days' },
];

function DashboardContent() {
  const { metrics, isLoading, error, timeRange, setTimeRange, refetch } = useMetrics('last-day');
  const { 
    chartData, 
    isLoading: chartLoading, 
    error: chartError, 
    refetch: refetchChart 
  } = useNetworkChart(timeRange);
  const { 
    distributionData, 
    isLoading: distributionLoading, 
    error: distributionError, 
    refetch: refetchDistribution 
  } = useNetworkDistribution(timeRange);
  const {
    metrics: regionMetrics,
    isLoading: regionLoading,
    error: regionError,
    refetch: refetchRegions
  } = useRegionList();

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as TimeRange);
  };

  // const handleExportData = () => {
  //   // TODO: Implement export functionality
  //   console.log('Exporting data for time range:', timeRange);
  // };

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchChart(), refetchDistribution(), refetchRegions()]);
  };

  // Prepare metrics array for display
  const displayMetrics = [
    {
      id: 'download',
      label: 'Download Speed',
      value: metrics.downloadSpeed?.formatted || 'N/A',
      rawValue: metrics.downloadSpeed?.value,
      change: null, // TODO: Calculate change from previous period
      isPositive: null,
    },
    {
      id: 'upload',
      label: 'Upload Speed',
      value: metrics.uploadSpeed?.formatted || 'N/A',
      rawValue: metrics.uploadSpeed?.value,
      change: null,
      isPositive: null,
    },
    {
      id: 'latency',
      label: 'Average Latency',
      value: metrics.latency?.formatted || 'N/A',
      rawValue: metrics.latency?.value,
      change: null,
      isPositive: null,
    },
    {
      id: 'availability',
      label: 'Network Availability',
      value: metrics.availability?.formatted || 'N/A',
      rawValue: metrics.availability?.value,
      change: null,
      isPositive: null,
    },
  ];

  const isAnyLoading = isLoading || chartLoading || distributionLoading || regionLoading;
  const hasAnyError = error || chartError || distributionError || regionError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Network Overview</h1>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-1/2 sm:w-auto sm:min-w-[180px]">
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="appearance-none rounded-md border-gray-300 pl-3 pr-8 py-2 text-xs focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 w-full"
              disabled={isAnyLoading}
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isAnyLoading}
            className="inline-flex items-center justify-center px-2 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-1/2 text-center"
          >
            <svg className={`-ml-1 mr-2 h-4 w-4 ${isAnyLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isAnyLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          {/* Uncomment and update the export button if you want to add it here
          <button
            onClick={handleExportData}
            className="inline-flex items-center justify-center px-2 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-1/2 text-center"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
          */}
        </div>
      </div>

      {/* Error Display */}
      {hasAnyError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Failed to load data
              </h3>
              {error && <p className="mt-1 text-sm text-red-700">Metrics: {error}</p>}
              {chartError && <p className="mt-1 text-sm text-red-700">Chart: {chartError}</p>}
              {distributionError && <p className="mt-1 text-sm text-red-700">Distribution: {distributionError}</p>}
              {regionError && <p className="mt-1 text-sm text-red-700">Regions: {regionError}</p>}
              <div className="mt-2">
                <button
                  onClick={handleRefresh}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayMetrics.map((metric) => (
          <Card key={metric.id} className="px-4 py-5">
            <dt className="text-sm font-medium text-gray-500">{metric.label}</dt>
            <dd className="mt-1">
              <div className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                  ) : (
                    metric.value
                  )}
                </div>
                {metric.change && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      metric.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change}
                  </div>
                )}
              </div>
            </dd>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Network Performance Trends</h3>
          <div className="h-80">
            <NetworkChart 
              data={chartData}
              isLoading={chartLoading}
              error={chartError}
            />
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Network Distribution</h3>
          <div className="h-80">
            <NetworkDistributionChart 
              data={distributionData}
              isLoading={distributionLoading}
              error={distributionError}
            />
          </div>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <DetailedMetricsTable metrics={regionMetrics} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
} 