import { create } from 'zustand';
import type { Sensor, Reading, Alert, RiskPrediction, SystemHealth, ForecastPoint, MetricCardData } from '../types';
import { mockSensors, mockReadings, mockAlerts, mockRiskPredictions, mockSystemHealth, mockForecast, mockMetricCards } from '../services/mockData';

interface SensorStore {
  sensors: Sensor[];
  loading: boolean;
  error: string | null;
  fetchSensors: () => Promise<void>;
  getSensor: (key: string) => Sensor | undefined;
}

export const useSensorStore = create<SensorStore>((set, get) => ({
  sensors: mockSensors,
  loading: false,
  error: null,
  fetchSensors: async () => {
    set({ loading: true, error: null });
    await new Promise((r) => setTimeout(r, 300));
    set({ sensors: mockSensors, loading: false });
  },
  getSensor: (key) => get().sensors.find((s) => s.sensor_key === key),
}));

interface ReadingStore {
  readings: Record<string, Reading>;
  loading: boolean;
  fetchReading: (key: string) => Promise<void>;
  getReading: (key: string) => Reading | undefined;
}

export const useReadingStore = create<ReadingStore>((set, get) => ({
  readings: {},
  loading: false,
  fetchReading: async (key) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 200));
    const reading = mockReadings[key];
    set((s) => ({
      readings: { ...s.readings, [key]: reading },
      loading: false,
    }));
  },
  getReading: (key) => get().readings[key] || mockReadings[key],
}));

interface AlertStore {
  alerts: Alert[];
  unacknowledgedCount: number;
  loading: boolean;
  fetchAlerts: () => Promise<void>;
  acknowledgeAlert: (id: number) => Promise<void>;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: mockAlerts,
  unacknowledgedCount: mockAlerts.filter((a) => a.status === 'active').length,
  loading: false,
  fetchAlerts: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({
      alerts: mockAlerts,
      unacknowledgedCount: mockAlerts.filter((a) => a.status === 'active').length,
      loading: false,
    });
  },
  acknowledgeAlert: async (id) => {
    await new Promise((r) => setTimeout(r, 300));
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? { ...a, status: 'acknowledged' as const, acknowledged_at: new Date().toISOString(), acknowledged_by: 'Current User' }
          : a
      ),
      unacknowledgedCount: Math.max(0, state.unacknowledgedCount - 1),
    }));
  },
}));

interface RiskStore {
  predictions: Record<string, RiskPrediction>;
  forecasts: Record<string, ForecastPoint[]>;
  loading: boolean;
  fetchRisk: (key: string) => Promise<RiskPrediction | undefined>;
  fetchForecast: (key: string) => Promise<ForecastPoint[] | undefined>;
  getRisk: (key: string) => RiskPrediction | undefined;
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  predictions: {},
  forecasts: {},
  loading: false,
  fetchRisk: async (key) => {
    await new Promise((r) => setTimeout(r, 200));
    const prediction = mockRiskPredictions[key];
    set((s) => ({
      predictions: { ...s.predictions, [key]: prediction },
      loading: false,
    }));
    return prediction;
  },
  fetchForecast: async (key) => {
    await new Promise((r) => setTimeout(r, 200));
    const forecast = mockForecast[key];
    set((s) => ({
      forecasts: { ...s.forecasts, [key]: forecast },
      loading: false,
    }));
    return forecast;
  },
  getRisk: (key) => get().predictions[key] || mockRiskPredictions[key],
}));

interface UIMetricsStore {
  metrics: MetricCardData[];
  health: SystemHealth | null;
  loading: boolean;
  fetchMetrics: () => Promise<void>;
  fetchHealth: () => Promise<void>;
}

export const useUIMetricsStore = create<UIMetricsStore>((set) => ({
  metrics: mockMetricCards,
  health: null,
  loading: false,
  fetchMetrics: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ metrics: mockMetricCards, loading: false });
  },
  fetchHealth: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 400));
    set({ health: mockSystemHealth, loading: false });
  },
}));
