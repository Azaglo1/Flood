import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useSensorStore } from '../store';
import { useReadingStore } from '../store';
import { useRiskStore } from '../store';
import { RiskBadge } from '../components/RiskBadge';
import { TrendChart } from '../components/TrendChart';

const riskLevelFromScore = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score <= 20) return 'low';
  if (score <= 50) return 'moderate';
  if (score <= 80) return 'high';
  return 'critical';
};

export const SensorDetailsPage: React.FC = () => {
  const { sensorId } = useParams<{ sensorId: string }>();
  const navigate = useNavigate();
  const { getSensor, fetchSensors } = useSensorStore();
  const { getReading, fetchReading } = useReadingStore();
  const { getRisk, fetchRisk, forecasts, fetchForecast } = useRiskStore();

  const sensor = sensorId ? getSensor(sensorId) : undefined;
  const reading = sensorId ? getReading(sensorId) : undefined;
  const risk = sensorId ? getRisk(sensorId) : undefined;

  useEffect(() => {
    fetchSensors();
    if (sensorId) {
      fetchReading(sensorId);
      fetchRisk(sensorId);
      fetchForecast(sensorId);
    }
  }, [fetchSensors, fetchReading, fetchRisk, fetchForecast, sensorId]);

  if (!sensor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sensor not found</p>
      </div>
    );
  }

  const currentRiskLevel = risk ? riskLevelFromScore(risk.score) : 'low';
  const forecast = sensorId ? forecasts[sensorId] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {sensor.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sensor.region} | Status: {sensor.status} | Last seen: {sensor.last_seen ? new Date(sensor.last_seen).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {reading && risk && (
        <>
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Readings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCardCustom label="Water Level" value={`${reading.water_level_cm.toFixed(1)} cm`} status={reading.water_level_cm > 190 ? 'critical' : reading.water_level_cm > 170 ? 'warning' : 'healthy'} />
              <MetricCardCustom label="Rainfall (24h)" value={`${reading.rainfall_mm.toFixed(1)} mm`} status={reading.rainfall_mm > 40 ? 'critical' : reading.rainfall_mm > 20 ? 'warning' : 'healthy'} />
              <MetricCardCustom label="Temperature" value={`${reading.temperature_c.toFixed(1)} C`} status="healthy" />
              <MetricCardCustom label="Humidity" value={`${reading.humidity_percent.toFixed(1)}%`} status={reading.humidity_percent > 80 ? 'warning' : 'healthy'} />
              <MetricCardCustom label="Soil Moisture" value={`${reading.soil_moisture.toFixed(1)}%`} status={reading.soil_moisture > 70 ? 'critical' : 'healthy'} />
              <MetricCardCustom label="Battery" value={`${reading.battery_voltage.toFixed(1)}V`} status={reading.battery_voltage < 5 ? 'critical' : reading.battery_voltage < 6 ? 'warning' : 'healthy'} />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Risk Assessment
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Risk Score</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{risk.score}</span>
                  <RiskBadge level={currentRiskLevel} score={risk.score} size="lg" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={clsx(
                      'h-4 rounded-full transition-all',
                      currentRiskLevel === 'low' ? 'bg-success' :
                      currentRiskLevel === 'moderate' ? 'bg-warning' :
                      currentRiskLevel === 'high' ? 'bg-risk-high' : 'bg-error'
                    )}
                    style={{ width: `${risk.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Confidence: {risk.confidence}%</span>
                  <span>Flood Probability: {risk.flood_probability}%</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Contributing Factors
              </h3>
              <div className="space-y-2">
                {risk.contributing_factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{factor.name}</span>
                        <span className="text-gray-500">{factor.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">{factor.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Trend Analysis
            </h2>
            <TrendChart
              data={(useSensorStore.getState() as any).mockTrendData?.[sensor.sensor_key] || []}
              unit="cm"
              showForecast={true}
            />
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              24-Hour Forecast
            </h2>
            {forecast.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2">Hour</th>
                      <th className="text-left py-2 px-2">Rainfall</th>
                      <th className="text-left py-2 px-2">Risk Score</th>
                      <th className="text-left py-2 px-2">Level</th>
                      <th className="text-left py-2 px-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map((point, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-2">{point.hour}</td>
                        <td className="py-2 px-2">{point.rainfall_mm} mm</td>
                        <td className="py-2 px-2">
                          <span className={clsx(
                            'font-semibold',
                            point.risk_level === 'low' ? 'text-success' :
                            point.risk_level === 'moderate' ? 'text-warning' :
                            point.risk_level === 'high' ? 'text-risk-high' : 'text-error'
                          )}>{point.risk_score}</span>
                        </td>
                        <td className="py-2 px-2">
                          <RiskBadge level={point.risk_level} size="sm" />
                        </td>
                        <td className="py-2 px-2">
                          <span className={clsx(
                            point.trend === 'rising' ? 'text-error' :
                            point.trend === 'falling' ? 'text-success' : 'text-gray-500'
                          )}>
                            {point.trend === 'rising' ? '↑' : point.trend === 'falling' ? '↓' : '→'}
                            {' '}{point.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Forecast data loading...</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Device Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">98.7%</p>
                <p className="text-xs text-gray-500">7 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Firmware</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{sensor.firmware_version || 'N/A'}</p>
                <button className="text-xs text-primary hover:underline mt-1">Check for Updates</button>
              </div>
              <div>
                <p className="text-sm text-gray-500">Battery</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{((sensor.battery_voltage || 0) / 7.4 * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Est. 15 days remaining</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Signal Strength</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{sensor.signal_strength || 0} dBm</p>
                <p className="text-xs text-gray-500">{sensor.signal_strength && sensor.signal_strength > -70 ? 'Good' : 'Weak'}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MetricCardCustom: React.FC<{ label: string; value: string; status: 'healthy' | 'warning' | 'critical' }> = ({ label, value, status }) => {
  const colors = {
    healthy: 'text-success',
    warning: 'text-warning',
    critical: 'text-error',
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={clsx('text-xl font-bold mt-1', colors[status])}>{value}</p>
    </div>
  );
};
