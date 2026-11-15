import React, { useState } from 'react';
import { Alert } from '../types';
import { AlertCard } from './AlertCard';

interface AlertTimelineProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onAcknowledge?: (id: number) => void;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({
  alerts,
  onAlertClick,
  onAcknowledge,
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? alerts : alerts.slice(0, 3);

  return (
    <div>
      <div className="space-y-3">
        {visible.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick?.(alert)}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <AlertCard alert={alert} onAcknowledge={onAcknowledge} />
          </div>
        ))}
      </div>
      {alerts.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-primary hover:text-primary-dark font-medium"
        >
          {showAll ? 'Show Less' : `Load More (${alerts.length - 3} more)`}
        </button>
      )}
    </div>
  );
};
