import React from 'react';
import type { SensorMarkerProps } from '../types';

const riskColors = {
  low: '#10B981',
  moderate: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

export const SensorMarker: React.FC<SensorMarkerProps> = ({
  riskLevel = 'low',
  onClick,
  sensorName,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      <div
        className="w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125"
        style={{ backgroundColor: riskColors[riskLevel] }}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {sensorName}
        </div>
      </div>
    </div>
  );
};
