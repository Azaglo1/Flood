import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendChartProps {
  data: { time: string; value: number; forecast?: number }[];
  unit: string;
  color?: string;
  showForecast?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  unit,
  color = '#0EA5E9',
  showForecast = false,
}) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            tickFormatter={(val) =>
              new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <YAxis
            unit={` ${unit}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="water_level"
            stroke={color}
            strokeWidth={2}
            dot={false}
            name="Water Level"
            unit={` ${unit}`}
          />
          {showForecast && (
            <Line
              type="monotone"
              dataKey="risk_score"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Risk Score"
              unit=" %"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
