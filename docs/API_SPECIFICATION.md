# FloodSense Ghana - API Specification v1.0

## API Overview

**Base URL:** `https://api.floodsense.com/v1`  
**Version:** 1.0  
**Authentication:** JWT Bearer Token  
**Response Format:** JSON  
**Rate Limiting:** 1,000 requests/hour per API key

---

## Authentication

### Login Endpoint

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "coordinator"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Using the Token

All requests must include the JWT token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

---

## Sensor Management API

### Register New Sensor

```http
POST /sensors
Authorization: Bearer <token>
Content-Type: application/json

{
  "sensor_key": "SEN-001",
  "location_name": "Accra River - Osu Bridge",
  "latitude": 5.5571,
  "longitude": -0.2083,
  "sensor_type": "comprehensive",
  "description": "Main monitoring station",
  "hardware_model": "ESP32-WROOM-32E",
  "installed_by": "John Appiah"
}
```

**Response (201 Created):**
```json
{
  "id": "sensor-uuid-123",
  "sensor_key": "SEN-001",
  "location_name": "Accra River - Osu Bridge",
  "latitude": 5.5571,
  "longitude": -0.2083,
  "sensor_type": "comprehensive",
  "is_active": true,
  "created_at": "2026-07-04T10:30:00Z"
}
```

---

### List All Sensors

```http
GET /sensors?status=active&limit=50&offset=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "sensor-uuid-123",
      "sensor_key": "SEN-001",
      "location_name": "Accra River - Osu Bridge",
      "latitude": 5.5571,
      "longitude": -0.2083,
      "is_active": true,
      "last_data_received": "2026-07-04T14:25:00Z",
      "battery_voltage": 7.2,
      "signal_strength": -65
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

---

### Get Sensor Details

```http
GET /sensors/{sensor_id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "sensor-uuid-123",
  "sensor_key": "SEN-001",
  "location_name": "Accra River - Osu Bridge",
  "latitude": 5.5571,
  "longitude": -0.2083,
  "sensor_type": "comprehensive",
  "installation_date": "2026-06-01",
  "is_active": true,
  "firmware_version": "1.2.3",
  "last_data_received": "2026-07-04T14:25:00Z",
  "battery_voltage": 7.2,
  "signal_strength": -65,
  "reporting_interval_seconds": 600
}
```

---

### Update Sensor

```http
PUT /sensors/{sensor_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "location_name": "Accra River - Osu Bridge (Updated)",
  "reporting_interval_seconds": 300
}
```

**Response (200 OK):**
```json
{
  "id": "sensor-uuid-123",
  "sensor_key": "SEN-001",
  "location_name": "Accra River - Osu Bridge (Updated)",
  "reporting_interval_seconds": 300,
  "updated_at": "2026-07-04T15:00:00Z"
}
```

---

### Delete Sensor

```http
DELETE /sensors/{sensor_id}
Authorization: Bearer <token>
```

**Response (204 No Content)**

---

## Data Ingestion API

### Submit Sensor Readings

This endpoint is typically called by ESP32 nodes with sensor data.

```http
POST /data/readings
Authorization: Bearer <sensor_api_key>
Content-Type: application/json

{
  "sensor_key": "SEN-001",
  "timestamp": "2026-07-04T14:30:00Z",
  "water_level_cm": 185.5,
  "rainfall_mm": 2.3,
  "temperature_c": 28.5,
  "humidity_percent": 75.2,
  "soil_moisture_percent": 62.1,
  "battery_voltage": 7.2,
  "rssi": -65
}
```

**Response (201 Created):**
```json
{
  "id": 12345,
  "sensor_id": "sensor-uuid-123",
  "timestamp": "2026-07-04T14:30:00Z",
  "received_at": "2026-07-04T14:30:05Z",
  "data_quality_score": 0.95,
  "is_anomaly": false
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid sensor_key or missing required fields"
}
```

---

### Get Latest Readings (All Sensors)

```http
GET /data/latest
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "sensor_id": "sensor-uuid-123",
      "sensor_key": "SEN-001",
      "location_name": "Accra River - Osu Bridge",
      "timestamp": "2026-07-04T14:30:00Z",
      "water_level_cm": 185.5,
      "rainfall_mm": 2.3,
      "temperature_c": 28.5,
      "humidity_percent": 75.2,
      "soil_moisture_percent": 62.1
    }
  ],
  "timestamp": "2026-07-04T14:30:05Z"
}
```

---

### Get Readings for Specific Sensor

```http
GET /data/sensor/{sensor_id}?limit=100&order=desc
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 12345,
      "timestamp": "2026-07-04T14:30:00Z",
      "water_level_cm": 185.5,
      "rainfall_mm": 2.3,
      "temperature_c": 28.5,
      "humidity_percent": 75.2,
      "soil_moisture_percent": 62.1,
      "battery_voltage": 7.2,
      "is_anomaly": false
    }
  ],
  "total": 450,
  "limit": 100,
  "offset": 0
}
```

---

### Get Historical Data (Time Range)

```http
GET /data/range?sensor_id={sensor_id}&from=2026-07-01T00:00:00Z&to=2026-07-04T23:59:59Z&granularity=hourly
Authorization: Bearer <token>
```

**Query Parameters:**
- `sensor_id` (required): UUID of sensor
- `from` (required): ISO 8601 timestamp
- `to` (required): ISO 8601 timestamp
- `granularity` (optional): `raw`, `hourly`, `daily` (default: `raw`)

**Response (200 OK):**
```json
{
  "sensor_id": "sensor-uuid-123",
  "data": [
    {
      "timestamp": "2026-07-01T00:00:00Z",
      "water_level_cm": 180.2,
      "rainfall_mm": 0.5,
      "temperature_c": 26.1,
      "humidity_percent": 72.0,
      "reading_count": 6
    }
  ],
  "count": 96
}
```

---

## Risk & Prediction API

### Get Current Risk Levels

```http
GET /risks/current
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "timestamp": "2026-07-04T14:30:00Z",
  "data": [
    {
      "sensor_id": "sensor-uuid-123",
      "sensor_key": "SEN-001",
      "location_name": "Accra River - Osu Bridge",
      "risk_score": 72,
      "risk_level": "orange",
      "confidence": 0.85,
      "predicted_flood_time": "2026-07-04T15:30:00Z",
      "flood_probability": 0.78
    }
  ]
}
```

---

### Get Risk Forecast (24h Ahead)

```http
GET /risks/forecast?hours=24
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "sensor_id": "sensor-uuid-123",
      "location_name": "Accra River - Osu Bridge",
      "forecast": [
        {
          "timestamp": "2026-07-04T15:00:00Z",
          "predicted_risk_score": 75,
          "predicted_risk_level": "orange"
        },
        {
          "timestamp": "2026-07-04T16:00:00Z",
          "predicted_risk_score": 82,
          "predicted_risk_level": "red"
        }
      ]
    }
  ]
}
```

---

### Get Prediction for Specific Sensor

```http
GET /risks/sensor/{sensor_id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "sensor_id": "sensor-uuid-123",
  "current_prediction": {
    "timestamp": "2026-07-04T14:30:00Z",
    "risk_score": 72,
    "risk_level": "orange",
    "confidence": 0.85,
    "predicted_flood_time": "2026-07-04T15:30:00Z",
    "factors": {
      "rainfall_24h_mm": 45.3,
      "water_level_cm": 185.5,
      "water_level_change_rate": 2.1,
      "soil_moisture_percent": 62.1,
      "temperature_c": 28.5,
      "forecast_rainfall_6h_mm": 5.2
    },
    "model_version": "1.0.0"
  },
  "previous_predictions": [
    {
      "timestamp": "2026-07-04T14:20:00Z",
      "risk_score": 68,
      "risk_level": "orange"
    }
  ]
}
```

---

## Alerts API

### Get Alert History

```http
GET /alerts?limit=50&offset=0&status=active&severity=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 50): Max results
- `offset` (optional, default: 0): Pagination offset
- `status` (optional): `active`, `acknowledged`, `dismissed`, `expired`
- `severity` (optional): `low`, `medium`, `high`, `critical`
- `sensor_id` (optional): Filter by sensor

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "alert-uuid-123",
      "sensor_id": "sensor-uuid-123",
      "sensor_key": "SEN-001",
      "location_name": "Accra River - Osu Bridge",
      "alert_type": "flood_warning",
      "severity": "high",
      "title": "High Flood Risk",
      "message": "Water level rising rapidly. Flood risk: 72%",
      "status": "active",
      "triggered_at": "2026-07-04T14:30:00Z",
      "expires_at": "2026-07-04T16:30:00Z"
    }
  ],
  "total": 3,
  "limit": 50,
  "offset": 0
}
```

---

### Get Active Alerts

```http
GET /alerts/active
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "alert-uuid-123",
      "sensor_id": "sensor-uuid-123",
      "location_name": "Accra River - Osu Bridge",
      "alert_type": "flood_warning",
      "severity": "high",
      "triggered_at": "2026-07-04T14:30:00Z"
    }
  ],
  "count": 5,
  "highest_severity": "critical"
}
```

---

### Acknowledge Alert

```http
POST /alerts/{alert_id}/acknowledge
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Alerted community leaders",
  "action_taken": "Road closure implemented"
}
```

**Response (200 OK):**
```json
{
  "id": "alert-uuid-123",
  "status": "acknowledged",
  "acknowledged_by": "user-uuid",
  "acknowledged_at": "2026-07-04T14:35:00Z"
}
```

---

### Dismiss Alert

```http
POST /alerts/{alert_id}/dismiss
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "False alarm - manual check shows water level stable"
}
```

**Response (200 OK):**
```json
{
  "id": "alert-uuid-123",
  "status": "dismissed",
  "dismissed_at": "2026-07-04T14:35:00Z"
}
```

---

## Analytics API

### Get Historical Trends

```http
GET /analytics/trends?sensor_id={sensor_id}&days=30&metric=water_level
Authorization: Bearer <token>
```

**Query Parameters:**
- `sensor_id` (required): UUID of sensor
- `days` (optional, default: 7): Historical period
- `metric` (optional): `water_level`, `rainfall`, `temperature`, `risk_score`

**Response (200 OK):**
```json
{
  "sensor_id": "sensor-uuid-123",
  "metric": "water_level",
  "period_days": 30,
  "data": [
    {
      "date": "2026-06-04",
      "avg": 178.2,
      "min": 175.0,
      "max": 182.5
    }
  ],
  "summary": {
    "current": 185.5,
    "avg_30_days": 179.8,
    "max_30_days": 192.1,
    "trend": "rising"
  }
}
```

---

### Get Summary Statistics

```http
GET /analytics/stats?sensor_id={sensor_id}&period=month
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "sensor_id": "sensor-uuid-123",
  "period": "month",
  "statistics": {
    "water_level": {
      "avg": 179.8,
      "min": 175.0,
      "max": 192.1,
      "std_dev": 4.2
    },
    "rainfall": {
      "total": 125.3,
      "avg_per_day": 4.18,
      "rain_days": 20
    },
    "temperature": {
      "avg": 27.5,
      "min": 22.0,
      "max": 32.1
    },
    "alerts_triggered": 3,
    "false_positives": 0
  }
}
```

---

### Generate Report

```http
POST /analytics/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "sensor_ids": ["sensor-uuid-123"],
  "start_date": "2026-07-01",
  "end_date": "2026-07-04",
  "format": "pdf",
  "include_sections": ["summary", "trends", "alerts", "recommendations"]
}
```

**Response (202 Accepted):**
```json
{
  "report_id": "report-uuid",
  "status": "processing",
  "download_url": null,
  "estimated_completion": "2026-07-04T15:30:00Z"
}
```

**Poll for report completion:**
```http
GET /analytics/report/{report_id}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "Missing required field: sensor_key"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "details": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "details": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "details": "Sensor with ID 'xyz' not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate Limited",
  "details": "Too many requests. Try again in 60 seconds"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "details": "An unexpected error occurred. Please try again later"
}
```

---

## WebSocket Events (Real-time Updates)

The dashboard can subscribe to real-time updates via WebSocket:

```javascript
const ws = new WebSocket('wss://api.floodsense.com/ws?token=<jwt_token>');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // message.type: 'reading', 'risk_update', 'alert', 'sensor_status'
};
```

### Event Types

**Reading Update:**
```json
{
  "type": "reading",
  "sensor_id": "sensor-uuid-123",
  "timestamp": "2026-07-04T14:35:00Z",
  "water_level_cm": 186.0,
  "rainfall_mm": 2.5
}
```

**Risk Score Updated:**
```json
{
  "type": "risk_update",
  "sensor_id": "sensor-uuid-123",
  "risk_score": 75,
  "risk_level": "orange"
}
```

**Alert Triggered:**
```json
{
  "type": "alert",
  "alert_id": "alert-uuid",
  "sensor_id": "sensor-uuid-123",
  "severity": "high",
  "title": "High Flood Risk"
}
```

**Sensor Status Changed:**
```json
{
  "type": "sensor_status",
  "sensor_id": "sensor-uuid-123",
  "is_online": false,
  "changed_at": "2026-07-04T14:40:00Z"
}
```

---

## Rate Limiting

- **Standard:** 1,000 requests/hour per API key
- **Sensor ingestion:** 10,000 requests/hour (higher limit for data collection)
- **Alerts:** No rate limiting (critical path)

Clients receive headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1625422800
```

---

## Implementation Notes

1. All timestamps are in UTC (ISO 8601 format)
2. Coordinates are in decimal degrees (WGS84)
3. Distances/heights in centimeters, temperatures in Celsius
4. All endpoints require HTTPS
5. CORS headers support web dashboard requests

---

**API Specification Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for Implementation  
**Next:** OpenAPI/Swagger documentation
