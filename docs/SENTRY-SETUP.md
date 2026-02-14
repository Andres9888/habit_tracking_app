# Sentry Error Tracking Setup

## Overview

This project uses [`@sentry/react-native`](https://docs.sentry.io/platforms/react-native/) for crash reporting, error tracking, and performance monitoring.

## Quick Start

### 1. Create a Sentry Project

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new **React Native** project
3. Copy your DSN

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
EXPO_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/1234567
```

### 3. Configure Source Map Uploads (EAS Build)

In `eas.json`, replace the placeholder values for `preview` and `production` builds:

| Variable             | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `SENTRY_ORG`         | Your Sentry organization slug                                |
| `SENTRY_PROJECT`     | Your Sentry project slug                                     |
| `SENTRY_AUTH_TOKEN`  | Auth token from **Settings → Auth Tokens** (needs `project:releases` and `org:read` scopes) |

> **Tip:** Use [EAS Secrets](https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables) for `SENTRY_AUTH_TOKEN` instead of committing it.

```bash
eas secret:create --name SENTRY_AUTH_TOKEN --value "sntrys_..."
```

Source maps are **disabled** for `development` builds (`SENTRY_DISABLE_AUTO_UPLOAD=true`).

## Architecture

```
src/lib/sentry/
├── init/               # SDK initialization
├── config.ts           # Environment detection (dev/preview/production)
├── ErrorBoundary/      # React error boundary with Sentry reporting
├── reporter/           # Abstracted reporter API (real + no-op)
├── hooks/              # React hooks for breadcrumbs, user sync, etc.
├── errorTracking/      # Mutation/query error tracking
└── performanceIntegration/  # Frame, render, memory, network reporters
```

### Environment Detection

Environments are auto-detected:

| Condition                          | Environment   |
| ---------------------------------- | ------------- |
| `__DEV__` is true                  | `development` |
| EAS channel is `preview`           | `preview`     |
| Everything else                    | `production`  |

### Key Integrations

- **`Sentry.wrap(App)`** — wraps the root component for automatic error capture
- **`SentryErrorBoundary`** — React error boundary with fallback UI
- **`SentryUserSync`** — syncs Clerk user identity to Sentry
- **`reactNavigationIntegration()`** — automatic screen tracking
- **Breadcrumbs** — habit toggle, paywall views, purchases, navigation

### Breadcrumb Categories

| Category     | Tracked Actions                        |
| ------------ | -------------------------------------- |
| `habit`      | Toggle, create, archive, reorder       |
| `paywall`    | Paywall viewed (with source)           |
| `purchase`   | Premium purchase completed             |
| `navigation` | Screen transitions                     |
| `user`       | General user actions                   |

## Verifying

1. Set your DSN in `.env.local`
2. Run the app
3. Trigger an error (or call `Sentry.captureMessage('test')` in dev)
4. Check your Sentry dashboard — events should appear within seconds

## Disabling

Remove or unset `EXPO_PUBLIC_SENTRY_DSN`. When no DSN is configured, Sentry initializes a no-op reporter and has zero runtime overhead.
