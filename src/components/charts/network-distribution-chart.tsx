'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface NetworkDistributionChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export function NetworkDistributionChart({ data }: NetworkDistributionChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.labels,
    datasets: [
      {
        data: data.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(16, 185, 129, 0.8)', // green-500
          'rgba(245, 158, 11, 0.8)', // yellow-500
          'rgba(239, 68, 68, 0.8)', // red-500
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
} 