export interface Sensor {
  sensor_key: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  status: 'online' | 'offline' | 'maintenance';
  last_seen: string;
  installed_at: string;
  region: string;
  description?: string;
  battery_voltage?: number;
  signal_strength?: number;
  firmware_version?: string;
}

export interface Reading {
  id: number;
  sensor_key: string;
  water_level_cm: number;
  rainfall_mm: number;
  temperature_c: number;
  humidity_percent: number;
  soil_moisture: number;
  battery_voltage: number;
  created_at: string;
}

export interface Alert {
  id: number;
  sensor_key: string;
  sensor_name?: string;
  severity: 1 | 2 | 3 | 4;
  message: string;
  triggered_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface RiskPrediction {
  id: number;
  sensor_key: string;
  score: number;
  confidence: number;
  predicted_at: string;
  created_at: string;
  level: 'low' | 'moderate' | 'high' | 'critical';
  contributing_factors: ContributingFactor[];
  predicted_flood_time?: string;
  flood_probability: number;
}

export interface ContributingFactor {
  name: string;
  value: number;
  weight: number;
}

export interface SensorMarkerProps {
  sensorKey: string;
  position: [number, number];
  riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
  onClick?: () => void;
  sensorName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'viewer';
  preferences: UserPreferences;
}

export interface UserPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  whatsappAlerts: boolean;
  dashboardNotifications: boolean;
  alertThreshold: number;
  theme: 'auto' | 'light' | 'dark';
  language: string;
  defaultSensor: string | null;
  mapZoom: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendUp?: boolean;
  status: 'healthy' | 'warning' | 'critical';
  icon: string;
  onClick?: () => void;
}

export interface SystemHealth {
  connectivity: {
    status: 'excellent' | 'good' | 'poor' | 'critical';
    online_count: number;
    total_count: number;
  };
  database: {
    status: 'healthy' | 'warning' | 'critical';
    used_gb: number;
    total_gb: number;
    response_ms: number;
  };
  mqtt: {
    status: 'connected' | 'disconnected' | 'degraded';
    messages_per_min: number;
  };
  api: {
    uptime: number;
    avg_latency_ms: number;
  };
}

export interface ForecastPoint {
  hour: string;
  rainfall_mm: number;
  risk_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  trend: 'rising' | 'falling' | 'stable';
}
