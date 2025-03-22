export interface NetworkMetrics {
  timestamp: string;
  deviceId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  cellularInfo: {
    cellId: string;
    lac: string;
    tac: string;
    signalStrength: number;
    networkType: '2G' | '3G' | '4G' | '5G';
    rsrp?: number;  // Reference Signal Received Power
    rsrq?: number;  // Reference Signal Received Quality
    sinr?: number;  // Signal to Interference plus Noise Ratio
  };
  performanceMetrics: {
    httpUploadSpeed: number;    // in Mbps
    httpDownloadSpeed: number;  // in Mbps
    pingLatency: number;       // in ms
    dnsResponseTime: number;   // in ms
    smsDeliveryLatency?: number; // in ms
  };
}

export interface ThresholdConfig {
  id: string;
  name: string;
  metric: keyof NetworkMetrics['performanceMetrics'] | keyof NetworkMetrics['cellularInfo'];
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  preferences: {
    defaultMapView: {
      center: [number, number];
      zoom: number;
    };
    thresholds: ThresholdConfig[];
  };
} 