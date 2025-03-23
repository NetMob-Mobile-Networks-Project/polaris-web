'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkChartProps {
  data: {
    labels: string[];
    download: number[];
    upload: number[];
    latency: number[];
  };
}

export function NetworkChart({ data }: NetworkChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Speed (Mbps)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Latency (ms)',
        },
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Download Speed',
        data: data.download,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Upload Speed',
        data: data.upload,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Latency',
        data: data.latency,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <div className="h-80">
      <Line options={options} data={chartData} />
    </div>
  );
} 