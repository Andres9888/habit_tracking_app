# Sentry Advanced Monitoring Review

Checked: 2026-07-14

## Decision

Sentry replay, profiling, and logs are implemented as opt-in runtime controls.
They remain disabled unless the matching `EXPO_PUBLIC_SENTRY_ENABLE_*` flag is
set for a build. Error tracking, breadcrumbs, release health, and sampled traces
continue to use the existing privacy scrubbers.

## Privacy Review

- `sendDefaultPii` stays `false`.
- Only opaque user IDs may be sent through `Sentry.setUser`.
- `attachScreenshot` and `attachViewHierarchy` stay `false`.
- Session Replay is configured at low quality and must pass through the existing
  `beforeSend` and `beforeBreadcrumb` redaction callbacks.
- Sentry Logs may be enabled with `enableLogs`, but automatic console-log capture
  is disabled so arbitrary `console.log` text is not uploaded.
- Failed network request capture remains disabled to avoid leaking URLs, request
  metadata, or payload data.

## Quota Review

Sentry bills errors, logs, spans, replays, profiles, attachments, and related
products separately. The production defaults are intentionally conservative:

| Signal          | Default                 | Production enablement cap                     |
| --------------- | ----------------------- | --------------------------------------------- |
| Errors          | `sampleRate: 1`         | Keep enabled                                  |
| Traces          | `tracesSampleRate: 0.2` | Revisit after real volume                     |
| Session replay  | `0`                     | Start at `0.01` full sessions                 |
| Replay on error | `0`                     | Use `1.0` only after replay masking review    |
| Profiling       | `0`                     | Use `0.1` only during targeted investigations |
| Logs            | `false`                 | Enable only with quota alerting in place      |

## Store-Label Review

Before enabling replay, profiling, or logs in a production App Store build,
confirm the App Privacy labels and privacy policy disclose diagnostics and
performance data collected by Sentry. If replay is enabled, review whether
screen recordings or interaction diagnostics change the disclosure scope for
diagnostics, product interaction, usage data, or other data categories.

## Runtime Controls

```bash
EXPO_PUBLIC_SENTRY_ENABLE_REPLAY=false
EXPO_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.01
EXPO_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1
EXPO_PUBLIC_SENTRY_ENABLE_PROFILING=false
EXPO_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE=0.1
EXPO_PUBLIC_SENTRY_ENABLE_LOGS=false
```
