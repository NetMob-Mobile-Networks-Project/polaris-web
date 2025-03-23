'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const data = {
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

export function NetworkChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data,
          options,
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-full">
      <canvas ref={chartRef} />
    </div>
  );
} 