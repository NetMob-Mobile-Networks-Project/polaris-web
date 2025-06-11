'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { NetworkDistributionData } from '@/lib/services/metrics';

interface NetworkDistributionChartProps {
  data?: NetworkDistributionData | null;
  isLoading?: boolean;
  error?: string | null;
}

// Fallback static data for when no data is provided
const fallbackData: NetworkDistributionData = {
  labels: ['4G/LTE', '5G', '3G'],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: [
        'rgb(99, 102, 241)', // indigo-500
        'rgb(59, 130, 246)', // blue-500
        'rgb(107, 114, 128)', // gray-500
      ],
      borderWidth: 0,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#374151', // text-gray-700
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
  },
  cutout: '70%',
};

export function NetworkDistributionChart({ data, isLoading, error }: NetworkDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Use provided data or fallback to static data
    const chartData = data || fallbackData;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]); // Re-create chart when data changes

  // Handle error state
  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">Failed to load distribution data</div>
          <div className="text-gray-500 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  // Handle loading state (when no data is available)
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
          <div className="text-gray-500 text-sm">Loading distribution data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <canvas ref={chartRef} />
    </div>
  );
} 