# Chain Day Maestro E2E

Maestro is the device-level E2E layer for Chain Day. The fast screen-render
suite in `tests/e2e-scenarios/` still runs on every PR; these flows validate
runtime behavior that needs an installed app, a simulator, or native modules.

## Commands

```bash
npm run test:e2e:maestro:smoke
npm run test:e2e:maestro
maestro test .maestro/e2e/07-gestures.yaml
```

All flows target `com.chainday.app`.

## Test Data Contract

Signed-in flows assume the prepared simulator already has:

- an authenticated Clerk session
- at least two active habits
- one habit with recent completions for detail and analytics screens
- template seed data loaded
- one archived or archivable habit for settings and gesture paths

Signed-out auth coverage is isolated in `01-auth-welcome.yaml` and clears app
state intentionally.

## Flow Tags

- `smoke`: release-blocking path, expected under 10 minutes on one simulator
- `regression`: broader feature coverage
- `native`: OS/device capability coverage
- `visual`: screenshot-assisted UI validation
- `helper`: reusable subflow, not a product scenario by itself

## Legacy Detox Note

The Detox-shaped files in `tests/e2e/` are legacy and are not wired to
`npm run test:e2e`. Use the Maestro flows here for device E2E.
