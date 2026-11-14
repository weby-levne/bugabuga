# Migration status

## Stage 1 — foundation (source created; build verification pending)

- [x] Preserve the supplied source archive as `reference/ORIGINAL_PROJECT.zip`.
- [x] Establish React + TypeScript + Vite project configuration.
- [x] Create responsive Czech menu and settings screen.
- [x] Add a locally bundled Three.js preview scene.
- [x] Add local settings persistence with invalid-data recovery.
- [x] Add a build-time service-worker generator for same-origin production assets.
- [x] Add CI workflow and initial settings tests.
- [ ] Install npm dependencies and generate a lockfile.
- [ ] Run TypeScript typecheck, Vitest, production build and browser smoke tests.
- [ ] Verify installation and offline relaunch on a real Android device.

The npm registry was unreachable from the implementation environment during this stage. No successful package install, production build, browser test or device test is claimed.

## Not implemented

Vehicle physics, clutch and gearbox behavior, traffic, pedestrians, world/map content, audio, missions, garage, damage, and full local progression/save system remain future stages.
