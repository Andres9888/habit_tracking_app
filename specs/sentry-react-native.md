# Sentry React Native Monitoring

Checked: 2026-07-14.

## Overview

Use `@sentry/react-native` for ChainDay's Expo React Native monitoring: JavaScript errors, native crashes, handled exceptions, breadcrumbs, release health, source-map symbolication, and sampled performance tracing.

Repo state:

- `package.json` already has `@sentry/react-native` pinned to `~7.2.0`.
- `app.json` already configures `@sentry/react-native/expo` with `organization: "daily-habits"` and `project: "react-native"`.
- `.env.example` already defines `EXPO_PUBLIC_SENTRY_DSN`.
- Runtime code already exists under `src/lib/sentry/`.

Context7 note: requested, but no callable Context7 resolver/docs tool was exposed in this Codex session after tool discovery. The library ID was inferred from the official repo/package (`getsentry/sentry-react-native`, package `@sentry/react-native`), and the implementation details below come from official Sentry, Expo, Bugsnag, Firebase, React Native Firebase, and npm registry sources.

## Selection Rationale

Selected: `@sentry/react-native`.

| Option | Current status | Strengths | Limits / risks |
| --- | --- | --- | --- |
| `@sentry/react-native` | Repo installed: `~7.2.0`. npm latest checked: `8.18.0`, modified `2026-07-09T09:58:55.494Z`. Sentry docs package detail page showed `8.2.0`, so npm is the fresher version source. | Best fit. Already integrated in repo. First-party Expo SDK 50+ support, Expo config plugin, Metro Debug IDs, release/source-map workflow, native crashes, JS errors, breadcrumbs, tracing, replay, logs, profiling, and clear pricing/quotas. | Upgrade from v7 to v8 should be separate migration work. Traces/replay/logs can exhaust quotas if oversampled. Build auth token is secret. |
| Bugsnag | npm latest checked: `8.10.0`, modified `2026-07-10T12:05:22.354Z`. | Solid React Native and Expo crash/error product, render error boundary, sessions, breadcrumbs, OOM/ANR/app-hang coverage, source-map/native-symbol workflows. | Would replace existing Sentry work. Expo and bare RN use different package paths. EAS Update source maps require explicit upload and code bundle coordination. Pricing is event/span pack based. |
| Firebase Crashlytics | `@react-native-firebase/crashlytics` latest checked: `25.1.0`, modified `2026-06-25T00:33:45.427Z`. | Strong no-cost native crash reporting, useful if the app standardizes on Firebase. | Not a full Sentry replacement for Expo JS symbolication, breadcrumbs, traces, replay/logs, release health, or existing app code. Requires native Firebase setup and has no web equivalent in React Native Firebase. |

Decision: keep Sentry and harden the current integration. Do not add Bugsnag or Crashlytics unless the product deliberately migrates providers.

## Installation

For this Expo app:

```bash
npx expo install @sentry/react-native
```

For a fresh or repaired setup, use Sentry's wizard:

```bash
npx @sentry/wizard@latest -i reactNative
```

Required Expo plugin shape:

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "organization": "daily-habits",
          "project": "react-native"
        }
      ]
    ]
  }
}
```

Required Metro shape:

```js
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = config;
```

Build-time source-map upload needs `SENTRY_AUTH_TOKEN` in local shell, EAS secrets, or CI secrets. Never commit it.

## Configuration (env vars + init code)

| Variable | Scope | Required | Secret | Purpose |
| --- | --- | --- | --- | --- |
| `EXPO_PUBLIC_SENTRY_DSN` | Runtime Expo JS | Yes for event delivery | No | Public DSN. Repo reads this in `buildSentryConfig()`. |
| `SENTRY_AUTH_TOKEN` | Build/EAS/CI | Yes for source maps and debug symbols | Yes | Authenticates upload of release artifacts. Requires project/release write permissions. |
| `SENTRY_DISABLE_AUTO_UPLOAD` | Build/EAS/CI | Optional | No | Set `true` to temporarily disable automatic source-map upload. |
| `SENTRY_ORG` | Build/CLI fallback | Optional | No | Organization slug if upload tooling does not read plugin/native config. Current org: `daily-habits`. |
| `SENTRY_PROJECT` | Build/CLI fallback | Optional | No | Project slug if upload tooling does not read plugin/native config. Current project: `react-native`. |
| `SENTRY_URL` | Build/CLI fallback | Optional | No | Defaults to `https://sentry.io/`; only change for self-hosted Sentry. |
| `SENTRY_DSN` | SDK env fallback | Optional | No | Sentry SDK can read this where process env exists. Prefer `EXPO_PUBLIC_SENTRY_DSN` for Expo client config. |
| `SENTRY_ENVIRONMENT` | SDK env fallback | Optional | No | Sentry SDK can read this; repo currently computes `development`, `preview`, or `production`. |
| `SENTRY_RELEASE` | SDK env fallback | Optional | No | Sentry SDK can read this; repo currently computes `daily-habits@<version>+<build>`. |

Repo-aligned init:

```ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  attachStacktrace: true,
  beforeBreadcrumb,
  beforeSend: createBeforeSend(config),
  debug: config.debug,
  dsn: config.dsn,
  enableAutoSessionTracking: true,
  enableNativeCrashHandling: true,
  environment: config.environment,
  integrations: [Sentry.reactNavigationIntegration()],
  normalizeDepth: 5,
  release: config.release,
  sampleRate: config.sampleRate,
  tracesSampleRate: config.tracesSampleRate,
});
```

If the app has a single root export, wrap it:

```ts
export default Sentry.wrap(App);
```

Production starting point:

```ts
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sampleRate: 1.0,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
});
```

## Key Patterns (code examples)

Capture handled errors:

```ts
try {
  await saveHabit(input);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: "habit-create" },
    extra: { cadence: input.cadence },
  });
  throw error;
}
```

Privacy-safe breadcrumbs:

```ts
Sentry.addBreadcrumb({
  category: "habit",
  data: { source: "today-list" },
  level: "info",
  message: "habit.toggle",
});
```

User context:

```ts
Sentry.setUser(userId ? { id: userId } : null);
```

Do not send email, habit names, reminder text, notes, or other user-entered content without privacy approval.

Expo Update tags:

```ts
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

const scope = Sentry.getGlobalScope();
scope.setTag("expo-update-id", Updates.updateId);
scope.setTag("expo-is-embedded-update", String(Updates.isEmbeddedLaunch));
```

Internal smoke test only:

```tsx
<Button
  title="Trigger Sentry test error"
  onPress={() => {
    Sentry.captureException(new Error("ChainDay Sentry test error"));
  }}
/>;
```

Optional replay/profiling only after privacy and quota review:

```ts
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.mobileReplayIntegration()],
  profilesSampleRate: __DEV__ ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: __DEV__ ? 1.0 : 0.01,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
});
```

## API Reference table

| API / option | Signature / shape | Use |
| --- | --- | --- |
| `Sentry.init(options)` | `init(options): void` | Initialize once as early as possible. Needs `dsn` to send events. |
| `Sentry.wrap(Component)` | `wrap(component): component` | Root instrumentation for touch tracking, automatic tracing, and React context. |
| `Sentry.captureException(error, hint?)` | returns event id string | Report handled exceptions with tags/extra context. |
| `Sentry.captureMessage(message, context?)` | returns event id string | Report notable non-exception states sparingly. |
| `Sentry.addBreadcrumb(breadcrumb)` | `void` | Add pre-error action context. |
| `Sentry.setUser(userOrNull)` | `void` | Set `{ id }` after auth; clear on sign out. |
| `Sentry.setTag(key, value)` | `void` | Add searchable dimensions such as feature, channel, update id. |
| `Sentry.getGlobalScope()` | `Scope` | Set global Expo/update/release tags. |
| `Sentry.reactNavigationIntegration()` | integration factory | Navigation instrumentation if correctly wired to the navigation container. |
| `Sentry.mobileReplayIntegration()` | integration factory | Session Replay; do not enable until privacy/quota review. |
| `dsn` | string | Runtime DSN from `EXPO_PUBLIC_SENTRY_DSN`. |
| `environment` | string | `development`, `preview`, or `production`. |
| `release` | string | Keep aligned with uploaded source maps. |
| `sampleRate` | number `0..1` | Error event sampling. Default is `1.0`. |
| `tracesSampleRate` | number `0..1` | Uniform transaction sampling. Use lower production rate. |
| `tracesSampler` | function | Dynamic transaction sampling. Sentry docs say it takes precedence over `tracesSampleRate`. |
| `beforeSend` | event filter | Scrub/drop events before upload. Required for privacy. |
| `beforeBreadcrumb` | breadcrumb filter | Scrub/drop breadcrumbs before upload. Required for privacy. |

## Gotchas

- Local `@sentry/react-native` is `~7.2.0`; npm latest is `8.18.0`. Do not paste v8-only APIs without upgrading and testing.
- Sentry docs package detail can lag npm. Use npm for latest version, official docs for setup/API behavior, and migration docs for breaking changes.
- Expo SDK 50+ uses `@sentry/react-native`; Expo SDK 49 and older used `sentry-expo`.
- `SENTRY_AUTH_TOKEN` is secret and build-only. `EXPO_PUBLIC_SENTRY_DSN` is public runtime config.
- Expo Go is not proof of native crash/source-map behavior. Validate with development builds and release/EAS builds.
- Release names, dist/build numbers, Debug IDs, and uploaded artifacts must match or errors will be unsymbolicated.
- EAS Update bundles need their own source-map upload path; do not assume native build upload covers OTA updates.
- Keep Sentry native imports away from broad Jest import graphs where possible, or mock `@sentry/react-native` explicitly.
- `sendDefaultPii: true` appears in examples, but leave it off unless privacy policy, store labels, and data processing settings allow it.
- Session Replay, screenshots, view hierarchy, profiling, and logs add privacy and quota risk. Start with errors and sampled traces.

## Rate Limits

Sentry pricing/limits checked 2026-07-14:

- Developer/free: Sentry pricing lists free Developer plan; Expo guide notes free tier supports up to 5,000 events/month.
- Team: Sentry pricing lists `$26/mo` annually with default prepaid data.
- Business: Sentry pricing lists `$80/mo` annually with default prepaid data.
- Included paid volumes shown: 50k errors, 5GB logs, 5M spans, 50 session replays, 1GB attachments.
- Sentry bills separate categories for errors, logs, spans, replays, profiles, attachments, monitors, and related products.
- If quota/PAYG budget is exhausted, additional data can be dropped for the billing cycle.

Recommended app controls:

- `sampleRate: 1.0` for errors initially.
- `tracesSampleRate: 1.0` in dev/internal, `0.1-0.2` in production.
- `profilesSampleRate: 0` initially; up to `0.1` only during targeted investigation.
- `replaysSessionSampleRate: 0` initially; if enabled later, start near `0.01`.
- `replaysOnErrorSampleRate: 1.0` only after replay masking/privacy review.

Competitors:

- Bugsnag pricing page checked 2026-07-14: free plan lists 7.5k events and 1M spans/month; paid plans sell event/span packs.
- Firebase pricing page checked 2026-07-14: Crashlytics appears as no-cost, but it does not cover the same Sentry observability surface.

## Currency (version · checked date · source)

| Item | Version / value | Checked | Source |
| --- | --- | --- | --- |
| Repo installed Sentry RN | `@sentry/react-native ~7.2.0` | 2026-07-14 | `package.json` |
| npm latest Sentry RN | `8.18.0`, modified `2026-07-09T09:58:55.494Z` | 2026-07-14 | `npm --cache /private/tmp/codex-npm-cache view @sentry/react-native version time.modified --json` |
| npm latest Bugsnag RN | `8.10.0`, modified `2026-07-10T12:05:22.354Z` | 2026-07-14 | `npm --cache /private/tmp/codex-npm-cache view @bugsnag/react-native version time.modified --json` |
| npm latest RNFirebase Crashlytics | `25.1.0`, modified `2026-06-25T00:33:45.427Z` | 2026-07-14 | `npm --cache /private/tmp/codex-npm-cache view @react-native-firebase/crashlytics version time.modified --json` |
| Sentry Expo support | Expo SDK 50+ uses `@sentry/react-native`; SDK 49 and older use `sentry-expo` | 2026-07-14 | https://docs.sentry.io/platforms/react-native/manual-setup/expo/ |
| Sentry source maps | SDK 5.11.0+ recommended; automatic upload via wizard/build tooling; `SENTRY_DISABLE_AUTO_UPLOAD=true` disables upload | 2026-07-14 | https://docs.sentry.io/platforms/react-native/sourcemaps/ |
| Sentry tracing | `tracesSampleRate` or `tracesSampler`; `tracesSampler` takes precedence | 2026-07-14 | https://docs.sentry.io/platforms/react-native/tracing/ |
| Sentry options/env | `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` can be read automatically where env is available | 2026-07-14 | https://docs.sentry.io/platforms/react-native/configuration/options/ |
| Sentry pricing | Free Developer, Team `$26/mo`, Business `$80/mo`, quotas above | 2026-07-14 | https://sentry.io/pricing/ |
| Bugsnag Expo | Expo setup, EAS source-map/update notes | 2026-07-14 | https://docs.bugsnag.com/platforms/react-native/expo/ |
| Bugsnag React Native | RN setup, stack traces, OOM/ANR/app-hang notes | 2026-07-14 | https://docs.bugsnag.com/platforms/react-native/react-native/ |
| React Native Firebase Crashlytics | Crashlytics usage docs | 2026-07-14 | https://rnfirebase.io/crashlytics/usage |
| Firebase pricing | Crashlytics no-cost context | 2026-07-14 | https://firebase.google.com/pricing |

## References

- Sentry React Native docs: https://docs.sentry.io/platforms/react-native/
- Sentry Expo setup: https://docs.sentry.io/platforms/react-native/manual-setup/expo/
- Sentry React Native source maps: https://docs.sentry.io/platforms/react-native/sourcemaps/
- Sentry React Native tracing: https://docs.sentry.io/platforms/react-native/tracing/
- Sentry React Native options: https://docs.sentry.io/platforms/react-native/configuration/options/
- Sentry pricing: https://sentry.io/pricing/
- Sentry quotas: https://docs.sentry.io/pricing/quotas/
- Expo Sentry guide: https://docs.expo.dev/guides/using-sentry/
- Bugsnag React Native docs: https://docs.bugsnag.com/platforms/react-native/react-native/
- Bugsnag Expo docs: https://docs.bugsnag.com/platforms/react-native/expo/
- Bugsnag pricing: https://www.bugsnag.com/pricing/
- React Native Firebase Crashlytics: https://rnfirebase.io/crashlytics/usage
- Firebase pricing: https://firebase.google.com/pricing
