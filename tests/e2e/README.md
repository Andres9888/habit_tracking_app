# Legacy E2E Files

The files in this directory were written for a Detox-style E2E setup, but this
repo does not currently install Detox or expose a Detox-backed `npm run
test:e2e` script.

Use Maestro for device E2E:

```bash
npm run test:e2e:maestro:smoke
npm run test:e2e:maestro
```

The fast headless screen scenarios remain under `tests/e2e-scenarios/`.
