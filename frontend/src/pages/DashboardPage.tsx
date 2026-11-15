import { useEffect } from 'react';
import { useSensorStore } from '../store';
import { useAlertStore } from '../store';
import { useUIMetricsStore } from '../store';
import { useRiskStore } from '../store';
import { MetricCard } from '../components/MetricCard';
import { AlertTimeline } from '../components/AlertTimeline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Activity, Database, Bell } from 'lucide-react';
import clsx from 'clsx';

const healthColors = {
  excellent: 'text-success',
  good: 'text-success',
  healthy: 'text-success',
  connected: 'text-success',
  warning: 'text-warning',
  poor: 'text-warning',
  degraded: 'text-warning',
  critical: 'text-error',
  offline: 'text-error',
  disconnected: 'text-error',
};

export const DashboardPage = () => {
  const { sensors, fetchSensors } = useSensorStore();
  const { alerts, fetchAlerts, acknowledgeAlert } = useAlertStore();
  const { metrics, fetchMetrics, health, fetchHealth } = useUIMetricsStore();
  const { getRisk } = useRiskStore();

  useEffect(() => {
    fetchSensors();
    fetchAlerts();
    fetchMetrics();
    fetchHealth();
  }, [fetchSensors, fetchAlerts, fetchMetrics, fetchHealth]);

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Real-time flood monitoring and early warning system
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={i} data={m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sensor Network Map
            </h2>
          </div>
          <div className="h-80 rounded-lg overflow-hidden">
            <MapContainer
              center={[6.8, -1.2]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {sensors.map((sensor) => {
                const risk = getRisk(sensor.sensor_key);
                const level = risk?.level || 'low';
                if (sensor.status === 'offline' || sensor.status === 'maintenance') {
                  return null;
                }
                return (
                  <Marker
                    key={sensor.sensor_key}
                    position={[sensor.latitude, sensor.longitude]}
                  >
                    <Popup>
                      <div className="dark:text-gray-900">
                        <p className="font-semibold">{sensor.name}</p>
                        <p className="text-xs text-gray-600">{sensor.region}</p>
                        <p className="text-xs mt-1">Risk Level: {level}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Alerts
            </h2>
            {activeAlerts.length > 0 && (
              <span className="ml-auto text-sm bg-error text-white px-2 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <AlertTimeline
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
          />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Health
        </h2>
        {health ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className={clsx('w-5 h-5', healthColors[health.connectivity.status])} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Connectivity
                </span>
              </div>
              <p className={clsx('text-lg font-bold', healthColors[health.connectivity.status])}>
                {health.connectivity.status.charAt(0).toUpperCase() + health.connectivity.status.slice(1)}
              </p>
              <p className="text-xs text-gray-500">
                {health.connectivity.online_count}/{health.connectivity.total_count} online
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Database className={clsx('w-5 h-5', healthColors[health.database.status])} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Database
                </span>
              </div>
              <p className={clsx('text-lg font-bold', healthColors[health.database.status])}>
                {health.database.status.charAt(0).toUpperCase() + health.database.status.slice(1)}
              </p>
              <p className="text-xs text-gray-500">
                {health.database.used_gb}GB / {health.database.total_gb}GB
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className={clsx('w-5 h-5', healthColors[health.mqtt.status])} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  MQTT Broker
                </span>
              </div>
              <p className={clsx('text-lg font-bold', healthColors[health.mqtt.status])}>
                {health.mqtt.status === 'connected' ? 'Connected' : health.mqtt.status}
              </p>
              <p className="text-xs text-gray-500">
                {health.mqtt.messages_per_min} msg/min
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className={clsx('w-5 h-5', health.api.uptime > 99 ? 'text-success' : 'text-warning')} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  API Uptime
                </span>
              </div>
              <p className={clsx('text-lg font-bold', health.api.uptime > 99 ? 'text-success' : 'text-warning')}>
                {health.api.uptime}%
              </p>
              <p className="text-xs text-gray-500">
                Avg Latency: {health.api.avg_latency_ms}ms
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Loading system health...</div>
        )}
      </div>
    </div>
  );
};
