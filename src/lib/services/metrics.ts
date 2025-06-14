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

export interface NetworkDistributionResponse {
  success: boolean;
  message: string;
  data: {
    labels: string[];
    values: number[];
  };
}

export interface MapDataPoint {
  id: number;
  device_id: string;
  timestamp: string;
  latitude: string;
  longitude: string;
  cellular_technology: string;
  network_operator_name: string;
  network_operator_mccmnc: string;
  lac: number;
  rac: number;
  tac: number;
  cell_id: number;
  arfcn: number;
  signal_strength: number;
  signal_quality: number;
  additional_params: string;
}

export interface MapDataResponse {
  success: boolean;
  message: string;
  data: {
    points: MapDataPoint[];
    bounds: {
      min_lat: number;
      max_lat: number;
      min_long: number;
      max_long: number;
    };
  };
}

export interface MapBounds {
  minLat?: number;
  maxLat?: number;
  minLong?: number;
  maxLong?: number;
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

export interface NetworkDistributionData {
  labels: string[];
  datasets: [{
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }];
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

export interface DetailedListParams {
  start: 'last-hour' | 'last-day' | 'last-week' | 'last-month';
  page: number;
  metric: 'network' | 'ping' | 'http' | 'dns' | 'web' | 'sms';
}

export interface DetailedListResponse {
  success: boolean;
  message: string;
  data: {
    labels: string[];
    values: Record<string, unknown>[];
  };
}

export interface ClientConfigResponse {
  samplingIntervalSeconds: number;
  testTypes: string[];
}

export interface ConfigResponse {
  success: boolean;
  message: string;
  data: ClientConfigResponse;
}

export interface UpdateConfigRequest {
  samplingIntervalSeconds: number;
  testTypes: string[];
}

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ListUsersResponse {
  users: UserResponse[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface UsersApiResponse {
  message: string;
  data: ListUsersResponse;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
}

export interface CreateUserApiResponse {
  message: string;
  data: UserResponse;
}

export interface DeleteUserApiResponse {
  message: string;
}

export interface RegionListResponse {
  success: boolean;
  message: string;
  data: {
    regions: Array<{
      name: string;
      average_strength: number;
      average_quality: number;
      measurement_count: number;
      strength_class: string;
      quality_class: string;
    }>;
  };
}

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

  // Get network distribution data
  static async getNetworkDistribution(timeRange: TimeRange = 'last-day'): Promise<NetworkDistributionResponse> {
    const response = await api.get<NetworkDistributionResponse>(`/metrics/network-distribution?start=${timeRange}`);
    return response.data;
  }

  // Get map data for network measurements
  static async getMapData(bounds?: MapBounds): Promise<MapDataResponse> {
    const params = new URLSearchParams();
    
    if (bounds?.minLat !== undefined) {
      params.append('min_lat', bounds.minLat.toString());
    }
    if (bounds?.maxLat !== undefined) {
      params.append('max_lat', bounds.maxLat.toString());
    }
    if (bounds?.minLong !== undefined) {
      params.append('min_long', bounds.minLong.toString());
    }
    if (bounds?.maxLong !== undefined) {
      params.append('max_long', bounds.maxLong.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/metrics/map-data?${queryString}` : '/metrics/map-data';
    
    const response = await api.get<MapDataResponse>(url);
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

  // Transform distribution data to chart format
  static transformDistributionToChartData(distributionData: NetworkDistributionResponse['data']): NetworkDistributionData {
    const { labels, values } = distributionData;

    // Generate colors based on the number of labels
    const colors = [
      'rgb(99, 102, 241)',   // indigo-500
      'rgb(59, 130, 246)',   // blue-500
      'rgb(107, 114, 128)',  // gray-500
      'rgb(34, 197, 94)',    // green-500
      'rgb(249, 115, 22)',   // orange-500
      'rgb(239, 68, 68)',    // red-500
      'rgb(168, 85, 247)',   // purple-500
      'rgb(236, 72, 153)',   // pink-500
    ];

    const backgroundColor = labels.map((_, index) => colors[index % colors.length]);

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor,
        borderWidth: 0,
      }],
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

  // Get detailed list of metrics
  static async getDetailedList(params: DetailedListParams): Promise<DetailedListResponse> {
    const queryParams = new URLSearchParams({
      start: params.start,
      page: params.page.toString(),
      metric: params.metric
    });

    const response = await api.get<DetailedListResponse>(`/metrics/detailed-list?${queryParams.toString()}`);
    return response.data;
  }

  // Get client configuration
  static async getClientConfig(): Promise<ConfigResponse> {
    const response = await api.get<ConfigResponse>('/config');
    return response.data;
  }

  // Update client configuration
  static async updateClientConfig(config: UpdateConfigRequest): Promise<ConfigResponse> {
    const response = await api.put<ConfigResponse>('/admin/config', config);
    return response.data;
  }

  // Get list of users with pagination
  static async getUsers(page: number = 1, pageSize: number = 10): Promise<UsersApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    });

    const response = await api.get<UsersApiResponse>(`/admin/users?${params.toString()}`);
    return response.data;
  }

  // Create a new user
  static async createUser(userData: CreateUserRequest): Promise<CreateUserApiResponse> {
    const response = await api.post<CreateUserApiResponse>('/admin/users', userData);
    return response.data;
  }

  // Delete a user
  static async deleteUser(userId: number): Promise<DeleteUserApiResponse> {
    const response = await api.delete<DeleteUserApiResponse>(`/admin/users/${userId}`);
    return response.data;
  }

  // Get region list with statistics
  static async getRegionList(): Promise<RegionListResponse> {
    const response = await api.get<RegionListResponse>('/metrics/region-list');
    return response.data;
  }
}

// Convenience exports
export const {
  getAvgDownSpeed,
  getAvgUpSpeed,
  getAvgLatency,
  getNetworkAvailability,
  getNetworkHistogram,
  getNetworkDistribution,
  getMapData,
  transformHistogramToChartData,
  transformDistributionToChartData,
  getAllMetrics,
  getTimeRangeLabel,
  getDetailedList,
  getClientConfig,
  updateClientConfig,
  getUsers,
  createUser,
  deleteUser,
  getRegionList,
} = MetricsService; 