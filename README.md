# Driving School Simulator – Ultimate Edition

Offline-first browser driving simulator for Android, tablets and desktop. Built with React, TypeScript, Three.js and Vite. Hosted as a static site on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Build and verify

```bash
npm run typecheck
npm test
npm run build
```

The production build is written to `dist/`. The GitHub Pages workflow builds and deploys this folder. The service worker precaches the app's local assets so the game can reopen offline after its first successful load.

## Current playable systems

- Procedural 3D training road with roadside houses and trees
- Third-person chase camera, cockpit-style camera and orbit camera (drag to rotate)
- Touch controls for accelerator, brake, clutch and steering; keyboard controls on PC (WASD/arrows, Shift clutch, Space handbrake)
- Manual gears R/N/1–6 and a basic automatic mode
- Arcade driving model with engine RPM, clutch disengagement, stalling, braking, handbrake, fuel consumption and distance
- Engine start, headlights, dashboard and local settings
- Responsive Czech UI; no accounts, ads, paid features or game servers

## Honest scope notes

This is a playable foundation, not a finished commercial-grade open-world driving simulator. Advanced tire and suspension simulation, ABS/traction control, collision damage, traffic AI, pedestrians, a complete city/highway map, licensed vehicle interiors, full weather/day-night cycles, missions/exams, vehicle purchases/customization and comprehensive vehicle audio are not yet implemented. The current driving model is a lightweight browser-friendly approximation, not a certified physical simulation. Graphics and performance vary by device.

## Project constraints

- Static hosting; no backend or account system
- Local browser storage only for settings
- Offline cache for app assets after first load
- Free, no ads and no paid features
