# FloodSense Ghana - Dashboard Design Specification

## Design Overview

The FloodSense Ghana dashboard is a real-time, responsive web application built with **React + TypeScript** and **Leaflet.js** for geospatial visualization. It serves as the central command center for flood monitoring across distributed sensor networks.

---

## Design Principles

1. **Information Hierarchy:** Critical data (active alerts, high-risk zones) front and center
2. **Real-time Responsiveness:** WebSocket updates with minimal latency
3. **Accessibility:** WCAG 2.1 AA compliance, dark/light mode support
4. **Mobile-First:** Responsive design from 320px to 4K displays
5. **Data-Driven:** Clear visual encodings (color, size, opacity) for risk levels
6. **Actionable:** Every screen supports decision-making by stakeholders

---

## Color Scheme & Visual Encoding

### Risk Level Color Palette
```
Green  (#10B981): Low Risk     (0-20 score)     - Safe, no action
Yellow (#F59E0B): Moderate     (21-50 score)    - Monitor closely
Orange (#EF4444): High Risk    (51-80 score)    - Alert issued, prepare
Red    (#DC2626): Critical     (81-100 score)   - Immediate action required
```

### UI Color Palette
```
Primary:    #0EA5E9   (Sky Blue - trust, water)
Secondary:  #06B6D4   (Cyan - freshness)
Success:    #10B981   (Green - safe)
Warning:    #F59E0B   (Amber - caution)
Error:      #DC2626   (Red - critical)
Neutral:    #6B7280   (Gray - secondary content)
Dark BG:    #111827   (Near-black for dark mode)
Light BG:   #F9FAFB   (Off-white for light mode)
```

### Typography
- **Headings:** Poppins (bold, modern, geometric)
- **Body:** Inter (highly legible, excellent for data)
- **Monospace:** Fira Code (technical/sensor data)

---

## Layout Architecture

### Main Layout (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│ HEADER (Logo, User, Notifications, Settings)            │
├────────────┬─────────────────────────────────────────────┤
│            │                                              │
│  SIDEBAR   │          MAIN CONTENT AREA                  │
│  (Nav)     │                                              │
│            │    [Responsive Grid]                        │
│            │                                              │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Mobile (320px-640px):** Single column, full-width cards
- **Tablet (641px-1024px):** Two columns
- **Desktop (1025px-1920px):** Three-four columns
- **Ultra-wide (1921px+):** Four-five columns + sidebar expansion

---

## Page Designs

### 1. Dashboard Home (Landing Page)

**URL:** `/dashboard`

#### Top Alert Banner
- High-priority active alerts in sticky banner
- Alert count badge, severity indicator
- Quick-action: "View All" / "Dismiss"

#### Grid Layout

**Section 1: Key Metrics (4 Cards)**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  📍 Sensors  │ │  🚨 Alerts   │ │  📊 Risk     │ │  🔋 Battery  │
│   Active     │ │   Active     │ │   Avg Score  │ │   Health     │
│     25/25    │ │      3       │ │      42%     │ │     78%      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Each card shows:
- Icon (emoji or SVG)
- Label
- Primary metric (large, bold)
- Trend indicator (↑/↓ with % change)
- Click to drill-down

**Section 2: Interactive Map**
```
┌────────────────────────────────────────────────┐
│  🗺️  SENSOR NETWORK MAP                    🔍  │
├────────────────────────────────────────────────┤
│                                                  │
│   [Leaflet Map - Fullscreen Capable]           │
│                                                  │
│   Markers:                                       │
│   🟢 Green marker (low risk)                    │
│   🟡 Yellow marker (moderate risk)              │
│   🔴 Orange marker (high risk)                  │
│   🔴 Red marker (critical risk)                 │
│                                                  │
│   Click marker → Sensor detail popup            │
│   Drag to pan, scroll to zoom                   │
│                                                  │
└────────────────────────────────────────────────┘
```

Map Features:
- Zoom to fit all sensors / Zoom to critical zones
- Layer toggle (satellite/standard/terrain)
- Rainfall overlay (from satellite data)
- Storm track animation
- Historical flood zones (polygon overlay)

**Section 3: Recent Alerts Timeline**
```
┌────────────────────────────────────────────────┐
│  🔔 RECENT ALERTS                              │
├────────────────────────────────────────────────┤
│ 14:30 🔴 CRITICAL - Accra River at 95%        │
│       Water rising rapidly. Flood likely.      │
│       [Acknowledge] [More Info]                │
│                                                 │
│ 14:15 🟠 HIGH - Tema Beach: 72% risk          │
│       Continued rainfall forecast.             │
│       [Acknowledge]                            │
│                                                 │
│ 14:00 🟡 MODERATE - Kumasi zone                │
│       Water levels elevated. Monitor.           │
│       [Dismiss]                                │
│                                                 │
│ ⋯ [Load More]                                  │
└────────────────────────────────────────────────┘
```

**Section 4: System Health**
```
┌─────────────────┐ ┌─────────────────┐
│ 📡 Connectivity │ │ 💾 Database     │
│    Excellent    │ │    Healthy      │
│   24/25 online  │ │   3.2 GB / 10GB │
│                 │ │   Response: 45ms │
└─────────────────┘ └─────────────────┘
```

---

### 2. Sensor Details Page

**URL:** `/sensors/{sensor_id}`

#### Header Section
```
┌──────────────────────────────────────────────────┐
│ ← Back  📍 SEN-001: Accra River - Osu Bridge   │
│ Status: 🟢 Online | Last Reading: 2 min ago    │
│ Location: 5.5571°N, 0.2083°W | Elevation: 8m  │
└──────────────────────────────────────────────────┘
```

#### Live Readings Section
```
┌─────────────────────────────────────────────────────────┐
│ CURRENT READINGS (Last updated: 14:35:22)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💧 WATER LEVEL                 🌧️ RAINFALL           │
│  │████████████ 185.5 cm          │████ 2.3 mm         │
│  Normal: 180cm | Threshold: 190cm│ Rate: +0.5 mm/h    │
│  Trend: ↗ Rising (+1.2 cm/h)    │ Last 6h: +8.3 mm   │
│                                                         │
│  🌡️ TEMPERATURE                 💨 HUMIDITY           │
│  28.5 °C (Normal: 24-28°C)       75.2% (Normal: 70%)   │
│  Feels like: 31.2°C              Dew point: 24.1°C    │
│                                                         │
│  🌱 SOIL MOISTURE                🔋 DEVICE STATUS     │
│  62.1% (Moderate saturation)     Battery: 7.2V (92%)   │
│  Optimal: 50-70%                 Signal: -65 dBm (OK)  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Risk Assessment
```
┌──────────────────────────────────────────────────┐
│ 🎯 FLOOD RISK ASSESSMENT                         │
├──────────────────────────────────────────────────┤
│                                                  │
│  Current Risk Score:  72 / 100                   │
│  ████████░░░░░░░░░░░ [ORANGE - High Risk]       │
│                                                  │
│  Confidence: 85% ✓                               │
│  Status: ⚠️ Alert Issued                         │
│  Predicted Flood Time: 15:30 ± 15 min           │
│  Flood Probability: 78%                          │
│                                                  │
│  Risk Factors:                                   │
│  • Rainfall 24h: 45.3 mm (36% of risk)           │
│  • Water level: 185.5 cm (31% of risk)           │
│  • Trend: Rising fast (18% of risk)              │
│  • Soil saturation: High (15% of risk)           │
│                                                  │
│  [View Model Details] [View Forecast]            │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Historical Trends Section
```
┌──────────────────────────────────────────────────┐
│ 📈 TRENDS & ANALYTICS                            │
│                                                  │
│ Time Range: [Last 7 Days ▼] [Last 30 Days] [YTD]│
│ Metric: [Water Level ▼] [Rainfall] [Risk Score] │
│                                                  │
│                                                  │
│  Water Level (cm)                                │
│  200 ├─────────────────/‾‾‾‾‾‾                  │
│      │                /                         │
│  190 ├──────────────/                            │
│      │             /                             │
│  180 ├───────────/                               │
│      │                                           │
│  170 ├────────────────────────────────────────── │
│       Mon   Tue   Wed   Thu   Fri   Sat   Sun   │
│                                                  │
│  Summary:                                        │
│  • Peak: 192.1 cm (Sat 14:00)                    │
│  • Average: 179.8 cm                             │
│  • Min: 175.0 cm (Wed 06:00)                     │
│  • Trend: Rising (slope: +1.2 cm/day)            │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Forecast Section
```
┌──────────────────────────────────────────────────┐
│ 🔮 24-HOUR FORECAST                              │
│                                                  │
│ Hour │ Rainfall │ Forecast Risk │ Trend         │
│──────┼──────────┼───────────────┼───────────    │
│ 15:00│ +0.2 mm  │ 75 (Orange)   │ ↗ Rising      │
│ 16:00│ +1.5 mm  │ 82 (Red)      │ ↗ Worsening   │
│ 17:00│ +2.1 mm  │ 85 (Red)      │ 🔴 Critical   │
│ 18:00│ +1.8 mm  │ 80 (Red)      │ ↘ Declining   │
│ 19:00│ +0.5 mm  │ 72 (Orange)   │ ↘ Improving   │
│ 20:00│ +0.0 mm  │ 65 (Orange)   │ ↘ Improving   │
│                                                  │
│ ⚠️ Peak risk expected around 17:00               │
│ 🌧️ Heavy rainfall 14:00-20:00                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Device Health & History
```
┌──────────────────────────────────────────────────┐
│ 🔧 DEVICE HEALTH & MAINTENANCE                   │
│                                                  │
│ Last Successful Reading: 2 min ago (14:35)      │
│ Uptime: 98.7% (7 days)                          │
│ Firmware Version: 1.2.3                         │
│ [Check for Updates]                             │
│                                                  │
│ Battery Trend:                                   │
│ 92% (today) → 89% (yesterday) → 86% (2d ago)   │
│ Est. Days to Recharge: 15 days (solar active)  │
│                                                  │
│ Sensor Calibration Status:                       │
│ • Water Level: ✓ Calibrated (2026-06-15)        │
│ • Temperature: ✓ Calibrated (2026-06-22)        │
│ • Humidity: ⚠️ Needs calibration (due 2026-08)  │
│                                                  │
│ [View Maintenance Log] [Schedule Service]       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### 3. Alerts & Notifications Page

**URL:** `/alerts`

#### Filter & Controls
```
┌──────────────────────────────────────────────────┐
│ 🔔 ALERTS                                        │
│                                                  │
│ Status: [All ▼] [Active] [Acknowledged]         │
│ Severity: [All ▼] [High] [Critical]             │
│ Location: [All Sensors ▼] [Search...]           │
│ Date Range: [Last 7 Days ▼]                     │
│ [Reset Filters]                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Alert List (Expandable Cards)
```
┌──────────────────────────────────────────────────┐
│ 🔴 CRITICAL - 2026-07-04 14:30                   │ ← Active
│ Accra River - Osu Bridge                         │
│ Water level critical (185.5 cm). Flood likely in│
│ ~1 hour. Recommend evacuation of low-lying areas│
│                                                  │
│ Risk: 72% | Confidence: 85%                     │
│ [Acknowledge] [More Info] [Share] [Close]      │
│                                                  │
├──────────────────────────────────────────────────┤
│ 🟠 HIGH - 2026-07-04 14:15                       │ ← Active
│ Tema Beach Zone                                  │
│ Sustained high rainfall. Risk remains elevated. │
│                                                  │
│ Risk: 68% | Confidence: 82%                     │
│ [Acknowledge] [More Info] [Share] [Close]      │
│                                                  │
├──────────────────────────────────────────────────┤
│ ✓ 🟡 MODERATE - 2026-07-04 14:00                │ ← Acknowledged
│ Kumasi Zone                                      │
│ Elevated water levels. Continue monitoring.     │
│                                                  │
│ Risk: 45% | Acknowledged by: John Mensah (14:05)│
│ [View Acknowledgment] [Reopen]                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Alert Statistics
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Total Alerts   │  Active Alerts  │  Avg Response   │
│  Issued: 847    │  Current: 5     │  Time: 8 min    │
│  This Month: 34 │  Unack.: 2      │  Ack Rate: 95%  │
└─────────────────┴─────────────────┴─────────────────┘
```

---

### 4. Analytics & Reporting Page

**URL:** `/analytics`

#### Selector Panel
```
┌─────────────────────────────────────────────────┐
│ 📊 ANALYTICS & REPORTING                        │
│                                                 │
│ Sensors: [Accra River ▼] [Add Sensor]          │
│ Period: [Last 30 Days ▼]                       │
│ Metric: [Water Level ▼]                        │
│ Granularity: [Daily ▼]                         │
│ [Generate Report] [Export CSV] [Export PDF]    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Chart Views (Tabbed)
```
Chart: [📈 Trends] [📊 Distribution] [🎯 Comparison] [📋 Table]

WATER LEVEL TRENDS (Last 30 Days)
└─────────────────────────────────────────────────┐
│                                                  │
│ 200 ├──╮                              ╭─        │
│     │  │                            ╭─┘ └─╮    │
│ 190 ├──┤ ╭──╮               ╭──────╯      └──  │
│     │  │ │  │               │                   │
│ 180 ├──╯ │  ╰───────────────╯                   │
│     │    │                                       │
│ 170 ├────╯                                       │
│      Jun 4   Jun 11   Jun 18   Jun 25   Jul 2   │
│                                                  │
│ Stats:                                           │
│ • Average: 179.8 cm                             │
│ • Peak: 192.1 cm (June 22)                      │
│ • Minimum: 175.0 cm (June 8)                    │
│ • Std Dev: 4.2 cm                               │
│ • Trend: Slightly rising (+0.3 cm/day)          │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### Report Summary
```
┌──────────────────────────────────────────────────┐
│ 📋 GENERATED REPORT                              │
│ Period: June 1 - July 4, 2026 (34 days)         │
│                                                  │
│ 🎯 KEY FINDINGS                                  │
│ • Total readings: 4,896 (successful)            │
│ • Data quality: 99.2% (excellent)               │
│ • Alerts triggered: 12                          │
│ • False positive rate: 0% (excellent)           │
│ • Average response time: 8 minutes              │
│ • Most active period: June 15-22 (monsoon)     │
│                                                  │
│ 📊 PEAK EVENTS                                   │
│ 1. June 22: Water level 192.1 cm (highest)     │
│ 2. June 19: 48 mm rainfall in 24h              │
│ 3. July 2: Risk score peaked at 85%            │
│                                                  │
│ 🔮 FORECASTS & RECOMMENDATIONS                 │
│ • Elevated season continues through July        │
│ • Recommend increased sensor monitoring         │
│ • Community preparedness level: HIGH            │
│                                                  │
│ [Download Full Report as PDF]                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### 5. Settings & Configuration Page

**URL:** `/settings`

#### User Preferences
```
┌──────────────────────────────────────────────────┐
│ ⚙️ SETTINGS                                      │
│                                                  │
│ 👤 PROFILE                                       │
│ Name: Kwame Mensah                              │
│ Email: kwame@example.com                        │
│ Role: Coordinator                               │
│ Organization: Accra Municipality                │
│ [Edit Profile] [Change Password]                │
│                                                  │
│ 🔔 NOTIFICATION PREFERENCES                      │
│ ☑️ Email alerts (High/Critical)                  │
│ ☑️ SMS alerts (Critical only)                    │
│ ☑️ WhatsApp alerts (All levels)                  │
│ ☑️ Dashboard notifications                      │
│ ☑️ Daily digest email                           │
│                                                  │
│ Alert Threshold:                                │
│ Notify me when risk score exceeds: [50 ▼]      │
│                                                  │
│ 🎨 APPEARANCE                                    │
│ Theme: [Auto ▼] [Light] [Dark]                  │
│ Language: [English ▼] [Akan] [French]           │
│                                                  │
│ 📍 DEFAULT LOCATION                              │
│ Default sensor on dashboard: [SEN-001 ▼]       │
│ Map zoom level: [12 ▼]                          │
│                                                  │
│ [Save Changes]                                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Sensor Management
```
┌──────────────────────────────────────────────────┐
│ 📡 MANAGE SENSORS                                │
│                                                  │
│ [+ Add New Sensor]                              │
│                                                  │
│ Sensor Key │ Location │ Status │ Last Read │ ⋯  │
│──────────────────────────────────────────────    │
│ SEN-001    │ Accra    │ 🟢     │ 2m ago   │ [⋯] │
│ SEN-002    │ Tema     │ 🟢     │ 3m ago   │ [⋯] │
│ SEN-003    │ Kumasi   │ 🟡     │ 8m ago   │ [⋯] │
│            │          │        │          │     │
│ Actions: [Edit] [Calibrate] [Delete] [Firmware] │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### System Administration (Admin Only)
```
┌──────────────────────────────────────────────────┐
│ 🔧 SYSTEM ADMINISTRATION                         │
│                                                  │
│ 👥 USER MANAGEMENT                               │
│ [View All Users] [Add User] [Export User List]  │
│                                                  │
│ 📊 SYSTEM HEALTH                                 │
│ Database: Healthy (3.2 GB / 10 GB)              │
│ API Uptime: 99.8%                               │
│ MQTT Broker: Connected                          │
│ [View Logs] [System Status]                     │
│                                                  │
│ 🔐 SECURITY                                      │
│ SSL Certificate: Valid until 2027-01-15         │
│ API Rate Limiting: 1000 req/hour                │
│ [Audit Log] [Access Control]                    │
│                                                  │
│ 💾 BACKUP & RECOVERY                             │
│ Last Backup: Today at 02:00 UTC                │
│ Backup Frequency: Daily                        │
│ [Manual Backup] [Restore] [Backup Policy]      │
│                                                  │
│ 🚀 DEPLOYMENT                                    │
│ API Version: 1.0.0                              │
│ Frontend Version: 1.0.0                         │
│ [Check Updates] [Deploy] [Rollback]            │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Component Library

### Reusable Components

```typescript
// Risk Badge Component
<RiskBadge score={72} label="High Risk" />

// Metric Card Component
<MetricCard 
  title="Water Level"
  value={185.5}
  unit="cm"
  trend="+1.2/h"
  status="rising"
  gauge={true}
/>

// Alert Card Component
<AlertCard
  severity="critical"
  title="Flood Warning"
  message="Water level rising rapidly"
  timestamp={new Date()}
  onAcknowledge={() => {}}
/>

// Sensor Marker Component (Leaflet)
<SensorMarker
  position={[5.5571, -0.2083]}
  riskLevel="orange"
  sensorKey="SEN-001"
  onClick={() => navigate(`/sensors/${sensorId}`)}
/>

// Trend Chart Component
<TrendChart
  data={historicalData}
  metric="water_level"
  period="30days"
  showForecast={true}
/>

// Timeline Component
<AlertTimeline
  alerts={alerts}
  onItemClick={handleAlertClick}
/>
```

---

## State Management (Redux/Zustand)

```typescript
// Global State Structure
{
  sensors: {
    entities: { [id]: Sensor },
    ids: string[],
    loading: boolean,
    error: string | null,
    lastUpdated: timestamp
  },
  readings: {
    current: { [sensorId]: Reading },
    historical: { [sensorId]: Reading[] },
    loading: boolean
  },
  risks: {
    predictions: { [sensorId]: RiskPrediction },
    forecast: { [sensorId]: ForecastPoint[] }
  },
  alerts: {
    active: Alert[],
    history: Alert[],
    unacknowledgedCount: number
  },
  user: {
    id: string,
    email: string,
    role: 'admin' | 'coordinator' | 'viewer',
    preferences: UserPreferences
  },
  ui: {
    sidebarOpen: boolean,
    darkMode: boolean,
    selectedSensor: string | null,
    notifications: Notification[]
  }
}
```

---

## Real-time Updates (WebSocket Integration)

```typescript
// Events from backend via WebSocket
interface WSMessage {
  type: 'reading' | 'risk_update' | 'alert' | 'sensor_status';
  timestamp: Date;
  payload: any;
}

// Update strategy:
// 1. Reading received → Update readings store → Re-render metric cards
// 2. Risk update → Update predictions store → Color-code map marker
// 3. Alert triggered → Add to alerts store → Trigger notification
// 4. Sensor status change → Update sensors store → Update status indicator
```

---

## Performance Optimizations

1. **Code Splitting:** Lazy-load pages with React.lazy()
2. **Memoization:** useMemo, useCallback to prevent unnecessary re-renders
3. **Virtual Scrolling:** Large alert lists use windowing
4. **Image Optimization:** WebP format with fallbacks
5. **Caching Strategy:** Service Worker for offline support
6. **Bundle Analysis:** Monitor bundle size with Webpack Bundle Analyzer

---

## Accessibility Checklist

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color not sole means of information (also use icons/text)
- [ ] Sufficient color contrast (WCAG AA: 4.5:1 for text)
- [ ] Screenreader tested (NVDA, JAWS)
- [ ] Focus indicators visible
- [ ] Forms properly labeled and validated
- [ ] Responsive text sizing (no fixed px units)
- [ ] Alternative text for all images

---

## Mobile Considerations

- **Touch Targets:** Minimum 48×48px
- **Map Interaction:** Pinch-to-zoom, swipe to pan
- **Alert Notifications:** Full-screen for critical alerts
- **Data:** Optimize for metered connections (progressive image loading)
- **Offline:** Cache critical dashboard data in IndexedDB

---

**Dashboard Design Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for Frontend Development
