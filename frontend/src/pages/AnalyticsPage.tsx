import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jun 4', water: 178, rainfall: 5, risk: 25 },
  { name: 'Jun 8', water: 175, rainfall: 0, risk: 20 },
  { name: 'Jun 11', water: 182, rainfall: 12, risk: 35 },
  { name: 'Jun 15', water: 188, rainfall: 28, risk: 55 },
  { name: 'Jun 19', water: 190, rainfall: 48, risk: 72 },
  { name: 'Jun 22', water: 192, rainfall: 32, risk: 65 },
  { name: 'Jun 25', water: 186, rainfall: 15, risk: 45 },
  { name: 'Jul 2', water: 185, rainfall: 45, risk: 70 },
  { name: 'Jul 4', water: 183, rainfall: 20, risk: 58 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reporting</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Historical trends, statistics, and generated reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Water Level Trends (30 Days)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="water" fill="#0EA5E9" name="Water Level (cm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Risk vs Rainfall (30 Days)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="rainfall" fill="#38BDF8" name="Rainfall (mm)" />
                <Bar dataKey="risk" fill="#EF4444" name="Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generated Report Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Total Readings</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">4,896</p>
            <p className="text-xs text-success">99.2% quality</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Alerts Triggered</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
            <p className="text-xs text-gray-500">0% false positive</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Avg Response Time</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">8 min</p>
            <p className="text-xs text-success">Ack rate 95%</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Peak Event</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">Jun 22</p>
            <p className="text-xs text-gray-500">Water: 192.1 cm</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Key Findings</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li>Most active period: June 15-22 (monsoon season)</li>
            <li>Highest risk recorded: 92% at SEN-004 (Kumasi)</li>
            <li>Data quality remains excellent at 99.2%</li>
            <li>Elevated season expected to continue through July</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
