'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { NetworkChartData } from '@/lib/services/metrics';

interface NetworkChartProps {
  data?: NetworkChartData | null;
  isLoading?: boolean;
  error?: string | null;
}

// Fallback static data for when no data is provided
const fallbackData: NetworkChartData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  datasets: [
    {
      label: 'Download Speed (Mbps)',
      data: [45.2, 42.8, 48.5, 52.3, 49.8, 46.2, 44.5],
      borderColor: 'rgb(99, 102, 241)', // indigo-500
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    },
    {
      label: 'Upload Speed (Mbps)',
      data: [12.8, 11.5, 13.2, 14.5, 13.8, 12.5, 12.2],
      borderColor: 'rgb(59, 130, 246)', // blue-500
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    },
    {
      label: 'Latency (ms)',
      data: [42, 38, 35, 32, 36, 40, 42],
      borderColor: 'rgb(239, 68, 68)', // red-500
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#374151', // text-gray-700
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#374151', // text-gray-700
        font: {
          size: 12,
        },
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      beginAtZero: true,
      ticks: {
        color: '#374151', // text-gray-700
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#374151', // text-gray-700
        font: {
          size: 12,
        },
      },
    },
  },
};

export function NetworkChart({ data, isLoading, error }: NetworkChartProps) {
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
      type: 'line',
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
          <div className="text-red-500 text-sm mb-2">Failed to load chart data</div>
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
          <div className="text-gray-500 text-sm">Loading chart data...</div>
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