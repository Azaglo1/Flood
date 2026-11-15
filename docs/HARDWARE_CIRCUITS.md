# Hardware Circuit Diagrams & Schematics

## 1. ESP32 Sensor Node Pinout & Connections

### Physical Layout

```
                    ┌─────────────────────────────────────┐
                    │    ESP32-WROOM-32E                  │
                    │  (Dual Core 240 MHz)                │
                    │                                     │
              USB ──┤ micro-USB (Programming + Power)    │
                    │                                     │
    ┌───────────────┼─────────────────────────────────┐   │
    │               │                                 │   │
    │   GPIO Pins   │    Internal Architecture        │   │
    │               │                                 │   │
    │  ┌──────────┐ │  ┌──────────────────────────┐   │   │
    │  │D0  (IO16)├─┤  │ Processor                │   │   │
    │  │D1  (IO17)├─┤  │ • WiFi (802.11 b/g/n)   │   │   │
    │  │D2  (IO04)├─┤  │ • Bluetooth 4.2/5.0     │   │   │
    │  │D3  (IO00)├─┤  │ • 4MB Flash             │   │   │
    │  │D4  (IO02)├─┤  │ • 520KB SRAM            │   │   │
    │  │D5  (IO21)├─┤  │ • Real-time Clock       │   │   │
    │  │D6  (IO03)├─┤  │ • 12-bit ADC (8-ch)    │   │   │
    │  │D7  (IO01)├─┤  │ • 8-bit DAC (2-ch)     │   │   │
    │  │D8  (IO09)├─┤  └──────────────────────────┘   │   │
    │  │D9  (IO10)├─┤  ┌──────────────────────────┐   │   │
    │  │D10 (IO11)├─┤  │ Peripherals              │   │   │
    │  │D11 (IO06)├─┤  │ • SPI (2x)              │   │   │
    │  │D12 (IO07)├─┤  │ • I2C (1x)              │   │   │
    │  │D13 (IO08)├─┤  │ • UART (2x)             │   │   │
    │  │D14 (IO12)├─┤  │ • CAN                   │   │   │
    │  │D15 (IO13)├─┤  │ • PWM (16-ch)           │   │   │
    │  │D16 (IO14)├─┤  │ • Capacitive Touch      │   │   │
    │  │D17 (IO15)├─┤  │ • Hall Effect Sensor    │   │   │
    │  │D18 (IO25)├─┤  │ • Temperature Sensor    │   │   │
    │  │D19 (IO26)├─┤  └──────────────────────────┘   │   │
    │  │D20 (IO32)├─┤                                  │   │
    │  │D21 (IO33)├─┤  Power:                          │   │
    │  │D22 (IO34)├─┤  • 3.3V, GND pins               │   │
    │  │GND        │  • Max current: 160 mA per pin    │   │
    │  │3V3        │  • Total max: 1A                  │   │
    │  └──────────┘ │                                  │   │
    │               │                                  │   │
    └───────────────┼──────────────────────────────────┘   │
                    │                                     │
                    └─────────────────────────────────────┘
```

### Pin Assignments for FloodSense Ghana

```
SENSOR INPUTS (Analog & Digital):

┌──────────────────────────────────────────────────┐
│ Sensor Type        │ PIN  │ Protocol │ Function  │
├──────────────────────────────────────────────────┤
│ Water Level        │ IO34 │ Analog   │ ADC-in   │
│ (Ultrasonic HC-SR04)                             │
│   - TRIG Signal    │ IO32 │ Digital  │ PWM-out  │
│   - ECHO Signal    │ IO35 │ Analog   │ ADC-in   │
│                    │      │          │          │
│ Rain Gauge         │ IO33 │ Digital  │ Interrupt│
│ (Tipping Bucket)   │      │          │ (GPIO)   │
│                    │      │          │          │
│ Temp/Humidity      │ IO23 │ I2C      │ Clock    │
│ (DHT22/BME280)     │ IO22 │ I2C      │ Data     │
│                    │      │          │          │
│ Soil Moisture      │ IO36 │ Analog   │ ADC-in   │
│ (Capacitive)       │      │          │          │
│                    │      │          │          │
│ Status LED (RGB)   │ IO27 │ PWM      │ Red      │
│                    │ IO26 │ PWM      │ Green    │
│                    │ IO25 │ PWM      │ Blue     │
│                    │      │          │          │
│ Reset Button       │ IO00 │ Digital  │ Pull-up  │
└──────────────────────────────────────────────────┘

COMMUNICATION (UART/SPI/I2C):

┌────────────────────────────────────────────────┐
│ Interface      │ PIN    │ Baud/Speed │ Device  │
├────────────────────────────────────────────────┤
│ UART0          │ TX=IO1 │ 115200     │ Console │
│ (Serial)       │ RX=IO3 │            │ Debug   │
│                │        │            │         │
│ I2C (SDA/SCL)  │ 23/22  │ 100 kHz    │ Sensors │
│                │        │ or 400 kHz │         │
│                │        │            │         │
│ SPI (optional) │ MO=23  │ 10 MHz     │ SD card │
│                │ MI=19  │            │ storage │
│                │ CK=18  │            │         │
│                │ CS=05  │            │         │
└────────────────────────────────────────────────┘

POWER MANAGEMENT:

┌──────────────────────────────────┐
│ Supply          │ PIN  │ Voltage │
├──────────────────────────────────┤
│ Power Input     │ 5V   │ 5V USB  │
│ 3.3V Regulator  │ 3V3  │ 3.3V   │
│ Ground          │ GND  │ 0V      │
└──────────────────────────────────┘
```

---

## 2. Water Level Sensor Circuit (Ultrasonic HC-SR04)

```
                    ┌─────────────────────┐
                    │   HC-SR04 Sensor    │ (waterproof variant: JSN-SR04T)
                    │                     │
         TRIG ──────┤ TRIG           VCC ├────── +5V (from Arduino)
                    │                     │
         ECHO ──────┤ ECHO           GND ├────── GND
                    │                     │
                    └─────────────────────┘


TIMING DIAGRAM:

TRIG ├─────┐
     └─────┘ (10 µs pulse every 60 ms)

              ┌───────────────────────┐
ECHO ─────────┤                       │────────
              └───────────────────────┘
              ├─ pulse width ─────────┤
              (proportional to distance)

CALCULATION:
Distance (cm) = (pulse_width_microseconds / 2) / 29.1

Example: 500 µs pulse width = 8.6 cm water level


GPIO CONNECTIONS (ESP32):

           ┌─────────────────────────┐
           │    HC-SR04 Sensor       │
           │ (Waterproof mounting)   │
           └─────────────────────────┘
                    │      │
                    │      │
         ┌──────────┘      └──────────┐
         │                            │
    5V Supply                      GND (0V)
    (from battery                 (return to
     via LDO)                      battery)
         │                            │
    ┌────▼────┐                  ┌────▼────┐
    │ GPIO 32  │                 │ GND pins │
    │ (TRIG)   │                 │ (x2)     │
    └──────────┘                 └──────────┘
         │
    ┌────▼────────────────┐
    │  100Ω Resistor      │
    │  (Signal Protection)│
    └──────┬───────┬──────┘
           │       │
      ┌────▼──┐ ┌──▼────┐
      │ GPIO35│ │ GPIO33│
      │ (ECHO)│ │(Rain) │
      └───────┘ └───────┘
```

---

## 3. Rain Gauge Circuit (Tipping Bucket)

```
                    ┌──────────────────────┐
                    │  Tipping Bucket      │
                    │  Rain Gauge          │
                    │                      │
         Signal ────┤ NO/COM           COM ├──── GND
                    │                      │
                    │ Closes on 0.5mm rain │
                    └──────────────────────┘
                            │
                            │
                    ┌───────▼────────┐
                    │ Reed Switch    │
                    │ (Magnetic)     │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │  One pulse per │
                    │  0.5mm of rain │
                    └────────────────┘

GPIO CONNECTION:

        ┌─────────────────────┐
        │  Tipping Bucket     │
        │  (on pole, 1.5m up) │
        └──────┬──────────────┘
               │ (2-wire cable)
               │ (twisted pair,
               │  shielded)
               │
        ┌──────▼──────────┐
        │  3.3V via       │
        │  Pull-up        │
        │  Resistor       │
        │  (10kΩ)         │
        └────┬────────────┘
             │
        ┌────▼────┐
        │ GPIO 33  │◄─── Detects falling edge
        │ (INPUT)  │     (0.5mm rain increment)
        └──────────┘

PULSE COUNTING:

        attachInterrupt(digitalPinToInterrupt(33),
                        countRain,
                        FALLING);  // Trigger on falling edge

        void countRain() {
            rain_count++;  // Each pulse = 0.5mm
        }

        float rainfall_mm = rain_count * 0.5;
```

---

## 4. Temperature & Humidity Sensor Circuit (DHT22)

```
                    ┌──────────────────┐
                    │     DHT22        │
                    │  Temp/Humidity   │
                    │                  │
         VCC ───────┤ VCC         DATA ├───── (Digital Signal)
                    │                  │
         GND ───────┤ GND           NC ├───── (No Connect)
                    │                  │
                    └──────────────────┘


I2C CONNECTION (Alternative: BME280):

        ┌─────────────────────────┐
        │  BME280 Sensor          │ (Better: includes pressure)
        │  (I2C Interface)        │
        │                         │
        │ VCC ─────── +3.3V      │
        │ GND ─────── GND        │
        │ SDA ─────── GPIO 23    │  I2C Clock Line
        │ SCL ─────── GPIO 22    │  I2C Data Line
        │ CSB ─────── GND        │  (I2C mode)
        │ SDO ─────── GND        │  (Address = 0x77)
        │                         │
        └─────────────────────────┘

I2C PULL-UP RESISTORS:

        ┌─────────┐      ┌─────────┐
        │ 4.7kΩ   │      │ 4.7kΩ   │
        │ (SDA)   │      │ (SCL)   │
        └────┬────┘      └────┬────┘
             │                │
             ├─ +3.3V ────────┤
             │                │
        ┌────▼─────────────────▼────┐
        │                            │
        │  BME280 Sensor (I2C)       │
        │                            │
        └────────────────────────────┘

DATA READING:

        #include <Adafruit_BME280.h>
        Adafruit_BME280 bme;

        void setup() {
            bme.begin(0x77);  // I2C address
        }

        void loop() {
            float temp = bme.readTemperature();       // °C
            float humidity = bme.readHumidity();      // %
            float pressure = bme.readPressure();      // Pa
            delay(10000);  // Read every 10 seconds
        }
```

---

## 5. Soil Moisture Sensor Circuit (Capacitive)

```
                    ┌──────────────────────┐
                    │ Capacitive Soil      │
                    │ Moisture Sensor      │ (Analog output)
                    │                      │
         VCC ───────┤ VCC             OUT ├────► GPIO 36 (ADC)
                    │                      │
         GND ───────┤ GND             GND ├───── GND
                    │                      │
                    └──────────────────────┘


ANALOG TO DIGITAL CONVERSION:

        ┌──────────────────┐
        │ Soil Moisture    │
        │ Sensor Output    │ (0-3.3V analog)
        │ (proportional to │
        │  soil wetness)   │
        └────────┬─────────┘
                 │
         ┌───────▼────────┐
         │  ESP32 ADC     │
         │  12-bit        │ (0-4095 digital)
         │  GPIO 36       │
         └────────┬───────┘
                  │
         ┌────────▼──────────────┐
         │ Soil Moisture %       │
         │ (0% = Dry)            │
         │ (100% = Saturated)    │
         └───────────────────────┘

CALIBRATION:

        const int DRY_VALUE = 4095;      // ADC reading in air
        const int WET_VALUE = 2500;      // ADC reading in water

        void readSoilMoisture() {
            int raw = analogRead(36);
            float moisture = (100.0 * (DRY_VALUE - raw)) / 
                             (DRY_VALUE - WET_VALUE);
            moisture = constrain(moisture, 0, 100);
        }

READINGS:
- 0-30%:   Dry (red alert on dashboard)
- 30-60%:  Optimal (green)
- 60-90%:  Wet (yellow warning)
- 90-100%: Saturated (critical)
```

---

## 6. Power Management Circuit

```
                    ┌──────────────────────────┐
                    │  Solar Panel             │
                    │  5W 18V                  │
                    │  (with bypass diode)     │
                    └─────────┬────────────────┘
                              │
                              │ +18V (open circuit)
                              │
                    ┌─────────▼───────────────┐
                    │  TP4056 Charging        │
                    │  Module                 │ Auto-stops at full charge
                    │  (Li-ion Charger)       │
                    │                         │
                    │  IN+ ─────────┐        │
                    │  IN- ─────┐   │        │
                    │           │   │        │
                    │  B+ ──────┼───┼───────►│ Battery +
                    │  B- ──────┼───┼───────►│ Battery -
                    │           │   │        │
                    └──────┬────▼───▼────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼────┐   ┌──────▼────┐   ┌─────▼──┐
    │ 18650 Li- │   │ 18650 Li- │   │ Status │
    │ ion Cell  │   │ ion Cell  │   │ LED    │
    │ (3.7V)    │   │ (3.7V)    │   │ (Red)  │
    │ 3000 mAh  │   │ 3000 mAh  │   └────────┘
    └──────┬────┘   └──────┬────┘
           │ (2S series = 7.4V nominal)
           │
    ┌──────▴───────────────┐
    │  Battery Protection  │
    │  Circuit (BMS)       │
    │  • Overcharge        │
    │  • Over-discharge    │
    │  • Over-current      │
    └──────┬───────────────┘
           │ 7.4V (nominal)
           │ Max 8.4V (full charge)
           │ Min 6.0V (minimum)
           │
    ┌──────▴─────────────────────┐
    │  MT3608 Boost Converter    │  +3.3V to 5V boost
    │  (5V Output @ 1A max)      │
    │                            │
    │  GND ────────────────────► GND
    │  IN ────────┐             │
    │  EN ────────┼──► +3.3V    │
    │  OUT ──────┼──────────────► +5V
    │  FB ───────┴─► Feedback    │
    │                            │
    └────┬───────────────────────┘
         │
    ┌────▴────────────────────────┐
    │  LDO Regulator (3.3V)        │  Step-down for sensors
    │  (LD1117 or similar)         │
    │                              │
    │  VIN (5V) ────────► 3.3V OUT │
    │  GND ─────────────► GND      │
    │                              │
    └──────────────────────────────┘

POWER DISTRIBUTION:

    ┌───────────┬──────────┬────────────┐
    │           │          │            │
   3.3V         5V       GND           
    │           │          │
┌───▼──┐  ┌────▼───┐ ┌────▼────┐
│Sensors│  │ESP32   │ │All GND  │
│Analog │  │Logic   │ │Pins     │
│  ADC  │  │WiFi    │ │         │
└───────┘  └────────┘ └────────┘

VOLTAGE MONITORING:

    Battery Voltage Divider (10kΩ + 10kΩ):
    
    Battery (+7.4V) ───── 10kΩ ──┬─── GPIO 39 (ADC)
                                  │
                             10kΩ │
                                  │
                                 GND

    ADC_reading = analogRead(39);
    battery_voltage = (ADC_reading / 4095) * 3.3 * 2;  // *2 due to divider

POWER BUDGET (Continuous Operation):

┌──────────────────────────────┐
│ Component      │ Current    │ Notes
├──────────────────────────────┤
│ ESP32 Idle     │ 80 mA      │ WiFi enabled
│ DHT22          │ 1 mA       │ Read 2x/hour
│ Soil Moisture  │ 5 mA       │ Continuous
│ Status LED     │ 20 mA      │ (when active)
│ Ultrasonic     │ 15 mA      │ Read 2x/hour
│ Rain Counter   │ 0 mA       │ (passive)
├──────────────────────────────┤
│ TOTAL IDLE     │ ~110 mA    │ Max continuous
│ TOTAL PEAK     │ ~200 mA    │ During reads
└──────────────────────────────┘

BATTERY LIFE CALCULATION:

    Battery Capacity: 2x 3000 mAh @ 3.7V = 6000 mAh total
    Total Energy: 6000 mAh * 7.4V = 44.4 Wh

    Average Load: 120 mA (continuous + periodic peaks)
    
    Runtime = 6000 mAh / 120 mA = 50 hours (~2 days)
    
    With solar charging (5W panel in daylight):
    Daylight hours (12h) = 5W * 12h = 60 Wh input
    Requirement (24h) = 120 mA * 24h = 2.88 Wh
    
    Net: +57 Wh surplus → Self-sustaining with solar
```

---

## 7. Complete Sensor Node Schematic

```
                    ╔═══════════════════════════════════════════╗
                    ║  FLOODSENSE GHANA SENSOR NODE v1.0        ║
                    ║  Complete Integration Schematic           ║
                    ╚═══════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│                        POWER SUBSYSTEM                          │
│                                                                  │
│   ☀ Solar Panel (5W)  →  TP4056 Charger  →  2x 18650 Battery  │
│                                                                  │
│   Battery +7.4V  ─────► MT3608 Boost ──────► 5V Supply        │
│                              │                                  │
│                              └─────────► LDO ────► 3.3V Supply│
│                                                                  │
│   Voltage Monitor (GPIO 39) ◄────────── Divider ────────        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ (7.4V nominal)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     MAIN MICROCONTROLLER                        │
│                                                                  │
│                    ┌──────────────────┐                         │
│                    │   ESP32-WROOM    │                         │
│                    │   (WiFi + BLE)   │                         │
│                    │                  │                         │
│                    │  VCC ──► +3.3V   │                         │
│                    │  GND ──► GND     │                         │
│                    └────────┬─────────┘                         │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │              │
│    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐        │
│    │ GPIO 22 │         │ GPIO 23 │        │ GPIO 33 │        │
│    │ (I2C)   │         │ (I2C)   │        │(Interrupt)     │
│    │ SCL     │         │ SDA     │        │(Rain)          │
│    └────┬────┘         └────┬────┘        └────┬────┘        │
│         │                   │                  │              │
│         │                   │                  │              │
│    ┌────▼───────────────────▼────┐            │              │
│    │                              │            │              │
│    │   I2C Bus (400 kHz)          │            │              │
│    │   4.7kΩ pull-ups             │            │              │
│    │                              │            │              │
│    │  ┌─► BME280 Sensor (0x77)   │            │              │
│    │  │   Temp/Humidity/Pressure  │            │              │
│    │  │                           │            │              │
│    │  └─► (future) EEPROM        │            │              │
│    │                              │            │              │
│    └──────────────────────────────┘            │              │
│                                                 │              │
│    ┌─────────────────────────────────┐        │              │
│    │  Tipping Bucket (Interrupt)    │        │              │
│    │  ◄─── GPIO 33 (Falling Edge)   │◄───────┘              │
│    │  0.5 mm increments              │                       │
│    └─────────────────────────────────┘                       │
│                                                               │
│    ┌──────────────────────────────────────┐                │
│    │  GPIO ADC Inputs (0-3.3V)            │                │
│    │                                      │                │
│    │  GPIO 39 ◄─ Battery Voltage          │                │
│    │  GPIO 36 ◄─ Soil Moisture            │                │
│    │  GPIO 34 ◄─ Water Level (Analog)     │                │
│    │  GPIO 35 ◄─ Echo (Ultrasonic)        │                │
│    │                                      │                │
│    └──────────────────────────────────────┘                │
│                                                               │
│    ┌──────────────────────────────────────┐                │
│    │  GPIO PWM Outputs (LED Status)       │                │
│    │                                      │                │
│    │  GPIO 27 ► Red LED                   │                │
│    │  GPIO 26 ► Green LED                 │                │
│    │  GPIO 25 ► Blue LED                  │                │
│    │                                      │                │
│    └──────────────────────────────────────┘                │
│                                                               │
│    ┌──────────────────────────────────────┐                │
│    │  GPIO Digital Outputs (Sensors)      │                │
│    │                                      │                │
│    │  GPIO 32 ► HC-SR04 TRIG               │                │
│    │  GPIO 33 ► (also input for rain)     │                │
│    │                                      │                │
│    └──────────────────────────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SENSOR SUBSYSTEMS                            │
│                                                                  │
│  1. WATER LEVEL (Ultrasonic)                                   │
│     └─ HC-SR04 Sensor                                         │
│        TRIG ◄─── GPIO 32                                       │
│        ECHO ◄─── GPIO 35 (ADC)                                │
│        Power: 5V (from boost converter)                       │
│        Range: 2cm - 400cm                                     │
│                                                                 │
│  2. RAINFALL (Tipping Bucket)                                 │
│     └─ Reed Switch (0.5mm per tip)                            │
│        Signal ◄─── GPIO 33 (Interrupt)                       │
│        Power: 3.3V (pull-up)                                  │
│        Counting: Incremental (ISR)                           │
│                                                                 │
│  3. TEMPERATURE & HUMIDITY                                    │
│     └─ BME280 I2C Sensor                                      │
│        SDA ◄─── GPIO 23                                       │
│        SCL ◄─── GPIO 22                                       │
│        Addr: 0x77                                             │
│        Power: 3.3V                                            │
│                                                                 │
│  4. SOIL MOISTURE (Capacitive)                               │
│     └─ Analog Sensor                                          │
│        OUT ◄─── GPIO 36 (ADC)                                │
│        Power: 3.3V                                            │
│        Range: 0-100%                                          │
│                                                                 │
│  5. STATUS INDICATORS                                        │
│     └─ RGB LED (Common Cathode)                              │
│        R ◄─── GPIO 27 (PWM)                                  │
│        G ◄─── GPIO 26 (PWM)                                  │
│        B ◄─── GPIO 25 (PWM)                                  │
│        Logic: 0 = LED on, 1 = LED off                        │
│                                                                 │
│  6. CONNECTIVITY                                              │
│     └─ Integrated WiFi 802.11 b/g/n                          │
│        MQTT Client → cloud.floodsense.com:8883 (TLS)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   COMMUNICATION FLOW                            │
│                                                                  │
│  Every 10 minutes:                                             │
│  1. Read all sensors (I2C, ADC, GPIO)                         │
│  2. Validate data (range checks)                             │
│  3. Package JSON:  {"water_level_cm": 185, ...}              │
│  4. Connect WiFi (if disconnected)                           │
│  5. Publish via MQTT:  /sensors/SEN-001/readings             │
│  6. Wait for ACK (QoS=1)                                     │
│  7. Log to local SPIFFS (if offline)                         │
│  8. Deep sleep for 9 minutes 50 seconds (low power)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

BOARD DIMENSIONS:  ~10cm x 7cm (ESP32 + breakout sensors)
ENCLOSURE:         200mm x 120mm x 75mm (IP67 ABS box)
WEIGHT:            ~500g (with housing and batteries)
COST per unit:     $130-150 (in quantities of 10+)
```

---

## 8. Firmware Upload & Configuration

```
DEVELOPMENT SETUP:

1. IDE: PlatformIO (VS Code) or Arduino IDE
2. Board: ESP32 Dev Module
3. Upload Speed: 921600 baud
4. Flash Frequency: 80 MHz
5. Partition Scheme: Default 4MB with spiffs

CONFIGURATION FILE (config.h):

    #define SSID "YourWiFi"
    #define PASSWORD "YourPassword"
    
    #define MQTT_SERVER "broker.floodsense.com"
    #define MQTT_PORT 8883  // TLS
    #define MQTT_USER "sensor_SEN-001"
    #define MQTT_PASS "secure_token"
    
    #define SENSOR_ID "SEN-001"
    #define SENSOR_NAME "Accra River - Osu Bridge"
    #define LATITUDE 5.5571
    #define LONGITUDE -0.2083
    
    #define READING_INTERVAL 600  // 10 minutes
    #define SLEEP_DURATION 590    // 9m 50s (conserve battery)

OTA (OVER-THE-AIR) UPDATE:

    - Firmware updates via secure WiFi
    - SHA-256 verification
    - Rollback capability
    - No physical access required
```

---

**Hardware Schematic Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** Ready for PCB Design & Production
