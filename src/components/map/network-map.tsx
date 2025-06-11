'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NetworkMetrics } from '@/types/network';

// Sample data - replace with real data from your API
const sampleData: NetworkMetrics[] = [
  {
    timestamp: '2024-03-22T12:00:00Z',
    deviceId: 'device1',
    location: {
      latitude: 35.6892,
      longitude: 51.3890
    },
    cellularInfo: {
      cellId: '12345',
      lac: '67890',
      tac: '11111',
      signalStrength: -75,
      networkType: '4G',
      rsrp: -80,
      rsrq: -10,
      sinr: 15
    },
    performanceMetrics: {
      httpUploadSpeed: 15.5,
      httpDownloadSpeed: 45.2,
      pingLatency: 35,
      dnsResponseTime: 20
    }
  },
  // Add more sample data points here
];

interface NetworkMapProps {
  activeMetric: string;
}

export default function NetworkMap({ activeMetric }: NetworkMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Initialize map if it hasn't been initialized yet
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([35.6892, 51.3890], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    // Add markers for each data point
    sampleData.forEach((point) => {
      const value = getMetricValue(point, activeMetric);
      const color = getColorForValue(value, activeMetric);
      
      const circle = L.circle(
        [point.location.latitude, point.location.longitude],
        {
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          radius: 100
        }
      );

      circle.bindPopup(`
        <div class="p-2">
          <div class="font-bold mb-1">Network Info</div>
          <div>Signal Strength: ${point.cellularInfo.signalStrength} dBm</div>
          <div>Network Type: ${point.cellularInfo.networkType}</div>
          <div>Download: ${point.performanceMetrics.httpDownloadSpeed} Mbps</div>
          <div>Upload: ${point.performanceMetrics.httpUploadSpeed} Mbps</div>
          <div>Latency: ${point.performanceMetrics.pingLatency} ms</div>
        </div>
      `);

      markersLayerRef.current?.addLayer(circle);
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeMetric]);

  return <div id="map" className="w-full h-full z-0" />;
}

function getMetricValue(point: NetworkMetrics, metric: string): number {
  switch (metric) {
    case 'signal':
      return point.cellularInfo.signalStrength;
    case 'download':
      return point.performanceMetrics.httpDownloadSpeed;
    case 'upload':
      return point.performanceMetrics.httpUploadSpeed;
    case 'latency':
      return point.performanceMetrics.pingLatency;
    default:
      return 0;
  }
}

function getColorForValue(value: number, metric: string): string {
  // Customize these thresholds based on your requirements
  switch (metric) {
    case 'signal':
      if (value >= -70) return '#22c55e'; // green-500
      if (value >= -85) return '#eab308'; // yellow-500
      if (value >= -100) return '#f97316'; // orange-500
      return '#ef4444'; // red-500
    
    case 'download':
      if (value >= 50) return '#22c55e';
      if (value >= 25) return '#eab308';
      if (value >= 10) return '#f97316';
      return '#ef4444';
    
    case 'upload':
      if (value >= 20) return '#22c55e';
      if (value >= 10) return '#eab308';
      if (value >= 5) return '#f97316';
      return '#ef4444';
    
    case 'latency':
      if (value <= 50) return '#22c55e';
      if (value <= 100) return '#eab308';
      if (value <= 150) return '#f97316';
      return '#ef4444';
    
    default:
      return '#6b7280'; // gray-500
  }
} 