import api from '../axios';

// Types matching the Go backend response structure
export interface MetricResponse {
  success: boolean;
  message: string;
  data: {
    averageSpeed?: number;
    averageLatency?: number;
    availability?: number;
    unit: string;
  };
}

export interface NetworkHistogramResponse {
  success: boolean;
  message: string;
  data: {
    labels: string[];
    uploadData: number[];
    downloadData: number[];
    latencyData: number[];
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
  yAxisID: string;
}

export interface NetworkChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface DashboardMetrics {
  downloadSpeed: {
    value: number;
    unit: string;
    formatted: string;
  } | null;
  uploadSpeed: {
    value: number;
    unit: string;
    formatted: string;
  } | null;
  latency: {
    value: number;
    unit: string;
    formatted: string;
  } | null;
  availability: {
    value: number;
    unit: string;
    formatted: string;
  } | null;
}

export type TimeRange = 'last-hour' | 'last-day' | 'last-week' | 'last-month';

export class MetricsService {
  // Get average download speed
  static async getAvgDownSpeed(timeRange: TimeRange = 'last-day'): Promise<MetricResponse> {
    const response = await api.get<MetricResponse>(`/metrics/avg-down-speed?start=${timeRange}`);
    return response.data;
  }

  // Get average upload speed
  static async getAvgUpSpeed(timeRange: TimeRange = 'last-day'): Promise<MetricResponse> {
    const response = await api.get<MetricResponse>(`/metrics/avg-up-speed?start=${timeRange}`);
    return response.data;
  }

  // Get average latency
  static async getAvgLatency(timeRange: TimeRange = 'last-day'): Promise<MetricResponse> {
    const response = await api.get<MetricResponse>(`/metrics/avg-latency?start=${timeRange}`);
    return response.data;
  }

  // Get network availability
  static async getNetworkAvailability(timeRange: TimeRange = 'last-day'): Promise<MetricResponse> {
    const response = await api.get<MetricResponse>(`/metrics/network-availability?start=${timeRange}`);
    return response.data;
  }

  // Get network histogram data
  static async getNetworkHistogram(timeRange: TimeRange = 'last-day'): Promise<NetworkHistogramResponse> {
    const response = await api.get<NetworkHistogramResponse>(`/metrics/network-histogram?start=${timeRange}`);
    return response.data;
  }

  // Transform histogram data to chart format
  static transformHistogramToChartData(histogramData: NetworkHistogramResponse['data']): NetworkChartData {
    const { labels, uploadData, downloadData, latencyData } = histogramData;

    // Convert kbps to Mbps for better readability
    const downloadMbps = downloadData.map(speed => speed / 1000);
    const uploadMbps = uploadData.map(speed => speed / 1000);

    return {
      labels,
      datasets: [
        {
          label: 'Download Speed (Mbps)',
          data: downloadMbps,
          borderColor: 'rgb(99, 102, 241)', // indigo-500
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Upload Speed (Mbps)',
          data: uploadMbps,
          borderColor: 'rgb(59, 130, 246)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Latency (ms)',
          data: latencyData,
          borderColor: 'rgb(239, 68, 68)', // red-500
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };
  }

  // Get all metrics at once
  static async getAllMetrics(timeRange: TimeRange = 'last-day'): Promise<DashboardMetrics> {
    try {
      // Make all API calls in parallel
      const [downSpeed, upSpeed, latency, availability] = await Promise.allSettled([
        this.getAvgDownSpeed(timeRange),
        this.getAvgUpSpeed(timeRange),
        this.getAvgLatency(timeRange),
        this.getNetworkAvailability(timeRange),
      ]);

      return {
        downloadSpeed: downSpeed.status === 'fulfilled' && downSpeed.value.data.averageSpeed !== undefined
          ? {
              value: downSpeed.value.data.averageSpeed,
              unit: downSpeed.value.data.unit,
              formatted: this.formatSpeed(downSpeed.value.data.averageSpeed, downSpeed.value.data.unit),
            }
          : null,
        
        uploadSpeed: upSpeed.status === 'fulfilled' && upSpeed.value.data.averageSpeed !== undefined
          ? {
              value: upSpeed.value.data.averageSpeed,
              unit: upSpeed.value.data.unit,
              formatted: this.formatSpeed(upSpeed.value.data.averageSpeed, upSpeed.value.data.unit),
            }
          : null,
        
        latency: latency.status === 'fulfilled' && latency.value.data.averageLatency !== undefined
          ? {
              value: latency.value.data.averageLatency,
              unit: latency.value.data.unit,
              formatted: `${latency.value.data.averageLatency.toFixed(1)} ${latency.value.data.unit}`,
            }
          : null,
        
        availability: availability.status === 'fulfilled' && availability.value.data.availability !== undefined
          ? {
              value: availability.value.data.availability,
              unit: availability.value.data.unit,
              formatted: `${availability.value.data.availability.toFixed(1)}%`,
            }
          : null,
      };
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      return {
        downloadSpeed: null,
        uploadSpeed: null,
        latency: null,
        availability: null,
      };
    }
  }

  // Helper function to format speed from kbps
  private static formatSpeed(speed: number, unit: string): string {
    if (unit === 'kbps') {
      // Convert kbps to Mbps for better readability
      const mbps = speed / 1000;
      if (mbps >= 1) {
        return `${mbps.toFixed(1)} Mbps`;
      } else {
        return `${speed.toFixed(0)} kbps`;
      }
    }
    return `${speed.toFixed(1)} ${unit}`;
  }

  // Helper function to get display name for time range
  static getTimeRangeLabel(timeRange: TimeRange): string {
    switch (timeRange) {
      case 'last-hour':
        return 'Last Hour';
      case 'last-day':
        return 'Last 24 Hours';
      case 'last-week':
        return 'Last 7 Days';
      case 'last-month':
        return 'Last 30 Days';
      default:
        return 'Last 24 Hours';
    }
  }
}

// Convenience exports
export const {
  getAvgDownSpeed,
  getAvgUpSpeed,
  getAvgLatency,
  getNetworkAvailability,
  getNetworkHistogram,
  transformHistogramToChartData,
  getAllMetrics,
  getTimeRangeLabel,
} = MetricsService; 