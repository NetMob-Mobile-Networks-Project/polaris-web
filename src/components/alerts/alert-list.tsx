'use client';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

interface AlertListProps {
  alerts: Alert[];
}

export function AlertList({ alerts }: AlertListProps) {
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-900';
      case 'warning':
        return 'bg-yellow-50 text-yellow-900';
      case 'info':
        return 'bg-blue-50 text-blue-900';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  const getSeverityBadgeColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between p-4 rounded-lg ${getSeverityColor(alert.severity)}`}
        >
          <div>
            <p className="text-sm font-medium">{alert.title}</p>
            <p className="text-sm opacity-90">{alert.message}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadgeColor(
              alert.severity
            )}`}
          >
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </span>
        </div>
      ))}
    </div>
  );
} 