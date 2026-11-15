# FloodSense Ghana - Technical Requirements Specification

## Functional Requirements

### FR1: Sensor Data Management
- The system SHALL support registration of distributed sensor nodes
- Each sensor node SHALL transmit readings at configurable intervals (min: 1 min, default: 10 min)
- The system SHALL validate sensor readings (range checking, outlier detection)
- The system SHALL store up to 12 months of historical data
- The system SHALL handle offline sensors gracefully (mark as offline, retry connection)

### FR2: Data Processing
- The system SHALL aggregate data from multiple sensors in a region
- The system SHALL calculate derived metrics (moving averages, rates of change)
- The system SHALL perform real-time data quality checks
- The system SHALL timestamp all readings in UTC

### FR3: Flood Risk Prediction
- The system SHALL calculate flood risk score (0-100) based on sensor data
- Risk scores SHALL map to 4 levels:
  - Green (0-20): Low risk
  - Yellow (21-50): Moderate risk
  - Orange (51-80): High risk, send alerts
  - Red (81-100): Critical risk, escalate alerts
- The system SHALL provide confidence intervals for predictions
- The system SHALL estimate likely flood timing (if applicable)

### FR4: Alert Generation & Delivery
- The system SHALL trigger alerts when risk score exceeds 50 (Orange)
- Alerts SHALL be sent via SMS, WhatsApp, and Email
- The system SHALL support different alert templates for each channel
- The system SHALL allow users to acknowledge/dismiss alerts
- The system SHALL implement alert escalation (repeat alerts at increasing frequency)
- The system SHALL maintain alert history

### FR5: Dashboard & Visualization
- The system SHALL display live sensor network on interactive map
- The system SHALL show real-time sensor readings (water level, rainfall, temperature)
- The system SHALL color-code sensors by risk level
- The system SHALL provide historical charts (7-day, 30-day, seasonal views)
- The system SHALL display alert timeline
- The system SHALL support filtering and search functionality
- The system SHALL be responsive (works on desktop and mobile)

### FR6: User Management
- The system SHALL support user registration and login
- The system SHALL implement role-based access control (Admin, Coordinator, Viewer)
- Admins SHALL manage sensors and users
- Coordinators SHALL acknowledge alerts and generate reports
- Viewers SHALL only view read-only data

### FR7: Reporting & Analytics
- The system SHALL generate flood event reports
- The system SHALL provide trend analysis
- The system SHALL calculate false positive/negative rates
- The system SHALL export data in CSV format

---

## Non-Functional Requirements

### NF1: Performance
- API response time: < 500ms for 95th percentile
- Dashboard load time: < 3 seconds on 4G
- Sensor data ingestion: Support 100+ simultaneous sensor connections
- Database query: < 1 second for historical queries

### NF2: Availability
- System uptime: 99% (excludes maintenance windows)
- Alert delivery: 99% success rate
- Sensor connectivity: Retry every 5 minutes if offline

### NF3: Scalability
- Support up to 1,000 sensor nodes per deployment
- Handle 1 million readings per day
- Database: Partition by time for performance

### NF4: Security
- All communications: HTTPS/TLS
- API authentication: JWT tokens
- Sensor authentication: API keys
- Database: Encrypted passwords (bcrypt)
- Data: No personal information storage without consent

### NF5: Reliability
- Database backup: Daily automated backups
- Disaster recovery: RTO 4 hours, RPO 1 hour
- Sensor firmware: OTA update capability
- Error handling: Graceful degradation

### NF6: Maintainability
- Code: Follow PEP 8 (Python), ESLint (JavaScript)
- Documentation: API docs + inline comments
- Logging: Structured logging for debugging
- Monitoring: Error tracking + performance monitoring

### NF7: Usability
- Dashboard: Intuitive for non-technical users
- Onboarding: 5-minute setup for new sensors
- Help: In-app help + documentation + video tutorials
- Accessibility: WCAG 2.1 AA compliance

---

## Data Requirements

### Data Inputs

| Source | Frequency | Resolution | Format |
|--------|-----------|------------|--------|
| Water Level Sensor | 5-10 min | ±1 cm | JSON via MQTT/HTTP |
| Rain Gauge | 5-10 min | ±0.5 mm | JSON via MQTT/HTTP |
| Temperature | 10 min | ±0.5°C | JSON via MQTT/HTTP |
| Humidity | 10 min | ±2% | JSON via MQTT/HTTP |
| Soil Moisture | 10 min | ±1% | JSON via MQTT/HTTP |
| OpenWeather API | Hourly | - | JSON REST |
| GPM Satellite | 3 times daily | 0.1° × 0.1° | TIFF/NetCDF |

### Data Outputs

| Output | Format | Recipients |
|--------|--------|-----------|
| Flood Alert | SMS/WhatsApp/Email | Community members, officials |
| Dashboard | Web/Mobile UI | Desktop & mobile browsers |
| Historical Data | CSV/JSON | Analytics tools |
| Report | PDF | Decision makers |

---

## API Requirements

### REST API Specifications

**Base URL:** `https://api.floodsense.com/v1`

#### Sensor Endpoints

```
GET    /sensors              - List all sensors
POST   /sensors              - Register new sensor
GET    /sensors/{id}         - Get sensor details
PUT    /sensors/{id}         - Update sensor
DELETE /sensors/{id}         - Deregister sensor
```

#### Data Endpoints

```
POST   /data/readings        - Submit sensor readings
GET    /data/latest          - Get latest readings from all sensors
GET    /data/sensor/{id}     - Get specific sensor readings
GET    /data/range           - Historical data (query params: from, to)
```

#### Risk Endpoints

```
GET    /risks/current        - Get current risk levels
GET    /risks/forecast       - Get risk forecast (24h ahead)
GET    /risks/sensor/{id}    - Get specific sensor risk
```

#### Alert Endpoints

```
GET    /alerts               - Get alert history
POST   /alerts/{id}/ack      - Acknowledge alert
GET    /alerts/active        - Get active alerts
```

#### Analytics Endpoints

```
GET    /analytics/trends     - Historical trends
GET    /analytics/stats      - Summary statistics
GET    /analytics/report     - Generate report
```

#### Authentication Endpoints

```
POST   /auth/login           - User login
POST   /auth/logout          - User logout
POST   /auth/refresh         - Refresh token
```

---

## Hardware Requirements

### Sensor Node Specifications

| Component | Specification |
|-----------|---------------|
| **Microcontroller** | ESP32-WROOM-32E (240 MHz dual-core) |
| **RAM** | 520 KB SRAM |
| **Flash** | 4 MB |
| **Connectivity** | WiFi 802.11 b/g/n, Bluetooth |
| **Power Input** | 3.3V - 12V |
| **GPIO** | 36 pins |
| **ADC** | 12-bit, 8 channels |

### Sensor Specifications

| Sensor | Part Number | Accuracy | Range |
|--------|-------------|----------|-------|
| **Water Level** | HC-SR04 or JSN-SR04T | ±1 cm | 0-400 cm |
| **Rain Gauge** | Tipping bucket 0.5 mm | ±0.5 mm | - |
| **Temperature/Humidity** | DHT22 | ±0.5°C, ±2% | -40 to 80°C |
| **Soil Moisture** | Capacitive | ±3% | 0-100% |
| **Power** | 5W Solar + 2x 18650 Li-ion | - | 7.4V nominal |

### Enclosure Specifications

- IP67 rating (waterproof, dustproof)
- Material: ABS or polycarbonate
- Vents for temperature sensor
- Cable glands for wiring
- Mounting bracket for installation

---

## Software Environment

### Backend Requirements
- Python 3.9+
- Flask 2.0+ or FastAPI 0.95+
- PostgreSQL 12+
- Redis 6.0+ (optional, for caching)
- Docker 20.10+

### Frontend Requirements
- Node.js 16+
- React 18+ or Vue 3+
- npm or yarn

### Development Tools
- Git 2.30+
- Visual Studio Code (recommended)
- Postman (for API testing)
- Draw.io or Figma (for diagrams)
- Fritzing (for circuit diagrams)

### Cloud Services
- Firebase or Supabase (authentication, real-time DB)
- AWS S3 or similar (file storage)
- MQTT broker (CloudMQTT or self-hosted Mosquitto)

---

## Compliance & Standards

- **Data Privacy:** GDPR (if EU users), Ghana Data Protection Act (if applicable)
- **IoT Security:** NIST Cybersecurity Framework
- **SMS:** ITU-T recommendations for SMS
- **API:** RESTful API standards (RFC 7231, JSON:API)

---

**Document Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** For Implementation
