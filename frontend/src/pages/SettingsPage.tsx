import React from 'react';
import { mockUser } from '../services/mockData';
import type { UserPreferences } from '../types';

export const SettingsPage: React.FC = () => {
  const user = mockUser;
  const [prefs, setPrefs] = React.useState<UserPreferences>(user.preferences);

  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your preferences and configuration
        </p>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profile
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value={user.role}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization
            </label>
            <input
              type="text"
              value="Accra Municipality"
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {([
            { key: 'emailAlerts', label: 'Email alerts (High/Critical)' },
            { key: 'smsAlerts', label: 'SMS alerts (Critical only)' },
            { key: 'whatsappAlerts', label: 'WhatsApp alerts (All levels)' },
            { key: 'dashboardNotifications', label: 'Dashboard notifications' },
          ] as const).map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">{item.label}</label>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => updatePref(item.key, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alert Threshold
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={prefs.alertThreshold}
              onChange={(e) => updatePref('alertThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Notify me when risk score exceeds {prefs.alertThreshold}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <select
              value={prefs.theme}
              onChange={(e) => updatePref('theme', e.target.value as UserPreferences['theme'])}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              value={prefs.language}
              onChange={(e) => updatePref('language', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="en">English</option>
              <option value="akan">Akan</option>
              <option value="french">French</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Location
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Sensor
            </label>
            <select
              value={prefs.defaultSensor || ''}
              onChange={(e) => updatePref('defaultSensor', e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Select sensor...</option>
              <option value="SEN-001">SEN-001 - Accra River</option>
              <option value="SEN-002">SEN-002 - Tema Beach</option>
              <option value="SEN-003">SEN-003 - Weija Reservoir</option>
              <option value="SEN-004">SEN-004 - Kumasi Subin</option>
              <option value="SEN-005">SEN-005 - Atonsu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Map Zoom Level
            </label>
            <input
              type="number"
              min={1}
              max={18}
              value={prefs.mapZoom}
              onChange={(e) => updatePref('mapZoom', parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Manage Sensors
        </h2>
        <div className="flex justify-end mb-4">
          <button className="btn-primary text-sm">Add New Sensor</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">Key</th>
                <th className="text-left py-2 px-2">Location</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Last Read</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-2 font-mono text-xs">SEN-001</td>
                <td className="py-2 px-2">Accra</td>
                <td className="py-2 px-2 text-success">Online</td>
                <td className="py-2 px-2">2 min ago</td>
                <td className="py-2 px-2">
                  <button className="text-xs text-primary hover:underline mr-2">Edit</button>
                  <button className="text-xs text-primary hover:underline mr-2">Calibrate</button>
                  <button className="text-xs text-error hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-2 font-mono text-xs">SEN-002</td>
                <td className="py-2 px-2">Tema</td>
                <td className="py-2 px-2 text-success">Online</td>
                <td className="py-2 px-2">3 min ago</td>
                <td className="py-2 px-2">
                  <button className="text-xs text-primary hover:underline mr-2">Edit</button>
                  <button className="text-xs text-primary hover:underline mr-2">Calibrate</button>
                  <button className="text-xs text-error hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-2 font-mono text-xs">SEN-003</td>
                <td className="py-2 px-2">Kumasi</td>
                <td className="py-2 px-2 text-warning">Warning</td>
                <td className="py-2 px-2">8 min ago</td>
                <td className="py-2 px-2">
                  <button className="text-xs text-primary hover:underline mr-2">Edit</button>
                  <button className="text-xs text-primary hover:underline mr-2">Calibrate</button>
                  <button className="text-xs text-error hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
