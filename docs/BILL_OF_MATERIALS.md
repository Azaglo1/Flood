# FloodSense Ghana - Bill of Materials (BOM)

## Sensor Node Hardware Cost Estimate

### Per Sensor Node (Complete Assembly)

#### Microcontroller & Core Components
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| ESP32-WROOM-32E | ESP32-WROOM-32E | 1 | $8.50 | $8.50 | Main processor |
| Micro USB Cable | Generic | 1 | $1.00 | $1.00 | Programming |

#### Sensors
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| Water Level Sensor | HC-SR04 or JSN-SR04T | 1 | $6.00 | $6.00 | Ultrasonic, waterproof |
| Rain Gauge (Tipping Bucket) | 0.5mm bucket | 1 | $12.00 | $12.00 | Precision rain measurement |
| Temperature/Humidity | DHT22 | 1 | $4.50 | $4.50 | Ambient conditions |
| Soil Moisture Sensor | Capacitive | 1 | $3.50 | $3.50 | Soil water content |
| Optional: Water Flow | YF-S201 | 0 | $7.00 | $0.00 | Hall effect flow meter |

#### Power Management
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| 18650 Li-ion Battery | Genuine | 2 | $5.00 | $10.00 | 3.7V each, 2x for 7.4V |
| Battery Holder 2S | 18650 Holder | 1 | $1.50 | $1.50 | Secure battery mounting |
| Solar Panel (5W) | 5W 18V | 1 | $15.00 | $15.00 | Charging during day |
| TP4056 Charging Module | TP4056 | 1 | $2.00 | $2.00 | Li-ion charge controller |
| Boost Converter (5V) | MT3608 or similar | 1 | $1.50 | $1.50 | Boost 3.7V to 5V |
| Resistors/Capacitors | Assorted | - | $2.00 | $2.00 | Misc components |

#### Connectors & Wiring
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| Breadboard | 400-pin | 1 | $2.00 | $2.00 | Or PCB for production |
| Jumper Wires | Assorted | 1 | $3.00 | $3.00 | Male-to-female, male-to-male |
| JST Connectors | Assorted | 1 | $2.00 | $2.00 | For modular sensor connections |
| Weatherproof Cable Gland | M20 | 1 | $3.00 | $3.00 | Wire entry sealing |

#### Housing & Mounting
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| Waterproof Enclosure (IP67) | ABS Box 200×120×75mm | 1 | $12.00 | $12.00 | Main housing |
| Mounting Bracket | Steel/Aluminum | 1 | $8.00 | $8.00 | Pole or wall mount |
| Silica Gel Desiccant | 50g packet | 1 | $2.00 | $2.00 | Moisture control |
| Thermal Foam | Padding | 1 | $2.00 | $2.00 | Shock protection |

#### Miscellaneous
| Item | Part Number | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| Status LEDs | 5mm RGB | 1 | $1.00 | $1.00 | Operational indicator |
| Small Push Button | 6mm | 1 | $0.50 | $0.50 | Reset/config button |
| Fuses & Protection | 2A fuse | 2 | $0.50 | $1.00 | Circuit protection |
| Insulation Tape | 10m roll | 1 | $1.00 | $1.00 | Wire insulation |
| Solder & Flux | Solder wire | 1 | $2.00 | $2.00 | PCB assembly |
| Labels & Documentation | Waterproof labels | 1 | $1.00 | $1.00 | Node identification |

#### Labor & Assembly
| Item | Description | Qty | Unit Cost | Subtotal | Notes |
|------|-------------|-----|-----------|----------|-------|
| Assembly & Testing | Manual assembly | 1 | $15.00 | $15.00 | 1-2 hours labor per node |
| Firmware Programming | Loading firmware | 1 | $5.00 | $5.00 | One-time per node |

### **TOTAL COST PER SENSOR NODE: $130 - $150** (depending on supplier & volume)

---

## Backend Infrastructure & Software

### Cloud Services (Monthly Estimated Costs)

| Service | Purpose | Free Tier | Paid Tier | Cost |
|---------|---------|-----------|-----------|------|
| **Firebase/Supabase** | Database + Auth + Hosting | 25 GB storage | 100 GB storage | Free or $25/mo |
| **PostgreSQL Database** | Time-series data | - | Cloud managed DB | $15/mo (basic) |
| **MQTT Broker** | IoT messaging | CloudMQTT free | Dedicated MQTT | Free or $20/mo |
| **SMS Gateway (Twilio)** | SMS alerts | $15 credit trial | Pay-as-you-go | $0.0075/SMS |
| **WhatsApp API** | WhatsApp alerts | Trial | Pay-as-you-go | $0.003-0.06/msg |
| **Email Service** | Email notifications | SendGrid free | Paid plans | Free or $10-20/mo |
| **Weather API** | OpenWeather | 5,000 calls/month | More calls | Free or $10/mo |
| **Maps** | Leaflet.js + OSM | Open source | MapBox premium | Free |
| **Monitoring** | Error tracking (Sentry) | Free tier | Paid plans | Free or $29/mo |
| **CDN** | Static hosting (Vercel/Netlify) | Free | Paid tiers | Free or $10-50/mo |

### **Estimated Monthly Cloud Costs: $60-120** (varies by usage)

---

## Development & Deployment Tools

| Tool | Type | Cost |
|------|------|------|
| GitHub | Version control & CI/CD | Free for public repos |
| VS Code | IDE | Free |
| Docker | Containerization | Free |
| Python Packages (pip) | Framework libraries | Free (open source) |
| Node.js packages (npm) | Frontend libraries | Free (open source) |
| Figma | UI/UX Design | Free tier available |
| Fritzing | Circuit design | Free |
| Draw.io | Diagrams | Free |
| Postman | API testing | Free tier |

### **Development Tools Cost: $0** (all free/open source)

---

## Deployment Scenario: 10-Sensor Network (Small Municipality)

### Hardware Costs
| Item | Qty | Unit Cost | Subtotal |
|------|-----|-----------|----------|
| Sensor Nodes | 10 | $140 | $1,400 |
| Central Gateway (Pi + Router) | 1 | $100 | $100 |
| Cables, connectors, misc | 1 | $200 | $200 |
| **Hardware Subtotal** | | | **$1,700** |

### Infrastructure Costs (Monthly)
| Item | Cost |
|------|------|
| Cloud services | $80 |
| SMS alerts (1,000/month) | $7.50 |
| Internet/hosting | $30 |
| **Infrastructure Subtotal** | **$117.50/month** |

### Deployment Costs
| Item | Cost |
|------|------|
| Site surveys & planning | $300 |
| Installation labor (10 sites × 8h) | $400 |
| Training & documentation | $200 |
| **Deployment Subtotal** | **$900** |

### **Total for 10-Sensor Deployment:**
- **Upfront:** $2,600
- **Monthly Operational:** $117.50
- **Annual Operational:** $1,410

---

## Deployment Scenario: 50-Sensor Network (District)

### Hardware Costs
| Item | Qty | Unit Cost | Subtotal |
|------|-----|-----------|----------|
| Sensor Nodes | 50 | $120 (bulk discount) | $6,000 |
| Central Infrastructure | 2 | $150 | $300 |
| **Hardware Subtotal** | | | **$6,300** |

### Infrastructure Costs (Monthly)
| Item | Cost |
|------|------|
| Cloud services (scaled) | $200 |
| SMS alerts (5,000/month) | $37.50 |
| Internet/hosting | $50 |
| Staff monitoring (part-time) | $200 |
| **Infrastructure Subtotal** | **$487.50/month** |

### Deployment & Training
| Item | Cost |
|------|------|
| Site surveys & planning | $1,000 |
| Installation labor (50 sites) | $2,000 |
| Training & documentation | $500 |
| System integration | $1,000 |
| **Deployment Subtotal** | **$4,500** |

### **Total for 50-Sensor Deployment:**
- **Upfront:** $10,800
- **Monthly Operational:** $487.50
- **Annual Operational:** $5,850
- **Cost per Sensor (annual):** $117 + $27 (1/50th of operational)

---

## Cost Optimization Strategies

### Hardware
1. **Bulk purchasing:** 40-50% discount for 50+ units
2. **Alternative sensors:** Cheaper alternatives for non-critical measurements
3. **Refurbished ESP32:** Slightly used but functional (20% cheaper)
4. **DIY enclosures:** 3D-printed instead of commercial ($30 vs $12)

### Cloud Services
1. **Self-hosted:** MQTT broker + PostgreSQL on cheap VPS (~$5-10/mo)
2. **Free tier:** Use free tiers of Firebase/Supabase initially
3. **Shared infrastructure:** Multiple projects on one cloud instance
4. **Sponsorship:** Cloud credits from Google Cloud, AWS, Azure

### Labor
1. **Community training:** Empower local technicians for maintenance
2. **Modular design:** Easy installation reduces labor time
3. **Automation:** Scripts for firmware updates and configuration

---

## Funding & Grant Opportunities

For deployment in Ghana, consider:

1. **Ghana Climate Action Fund** - Climate adaptation projects
2. **USAID** - Development projects with environmental benefits
3. **World Bank** - Disaster risk reduction initiatives
4. **AfDB (African Development Bank)** - Infrastructure & resilience
5. **Microsoft AI for Good** - Tech for social impact
6. **Google.org** - Crisis response & disaster preparedness
7. **Local NGOs** - Partnerships with organizations working on disaster response

---

## Timeline & Milestones

| Phase | Item | Cost | Timeline |
|-------|------|------|----------|
| **MVP/Prototype** | 2-3 sensor nodes + server | $500 | July-August 2026 |
| **Pilot Deployment** | 10-sensor network | $2,600 | September-October 2026 |
| **Scale-up** | 50-sensor district | $10,800 | Q4 2026 onwards |
| **Regional Network** | 200+ sensors | $40,000+ | 2027+ |

---

## Notes

- All costs are estimates and subject to local market variations
- Prices sourced from typical online retailers (Amazon, Aliexpress, local distributors)
- Exchange rate assumed: 1 USD = 15 GHS (approximate)
- Volume discounts can significantly reduce per-unit costs
- Many components can be sourced locally in Ghana to reduce shipping costs

---

**BOM Version:** 1.0  
**Last Updated:** 4 July 2026  
**Status:** For Procurement Planning
