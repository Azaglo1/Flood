# Visual Diagrams - FloodSense Ghana

Mermaid diagrams ready for export to Draw.io, Figma, and other visualization tools.
Copy any diagram below and paste into Draw.io (Arrange → Insert → Advanced → Mermaid) for visual editing.

---

## 1. System Architecture Diagram (7-Layer)

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        WEB[Web Dashboard - React + Leaflet]
        MOBILE[Mobile App - Responsive]
        SMS[SMS/WhatsApp Alerts]
        EMAIL[Email Notifications]
    end
    
    subgraph API["API & Orchestration Layer"]
        AUTH[Authentication - JWT/OAuth2]
        ROUTE[Request Routing & Validation]
        LIMIT[Rate Limiting & Middleware]
        ERROR[Error Handling & Logging]
    end
    
    subgraph App["Application & Business Logic Layer"]
        DP[DataPipeline - validation, cleaning]
        PS[PredictionService - ML inference]
        AS[AlertService - generation, dispatch]
        SS[SensorService - registration, management]
        AIS[AnalyticsService - trends, reports]
    end
    
    subgraph Data["Data Persistence Layer"]
        PGS[PostgreSQL Database]
        PG1[Sensors Table]
        PG2[Readings Table]
        PG3[Risk Predictions]
        PG4[Alerts Table]
        PG5[Users & Permissions]
    end
    
    subgraph Cache["Cache Layer"]
        REDIS[Redis Cache]
        RED1[Risk Scores]
        RED2[Sensor Status]
        RED3[User Sessions]
        RED4[Dashboard State]
    end
    
    subgraph MQ["Message Queue Layer"]
        MQTT[MQTT Broker - Mosquitto]
        MQ1[/sensors/+/readings]
        MQ2[/alerts/+]
        MQ3[/risks/+]
    end
    
    subgraph IoT["IoT & External Data Layer"]
        SENSORS[Sensor Nodes - ESP32]
        WEATHER[OpenWeather API]
        SATELLITE[GPM Satellite Data]
        TWILIO[Twilio SMS Gateway]
        WHATS[WhatsApp API]
        SENDGRID[SendGrid Email]
    end
    
    WEB <-->|HTTP/WebSocket| API
    MOBILE <-->|HTTPS| API
    API <-->|SQL| Data
    API <-->|Cache| Cache
    Data <-->|Pub/Sub| MQ
    Cache <-->|Pub/Sub| MQ
    MQ <-->|MQTT| IoT
    IoT -- MQTT/Readings
    
    style Presentation fill:#e0f2fe
    style API fill:#bae6fd
    style App fill:#7dd3fc
    style Data fill:#38bdf8
    style Cache fill:#0ea5e9
    style MQ fill:#0284c7
    style IoT fill:#0369a1
```

---

## 2. Sensor Node Circuit Diagram

```mermaid
graph LR
    subgraph POWER["Power Subsystem"]
        SOLAR[Solar Panel<br/>5W 18V]
        CHARGER[TP4056<br/>Charger Module]
        BAT1[18650<br/>Battery 1]
        BAT2[18650<br/>Battery 2]
        BOOST[MT3608<br/>Boost Converter<br/>5V Out]
        LDO[LDO Regulator<br/>3.3V Out]
    end
    
    subgraph ESP32["ESP32-WROOM-32E"]
        VCC[VCC 3.3V]
        GND[GND]
        IO22[I2C SCL<br/>GPIO 22]
        IO23[I2C SDA<br/>GPIO 23]
        IO32[HC-SR04 TRIG<br/>GPIO 32]
        IO33[Interrupt<br/>GPIO 33<br/>Rain + Button]
        IO34[Water Level ADC<br/>GPIO 34]
        IO35[Echo ADC<br/>GPIO 35]
        IO36[Soil Moisture<br/>GPIO 36]
        IO39[Battery Monitor<br/>GPIO 39]
        IO25[LED B<br/>GPIO 25]
        IO26[LED G<br/>GPIO 26]
        IO27[LED R<br/>GPIO 27]
    end
    
    subgraph SENSORS["Sensors"]
        ULTRA[HC-SR04<br/>Ultrasonic<br/>Water Level]
        RAIN[Tipping Bucket<br/>Rain Gauge]
        BME[BME280<br/>Temp/Humidity<br/>I2C 0x77]
        SOIL[Capacitive<br/>Soil Moisture]
        LED[RGB LED<br/>Status Indicator]
    end
    
    SOLAR --> CHARGER
    CHARGER --> BAT1
    CHARGER --> BAT2
    BAT1 & BAT2 --> BOOST
    BOOST --> LDO
    LDO --> VCC
    
    IO22 <-->|I2C| BME
    IO23 <-->|I2C| BME
    VCC --> BME
    GND --> BME
    
    IO32 -->|Pulse| ULTRA
    IO35 <-->|Echo| ULTRA
    VIN5V[5V from Boost] --> ULTRA
    GND --> ULTRA
    
    IO33 <-->|Interrupt| RAIN
    VCC --> RAIN
    GND --> RAIN
    
    IO36 <-->|Analog| SOIL
    VCC --> SOIL
    GND --> SOIL
    
    IO25 & IO26 & IO27 <-->|PWM| LED
    
    IO39 <-->|Voltage Divider| BAT1
    
    style POWER fill:#dcfce7
    style ESP32 fill:#bae6fd
    style SENSORS fill:#fef3c7
```

---

## 3. Deployment Architecture (Cloud)

```mermaid
graph TB
    subgraph INTERNET["Internet"]
        USERS[Users<br/>Desktop/Mobile]
        IOTNODES[IoT Nodes<br/>ESP32]
    end
    
    subgraph CLOUD["Cloud Platform<br/>(GCP/AWS/Firebase)"]
        CDN[CDN - Cloudflare]
        GATEWAY[API Gateway<br/>HTTPS:443]
        
        subgraph BACKEND["Backend Services"]
            API[FastAPI Containers<br/>Auto-scaling]
            LOAD[Load Balancer]
            API -.-> LOAD
            
            subgraph DATABASE["Data Layer"]
                PGDB[PostgreSQL<br/>Managed (Master)]
                REDISCLOUD[Redis Cache<br/>MemoryStore]
            end
            
            subgraph MESSAGING["Messaging Layer"]
                PUBSUB[Pub/Sub<br/>or MQTT Broker]
            end
            
            subgraph ML["ML Services"]
                MODEL[TensorFlow<br/>Model Server]
                TRAIN[Batch Training]
            end
            
            subgraph MONITOR["Monitoring"]
                LOGS[Cloud Logging]
                TRACE[Cloud Trace]
                MONITORING[Cloud Monitoring]
            end
        end
    end
    
    USERS -->|HTTPS| CDN
    CDN --> GATEWAY
    GATEWAY --> BACKEND
    
    IOTNODES -->|MQTT/TLS| PUBSUB
    
    BACKEND -->|SQL| PGDB
    BACKEND -->|Cache| REDISCLOUD
    BACKEND -->|Events| PUBSUB
    BACKEND -->|Predictions| ML
    
    style CLOUD fill:#f3e8ff
    style BACKEND fill:#e9d5ff
    style DATABASE fill:#c084fc
```

---

## 4. CI/CD Pipeline

```mermaid
flowchart LR
    DEV[Developer<br/>git push] --> GITHUB[GitHub Actions]
    
    subgraph CI["CI Checks"]
        LINT[Lint Code]
        TEST[Test Suite<br/>>80% Coverage]
        SEC[Security Scan<br/>SAST]
    end
    
    GITHUB --> LINT
    GITHUB --> TEST
    GITHUB --> SEC
    
    LINT & TEST & SEC --> BUILD[Build Docker<br/>Image]
    BUILD --> REGISTRY[Docker Registry]
    
    REGISTRY -->|Auto| STAGING[Staging<br/>Deployment]
    REGISTRY -->|Manual| PROD[Production<br/>Deployment]
    
    PROD --> MONITOR[Monitor<br/>& Alert]
    
    style CI fill:#fef9c3
    style REGISTRY fill:#fde047
```

---

## 5. End-to-End Flood Alert Flow

```mermaid
sequenceDiagram
    participant SENSOR as ESP32 Sensor
    participant MQTT as MQTT Broker
    participant API as FastAPI Server
    participant DB as PostgreSQL
    participant ALERT as Alert Service
    participant DISPATCH as Dispatch
    participant USER as Users
    
    SENSOR->>MQTT: Publish reading<br/>/sensors/SEN-001/readings
    MQTT->>API: Forward (QoS=1)
    Note over API: T+0.5s
    
    API->>API: Validate data
    Note over API: T+1s
    
    API->>DB: Store reading
    Note over API,DB: T+1.5s
    
    API->>API: Trigger prediction<br/>background task
    Note over API: T+2s
    
    API->>DB: Store risk score
    Note over API,DB: T+3s
    
    API->>ALERT: Risk check<br/>score: 72 (ORANGE)
    ALERT->>ALERT: Generate alert
    Note over ALERT: T+4s
    
    ALERT->>DISPATCH: Dispatch alert
    DISPATCH->>USER: SMS/Email/WhatsApp
    DISPATCH->>USER: Dashboard notification
    Note over USER: T+5-10s
    
```

---

## 6. Network Architecture

```mermaid
graph TB
    subgraph PUBLIC["Public Network"]
        INTERNET[Internet]
        WEBCLI[Web Clients<br/>HTTPS:443]
        IOTINT[IoT over LTE<br/>HTTPS:8000]
    end
    
    subgraph VPC["Private Network (VPC)"]
        APIGW[API Gateway<br/>443]
        
        subgraph BACKEND["Backend Subnet"]
            APISRV[FastAPI Server<br/>Port 8000]
            MQTTBROKER[MQTT Broker<br/>1883 internal]
            POSTGRES[PostgreSQL<br/>5432]
            REDISVC[Redis<br/>Port 6379]
        end
    end
    
    INTERNET -->|HTTPS| WEBCLI
    INTERNET -->|HTTPS| IOTINT
    WEBCLI -->|HTTPS| APIGW
    IOTINT -->|MQTT/TLS| MQTTBROKER
    APIGW --> APISRV
    APISRV --> POSTGRES
    APISRV --> REDISVC
    MQTTBROKER --> APISRV
    
    style VPC fill:#fee2e2
    style BACKEND fill:#fecaca
```

---

## 7. Microservices Architecture (Future)

```mermaid
graph TB
    APIGW[API Gateway<br/>Kong/AWS API GW] --> SENSOR_SVC[Sensor Service]
    APIGW --> ALERT_SVC[Alert Service]
    APIGW --> DATA_SVC[Data Service]
    APIGW --> PREDICT_SVC[Prediction Service]
    APIGW --> ANALYTICS_SVC[Analytics Service]
    
    SENSOR_SVC & DATA_SVC & PREDICT_SVC & ALERT_SVC & ANALYTICS_SVC --> SHARED[(Shared<br/>PostgreSQL)]
    SENSOR_SVC & DATA_SVC & PREDICT_SVC & ALERT_SVC & ANALYTICS_SVC --> CACHE[(Redis Cache)]
    
    style APIGW fill:#86efac
```

---

## 8. Database ER Diagram

```mermaid
erDiagram
    SENSORS ||--o{ READINGS : "has"
    SENSORS ||--o{ ALERTS : "triggers"
    SENSORS ||--o{ RISK_PREDICTIONS : "generates"
    
    SENSORS {
        string sensor_key PK
        string name
        float latitude
        float longitude
        int elevation_m
        string status
        timestamp last_seen
        timestamp installed_at
    }
    
    READINGS {
        int id PK
        string sensor_key FK
        float water_level_cm
        float rainfall_mm
        float temperature_c
        float humidity_percent
        float soil_moisture
        float battery_voltage
        timestamp created_at
    }
    
    ALERTS {
        int id PK
        string sensor_key FK
        int severity
        string message
        timestamp triggered_at
        timestamp acknowledged_at
        string acknowledged_by FK
    }
    
    RISK_PREDICTIONS {
        int id PK
        string sensor_key FK
        int score
        int confidence
        timestamp predicted_at
        timestamp created_at
    }
    
    USERS {
        int id PK
        string email
        string name
        string role
        json preferences
    }
    
    USERS ||--o{ ALERTS : "acknowledges"
```

---

## 9. Sensor Network Topology

```mermaid
graph TB
    subgraph REGION1["Greater Accra Region"]
        ACCRA1[SEN-001<br/>Accra River<br/>Osu Bridge]
        ACCRA2[SEN-002<br/>Tema Beach<br/>Coastal]
        ACCRA3[SEN-003<br/>Weija<br/>Reservoir]
    end
    
    subgraph REGION2["Ashanti Region"]
        KUMASI1[SEN-004<br/>Kumasi<br/>Subin River]
        KUMASI2[SEN-005<br/>Atonsu<br/>Stream]
    end
    
    subgraph REGION3["Central Region"]
        CAPE1[SEN-006<br/>Cape Coast<br/>Tiver]
    end
    
    ACCRA1 & ACCRA2 & ACCRA3 --> GATEWAY[Mqtts<br/>broker.floodsense.com:8883]
    KUMASI1 & KUMASI2 --> GATEWAY
    CAPE1 --> GATEWAY
    
    GATEWAY --> SERVER[FastAPI<br/>Backend Server]
    
    style REGION1 fill:#dbeafe
    style REGION2 fill:#ede9fe
    style REGION3 fill:#f3e8ff
```

---

## 10. Dashboard Wireframe - Home

```mermaid
graph TD
    subgraph DESKTOP["Desktop Layout - 1200px+"]
        HEADER[Header<br/>Logo | User Menu | Notifications]
        
        subgraph MAIN["Main Content"]
            COL1[Column 1 - 2/12]
            SIDEBAR[Sidebar Navigation]
            
            COL2[Column - 10/12]
            GRID1[4 Metric Cards<br/>Sensors | Alerts | Risk | Battery]
            MAP[Interactive Leaflet Map<br/>with Risk Markers]
            ALERTS[Recent Alerts Timeline]
            HEALTH[System Health Indicators]
        end
    end
    
    HEADER -.-> MAIN
    MAIN -.-> SIDEBAR
    GRID1 -.-> MAP
    MAP -.-> ALERTS
    ALERTS -.-> HEALTH
```

---

## 11. Dashboard Wireframe - Sensor Detail

```mermaid
graph TD
    HEADER[Header<br/>Back | Sensor Name | Status]
    
    subgraph SENSOR_DETAIL["Sensor Detail Page"]
        LIVE[Live Readings<br/>Water | Rain | Temp | Humidity<br/>Soil | Battery]
        RISK[Risk Assessment<br/>Score | Confidence | Prediction<br/>Factors | Actions]
        CHART[Trend Charts<br/>Water Level | Rainfall<br/>7/30/YTD Tabs]
        FORECAST[24h Forecast<br/>Hourly Predictions]
        HEALTH[Device Health<br/>Uptime | Firmware<br/>Calibration<br/>Maintenance]
    end
    
    HEADER --> LIVE
    LIVE --> RISK
    RISK --> CHART
    CHART --> FORECAST
    FORECAST --> HEALTH
```

---

**Diagram Version:** 1.0  
**Last Updated:** 4 July 2026  
**Format:** Mermaid.js (compatible with Draw.io, Figma, GitHub)  
**Usage:** Copy any diagram block and paste into visualization tool for editing