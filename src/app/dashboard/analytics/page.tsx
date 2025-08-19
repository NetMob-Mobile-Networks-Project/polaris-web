'use client';

import { useState } from 'react';
import { DynamicMetricsTable } from '@/components/metrics/dynamic-metrics-table';
import { useAnalyticsData } from '@/lib/hooks/useAnalyticsData';
import type { DetailedListParams } from '@/lib/services/metrics';

// Map UI time ranges to API time ranges
const timeRanges = [
  { id: 'last-hour', label: 'Last Hour' },
  { id: 'last-day', label: 'Last 24 Hours' },
  { id: 'last-week', label: 'Last 7 Days' },
  { id: 'last-month', label: 'Last 30 Days' },
] as const;

const metricTabs = [
  { id: 'network', label: 'Network' },
  { id: 'ping', label: 'Ping' },
  { id: 'http', label: 'HTTP' },
  { id: 'dns', label: 'DNS' },
  { id: 'web', label: 'Web' },
  { id: 'sms', label: 'SMS' },
] as const;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<DetailedListParams['start']>('last-day');
  const [activeTab, setActiveTab] = useState<DetailedListParams['metric']>('network');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data using the custom hook
  const { data, isLoading, error, refetch } = useAnalyticsData({
    start: timeRange,
    page: currentPage,
    metric: activeTab
  });

  // Handle tab change and reset page
  const handleTabChange = (newTab: DetailedListParams['metric']) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  // Handle time range change and reset page
  const handleTimeRangeChange = (newTimeRange: DetailedListParams['start']) => {
    setTimeRange(newTimeRange);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle export functionality
  const handleExport = async () => {
    if (!data?.data?.values || data.data.values.length === 0) {
      alert('No data available to export');
      return;
    }

    try {
      // Construct the export URL with current filters
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://156.255.1.85:8080/api/v1';
      const params = new URLSearchParams({
        start: timeRange,
        page: currentPage.toString(),
        metric: activeTab
      });
      
      const exportUrl = `${baseUrl}/export/csv?${params.toString()}`;
      
      // Get auth token for the request
      const token = localStorage.getItem('auth-token');
      
      // Fetch the CSV data from backend
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      // Get the CSV content
      const csvContent = await response.text();
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_metrics_${timeRange}_page${currentPage}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-semibold text-gray-800 text-base sm:text-2xl">Network Analytics</h1>
        <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:justify-end sm:w-auto">
          <div className="relative w-full sm:w-auto max-w-xs">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as DetailedListParams['start'])}
              className="appearance-none rounded-md border-gray-300 pl-3 pr-8 py-2 text-xs focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 w-full sm:w-auto"
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
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={refetch}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-2 py-2 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-1/2 sm:w-auto text-center"
            >
              <svg className={`-ml-1 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={handleExport}
              disabled={isLoading || !data?.data?.values?.length}
              className="inline-flex items-center justify-center px-2 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-1/2 sm:w-auto text-center"
            >
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex flex-nowrap space-x-2 min-w-max sm:space-x-6" aria-label="Tabs">
            {metricTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`$${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <DynamicMetricsTable
            labels={data?.data?.labels || []}
            values={data?.data?.values || []}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Pagination Controls */}
        {data?.data?.values && data.data.values.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of {activeTab} metrics
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    {currentPage}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 