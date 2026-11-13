# Driving School Simulator – Production Edition

A free, ad-free, offline-first driving simulator for Android phones, tablets and desktop browsers.

## Current status: Stage 1 foundation

This repository is a clean React + TypeScript + Vite migration. The original project archive is preserved untouched in `reference/ORIGINAL_PROJECT.zip`.

Implemented in this stage:
- React/TypeScript application shell and responsive Czech menu
- Local-only settings with safe recovery from invalid stored data
- Locally bundled Three.js preview scene (no CDN or runtime network import)
- Build-generated service worker that precaches the production app shell and bundled assets
- Basic CI workflow for typecheck, tests and production build

Not implemented yet: drivable vehicle physics, clutch/transmission simulation, traffic, pedestrians, full maps, sound, missions, garage, damage, and production-ready save/progression systems. The current 3D scene is a rendering smoke-test/visual placeholder, not a finished driving game.

## Requirements
- Node.js 22+
- npm 10+

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## Offline behavior

The production service worker precaches the generated application shell and local build assets. As with any GitHub Pages PWA, the first visit/install requires a network connection; after the service worker has installed and cached the build, the app is designed to launch offline. There are no remote runtime libraries, APIs, accounts, cloud saves, multiplayer, analytics or advertising.

## GitHub Pages

Build output is in `dist/`. Vite uses a relative base path so the build can be hosted under a GitHub Pages project path. Configure Pages to publish the `dist` artifact using GitHub Actions when the repository is connected.
