# System Architecture Diagrams

This document contains visual representations of the FloodSense Ghana system architecture.

---

## 1. High-Level System Architecture (7 Layers)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│   Web Dashboard | Mobile App | SMS/WhatsApp Alerts | Email     │
│                                                                  │
│  ├─ React Dashboard (Leaflet Map)                             │
│  ├─ Mobile Responsive UI                                        │
│  └─ Notification Channels                                       │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API & ORCHESTRATION LAYER                    │
│   FastAPI/Flask Server | REST Endpoints | WebSocket Server    │
│                                                                  │
│  ├─ Authentication & Authorization (JWT/OAuth2)               │
│  ├─ Request Routing & Validation                                │
│  ├─ Rate Limiting & Middleware                                 │
│  └─ Error Handling & Logging                                    │
└─────────────────────────────────────────────────────────────────┘
                    ▲                           ▲
                    │ SQL/ORM                   │ MQTT/HTTP
                    │                           │
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION & BUSINESS LOGIC LAYER                 │
│  Service Layer | Data Processing | Prediction Engine          │
│                                                                  │
│  ├─ DataPipeline (validation, aggregation, cleaning)          │
│  ├─ PredictionService (ML model inference)                     │
│  ├─ AlertService (generation, dispatch, escalation)            │
│  ├─ SensorService (registration, management, health)           │
│  └─ AnalyticsService (trends, reports, statistics)             │
└─────────────────────────────────────────────────────────────────┘
                    ▲                           ▲
                    │                           │ Cache
                    │ SQL                       │
                    │                           ▼
┌──────────────────────────┐     ┌──────────────────────────────┐
│   DATA PERSISTENCE LAYER  │     │    CACHE LAYER               │
│   PostgreSQL Database     │     │    Redis                     │
│                           │     │                              │
│  ├─ Sensors Table         │     │  ├─ Current Risk Scores    │
│  ├─ Readings Table        │     │  ├─ Sensor Status Cache    │
│  ├─ Risk Predictions      │     │  ├─ User Sessions          │
│  ├─ Alerts Table          │     │  └─ Dashboard State        │
│  ├─ Users & Permissions   │     │                             │
│  ├─ Audit Log             │     │  TTL: 5-60 minutes         │
│  └─ Historical Analytics  │     │                             │
└──────────────────────────┘     └──────────────────────────────┘
                    ▲                           ▲
                    └─────────────┬─────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│              MESSAGE QUEUE & EVENT LAYER                        │
│   MQTT Broker (Mosquitto) | Event Streaming               │
│                                                                  │
│  ├─ Topic: /sensors/+/readings (sensor data)                 │
│  ├─ Topic: /alerts/+ (alert events)                           │
│  ├─ Topic: /risks/+ (risk predictions)                        │
│  └─ QoS Levels: 1 (at-least-once), 2 (exactly-once)          │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ MQTT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   IOT & EXTERNAL DATA LAYER                     │
│  Sensor Nodes | Weather APIs | Satellite Data              │
│                                                                  │
│  ├─ IoT Sensor Nodes (ESP32) → WiFi/4G → MQTT               │
│  ├─ OpenWeather API (hourly forecasts)                         │
│  ├─ GPM Satellite Rainfall (3x daily)                          │
│  ├─ Twilio SMS Gateway                                         │
│  ├─ WhatsApp API                                               │
│  └─ Email Service (SendGrid)                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SENSOR NODES                             │
│  (ESP32 + Ultrasonic + Rain Gauge + Temperature + Humidity)   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ JSON over MQTT or HTTP POST
                 │ Every 5-10 minutes
                 ▼
        ┌─────────────────┐
        │  MQTT Broker    │  ◄─── Ingestion Point
        │  (Mosquitto)    │
        └────────┬────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
   ┌──────────┐    ┌──────────────────┐
   │ FastAPI  │    │ Background Tasks │
   │ Server   │    │ (Celery/APScheduler)
   └────┬─────┘    └──────┬───────────┘
        │                 │
        │  Process Flow:  │
        │  1. Validate    │
        │  2. Store       │  
        │  3. Aggregate   │
        │  4. Predict     │
        │  5. Alert       │
        │                 │
        ▼                 ▼
   ┌─────────────────────────────────┐
   │  PostgreSQL Database            │
   │  (readings, risks, alerts)      │
   └────┬────────────────────────────┘
        │
    ┌───┴────────────────┐
    │                    │
    ▼                    ▼
Dashboard Queries    Real-time Analytics
(REST API)           (WebSocket Updates)
    │                    │
    └──────────┬─────────┘
               ▼
        ┌─────────────────┐
        │ React Dashboard │
        │ (Leaflet Maps)  │
        └─────────────────┘
```

---

## 3. Component Interaction Diagram

```
                    ┌──────────────────────┐
                    │   React Dashboard    │
                    │   (Port 3000)        │
                    └──────┬───────────────┘
                           │ HTTP/WebSocket
                           ▼
        ┌─────────────────────────────────────┐
        │        FastAPI Server               │
        │        (Port 8000)                  │
        ├─────────────────────────────────────┤
        │  Routes:                            │
        │  - /api/v1/sensors                  │
        │  - /api/v1/data/readings            │
        │  - /api/v1/risks/current            │
        │  - /api/v1/alerts                   │
        │  - /api/v1/analytics                │
        │  - /ws (WebSocket)                  │
        └──┬──────────────────────┬───────────┘
           │                      │
           │                      │
      ┌────▼─────┐          ┌─────▼──────────┐
      │ MQTT      │          │ PostgreSQL DB  │
      │ Broker    │◄─────────┤ (Sensor Data)  │
      │ (MQTT)    │          └────────────────┘
      └────┬──────┘
           │
      ┌────▼───────────────────┐
      │  IoT Sensor Nodes      │
      │  (ESP32 x N)           │
      │  - Ultrasonic Sensor   │
      │  - Rain Gauge          │
      │  - Temp/Humidity       │
      │  - Soil Moisture       │
      └────────────────────────┘


     ┌──────────────────────────────────────┐
     │  Background Services                 │
     ├──────────────────────────────────────┤
     │  - ML Prediction Engine (every 5m)  │
     │  - Alert Dispatcher (real-time)      │
     │  - Weather API Sync (hourly)         │
     │  - Database Maintenance (nightly)    │
     └──────────────────────────────────────┘
```

---

## 4. Deployment Architecture (Cloud)

```
┌────────────────────────────────────────────────────────────┐
│                    CLOUD PLATFORM                          │
│  (Firebase / Google Cloud / AWS / Supabase)                │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  FRONTEND DEPLOYMENT                               │  │
│  │  (Vercel / Netlify / CloudFlare Pages)             │  │
│  │  - React Build (optimized)                         │  │
│  │  - CDN Distribution                                │  │
│  │  - SSL/TLS Certificate                             │  │
│  │  - 99.9% Uptime SLA                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                 │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │  BACKEND DEPLOYMENT                               │  │
│  │  (Cloud Run / Lambda / App Engine)                 │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │  FastAPI Container (Containerized)        │   │  │
│  │  │  ├─ API Server (scaled horizontally)      │   │  │
│  │  │  ├─ Load Balancer                         │   │  │
│  │  │  └─ Auto-scaling (CPU/Memory based)      │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                          │                         │  │
│  │  ┌──────────────────────▼────────────────────┐    │  │
│  │  │  DATA LAYER                              │    │  │
│  │  │  ├─ Cloud SQL (PostgreSQL managed)      │    │  │
│  │  │  │  └─ Automated backups (daily)        │    │  │
│  │  │  │  └─ Replicated across zones          │    │  │
│  │  │  └─ Cloud Memorystore (Redis)           │    │  │
│  │  │     └─ High availability setup           │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │  MESSAGE QUEUE                          │    │  │
│  │  │  ├─ Cloud Pub/Sub (alternative to MQTT) │    │  │
│  │  │  │  OR                                  │    │  │
│  │  │  └─ Self-hosted MQTT (Mosquitto)        │    │  │
│  │  │     (on Compute Engine / K8s)           │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │  ML MODELS                               │    │  │
│  │  │  ├─ Model Server (TensorFlow Serving)   │    │  │
│  │  │  ├─ Batch Prediction (daily retraining) │    │  │
│  │  │  └─ Model versioning & rollback         │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │  MONITORING & LOGGING                   │    │  │
│  │  │  ├─ Cloud Logging (all events)          │    │  │
│  │  │  ├─ Cloud Trace (performance)           │    │  │
│  │  │  ├─ Cloud Monitoring (metrics, alerts)  │    │  │
│  │  │  └─ Error Reporting (exceptions)        │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
                              ▲
                    HTTPS/WebSocket
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                            │
    ┌───▼────┐                              ┌──────▼────┐
    │  Users │                              │ IoT Nodes │
    │Desktop │                              │  (ESP32)  │
    │ Mobile │                              │  WiFi/LTE │
    └────────┘                              └───────────┘
```

---

## 5. Microservices Architecture (Future Scale)

```
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY                               │
│  (Kong / AWS API Gateway / Google Cloud Endpoints)         │
│  - Request routing                                          │
│  - Rate limiting                                            │
│  - Authentication                                           │
└──────┬───────────────────────────────────────────────────────┘
       │
   ┌───┴─────────────────────────────────┐
   │                                     │
   ▼                                     ▼
┌──────────────────┐        ┌──────────────────────┐
│ Sensor Service   │        │ Alert Service        │
│                  │        │                      │
│ - Register       │        │ - Generate alerts    │
│ - List sensors   │        │ - Send SMS/Email     │
│ - Sensor health  │        │ - Dispatch to users  │
└──────────────────┘        └──────────────────────┘
        │                           │
        ▼                           ▼
┌──────────────────┐        ┌──────────────────────┐
│ Data Service     │        │ Prediction Service   │
│                  │        │                      │
│ - Ingest data    │        │ - ML inference       │
│ - Store readings │        │ - Risk scoring       │
│ - Clean/validate │        │ - Model training     │
└──────────────────┘        └──────────────────────┘
        │                           │
        ▼                           ▼
┌──────────────────┐        ┌──────────────────────┐
│ Analytics Service│        │ User Service         │
│                  │        │                      │
│ - Reports        │        │ - Auth               │
│ - Trends         │        │ - Preferences        │
│ - Statistics     │        │ - Permissions        │
└──────────────────┘        └──────────────────────┘
        │                           │
        └───────────┬───────────────┘
                    │
        ┌───────────▼──────────────┐
        │                          │
        ▼                          ▼
   ┌─────────┐            ┌──────────────┐
   │PostgreSQL│            │ Redis Cache  │
   │  (shared)│            │   (shared)   │
   └─────────┘            └──────────────┘
```

---

## 6. Data Flow: End-to-End Flood Alert

```
TIME: T=0s
┌──────────────────┐
│  ESP32 Sensor    │
│  Water Level: 185cm (HIGH)
│  Rainfall: 2.3mm/h
└────────┬─────────┘
         │ MQTT Publish
         │ Topic: /sensors/SEN-001/readings
         ▼
    ┌─────────────┐
    │ MQTT Broker │
    └────┬────────┘
         │ T=+0.5s
         ▼
    ┌──────────────────┐
    │ FastAPI Server   │
    │ /data/readings   │
    │ (validate data)  │
    └────┬─────────────┘
         │ T=+1s
         ▼
    ┌──────────────────┐
    │ Database Write   │
    │ INSERT readings  │
    └────┬─────────────┘
         │ T=+1.5s
         ▼
    ┌──────────────────────────┐
    │ Prediction Engine        │
    │ (background task)        │
    │ - Load model             │
    │ - Extract features       │
    │ - Run inference          │
    │ Risk Score: 72 (ORANGE)  │
    │ Confidence: 85%          │
    └────┬─────────────────────┘
         │ T=+3s
         ▼
    ┌──────────────────────┐
    │ Alert Service        │
    │ Risk ≥ 50?           │
    │ YES → Generate Alert │
    └────┬─────────────────┘
         │ T=+4s
         ▼
    ┌────────────────────────────┐
    │ Multi-Channel Dispatch     │
    │                            │
    │ ├─ SMS to 100 residents   │
    │ ├─ WhatsApp to officials   │
    │ ├─ Email to NADMO          │
    │ └─ Dashboard notification  │
    └────┬───────────────────────┘
         │ T=+5-10s
         ▼
    ┌──────────────────────┐
    │ Users Receive Alerts │
    │                      │
    │ "🚨 FLOOD WARNING    │
    │  Risk: 72%           │
    │  Location: Accra R.  │
    │  Action: EVACUATE"   │
    └──────────────────────┘

TOTAL LATENCY: 5-10 seconds from sensor reading to alert delivery
```

---

## 7. Network Architecture

```
INTERNET

    ├─── API Clients (Web Browsers)
    │    └─ HTTPS:443 → CDN → API Gateway
    │
    ├─── IoT Devices (ESP32)
    │    └─ WiFi:1883 (MQTT) → MQTT Broker
    │    └─ LTE:8000 (HTTPS) → API Server
    │
    ├─── Weather APIs (External)
    │    └─ OpenWeather, GPM Satellite, etc.
    │
    └─── Notification Services
         ├─ Twilio (SMS)
         ├─ WhatsApp API
         └─ SendGrid (Email)


INTERNAL NETWORK (VPC)

    ┌─────────────────────────────────────┐
    │  Private Subnet (Backend)           │
    │                                     │
    │  ┌────────────┐  ┌────────────┐   │
    │  │ API Server │  │ ML Service │   │
    │  │ (FastAPI)  │  │ (TensorFlow)  │
    │  └──────┬─────┘  └────────────┘   │
    │         │                         │
    │  ┌──────▼────────────────────┐   │
    │  │  Internal Load Balancer   │   │
    │  └──────────────────────────┘   │
    │                                     │
    │  ┌────────────┐  ┌────────────┐   │
    │  │ PostgreSQL │  │   Redis    │   │
    │  │  (Master)  │  │  (Cache)   │   │
    │  └────────────┘  └────────────┘   │
    │                                     │
    │  ┌────────────────────────────┐   │
    │  │  MQTT Broker (Mosquitto)   │   │
    │  │  Port: 1883 (internal)     │   │
    │  │  Port: 8883 (TLS external) │   │
    │  └────────────────────────────┘   │
    │                                     │
    └─────────────────────────────────────┘

    ┌─────────────────────────────────────┐
    │  Public Subnet (CDN/Gateway)        │
    │                                     │
    │  ┌────────────────────────────┐   │
    │  │  API Gateway / Load Balancer  │
    │  │  HTTPS:443                  │   │
    │  └────────────────────────────┘   │
    │                                     │
    └─────────────────────────────────────┘
```

---

## 8. CI/CD Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    DEVELOPER PUSH                            │
│                  git push origin main                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         ┌─────────▼────────────┐
         │  GitHub Actions      │
         │  (CI/CD Pipeline)    │
         └─────────┬────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Lint    │  │  Test    │  │ Security │
│ Code     │  │ Coverage │  │  Scan    │
│ Checks   │  │ > 80%    │  │ (SAST)   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
            ┌──────▼─────────┐
            │  Build Docker  │
            │  Image         │
            └──────┬─────────┘
                   │
            ┌──────▼─────────────┐
            │  Push to Registry  │
            │  (Docker Hub)      │
            └──────┬─────────────┘
                   │
        ┌──────────┼──────────┐
        │                     │
        ▼                     ▼
    ┌────────┐          ┌──────────┐
    │ Staging│          │Production│
    │Deployment          Deployment
    │(Manual)            (Auto after approval)
    └────────┘          └──────────┘
        │                     │
        └─────────────┬───────┘
                      │
            ┌─────────▼──────────┐
            │  Monitor & Alert   │
            │  (Success/Failure) │
            └────────────────────┘
```

---

**Diagram Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for Integration
