# FloodSense Ghana

**An Intelligent Community Flood Monitoring and Early Warning System Using IoT, Satellite Data and Predictive Analytics**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Alpha-yellow.svg)]()
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791.svg)]()

## One-Sentence Pitch

FloodSense Ghana is a low-cost IoT and satellite-powered early warning system that **predicts flood risks in real time** and automatically alerts communities before flooding occurs, enabling proactive disaster response instead of reactive recovery.

---

## Table of Contents

- [Vision](#vision)
- [Key Differentiators](#key-differentiators)
- [Problem Statement](#problem-statement)
- [Target Users](#target-users)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Vision

FloodSense Ghana transforms community flood response through **intelligent prediction** rather than reactive monitoring. By combining:

- 📡 **Distributed IoT sensor networks** (ESP32-based nodes)
- 🛰️ **Satellite weather data** (rainfall estimates, storm tracking)
- 🧠 **Machine learning predictions** (risk scoring, flood forecasting)
- 📱 **Multi-channel alerting** (SMS, WhatsApp, Email, Dashboard)

We enable communities, municipalities, and disaster management agencies to **predict floods before they occur** and take **preventive action** with confidence.

### Why This Matters

In flood-prone regions of Ghana:
- ⚠️ Communities receive **little-to-no warning** before flooding
- 🏚️ Reactive responses lead to **preventable loss of lives**
- 💔 Property damage disrupts **livelihoods and economies**
- 📊 Existing systems rely on **regional weather forecasts**, not local conditions

**FloodSense Ghana changes this narrative** through hyperlocal, predictive monitoring.

---

## Key Differentiators

| Aspect | Typical Solution | FloodSense Ghana |
|--------|-----------------|------------------|
| **Approach** | Reactive (measure current level) | **Predictive** (forecast risks) |
| **Data Sources** | Single sensor per location | **Multiple sources** (IoT + satellite + weather) |
| **Scalability** | Single prototype | **Distributed network** (1 to 1000+ nodes) |
| **Intelligence** | Alert on threshold breach | **AI-powered risk scoring** |
| **Real-world Ready** | Hackathon demo | **Designed for NADMO/municipal deployment** |
| **Cost per Node** | $200-300 | **$130-150** (sustainable) |

---

## Problem Statement

### Context
Ghana's flood-prone areas (Accra, Tema, Kumasi, etc.) face recurrent flooding with devastating consequences:
- Loss of lives
- Economic disruption ($50M+ annual losses)
- Displacement of communities
- Damage to critical infrastructure

### Root Cause
Existing early warning systems:
1. Rely on **coarse-resolution satellite data** (25+ km resolution)
2. Use **regional weather forecasts** that don't reflect local microclimates
3. Depend on **manual observations** (slow, inconsistent)
4. Have **long alert lead times** (hours, not real-time)
5. Don't integrate **predictive analytics** for proactive response

### Our Solution
FloodSense Ghana provides:
- ✅ **Hyperlocal monitoring** (meter-scale precision)
- ✅ **Real-time predictions** (updated every 5-10 minutes)
- ✅ **Integrated intelligence** (IoT + satellite + AI)
- ✅ **Automated alerting** (SMS, WhatsApp, Email)
- ✅ **Actionable insights** (flood timing, probability, impact)

---

## Target Users

### Primary Stakeholders
- **Community Residents** - Direct beneficiaries of early warnings
- **Municipal Authorities** - Decision-makers for evacuation/resource allocation
- **Schools & Hospitals** - Critical infrastructure needing advance notice
- **NGOs** - Disaster response organizations partnering with communities

### Secondary Stakeholders (Future)
- National Disaster Management Organisation (NADMO)
- Ghana Meteorological Agency (GMet)
- Fire Service & Emergency Response
- District Assemblies
- Development Partners (World Bank, USAID, AfDB)

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS & INTERFACES                      │
│  Web Dashboard | Mobile App | SMS Alerts | WhatsApp Alerts  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     API LAYER (REST/WebSocket)              │
│  Authentication | Data Management | Alert Handling | Auth   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  APPLICATION SERVICES                        │
│  Data Pipeline | ML Prediction Engine | Alert Dispatcher    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  DATA LAYER                                  │
│  PostgreSQL Database | Redis Cache | Time-Series Storage    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 EXTERNAL DATA SOURCES                        │
│  IoT Sensors | Satellite APIs | Weather Forecasts | SMS API │
└─────────────────────────────────────────────────────────────┘
```

### Components

For detailed architecture, see [SYSTEM_ARCHITECTURE.md](/docs/SYSTEM_ARCHITECTURE.md)

---

## Technology Stack

### Frontend
```yaml
Framework:      React 18 + TypeScript
UI Library:     Material-UI / Tailwind CSS
Maps:           Leaflet.js + OpenStreetMap
State:          Redux Toolkit / Zustand
Real-time:      WebSocket (Socket.io)
Testing:        Jest + React Testing Library
Build:          Vite
Deploy:         Vercel / Netlify / S3 + CloudFront
```

### Backend
```yaml
Language:       Python 3.9+
Framework:      FastAPI (async) / Flask
Database:       PostgreSQL 12+
Cache:          Redis 6.0+
Message Queue:  MQTT (Mosquitto)
Auth:           JWT + OAuth2
ML Lib:         TensorFlow / Scikit-learn / Prophet
Testing:        pytest
CI/CD:          GitHub Actions
Deploy:         Docker + Kubernetes / Cloud Run
```

### Infrastructure
```yaml
Cloud:          Firebase / Supabase / AWS / Google Cloud
Container:      Docker + Docker Compose
IaC:            Terraform / CloudFormation
Monitoring:     Prometheus + Grafana / DataDog
Logging:        ELK Stack / Splunk
APM:            New Relic / Sentry
```

### Hardware
```yaml
Microcontroller:  ESP32-WROOM-32E
Sensors:
  - Water Level:    HC-SR04 / JSN-SR04T (ultrasonic)
  - Rainfall:       Tipping bucket (0.5mm precision)
  - Temperature:    DHT22 / BME280
  - Humidity:       DHT22 / BME280
  - Soil Moisture:  Capacitive sensor
Power:
  - Solar Panel:    5W 18V
  - Battery:        2x 18650 Li-ion (7.4V nominal)
  - Charger:        TP4056 module
Connectivity:     WiFi 802.11 b/g/n / 4G LTE (optional)
Enclosure:        IP67 ABS/Polycarbonate
```

---

## Features

### 1. Real-Time Sensor Monitoring
- Live readings from distributed sensor network
- Automatic data validation and anomaly detection
- Battery and connectivity status tracking
- Historical data retention (12+ months)

### 2. Intelligent Prediction Engine
- ML-based flood risk scoring (0-100)
- Risk level classification (Green → Yellow → Orange → Red)
- Predicted flood timing with confidence intervals
- Contributing factors analysis

### 3. Multi-Channel Alerting
- **SMS Alerts** (Twilio / Africastalking)
- **WhatsApp Messages** (interactive buttons)
- **Email Reports** (formatted with charts)
- **Dashboard Notifications** (real-time)
- Alert prioritization and escalation
- Customizable thresholds per sensor

### 4. Interactive Dashboard
- Real-time sensor network map (Leaflet.js)
- Live metric cards with trend indicators
- Risk assessment visualization
- 24-hour flood forecast charts
- Historical analytics (7-day, 30-day, YTD views)
- Alert timeline and history
- System health monitoring

### 5. User Management & Permissions
- Role-based access control (RBAC)
  - **Admin:** Full system access
  - **Coordinator:** Acknowledge alerts, manage sensors
  - **Viewer:** Read-only dashboard access
- User authentication (JWT + OAuth2)
- Audit trail of all actions

### 6. Analytics & Reporting
- Trend analysis (water levels, rainfall, risk scores)
- Statistical summaries (mean, median, std dev, percentiles)
- Flood event identification and classification
- Performance metrics (alert accuracy, response time)
- PDF/CSV export capabilities
- Custom report generation

### 7. System Administration
- Sensor registration and management
- Firmware updates (OTA capability)
- Database backup and recovery
- Performance monitoring and alerting
- Security and compliance features

---

## Getting Started

### Prerequisites
- Git
- Python 3.9+
- Node.js 16+
- Docker & Docker Compose (optional but recommended)
- PostgreSQL 12+ (local or cloud)
- Redis 6+ (optional, for caching)

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/floodsense-ghana.git
cd floodsense-ghana
```

#### 2. Set Up Environment

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your API endpoint
npm run dev
```

#### 3. Run Locally

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# API running on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Dashboard on http://localhost:5173
```

### Documentation Structure

```
docs/
├── SYSTEM_ARCHITECTURE.md      # Detailed architecture & design patterns
├── TECHNICAL_REQUIREMENTS.md   # Functional & non-functional specs
├── DATABASE_DESIGN.md          # ER diagrams, migrations, indexing
├── API_SPECIFICATION.md        # REST endpoints, WebSocket events
├── DASHBOARD_DESIGN.md         # UI/UX specifications, components
├── BILL_OF_MATERIALS.md        # Hardware costs, deployment scenarios
├── DEVELOPMENT_ROADMAP.md      # Phased timeline & milestones
├── ARCHITECTURE_DIAGRAMS.md    # System architecture ASCII diagrams
├── VISUAL_DIAGRAMS.md          # Mermaid.js diagrams for everything
├── HARDWARE_CIRCUITS.md         # Schematic ASCII art for hardware
├── CIRCUIT_DIAGRAMS.md          # Fritzing-compatible circuit schematics
├── WIREFRAMES.md                # Dashboard page wireframes
├── DIAGRAM_GUIDE.md             # How to use, export, and edit diagrams
└── diagrams/                    # Architecture visuals (Draw.io exports)
```

### Visual Diagrams
All diagrams are available in Mermaid.js format for easy viewing:
- **System Architecture:** 7-layer view, data flow, deployment, CI/CD
- **Hardware Circuits:** ESP32 pinout, sensors, power management
- **Dashboard Wireframes:** All 5 pages + mobile layout
- **ER Diagrams:** Database schema relationships
- **Sequence Diagrams:** End-to-end alert flows

View diagrams on [GitHub](https://github.com/yourusername/floodsense-ghana/blob/main/docs/VISUAL_DIAGRAMS.md) or export using [mermaid-cli](https://github.com/mermaid-js/mermaid-cli).

---

## Development

### Project Structure

```
floodsense-ghana/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app initialization
│   │   ├── config.py            # Configuration management
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── sensor.py
│   │   │   ├── reading.py
│   │   │   ├── alert.py
│   │   │   └── user.py
│   │   ├── routes/              # API endpoints
│   │   │   ├── sensors.py
│   │   │   ├── data.py
│   │   │   ├── risks.py
│   │   │   └── alerts.py
│   │   ├── services/            # Business logic
│   │   │   ├── prediction.py    # ML pipeline
│   │   │   ├── alert.py         # Alert generation
│   │   │   └── data_processor.py
│   │   ├── utils/               # Helpers
│   │   │   ├── validators.py
│   │   │   ├── logger.py
│   │   │   └── cache.py
│   │   └── tests/               # Unit & integration tests
│   ├── migrations/              # Alembic database migrations
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SensorMap.tsx
│   │   │   ├── AlertCard.tsx
│   │   │   └── Charts.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SensorDetailsPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   └── AnalyticsPage.tsx
│   │   ├── services/            # API client
│   │   │   └── api.ts
│   │   ├── store/               # State management
│   │   │   └── slices/
│   │   ├── styles/              # Tailwind config
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── hardware/
│   ├── sensor_node/             # ESP32 firmware
│   │   ├── src/
│   │   │   ├── main.cpp
│   │   │   ├── sensors.cpp
│   │   │   ├── wifi.cpp
│   │   │   └── mqtt.cpp
│   │   └── platformio.ini
│   └── circuits/                # Circuit diagrams (Fritzing)
│
├── data/
│   ├── models/                  # Trained ML models
│   ├── training/                # Training scripts
│   └── datasets/                # Historical data
│
├── docs/                        # Documentation
├── docker-compose.yml
├── .github/                     # GitHub Actions CI/CD
├── .gitignore
├── LICENSE
└── README.md
```

### Coding Standards

#### Python (Backend)
- **Style:** PEP 8 with Black formatter
- **Linting:** flake8, pylint
- **Type Hints:** mypy for static type checking
- **Docstrings:** Google-style
- **Testing:** pytest with >80% coverage

#### TypeScript (Frontend)
- **Style:** ESLint + Prettier
- **Strict Mode:** Full TypeScript strict checking enabled
- **Components:** Functional components with hooks
- **Testing:** Jest + React Testing Library
- **Accessibility:** axe-core automated testing

#### Git Workflow
```
main (production)
├── staging (pre-release testing)
└── feature/ branches (development)
    ├── feature/sensor-calibration
    ├── feature/ml-model-v2
    └── fix/alert-notification-bug
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>

Examples:
feat(api): Add sensor registration endpoint
fix(dashboard): Fix map zoom on mobile
docs(readme): Update installation instructions
test(alert): Add unit tests for alert dispatcher
```

### Testing Strategy

```
Backend (Python):
├── Unit Tests         (50% coverage)      - models, validators, utils
├── Integration Tests  (30% coverage)      - API endpoints, DB
├── ML Model Tests     (20% coverage)      - prediction accuracy
└── E2E Tests          (CI/CD pipeline)    - full workflow

Frontend (React):
├── Component Tests    (50% coverage)      - isolated components
├── Integration Tests  (30% coverage)      - page workflows
└── E2E Tests          (20% coverage)      - full user journeys
```

### Performance Benchmarks

```
Backend:
- API response: <500ms p95
- Database query: <1s p95 (for complex aggregations)
- Sensor ingestion: 100+ concurrent connections

Frontend:
- Dashboard load: <3 seconds (4G)
- Map render: <1 second
- Alert notification: <500ms latency

ML Model:
- Prediction inference: <100ms
- Model update (daily): <5 minutes
```

---

## Deployment

### Development Environment
```bash
docker-compose -f docker-compose.dev.yml up
# Backend: http://localhost:8000/docs (Swagger)
# Frontend: http://localhost:5173
# PostgreSQL: localhost:5432
# MQTT: localhost:1883
```

### Production Deployment

For cloud deployment options, see [DEPLOYMENT.md](docs/DEPLOYMENT.md) (to be created)

**Recommended Platforms:**
- **Backend:** Google Cloud Run / AWS Lambda / Heroku
- **Frontend:** Vercel / Netlify / CloudFlare Pages
- **Database:** Cloud SQL / AWS RDS / Supabase
- **Storage:** Cloud Storage / S3
- **IoT:** Google Cloud IoT / AWS IoT Core / Azure IoT Hub

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to fork and create branches
- Code review process
- Pull request guidelines
- Development environment setup

### Current Priorities (Phase 1: Jul 4-14)
- [ ] Create system architecture diagrams
- [ ] Design database migrations
- [ ] Build dashboard wireframes
- [ ] Complete API specification
- [ ] Design hardware circuits

See [DEVELOPMENT_ROADMAP.md](/docs/DEVELOPMENT_ROADMAP.md) for detailed timeline.

---

## Security

### Data Protection
- All communications: HTTPS/TLS 1.3
- Passwords: bcrypt hashing (cost factor: 12)
- Sensitive data: Encrypted at rest (AES-256)
- API keys: Rotated every 90 days

### Compliance
- GDPR-ready (data privacy)
- Ghana Data Protection Act compliance
- Regular security audits
- Penetration testing (Q4 2026)

### Reporting Security Issues
Please report vulnerabilities to: **security@floodsense.com**  
Do NOT open public GitHub issues for security vulnerabilities.

---

## License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

Commercial use is permitted. We request attribution and would appreciate collaboration on public sector deployments.

---

## Support

### Documentation
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [API Reference](docs/API_SPECIFICATION.md)
- [Dashboard Design](docs/DASHBOARD_DESIGN.md)
- [Developer Guide](docs/DEVELOPMENT_ROADMAP.md)

### Getting Help
- **Issues:** [GitHub Issues](https://github.com/yourusername/floodsense-ghana/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/floodsense-ghana/discussions)
- **Email:** support@floodsense.com

---

## Acknowledgments

- SOKO Aerial Robotics (hackathon sponsor)
- Ghana Meteorological Agency (data partnership)
- Community partners in flood-prone regions
- Open source communities (React, FastAPI, Leaflet.js, etc.)

---

## Roadmap

### Phase 1: Foundation (Jul 4-14)
✅ Project setup, architecture, documentation

### Phase 2: Proposal (Jul 15-25)
📝 Comprehensive proposal, pitch deck

### Phase 3: Development (Jul 26-Aug 15)
💻 API, dashboard, ML model, firmware

### Phase 4: Integration (Aug 16-21)
🧪 Testing, deployment, submission

### Future (Post-Hackathon)
- Mobile app (React Native)
- Advanced ML models (LSTM, ensemble methods)
- Drone-based sensor deployment
- Integration with NADMO systems
- Regional expansion (other African countries)

---

**Last Updated:** 4 July 2026  
**Project Status:** Phase 1 - Foundation & Design  
**Maintainers:** [Your Team Names]  
**Version:** 1.0.0-alpha
