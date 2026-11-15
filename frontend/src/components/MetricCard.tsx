import React from 'react';
import clsx from 'clsx';
import { MetricCardData } from '../types';

interface MetricCardProps {
  data: MetricCardData;
}

const statusColor = {
  healthy: 'text-success',
  warning: 'text-warning',
  critical: 'text-error',
};

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  return (
    <div
      onClick={data.onClick}
      className="card p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{data.title}</p>
          <p className="metric-value mt-1">
            {data.value}
            {data.unit && <span className="text-sm font-normal text-gray-500 ml-1">{data.unit}</span>}
          </p>
        </div>
        <span className="text-2xl">{data.icon}</span>
      </div>
      {data.trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-sm">
          <span className={clsx(data.trendUp ? 'text-success' : 'text-error')}>
            {data.trendUp ? '↑' : '↓'} {Math.abs(data.trend)}%
          </span>
          <span className="text-gray-500">vs last period</span>
        </div>
      )}
      <div className="mt-2">
        <span className={clsx('text-xs font-medium', statusColor[data.status])}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>
    </div>
  );
};
