import React from 'react';
import clsx from 'clsx';
import { Alert } from '../types';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: number) => void;
}

const severityConfig = {
  1: { bg: 'bg-success', text: 'text-success', label: 'Info' },
  2: { bg: 'bg-warning', text: 'text-warning', label: 'Moderate' },
  3: { bg: 'bg-risk-high', text: 'text-risk-high', label: 'High' },
  4: { bg: 'bg-error', text: 'text-error', label: 'Critical' },
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge }) => {
  const config = severityConfig[alert.severity];

  return (
    <div className="card p-4 border-l-4" style={{ borderLeftColor: config.bg.replace('bg-', '') === 'bg-success' ? '#10B981' : config.bg.replace('bg-', '') === 'bg-warning' ? '#F59E0B' : config.bg.replace('bg-', '') === 'bg-risk-high' ? '#EF4444' : '#DC2626' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx('text-xs font-bold px-2 py-0.5 rounded', config.bg, 'text-white')}>
              {config.label}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(alert.triggered_at).toLocaleString()}
            </span>
            {alert.status === 'acknowledged' && (
              <span className="text-xs text-success font-medium">Acknowledged</span>
            )}
            {alert.status === 'resolved' && (
              <span className="text-xs text-gray-500 font-medium">Resolved</span>
            )}
          </div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
            {alert.sensor_name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
          {alert.acknowledged_at && (
            <p className="text-xs text-gray-500 mt-1">
              Acknowledged by {alert.acknowledged_by} at {new Date(alert.acknowledged_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4">
          {alert.status === 'active' && (
            <button
              onClick={() => onAcknowledge?.(alert.id)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
