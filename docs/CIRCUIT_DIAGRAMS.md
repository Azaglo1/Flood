# Hardware Circuit Diagrams for Fritzing

This document contains detailed circuit schematics in a format ready for Fritzing import.

---

## Circuit 1: ESP32 Sensor Node - Complete

```
Fritzing-Compatible Schematic Description:

┌─────────────────────────────────────────────────────────────────┐
│                    POWER MANAGEMENT CIRCUIT                       │
└─────────────────────────────────────────────────────────────────┘

SOLAR PANEL (5W 18V, 500mA)
├── Positive ──→ TP4056 CHARGING MODULE
└── Negative ──→ GND

TP4056 MODULE:
B+ ──→ Battery 1 (+) [18650 Li-ion 3000mAh]
B- ──→ Battery 1 (-) (and Battery 2 in series)
OUT+ ──→ Battery 2 (+)
IN+ ──→ Solar Panel (+)
IN- ──→ Solar Panel (-)

BATTERY 2 (+) ──→ MT3608 BOOST CONVERTER (IN)
BATTERY 2 (-) ──→ GND

MT3608 BOOST CONVERTER:
IN+ ──→ Battery +
IN- ──→ GND
OUT+ ──→ LDO REGULATOR (5V)
OUT- ──→ GND
EN ──→ 3.3V (enable pin)

LDO REGULATOR (LD1117-3.3):
VI ──→ MT3608 Output (5V)
GND ──→ GND
VO ──→ 3.3V Supply Rail ──→ All Sensors

VOLTAGE DIVIDER (Battery Monitoring):
Battery + ──→ 10kΩ Resistor ──→ 10kΩ Resistor ──→ GND
                                  │
                                  └──→ GPIO 39 (ADC) on ESP32


┌─────────────────────────────────────────────────────────────────┐
│                    ESP32 WROOM - 32E                            │
└─────────────────────────────────────────────────────────────────┘

Power Pins:
3V3 (Pin 1) ──→ 3.3V Supply Rail
GND (Pin 2) ──→ GND

I2C Bus (BME280 Sensor):
GPIO 22 (Pin 23) ──→ SCL ──→ BME280 SCL
GPIO 23 (Pin 22) ──→ SDA ──→ BME280 SDA
                              ──→ Pull-up Resistors (4.7kΩ to 3.3V)

Ultrasonic Sensor (HC-SR04):
GPIO 32 (Pin 25) ──→ TRIG
GPIO 35 (Pin 14) ──→ ECHO ──→ 100Ω Resistor ──→ GND
HC-SR04 VCC ──→ 5V from Boost
HC-SR04 GND ──→ GND

Rain Gauge (Tipping Bucket):
GPIO 33 (Pin 16) ──→ Signal
                      ──→ Pull-up Resistor (10kΩ to 3.3V)
Rain Gauge GND ──→ GND

Soil Moisture Sensor:
GPIO 36 (Pin 13) ──→ OUT (Analog)
Sensor VCC ──→ 3.3V
Sensor GND ──→ GND

RGB Status LED (Common Cathode):
GPIO 27 (Pin 18) ──→ Red LED (via 220Ω) ──→ LED_R
GPIO 26 (Pin 16) ──→ Green LED (via 220Ω) ──→ LED_G
GPIO 25 (Pin 15) ──→ Blue LED (via 220Ω) ──→ LED_B
LED Common Cathode ──→ GND

Reset Button:
GPIO 0 (Pin 26) ──→ One side of button
Other side ──→ Pull-up to 3.3V via 10kΩ


┌─────────────────────────────────────────────────────────────────┐
│                    BME280 SENSOR - I2C                           │
└─────────────────────────────────────────────────────────────────┘

BME280:
VCC ──→ 3.3V
GND ──→ GND
SCL ──→ GPIO 22
SDA ──→ GPIO 23
CSB ──→ GND (I2C mode)
SDO ──→ GND (Address 0x77)


┌─────────────────────────────────────────────────────────────────┐
│                    HC-SR04 - ULTRASONIC                           │
└─────────────────────────────────────────────────────────────────┘

HC-SR04 (Waterproof JSN-SR04T):
VCC ──→ 5V
GND ──→ GND
TRIG ──→ GPIO 32 (output pulse)
ECHO ──→ GPIO 35 (input pulse width)


┌─────────────────────────────────────────────────────────────────┐
│                    TIPPING BUCKET RAIN GAUGE                      │
└─────────────────────────────────────────────────────────────────┘

Rain Gauge:
COM ──→ GND
NO (Normally Open) ──→ GPIO 33

When bucket tips: NO connects to COM, triggering falling edge interrupt
Each tip = 0.5mm rainfall


┌─────────────────────────────────────────────────────────────────┐
│                    CAPACITIVE SOIL MOISTURE                         │
└─────────────────────────────────────────────────────────────────┘

Soil Sensor:
VCC ──→ 3.3V
GND ──→ GND
OUT ──→ GPIO 36 (analog read)


┌─────────────────────────────────────────────────────────────────┐
│                    RGB STATUS LED                                   │
└─────────────────────────────────────────────────────────────────┘

Common Cathode LED:
R ──→ 220Ω Resistor ──→ GPIO 27
G ──→ 220Ω Resistor ──→ GPIO 26
B ──→ 220Ω Resistor ──→ GPIO 25
Common Cathode ──→ GND
```

---

## Circuit 2: Power Management Detailed

```
Fritzing Schematic - Power Chain

┌─────────────────────────────────────────────────────────────────┐
│  SOLAR CHARGING & POWER DISTRIBUTION                              │
└─────────────────────────────────────────────────────────────────┘

[Solar Panel 5W] ──→ [TP4056 Charger] ──→ [18650 Battery x2]
                                         │
                                         ├──→ [MT3608 Boost] ──→ 5V Rail
                                         │                            │
                                         └────────────────────────────┼──→ [HC-SR04 VCC]
                                                                      │
                                                                 ┌──▼──┐
                                                                 │LDO   │
                                                                 │(3.3V)│
                                                                 └──▲──┘
                                                                    │
                                                                 ┌──▼──┐
                                                                 │ESP32 │
                                                                 │3V3   │
                                                                 └──▲──┘
                                                                    │
                                                                    ├──→ All 3.3V Sensors
                                                                    ├── → BME280 VCC
                                                                    ├── → Rain Gauge VCC
                                                                    └── → Soil Sensor VCC

BATTERY MONITORING:
Battery + ──→ [10kΩ] ──→ [10kΩ] ──→ GND
                         │
                         └──→ GPIO 39 (ADC1_CH3)
```

---

## Circuit 3: Breadboard Assembly View

```
FRITZING BREADBOARD LAYOUT (Single Side):

┌─────────────────────────────────────────────────────────────────┐
│                        POWER RAILS                                │
├─────────────────────────────────────────────────────────────────┤
│  +5V Rail  │ +3.3V Rail │ GND Rail                                │
│  (Red)      │ (Orange)   │ (Blue/Black)                          │
├─────────────────────────────────────────────────────────────────┤

Left Side (Power Components):
Row 1-5:   TP4056 Charging Module
Row 6-10:  MT3608 Boost Converter
Row 11-15: LDO Regulator (LD1117-3.3)
Row 16-20: Battery Pack (2x 18650 holders)

Middle (ESP32 & Sensors):
Row 21-25: ESP32 Development Board
Row 26-30: BME280 I2C Sensor (on breakout)
Row 31-35: HC-SR04 Ultrasonic (on breakout)
Row 36-40: Rain Gauge connections (GPIO 33)
Row 41-45: Soil Moisture sensor (on breakout)
Row 46-50: RGB LED with resistors

Right Side (Support Components):
Row 51-55: Pull-up resistors (4.7kΩ for I2C, 10kΩ for Rain)
Row 56-60: Current limiting resistors (220Ω for LEDs)
Row 61-65: Voltage divider resistors (10kΩ x2)

Jumper Connections:
Red (5V): Solar → TP4056 OUT → MT3608 IN/OUT → HC-SR04 VCC
Orange (3.3V): LDO OUT → ESP32 3V3 → All 3.3V sensors
Black (GND): Common ground for all components
```

---

## Parts List for Fritzing

| Part | Value | Quantity | Notes |
|------|-------|----------|-------|
| ESP32 Dev Board | ESP32-WROOM-32E | 1 | Main controller |
| HC-SR04 | Ultrasonic Sensor | 1 | Waterproof version JSN-SR04T |
| BME280 | Temp/Humidity/Pressure | 1 | I2C breakout board |
| Capacitive Soil Sensor | Soil Moisture | 1 | Analog output |
| Tipping Bucket | Rain Gauge | 1 | Reed switch type |
| RGB LED | Common Cathode | 1 | Status indicator |
| Resistor | 220Ω | 3 | LED current limiting |
| Resistor | 10kΩ | 2 | Voltage divider |
| Resistor | 4.7kΩ | 2 | I2C pull-ups |
| TP4056 | Li-ion Charger | 1 | With protection |
| MT3608 | Boost Converter | 1 | 5V output |
| LD1117 | LDO Regulator | 1 | 3.3V output |
| 18650 | Li-ion Battery | 2 | 3000mAh |
| Solar Panel | 5W 18V | 1 | With diode |
| Button | Push Button | 1 | For reset |

---

## Fritzing Export Instructions

1. Open Fritzing (https://fritzting.org)
2. Create new Breadboard/Schematic/PCB view
3. Add parts from "Parts" panel:
   - Search "esp32" for ESP32 Dev Module
   - Search "hc-sr04" for ultrasonic sensor
   - Search "bme280" for temperature sensor
   - Search "led rgb" for status indicator
4. Wire according to connections above
5. Export as SVG/PNG for documentation
6. Generate PCB layout for production

---

**Hardware Diagram Version:** 1.0  
**Last Updated:** 4 July 2026  
**Format:** Fritzing-compatible  
**Status:** Ready for circuit visualization