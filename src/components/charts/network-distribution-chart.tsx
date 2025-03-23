'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const data = {
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

export function NetworkDistributionChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
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