import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAlertStore } from '../store';
import { AlertCard } from '../components/AlertCard';

type FilterStatus = 'all' | 'active' | 'acknowledged' | 'resolved';
type FilterSeverity = 'all' | '1' | '2' | '3' | '4';

export const AlertsPage: React.FC = () => {
  const { alerts, fetchAlerts, acknowledgeAlert, unacknowledgedCount } = useAlertStore();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const filtered = alerts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (severityFilter !== 'all' && a.severity !== parseInt(severityFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.message.toLowerCase().includes(q) ||
        (a.sensor_name && a.sensor_name.toLowerCase().includes(q)) ||
        a.sensor_key.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = alerts.length;
  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const avgResponse = '8 min';
  const ackRate = '95%';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor and manage flood alerts across all sensors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalCount}</p>
          <p className="text-xs text-gray-500">This month: 34</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Active Alerts</p>
          <p className={clsx('text-2xl font-bold mt-1', activeCount > 0 ? 'text-error' : 'text-success')}>
            {activeCount}
          </p>
          <p className="text-xs text-gray-500">Unacknowledged: {unacknowledgedCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgResponse}</p>
          <p className="text-xs text-gray-500">Ack rate: {ackRate}</p>
        </div>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as FilterSeverity)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="all">All Severities</option>
          <option value="1">Info</option>
          <option value="2">Moderate</option>
          <option value="3">High</option>
          <option value="4">Critical</option>
        </select>
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm flex-1"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No alerts match your filters.</div>
        ) : (
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
            />
          ))
        )}
      </div>
    </div>
  );
};
