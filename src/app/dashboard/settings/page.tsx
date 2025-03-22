'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ThresholdConfig } from '@/types/network';

const defaultThresholds: ThresholdConfig[] = [
  {
    id: '1',
    name: 'Low Signal Strength',
    metric: 'signalStrength',
    operator: 'lt',
    value: -100,
    severity: 'critical',
    enabled: true,
  },
  {
    id: '2',
    name: 'Poor Download Speed',
    metric: 'httpDownloadSpeed',
    operator: 'lt',
    value: 10,
    severity: 'warning',
    enabled: true,
  },
  {
    id: '3',
    name: 'High Latency',
    metric: 'pingLatency',
    operator: 'gt',
    value: 150,
    severity: 'warning',
    enabled: true,
  },
];

export default function SettingsPage() {
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>(defaultThresholds);
  const [syncInterval, setSyncInterval] = useState('300'); // 5 minutes in seconds

  const handleThresholdChange = (id: string, field: keyof ThresholdConfig, value: any) => {
    setThresholds(thresholds.map(threshold => 
      threshold.id === id ? { ...threshold, [field]: value } : threshold
    ));
  };

  const handleSaveSettings = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', { thresholds, syncInterval });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Alert Thresholds</h2>
          <div className="space-y-4">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={threshold.name}
                    onChange={(e) => handleThresholdChange(threshold.id, 'name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={threshold.operator}
                    onChange={(e) => handleThresholdChange(threshold.id, 'operator', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="lt">&lt;</option>
                    <option value="lte">≤</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">≥</option>
                    <option value="eq">=</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={threshold.value}
                    onChange={(e) => handleThresholdChange(threshold.id, 'value', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={threshold.severity}
                    onChange={(e) => handleThresholdChange(threshold.id, 'severity', e.target.value as ThresholdConfig['severity'])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={threshold.enabled}
                      onChange={(e) => handleThresholdChange(threshold.id, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Enabled</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Data Collection Settings</h2>
          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Synchronization Interval (seconds)
              </label>
              <input
                type="number"
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                min="60"
                step="60"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum interval: 60 seconds
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Map Settings</h2>
          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Map Center
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  defaultValue="35.6892"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  defaultValue="51.3890"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Zoom Level
              </label>
              <input
                type="number"
                defaultValue={12}
                min={1}
                max={18}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Export Settings</h2>
          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Export Format
              </label>
              <select
                defaultValue="csv"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="csv">CSV</option>
                <option value="kml">KML</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Include device information in exports
                </span>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 