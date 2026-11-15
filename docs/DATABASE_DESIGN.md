# FloodSense Ghana - Database Design

## Database Schema Overview

The database uses PostgreSQL with the following core tables:

---

## Entity-Relationship Diagram (Text Format)

```
USERS (1) ──────── (N) ALERT_ACKNOWLEDGMENTS
  │
  └────── (1) ─── (N) AUDIT_LOG


SENSORS (1) ──────── (N) READINGS
  │
  ├────── (1) ─── (N) RISK_PREDICTIONS
  │
  ├────── (1) ─── (N) ALERTS
  │
  └────── (1) ─── (N) SENSOR_STATUS


READINGS (1) ──────── (N) DERIVED_METRICS (e.g., hourly averages)
RISK_PREDICTIONS (1) ──────── (N) ALERTS
ALERTS (1) ──────── (N) ALERT_ACKNOWLEDGMENTS
ALERTS (1) ──────── (N) NOTIFICATION_LOG
```

---

## Table Definitions

### 1. users
Stores user account information and access control.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'coordinator', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
```

---

### 2. sensors
Represents each physical sensor node in the network.

```sql
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_key VARCHAR(50) NOT NULL UNIQUE,  -- e.g., "SEN-001"
    location_name VARCHAR(255) NOT NULL,      -- e.g., "Accra River - Osu Bridge"
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL CHECK (sensor_type IN 
        ('water_level', 'rainfall', 'combined', 'comprehensive')),
    description TEXT,
    installation_date DATE,
    activated_date DATE,
    installed_by VARCHAR(255),
    
    -- Hardware info
    hardware_model VARCHAR(100),  -- e.g., "ESP32-WROOM"
    firmware_version VARCHAR(50),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_data_received TIMESTAMP,
    battery_voltage FLOAT,
    signal_strength INT,  -- RSSI in dBm
    
    -- Configuration
    reporting_interval_seconds INT DEFAULT 600,  -- 10 minutes
    timezone VARCHAR(50) DEFAULT 'Africa/Accra',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_coordinates CHECK (
        latitude BETWEEN -90 AND 90 
        AND longitude BETWEEN -180 AND 180
    )
);

CREATE INDEX idx_sensors_location ON sensors(location_name);
CREATE INDEX idx_sensors_status ON sensors(is_active);
CREATE INDEX idx_sensors_coordinates ON sensors USING GIST(
    ll_to_earth(latitude, longitude)
);
```

---

### 3. readings
Stores raw sensor measurements.

```sql
CREATE TABLE readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    
    -- Measurements
    water_level_cm FLOAT,  -- NULL if sensor doesn't measure this
    rainfall_mm FLOAT,
    temperature_c FLOAT,
    humidity_percent FLOAT,
    soil_moisture_percent FLOAT,
    water_flow_speed_mps FLOAT,  -- Optional
    
    -- Device status
    battery_voltage FLOAT,
    rssi INT,  -- Signal strength
    
    -- Metadata
    timestamp TIMESTAMP NOT NULL,  -- UTC
    received_at TIMESTAMP DEFAULT NOW(),
    data_quality_score FLOAT CHECK (data_quality_score BETWEEN 0 AND 1),
    is_anomaly BOOLEAN DEFAULT false,
    
    CONSTRAINT not_all_null CHECK (
        water_level_cm IS NOT NULL 
        OR rainfall_mm IS NOT NULL 
        OR temperature_c IS NOT NULL
    )
);

CREATE INDEX idx_readings_sensor_timestamp ON readings(sensor_id, timestamp DESC);
CREATE INDEX idx_readings_timestamp ON readings(timestamp DESC);
```

**Partitioning Strategy:** Partition by month on `timestamp` for better performance on large datasets.

---

### 4. risk_predictions
ML model predictions for each sensor.

```sql
CREATE TABLE risk_predictions (
    id BIGSERIAL PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    reading_id BIGINT REFERENCES readings(id),
    
    -- Risk assessment
    risk_score FLOAT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN 
        ('green', 'yellow', 'orange', 'red')),
    confidence FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    
    -- Prediction details
    predicted_flood_time TIMESTAMP,  -- NULL if no flood predicted
    flood_probability FLOAT CHECK (flood_probability BETWEEN 0 AND 1),
    
    -- Features used in prediction (JSON for flexibility)
    input_features JSONB,  -- {rainfall_24h, water_level, soil_moisture, ...}
    model_version VARCHAR(50),  -- Track which model generated this
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    predicted_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_risk_sensor_time ON risk_predictions(sensor_id, predicted_at DESC);
CREATE INDEX idx_risk_level ON risk_predictions(risk_level) WHERE risk_level IN ('orange', 'red');
```

---

### 5. alerts
Triggered when risk exceeds thresholds.

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    risk_prediction_id BIGINT REFERENCES risk_predictions(id),
    
    -- Alert details
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN 
        ('flood_warning', 'flood_critical', 'system_error')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN 
        ('low', 'medium', 'high', 'critical')),
    
    -- Message
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Recipients (array or foreign key to recipients table)
    recipient_ids UUID[] DEFAULT ARRAY[]::UUID[],
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN 
        ('active', 'acknowledged', 'dismissed', 'expired')),
    
    -- Timing
    triggered_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,  -- After this, alert is considered expired
    
    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_sensor_status ON alerts(sensor_id, status);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_alerts_expires ON alerts(expires_at) WHERE status = 'active';
```

---

### 6. alert_acknowledgments
Tracks who acknowledged which alerts and when.

```sql
CREATE TABLE alert_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    
    -- Acknowledgment details
    acknowledged_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    action_taken VARCHAR(255),  -- e.g., "Evacuated zone", "Road closed"
    
    UNIQUE(alert_id, user_id)  -- One ack per user per alert
);

CREATE INDEX idx_ack_alert ON alert_acknowledgments(alert_id);
CREATE INDEX idx_ack_user ON alert_acknowledgments(user_id);
```

---

### 7. notifications
Audit log of all sent notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    
    -- Destination
    channel VARCHAR(50) NOT NULL CHECK (channel IN 
        ('sms', 'whatsapp', 'email', 'dashboard', 'push')),
    recipient_address VARCHAR(255) NOT NULL,  -- Phone, email, etc.
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN 
        ('pending', 'sent', 'failed', 'delivered', 'read')),
    error_message TEXT,
    
    -- Timestamps
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Retry logic
    retry_count INT DEFAULT 0,
    last_retry_at TIMESTAMP
);

CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_channel ON notifications(channel);
```

---

### 8. sensor_status
Time-series of sensor health (battery, connectivity).

```sql
CREATE TABLE sensor_status (
    id BIGSERIAL PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    
    -- Status
    is_online BOOLEAN NOT NULL,
    battery_voltage FLOAT,
    battery_percent FLOAT CHECK (battery_percent BETWEEN 0 AND 100),
    signal_strength INT,  -- RSSI in dBm
    
    -- Last communication
    last_ping TIMESTAMP,
    last_successful_reading TIMESTAMP,
    
    -- Alerts
    status_changed_at TIMESTAMP NOT NULL,
    status_issue_type VARCHAR(100),  -- 'low_battery', 'no_signal', etc.
    
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_sensor ON sensor_status(sensor_id, recorded_at DESC);
```

---

### 9. derived_metrics
Pre-computed aggregates for performance.

```sql
CREATE TABLE derived_metrics (
    id BIGSERIAL PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    
    -- Time period
    metric_period VARCHAR(50) NOT NULL CHECK (metric_period IN 
        ('hourly', 'daily', 'weekly', 'monthly')),
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    
    -- Aggregated values
    avg_water_level_cm FLOAT,
    min_water_level_cm FLOAT,
    max_water_level_cm FLOAT,
    water_level_trend VARCHAR(20),  -- 'rising', 'falling', 'stable'
    
    avg_rainfall_mm FLOAT,
    total_rainfall_mm FLOAT,
    avg_temperature_c FLOAT,
    max_temperature_c FLOAT,
    min_temperature_c FLOAT,
    
    reading_count INT,
    data_availability_percent FLOAT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metrics_sensor_period ON derived_metrics(
    sensor_id, metric_period, period_start DESC
);
```

---

### 10. audit_log
Tracks all user actions for compliance.

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action details
    action VARCHAR(100) NOT NULL,  -- 'create', 'update', 'delete', 'acknowledge_alert'
    resource_type VARCHAR(50) NOT NULL,  -- 'sensor', 'alert', 'user'
    resource_id VARCHAR(255),
    
    -- Changes (old and new values)
    old_values JSONB,
    new_values JSONB,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
```

---

## Data Retention & Archival

| Table | Retention | Archive Strategy |
|-------|-----------|------------------|
| `readings` | 12 months | Archive to cold storage quarterly |
| `risk_predictions` | 12 months | Archive with readings |
| `alerts` | 36 months | Keep for historical analysis |
| `notifications` | 6 months | Archive after 3 months |
| `audit_log` | 24 months | Comply with regulatory requirements |
| Other tables | Indefinite | Keep active data |

---

## Performance Optimization

### Indexes

```sql
-- Fast sensor queries
CREATE INDEX idx_sensors_active_location ON sensors(is_active, location_name);

-- Fast reading queries by sensor and time
CREATE INDEX idx_readings_sensor_time ON readings(sensor_id, timestamp DESC);

-- Fast risk assessment queries
CREATE INDEX idx_risk_by_level ON risk_predictions(risk_level) 
WHERE risk_level IN ('orange', 'red');

-- Alert status queries
CREATE INDEX idx_alerts_active ON alerts(status) 
WHERE status IN ('active', 'acknowledged');
```

### Query Optimization Strategies

1. **Partitioning:** `readings` table partitioned by month
2. **Materialized Views:** Pre-compute dashboard statistics
3. **Caching:** Use Redis for frequently accessed data (current risk levels)
4. **Denormalization:** Store some calculated fields in `readings` for speed

---

## Data Backup & Recovery

- **Daily Backups:** Automated nightly backups to S3-compatible storage
- **Backup Retention:** 30 days of daily backups, 12 months of monthly backups
- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 1 hour (backup frequency)

---

## Security Considerations

1. **Encryption:** All connections to database use SSL/TLS
2. **Passwords:** Stored as bcrypt hashes (never plaintext)
3. **Access Control:** Role-based database permissions
4. **Audit Trail:** All modifications logged in `audit_log`
5. **Data Privacy:** Sensitive fields (phone, email) handled per regulations

---

**Database Design Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for Migration Scripts
