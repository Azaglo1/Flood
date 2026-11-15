# FloodSense Ghana - System Architecture

## System Overview

FloodSense Ghana is a distributed IoT-based flood prediction and early warning system. It combines real-time sensor data, satellite weather information, and machine learning to predict flood risks and alert communities.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│  Web Dashboard | Mobile App | SMS Alerts | Email Alerts     │
└────────────┬────────────────────────────────────┬───────────┘
             │                                    │
┌────────────▼──────────────────────────────────▼─────────────┐
│                   API & SERVICES LAYER                       │
│  REST API | Authentication | Alert Service | Analytics      │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
┌────────────▼────────────────┬─────────────────▼─────────────┐
│     DATA PROCESSING LAYER    │   PREDICTION ENGINE          │
│  Data Validation             │  Machine Learning Models      │
│  Aggregation                 │  Risk Scoring                 │
│  Storage                     │  Anomaly Detection           │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
┌────────────▼────────────────┬─────────────────▼─────────────┐
│      DATA SOURCES LAYER      │    NOTIFICATION LAYER        │
│  IoT Sensor Nodes            │  SMS Gateway (Twilio)         │
│  Satellite Data              │  WhatsApp API                │
│  Weather APIs                │  Email Service               │
│  Database                    │  In-app Notifications       │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
┌────────────▼────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│  Cloud Platform | Message Queue (MQTT) | Database Server   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. IoT Sensor Network

#### Sensor Node Components
Each distributed sensor node consists of:

- **Microcontroller:** ESP32
- **Sensors:**
  - Ultrasonic water level sensor (HC-SR04 or JSN-SR04T)
  - Rain gauge (tipping bucket)
  - Temperature/Humidity sensor (DHT22)
  - Soil moisture sensor (capacitive)
  - (Optional) Water flow sensor
- **Connectivity:** WiFi or 4G LTE module
- **Power:** Solar panel (5W) + Li-ion battery (18650)
- **Housing:** Waterproof enclosure (IP67)

#### Sensor Node Responsibilities
- Collect environmental data at configurable intervals (e.g., every 5-10 minutes)
- Validate data locally (range checking, outlier detection)
- Store locally if connectivity lost (circular buffer)
- Publish via MQTT or HTTP POST
- Report battery status and connectivity
- Support OTA firmware updates

### 2. Backend API Server

**Framework:** Flask or FastAPI (Python)  
**Purpose:** Central data aggregation, processing, and business logic

#### Key Responsibilities
- Ingest and validate sensor data from distributed nodes
- Store readings in database
- Calculate derived metrics (averages, trends)
- Trigger prediction model
- Generate and dispatch alerts
- Provide data to frontend dashboard
- Authenticate users and manage permissions
- Log all events for audit trail

#### Core Modules

**a) Sensor Management**
```
POST   /api/v1/sensors/register        - Register new sensor node
GET    /api/v1/sensors                 - List all sensors
GET    /api/v1/sensors/{id}            - Get sensor details
PUT    /api/v1/sensors/{id}            - Update sensor
DELETE /api/v1/sensors/{id}            - Deregister sensor
```

**b) Data Ingestion**
```
POST   /api/v1/data/readings           - Submit sensor readings
GET    /api/v1/data/latest             - Get latest readings from all sensors
GET    /api/v1/data/sensor/{id}        - Get readings for specific sensor
GET    /api/v1/data/historical         - Get historical data (time range)
```

**c) Risk & Prediction**
```
GET    /api/v1/risks/current           - Get current flood risk levels
GET    /api/v1/risks/forecast          - Get flood risk forecast
GET    /api/v1/predictions/{area}      - Get predictions for area
```

**d) Alerts**
```
GET    /api/v1/alerts                  - Get alert history
POST   /api/v1/alerts/acknowledge      - Mark alert as acknowledged
GET    /api/v1/alerts/active           - Get active alerts
```

**e) Analytics**
```
GET    /api/v1/analytics/trends        - Historical trends
GET    /api/v1/analytics/statistics    - Summary statistics
GET    /api/v1/analytics/reports       - Generate reports
```

**f) Authentication**
```
POST   /api/v1/auth/login              - User login
POST   /api/v1/auth/logout             - User logout
POST   /api/v1/auth/refresh            - Refresh token
```

### 3. Prediction Engine

**Technology:** Machine Learning (TensorFlow, Scikit-learn, Prophet)  
**Purpose:** Predict flood risks based on current and forecast data

#### Inputs (Features)
- Current water level (absolute and rate of change)
- Rainfall (past 6h, 12h, 24h, 48h)
- Forecast rainfall (next 6h, 12h, 24h)
- Soil moisture
- Temperature
- Seasonal factors
- Historical flood patterns
- Upstream sensor data

#### Processing
1. **Feature Engineering:** Normalize and transform features
2. **Model Inference:** Run ensemble of trained models
3. **Risk Scoring:** Aggregate predictions into 0-100 risk score
4. **Threshold Mapping:** Convert score to level (Green/Yellow/Orange/Red)
5. **Confidence Calculation:** Provide confidence interval

#### Output
```json
{
  "sensor_id": "SEN-001",
  "timestamp": "2026-07-04T14:30:00Z",
  "risk_score": 72,
  "risk_level": "Orange",
  "confidence": 0.85,
  "likely_flood_time": "2026-07-04T15:30:00Z",
  "factors": {
    "rainfall_24h_mm": 45.3,
    "water_level_cm": 185,
    "soil_moisture_percent": 92,
    "trend": "rising"
  }
}
```

#### Alert Thresholds
- **Green:** Risk score 0-20 (Low risk)
- **Yellow:** Risk score 21-50 (Moderate risk)
- **Orange:** Risk score 51-80 (High risk) → Send alerts
- **Red:** Risk score 81-100 (Critical risk) → Escalate alerts

### 4. Database Schema

**Primary Database:** PostgreSQL

#### Core Tables

```sql
-- Sensor Nodes
sensors {
  id, location_name, latitude, longitude, sensor_type,
  installation_date, battery_status, is_active, last_seen
}

-- Sensor Readings
readings {
  id, sensor_id, timestamp, water_level_cm, rainfall_mm,
  temperature_c, humidity_percent, soil_moisture_percent,
  water_flow_speed, battery_voltage, rssi
}

-- Risk Predictions
risk_predictions {
  id, sensor_id, timestamp, risk_score, risk_level,
  confidence, predicted_flood_time, factors_json
}

-- Alerts
alerts {
  id, sensor_id, alert_type, risk_level, message,
  timestamp, is_acknowledged, acknowledged_by,
  acknowledged_at, recipients
}

-- Users
users {
  id, email, password_hash, full_name, role,
  created_at, last_login, is_active
}

-- Audit Log
audit_log {
  id, user_id, action, resource, timestamp, details
}
```

### 5. Frontend Dashboard

**Framework:** React or Vue.js  
**Purpose:** Real-time monitoring, alert viewing, analytics

#### Key Views

**Dashboard Home**
- Summary cards (# sensors, active alerts, overall risk)
- Interactive map of sensor network
- Recent alerts feed
- Quick stats

**Sensor Map**
- Interactive Leaflet/Google Maps
- Sensor pins color-coded by risk level
- Click for sensor details
- Historical path visualization

**Sensor Details**
- Live readings (water level, rainfall, temperature, soil moisture)
- Time series charts
- Alert history
- Battery status
- Connectivity status

**Alerts & Notifications**
- Active alerts list
- Alert timeline
- Acknowledge/dismiss functionality
- Filter by severity

**Analytics**
- Historical trends (7-day, 30-day, seasonal)
- Rainfall patterns
- Flood event frequency
- System performance metrics

**Settings**
- Sensor management (add/edit/delete)
- Alert configuration
- User management
- Notification preferences

### 6. Notification System

**Multi-channel alerts:**

**SMS (via Twilio or Africastalking)**
```
FLOOD ALERT: High flood risk in Accra (Risk: 85%)
Expect flooding in ~1 hour. Take shelter. Reply HELP
```

**WhatsApp**
- Rich messages with media
- Interactive buttons (Acknowledge, More info, Emergency)

**Email**
- Formatted report with charts
- Detailed explanation
- Recommendations

**In-app**
- Push notifications
- Dashboard banners
- Alert feed

**Future: Community Display Boards**
- LED panels in public spaces
- SMS-controlled updates
- Simple Green/Yellow/Orange/Red indicators

### 7. External Data Integration

#### Weather API Integration
```
OpenWeather API
├─ Current weather
├─ Forecast (5-day, hourly)
├─ Historical data (if available)
```

#### Satellite Data
```
GPM (Global Precipitation Measurement)
├─ Rainfall estimates (IMERG product)
├─ 0.1° × 0.1° resolution
├─ Near-real-time (3-4 hours latency)

Meteosat/GOES
├─ Cloud imagery
├─ Storm tracking
├─ Derived rainfall
```

#### Water Data
```
USGS/Local Gauges (if available)
├─ Upstream water levels
├─ Flow rates
├─ Historical discharge data
```

---

## Data Flow Diagram

```
SENSOR NODES                 BACKEND                    USERS
─────────────               ─────────              ──────────────

┌──────────────┐            ┌──────────┐         ┌──────────────┐
│ Water Level  │ ──MQTT──┐  │          │         │              │
│   Sensor     │         │  │          │         │   Dashboard  │
└──────────────┘         │  │   API    │────────→│   (Browser)  │
                         │  │ Server   │         │              │
┌──────────────┐         │  │          │         └──────────────┘
│   Rainfall   │─────────┤  │          │
│   Gauge      │         │  │          │         ┌──────────────┐
└──────────────┘         │  │          │         │   Mobile     │
                         │  │          │────────→│     App      │
┌──────────────┐         │  │  Data    │         │              │
│Temperature   │─────────┤  │  Pipeline│         └──────────────┘
│  Sensor      │         │  │          │
└──────────────┘         │  └──────────┘         ┌──────────────┐
                         │        │              │ SMS/WhatsApp │
         ...             │        │              │   Alerts     │
                         │        ▼              └──────────────┘
                         │   ┌─────────────┐
                         │   │ Database    │
                         │   │ PostgreSQL  │
                         │   └─────────────┘
                         │
                         │   ┌─────────────────┐
                         └──→│ ML Prediction   │
                             │ Engine          │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Alert & Notify  │
                             │ Service         │
                             └─────────────────┘
```

---

## Technology Choices & Rationale

| Component | Technology | Why |
|-----------|-----------|-----|
| **Backend Framework** | Flask or FastAPI | Lightweight, Python, easy to deploy |
| **Frontend** | React + Leaflet.js | Rich ecosystem, good map libraries |
| **Database** | PostgreSQL | Open-source, robust, good geospatial support |
| **Message Queue** | MQTT | Lightweight, IoT-optimized, publish-subscribe |
| **Cloud Platform** | Firebase or Supabase | Free tier, real-time DB, authentication |
| **ML Framework** | Scikit-learn / TensorFlow | Well-documented, proven for timeseries |
| **Maps** | Leaflet.js + OpenStreetMap | Open-source, no licensing restrictions |
| **Microcontroller** | ESP32 | WiFi, low cost, large community, good libraries |
| **SMS/WhatsApp** | Twilio or Africastalking | Reliable, good for Africa, developer-friendly |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUD PLATFORM                           │
│              (Firebase, Supabase, or AWS)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Application Server (Docker)                │    │
│  │  Flask/FastAPI + Gunicorn + Nginx                  │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PostgreSQL Database (Managed or Self-hosted)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MQTT Broker (Mosquitto or Managed)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Frontend (React) - Static CDN                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                             ▲
                             │ HTTPS
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌─────────┐          ┌──────────┐        ┌─────────┐
   │Sensor 1 │          │ Sensor 2 │   ...  │Sensor N │
   │ (ESP32) │          │ (ESP32)  │        │(ESP32)  │
   └─────────┘          └──────────┘        └─────────┘
      WiFi                 WiFi                 WiFi
      /MQTT                /MQTT                /MQTT
```

---

## Security Considerations

1. **API Authentication:** JWT tokens, API keys for sensors
2. **Data Encryption:** HTTPS/TLS for all communications
3. **Database:** Parameterized queries, role-based access
4. **Firmware:** Over-the-air updates with signature verification
5. **Alert System:** Rate limiting to prevent alert spam
6. **Privacy:** No personal data storage (unless consented)

---

## Scalability

- **Horizontal:** Add more sensor nodes without code changes
- **Vertical:** Database indexing, caching, query optimization
- **Caching:** Redis for frequently accessed data
- **Load Balancing:** Multiple API server instances behind load balancer

---

## Next Steps

1. **Finalize stack choices** (Flask vs FastAPI, React vs Vue)
2. **Create detailed database schema** with migrations
3. **Design API endpoints** with OpenAPI/Swagger
4. **Set up development environment** with Docker
5. **Build data model** for ML pipeline

---

**Architecture Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for Implementation
