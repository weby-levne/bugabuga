# Implementation status

This archive contains a playable browser prototype with a procedural Three.js road scene, player vehicle, touch/keyboard input, gear selection, clutch-aware start/stall behavior, basic automatic shifting, dashboard telemetry, camera modes, headlights and local settings.

The project remains intentionally honest about the remaining production work. It does not yet implement full vehicle dynamics, traffic/pedestrians, a large explorable city, missions/exams, garage progression, collision damage, complete audio, dynamic weather or day/night simulation.

## Validation

Run `npm install`, `npm run typecheck`, `npm test` and `npm run build` before deployment. GitHub Actions performs the production build and deploys `dist/` to GitHub Pages.
