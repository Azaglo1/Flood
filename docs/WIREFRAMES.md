# Dashboard Wireframes - High Fidelity

This document provides detailed wireframes for all dashboard pages using Mermaid.js.
These can be imported into Figma, MockFlow, or other prototyping tools.

---

## Wireframe 1: Dashboard Home Page

```mermaid
flowchart TD
    subgraph HOME["Dashboard Home - /dashboard"]
        BANNER[Top Alert Banner<br/>🚨 3 Active Alerts | Risk Level: HIGH]
        
        subgraph METRICS["Key Metrics Row"]
            M1[Sensors: 📡 25 Active<br/>100% uptime]
            M2[Alerts: 🚨 3 Active<br/>+2 this hour]
            M3[Risk: 📊 72% Average<br/>Orange zone]
            M4[Battery: 🔋 92%<br/>All healthy]
        end
        
        subgraph MAP_SECTION["Interactive Map Section"]
            LEAFLET[Leaflet Map<br/>Full viewport height]
            LEGEND[Legend<br/>🟢 Low | 🟡 Moderate<br/>🟠 High | 🔴 Critical]
            CONTROLS[Controls<br/>Zoom to fit | Rainfall overlay<br/>Flood zones toggle]
        end
        
        subgraph ALERTS_SECTION["Recent Alerts Timeline"]
            A1[🔴 CRITICAL - 2 min ago<br/>Accra River - Osu Bridge<br/>Risk: 72% | Confidence: 85%<br/>[Acknowledge] [More Info]]
            A2[🟠 HIGH - 5 min ago<br/>Tema Beach Zone<br/>Sustained rainfall<br/>[Acknowledge]]
            A3[🟡 MODERATE - 12 min ago<br/>Kumasi Zone<br/>Elevated levels<br/>[Dismiss]]
        end
        
        subgraph HEALTH["System Health Indicators"]
            H1[Connectivity: 📶 Excellent<br/>24/25 online]
            H2[Database: 🟢 Healthy<br/>3.2GB / 10GB | 45ms]
        end
    end
    
    BANNER --> METRICS
    METRICS --> MAP_SECTION
    MAP_SECTION --> ALERTS_SECTION
    ALERTS_SECTION --> HEALTH
```

---

## Wireframe 2: Sensor Detail Page

```mermaid
flowchart TD
    subgraph SENSOR_DETAIL["Sensor Detail - /sensors/SEN-001"]
        HEADER[← Back | 📍 SEN-001: Accra River - Osu Bridge<br/>Status: 🟢 Online | Last Reading: 2 min ago]
        
        subgraph READINGS["Live Readings Section"]
            R1[💧 WATER LEVEL<br/>185.5 cm<br/>Trend: ↗ Rising +1.2 cm/h<br/>Normal: 180cm | Threshold: 190cm]
            R2[🌧️ RAINFALL<br/>2.3 mm<br/>Rate: +0.5 mm/h<br/>Last 6h: +8.3 mm]
            R3[🌡️ TEMPERATURE<br/>28.5 °C<br/>Feels like: 31.2°C]
            R4[💨 HUMIDITY<br/>75.2%<br/>Dew point: 24.1°C]
            R5[🌱 SOIL MOISTURE<br/>62.1%<br/>Optimal: 50-70%]
            R6[🔋 DEVICE STATUS<br/>Battery: 7.2V (92%)<br/>Signal: -65 dBm]
        end
        
        subgraph RISK["Risk Assessment"]
            SCORE[Score: 72/100]
            BAR[██████████░░░░░░░░░ ORANGE]
            CONF[Confidence: 85%]
            STATUS[Status: ⚠️ Alert Issued]
            PREDICT[Predicted Flood: 15:30 ± 15min]
            FACTORS[Factors:<br/>• Rainfall 24h: 45.3mm (36%)<br/>• Water level: 185.5cm (31%)<br/>• Trend: Rising fast (18%)]
        end
        
        subgraph TRENDS["Historical Trends"]
            CHART[Line Chart - Water Level vs Time]
            TABS[7 Days | 30 Days | YTD]
            SUMMARY[Stats: Avg 179.8cm | Peak 192.1cm | Min 175.0cm]
        end
        
        subgraph FORECAST["24-Hour Forecast"]
            TABLE[Hourly predictions table]
            PEAK[⚠️ Peak risk expected 17:00]
            STORM[🌧️ Heavy rainfall 14:00-20:00]
        end
        
        subgraph DEVICE["Device Health & Maintenance"]
            UPTIME[Uptime: 98.7%]
            FW[Firmware: v1.2.3]
            BAT_TREND[Battery trend chart]
            CAL[Calibration status per sensor]
            MAINT[Maintenance log]
        end
    end
    
    HEADER --> READINGS
    READINGS --> RISK
    RISK --> TRENDS
    TRENDS --> FORECAST
    FORECAST --> DEVICE
```

---

## Wireframe 3: Alerts & Notifications Page

```mermaid
flowchart TD
    subgraph ALERTS["Alerts & Notifications - /alerts"]
        FILTERS[Filter Bar:<br/>Status: [All Active Acknowledged]
        Severity: [All High Critical]
        Location: [All Sensors ▼]
        Date: [Last 7 Days ▼]
        [Reset Filters]]
        
        subgraph ALERT_LIST["Alert List - Expandable Cards"]
            CARD1[🔴 CRITICAL - 2026-07-04 14:30<br/>
            ─────────────────────────────────────<br/>
            🏙️ Accra River - Osu Bridge<br/>
            Water level critical (185.5 cm).<br/>
            Flood likely in ~1 hour.<br/>
            Recommend evacuation of<br/>
            low-lying areas.<br/>
            ─────────────────────────────────────<br/>
            Risk: 72% | Confidence: 85%<br/>
            [Acknowledge] [More Info] [Share]]
            
            CARD2[🟠 HIGH - 2026-07-04 14:15<br/>
            ─────────────────────────────────────<br/>
            🏖️ Tema Beach Zone<br/>
            Sustained high rainfall.<br/>
            Risk remains elevated.<br/>
            ─────────────────────────────────────<br/>
            Risk: 68% | Confidence: 82%<br/>
            [Acknowledge] [More Info]]
            
            CARD3[🟡 MODERATE - 2026-07-04 14:00<br/>
            ─────────────────────────────────────<br/>
            🏔️ Kumasi Zone<br/>
            Elevated water levels.<br/>
            Continue monitoring.<br/>
            ─────────────────────────────────────<br/>
            Risk: 45% | Ack by: John (14:05)<br/>
            [View Acknowledgment] [Reopen]]
            
            LOAD[Load More Alerts...]
        end
        
        subgraph STATS["Alert Statistics"]
            S1[Total This Month: 34]
            S2[Active: 5 | Unack: 2]
            S3[Avg Response: 8 min]
            S4[Ack Rate: 95%]
        end
    end
    
    FILTERS --> ALERT_LIST
    ALERT_LIST --> STATS
```

---

## Wireframe 4: Analytics & Reporting Page

```mermaid
flowchart TD
    subgraph ANALYTICS["Analytics & Reporting - /analytics"]
        SELECTOR[Selector Panel:<br/>
        Sensors: [Accra River ▼] [Add Sensor]<br/>
        Period: [Last 30 Days ▼]<br/>
        Metric: [Water Level ▼]
        [Generate Report] [Export CSV] [Export PDF]]
        
        TABS[Chart Tabs:<br/>
        📈 Trends | 📊 Distribution | 🎯 Comparison | 📋 Table]
        
        subgraph CHART_VIEW["Chart View"]
            LAYOUT[Left: Chart Area | Right: Stats Panel]
            LINE_CHART[Trend Line Chart<br/>Water Level over 30 days]
            BARS[Weekly bar comparison]
        end
        
        subgraph REPORT["Generated Report Summary"]
            FINDINGS[Key Findings:<br/>
            Total readings: 4,896<br/>
            Data quality: 99.2%<br/>
            Alerts triggered: 12<br/>
            False positive rate: 0%<br/>
            Avg response time: 8 min]
            
            PEAKS[Peak Events:<br/>
            1. June 22: 192.1cm<br/>
            2. June 19: 48mm rain in 24h<br/>
            3. July 2: Risk score 85%]
            
            RECS[Forecasts & Recommendations:<br/>
            • Elevated season continues<br/>
            • Increase monitoring<br/>
            • Community prep: HIGH<br/>
            [Download Full Report PDF]]
        end
    end
    
    SELECTOR --> TABS
    TABS --> CHART_VIEW
    CHART_VIEW --> REPORT
```

---

## Wireframe 5: Settings & Configuration Page

```mermaid
flowboard TD
    subgraph SETTINGS["Settings & Configuration - /settings"]
        subgraph PROFILE["User Profile"]
            NAME[Name: Kwame Mensah]
            EMAIL[Email: kwame@example.com]
            ROLE[Role: Coordinator]
            ORG[Organization: Accra Municipality]
        end
        
        subgraph NOTIFICATIONS["Notification Preferences"]
            N1[☑️ Email alerts (High/Critical)]
            N2[☑️ SMS alerts (Critical only)]
            N3[☑️ WhatsApp alerts (All levels)]
            N4[☑️ Dashboard notifications]
            N5[☑️ Daily digest email]
            THRESHOLD[Alert threshold: [50 ▼]]
        end
        
        subgraph APPEARANCE["Appearance"]
            THEME[Theme: [Auto ▼] Light Dark]
            LANG[Language: [English ▼] Akan French]
        end
        
        subgraph LOCATION["Default Location"]
            DEFAULT_SENSOR[Default sensor: [SEN-001 ▼]]
            ZOOM[Map zoom: [12 ▼]]
        end
        
        subgraph SENSOR_MGMT["Sensor Management"]
            ADD[+ Add New Sensor]
            TABLE[Sensor Table:<br/>
            Key | Location | Status | Last Read | Actions
            SEN-001 | Accra | 🟢 | 2m | [Edit] [Calibrate]
            SEN-002 | Tema | 🟢 | 3m | [Edit] [Calibrate]
            SEN-003 | Kumasi | 🟡 | 8m | [Edit] [Calibrate]]
        end
        
        subgraph ADMIN["System Administration (Admin Only)"]
            USERS[User Management<br/>[View All] [Add User]]
            HEALTH[System Health<br/>DB: 3.2GB | API: 99.8%]
            SECURITY[Security<br/>SSL: Valid | Rate: 1000 req/h]
            BACKUP[Backup & Recovery<br/>Last: Today 02:00 | Daily]
            DEPLOY[Deployment<br/>API: 1.0.0 | FE: 1.0.0]
        end
        
        SAVE[Save Changes]
    end
    
    PROFILE --> NOTIFICATIONS
    NOTIFICATIONS --> APPEARANCE
    APPEARANCE --> LOCATION
    LOCATION --> SENSOR_MGMT
    SENSOR_MGMT --> ADMIN
    ADMIN --> SAVE
```

---

## Wireframe 6: Mobile Navigation Flow

```mermaid
flowchart TD
    subgraph MOBILE["Mobile Responsive Layout"]
        subgraph LOGIN["Login Screen"]
            LOGO[FloodSense Ghana Logo]
            FORM[Email | Password]
            BTN[Login Button]
            FORGOT[Forgot Password?]
        end
        
        LOGIN --> DASHBOARD
        
        subgraph DASHBOARD["Mobile Dashboard"]
            DRAWER[☰ Sidebar Drawer<br/>Navigation]
            MOBILE_MAP[Map (Full width)]
            MOBILE_METRICS[Scrollable Metrics]
            MOBILE_ALERTS[Alert Cards Stack]
        end
        
        DRAWER --> NAV1[Navigate: Dashboard]
        DRAWER --> NAV2[Sensors]
        DRAWER --> NAV3[Alerts]
        DRAWER --> NAV4[Analytics]
        DRAWER --> NAV5[Settings]
        
        MOBILE_MAP -.Critical Alert Notification
        ALERT_PUSH[🔴 Full-screen Alert<br/>FLOOD WARNING<br/>Risk: 95%<br/>Location: Accra River<br/>Action: EVACUATE]
    end
```

---

## Wireframe 7: Component Library

```mermaid
fluid TD
    subgraph COMPONENTS["Reusable Component Library"]
        subgraph RISK_BADGE["RiskBadge Component"]
            RB1[score: 72]
            RB2[level: ORANGE]
            RB3[label: "High Risk"]
        end
        
        subgraph METRIC_CARD["MetricCard Component"]
            MC1[title: "Water Level"]
            MC2[value: 185.5 cm]
            MC3[trend: "+1.2/h"]
            MC4[status: rising]
            MC5[icon: 💧]
        end
        
        subgraph ALERT_CARD["AlertCard Component"]
            AC1[severity: critical]
            AC2[title: "Flood Warning"]
            AC3[message: "Water level rising"]
            AC4[timestamp: Date.now()]
            AC5[actions: [Ack] [Info]]
        end
        
        subgraph SENSOR_MARKER["SensorMarker Component"]
            SM1[position: [5.5571, -0.2083]]
            SM2[riskLevel: orange]
            SM3[sensorKey: "SEN-001"]
            SM4[onClick: navigate]
        end
        
        subgraph TREND_CHART["TrendChart Component"]
            TC1[data: historicalData]
            TC2[metric: "water_level"]
            TC3[period: "30days"]
            TC4[forecast: true]
        end
        
        subgraph ALERT_TIMELINE["AlertTimeline Component"]
            AT1[alerts: Alert[]]
            AT2[onItemClick: handler]
            AT3[compact: boolean]
        end
    end
```

---

## Wireframe 8: Color & Typography System

```mermaid
flowboard TD
    subgraph DESIGN_SYSTEM["Design System - Colors & Typography"]
        subgraph RISK_PALETTE["Risk Level Colors"]
            G[Green<br/>#10B981<br/>Low 0-20]
            Y[Yellow<br/>#F59E0B<br/>Medium 21-50]
            O[Orange<br/>#EF4444<br/>High 51-80]
            R[Red<br/>#DC2626<br/>Critical 81-100]
        end
        
        subgraph UI_PALETTE["UI Colors"]
            P[Primary: #0EA5E9]
            S[Secondary: #06B6D4]
            SUCC[Success: #10B981]
            WARN[Warning: #F59E0B]
            ERR[Error: #DC2626]
            NEUT[Neutral: #6B7280]
            DARK[Dark BG: #111827]
            LIGHT[Light BG: #F9FAFB]
        end
        
        subgraph TYPOGRAPHY["Typography Scale"]
            H1[Heading 1: Poppins Bold 32px]
            H2[Heading 2: Poppins Semi 24px]
            BODY[Body: Inter Regular 16px]
            SMALL[Small: Inter 14px]
            MONO[Mono: Fira Code 13px]
        end
        
        subgraph SPACING["Spacing System"]
            S8[8px]
            S12[12px]
            S16[16px]
            S24[24px]
            S32[32px]
            S48[48px]
        end
    end
```

---

**Wireframe Version:** 1.0  
**Last Updated:** 4 July 2026  
**Format:** Mermaid.js (importable to Figma/MockFlow via Mermaid converters)  
**Usage:** Copy diagram blocks into mermaid.live for interactive viewing