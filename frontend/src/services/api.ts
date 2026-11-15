import axios from 'axios';
import type { Sensor, Reading, Alert, RiskPrediction, ForecastPoint, SystemHealth } from '../types';

export interface SensorResponse extends Sensor {}
export interface ReadingResponse extends Reading {}
export interface AlertResponse extends Alert {}
export interface RiskResponse extends RiskPrediction {}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sensorApi = {
  getAll: () => api.get<SensorResponse[]>('/sensors'),
  getById: (key: string) => api.get<SensorResponse>(`/sensors/${key}`),
  getReadings: (key: string) =>
    api.get<ReadingResponse[]>(`/sensors/${key}/readings`),
  getForecast: (key: string) => api.get<ForecastPoint[]>(`/sensors/${key}/forecast`),
};

export const alertApi = {
  getAll: (params?: { status?: string; severity?: number; sensor?: string; period?: string }) =>
    api.get<AlertResponse[]>('/alerts', { params }),
  acknowledge: (id: number) => api.post<AlertResponse>(`/alerts/${id}/acknowledge`),
  getStats: (params?: { period?: string }) => api.get('/alerts/stats', { params }),
};

export const readingApi = {
  getLive: (key: string) => api.get<ReadingResponse>(`/readings/live/${key}`),
  getTrend: (key: string, args?: { metric: string; period: string; granularity: string }) =>
    api.get<any>(`/readings/trend/${key}`, { params: args }),
};

export const riskApi = {
  getCurrent: (key: string) => api.get<RiskResponse>(`/risks/${key}`),
  getPrediction: (key: string) => api.get<RiskResponse>(`/risks/predict/${key}`),
};

export const healthApi = {
  getStatus: () => api.get<SystemHealth>('/health/status'),
};

export const analyticsApi = {
  getSummary: (params?: { sensor?: string; period: string }) =>
    api.get('/analytics/summary', { params }),
};
