# Visual Diagrams Guide - FloodSense Ghana

This guide explains how to view, export, and use the visual diagrams in this project.

## Available Diagram Files

| File | Format | Content | Uses |
|------|--------|---------|------|
| `docs/ARCHITECTURE_DIAGRAMS.md` | Mermaid.js + ASCII | System architecture (7 layers), data flow, component interaction, deployment, microservices, end-to-end flow, network, CI/CD pipeline | Documentation, presentations, architecture review |
| `docs/VISUAL_DIAGRAMS.md` | Mermaid.js | Architecture, circuit, deployment, pipeline, sequence, network, microservices, ER, topology, wireframes | Exports, Draw.io, Figma |
| `docs/CIRCUIT_DIAGRAMS.md` | ASCII/Fritzing | ESP32 pinout, sensor circuits, power management, complete schematic | PCB design, hardware assembly |
| `docs/WIREFRAMES.md` | Mermaid.js | All 5 dashboard pages, mobile layout, components, design system | Frontend development, UI/UX design |

---

## How to View Diagrams

### Option 1: GitHub (Recommended)
All `.md` files with Mermaid diagrams render automatically on GitHub:
```bash
# Just open these files on GitHub:
https://github.com/YOUR_USERNAME/flood-sense-ghana/blob/main/docs/VISUAL_DIAGRAMS.md
```

### Option 2: Mermaid Live Editor
1. Open https://mermaid.live
2. Copy any diagram block from the markdown files
3. Paste into the editor
4. Export as SVG, PNG, or PDF

### Option 3: VS Code
Install the "Mermaid Preview" extension:
```bash
ext install bierner.markdown-mermaid
```
Then open any diagram file and use the preview.

### Option 4: Command Line
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i VISUAL_DIAGRAMS.md -o diagram.svg
```

---

## Exports for Presentation

### High-Resolution SVG Export
```bash
# Using mermaid-cli
mmdc -i docs/VISUAL_DIAGRAMS.md -o diagrams.svg --width 1920 --backgroundColor white
```

### PNG Export (For PowerPoint)
```bash
mmdc -i docs/VISUAL_DIAGRAMS.md -o diagrams.png -b white -s 2
```

### PDF Export (For Reports)
```bash
mmdc -i docs/VISUAL_DIAGRAMS.md -o diagrams.pdf -b white -s 2
```

---

## Using in Draw.io

1. Open https://app.diagrams.net
2. Create a new diagram
3. Go to Arrange → Insert → Advanced → Mermaid
4. Copy any diagram code block from the markdown files
5. Paste into Draw.io
6. Export as SVG/PNG

---

## Using in Figma

Figma does not directly support Mermaid, but you can:

1. Convert Mermaid to SVG using mermaid.live
2. Import SVG into Figma
3. Convert to frames for interactive prototyping
4. Use Figma plugins like "Mermaid to Figma" for direct import

---

## Hardware Drafting for Fritzing

For actual circuit design in Fritzing:

1. **Open Fritzing:** https://fritzing.org/download/
2. **Create new project**
3. **Add parts:**
   - ESP32 Dev Module (search "ESP32")
   - HC-SR04 Ultrasonic (search "HC-SR04")
   - BME280 Sensor (search "BME280")
   - Capacitive Soil Moisture (search "soil moisture")
   - Tipping Bucket Rain Gauge (custom part)
   - All resistors from parts bin
4. **Wire according to:** `docs/CIRCUIT_DIAGRAMS.md`
5. **Export to:** SVG/PNG for documentation, or Gerber for PCB fabrication

---

## Creating Instagram-Sized Visuals

For social media or quick reference:

```bash
# Create square 1080x1080 version
mmdc -i docs/VISUAL_DIAGRAMS.md -o social.jpg -b "#111827" -s 3 -H 1080 -W 1080
```

---

## Diagram Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-04 | Initial comprehensive diagram suite |
| | | Added 8 architecture diagrams |
| | | Added 4 circuit diagrams |
| | | Added 8 wireframes |
| | | Added ER diagram |
| | | Added CI/CD pipeline diagram |

---

## Customization Tips

### Changing Colors
In Mermaid diagrams, replace colors using these patterns:
```mermaid
style ComponentName fill:#hexcolor,stroke:#hexcolor,stroke-width:2px
```

### Combining Diagrams
To create composite diagrams:
1. Export individual diagrams as SVG
2. Use Inkscape or Illustrator to combine
3. Export as high-res PNG

### Animation
For animated presentations:
1. Export diagram to SVG
2. Use Morph SVG library for animation
3. Or use Figma's auto-animate for wireframe flows

---

## Tips for Diagrams

- **Architecture diagrams:** Use Mermaid for quick iterations, then polish in Draw.io
- **Circuit diagrams:** Use Fritzing for actual PCB design, export SVG for docs
- **Wireframes:** Use Mermaid for structure, Figma for high-fidelity design
- **Sequence diagrams:** Use https://www.websequencediagrams.com/ for alternatives

---

**Guide Version:** 1.0  
**Last Updated:** 4 July 2026  
**For:** FloodSense Ghana Hackathon Documentation Suite