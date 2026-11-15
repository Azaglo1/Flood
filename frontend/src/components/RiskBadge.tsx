import React from 'react';
import clsx from 'clsx';

interface RiskBadgeProps {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  low: 'bg-success text-white',
  moderate: 'bg-warning text-white',
  high: 'bg-risk-high text-white',
  critical: 'bg-error text-white',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold',
        colorMap[level],
        sizeMap[size]
      )}
    >
      {score !== undefined && `${score}% `}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};
