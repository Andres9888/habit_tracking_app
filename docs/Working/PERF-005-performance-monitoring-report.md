---
type: report
title: PERF-005 Performance Monitoring Implementation Report
created: 2026-01-22
tags:
  - performance
  - monitoring
  - sentry
related:
  - "[[SECURITY-PERFORMANCE-SPEC]]"
  - "[[PERF-001-performance-baseline-report]]"
---

# PERF-005: Performance Monitoring Implementation Report

## Summary

Implemented comprehensive performance monitoring using Sentry for React Native/Expo. The integration bridges the existing local performance monitoring system (`PerformanceProvider`) with Sentry's cloud-based analytics, error tracking, and alerting capabilities.

## Implementation Overview

### Files Created (11 files, ~860 lines)

| File | Lines | Description |
|------|-------|-------------|
| `src/lib/sentry/types.ts` | 97 | Type definitions for Sentry config, users, transactions |
| `src/lib/sentry/config.ts` | 53 | Environment-based configuration builder |
| `src/lib/sentry/init.ts` | 102 | SDK initialization with security filtering |
| `src/lib/sentry/reporter.ts` | 134 | Clean API for error/message/performance reporting |
| `src/lib/sentry/ErrorBoundary.tsx` | 117 | React error boundary with Sentry integration |
| `src/lib/sentry/performanceIntegration.ts` | 115 | Bridge between PerformanceProvider and Sentry |
| `src/lib/sentry/hooks.ts` | 96 | React hooks for common Sentry operations |
| `src/lib/sentry/index.ts` | 44 | Barrel exports for the module |
| `tests/integration/monitoring/sentry-integration.test.ts` | 195 | Integration tests |
| `src/lib/sentry/__tests__/reporter.test.ts` | 148 | Reporter unit tests |
| `src/lib/sentry/__tests__/ErrorBoundary.test.tsx` | 166 | Error boundary tests |

### Files Modified (4 files)

| File | Changes |
|------|---------|
| `app.json` | Added `@sentry/react-native/expo` plugin |
| `src/App.tsx` | Added Sentry init, ErrorBoundary, user sync |
| `App.tsx` | Added Sentry init and ErrorBoundary wrapping |
| `src/contexts/PerformanceContext/PerformanceProvider.tsx` | Integrated Sentry issue reporting |

## Architecture

### Integration Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    App Entry Points                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ initSentry() - Called before React rendering            ││
│  │ SentryErrorBoundary - Wraps entire app                  ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Authentication Layer                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ SentryUserSync - Syncs Clerk user to Sentry context     ││
│  │ useSentryUser() - Updates user on auth changes          ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Performance Monitoring                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ PerformanceProvider (existing)                          ││
│  │   ├─ FrameMonitor → reportFrameIssue()                  ││
│  │   ├─ MemoryMonitor → reportMemoryIssue()                ││
│  │   ├─ NetworkMonitor → reportNetworkIssue()              ││
│  │   └─ RenderTracker → reportSlowRenders()                ││
│  │                                                          ││
│  │ onPerformanceIssue callback → Sentry captureMessage()   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Sentry Cloud                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ • Error tracking with stack traces                      ││
│  │ • Performance issues with context                       ││
│  │ • User sessions and breadcrumbs                         ││
│  │ • Alerting and dashboards                               ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Error Boundary**
   - Catches React render errors
   - Reports to Sentry with component stack
   - Shows user-friendly fallback UI
   - Includes "Try Again" recovery button

2. **Performance Issue Reporting**
   - FPS drops (warning < 45 FPS, critical < 30 FPS)
   - Slow renders (threshold configurable, default 16ms)
   - Memory issues (exceeding 200MB threshold)
   - Network latency (exceeding 200ms P95)

3. **User Context**
   - Syncs Clerk user ID/email to Sentry
   - Tracks premium status as tag for filtering
   - Clears on logout

4. **Security Filtering**
   - Removes tokens from breadcrumbs
   - Skips health check/polling requests
   - Sanitizes URLs (replaces UUIDs with `:id`)
   - Dev mode suppression by default

5. **React Hooks**
   - `useSentryUser()` - User context sync
   - `useSentryTransaction()` - Performance tracing
   - `useSentryScreen()` - Navigation tracking
   - `useSentryHabitActions()` - Habit-specific breadcrumbs
   - `useSentryError()` - Manual error capture

## Configuration Required

### Environment Variables

```bash
# Required for Sentry to be enabled
EXPO_PUBLIC_SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID
```

### Sentry Dashboard Setup

1. Create a new Sentry project for React Native
2. Copy the DSN to `.env`
3. Configure alerts for:
   - Error rate spikes
   - Performance regression
   - Memory issues

### app.json Plugin (Already Added)

```json
{
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        "organization": "daily-habits",
        "project": "react-native"
      }
    ]
  ]
}
```

## Sample Rates

| Environment | Error Sample Rate | Trace Sample Rate |
|-------------|-------------------|-------------------|
| Development | 1.0 (100%) | 1.0 (100%) |
| Preview | 1.0 (100%) | 1.0 (100%) |
| Production | 1.0 (100%) | 0.2 (20%) |

## Test Coverage

- **51 tests** across 3 test files
- Configuration tests (DSN, environment detection)
- Type validation tests
- Performance integration tests
- Reporter no-op behavior tests
- Error boundary rendering tests
- Recovery mechanism tests

## Usage Examples

### Tracking a Custom Error

```typescript
import { useSentryError } from '~/lib/sentry';

function MyComponent() {
  const { captureError } = useSentryError();

  const handleError = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error, { context: 'habit_sync' });
    }
  };
}
```

### Adding Breadcrumbs

```typescript
import { useSentryHabitActions } from '~/lib/sentry';

function HabitToggle({ habitId }) {
  const { trackHabitToggle } = useSentryHabitActions();

  const handleToggle = (completed) => {
    trackHabitToggle(habitId, completed);
    // ... toggle logic
  };
}
```

### Performance Transaction

```typescript
import { getSentryReporter } from '~/lib/sentry';

async function syncHabits() {
  const reporter = getSentryReporter();
  const tx = reporter.startTransaction('habits.sync');

  try {
    const fetchSpan = tx?.startChild('http.client', 'Fetch habits');
    await fetchHabits();
    fetchSpan?.finish();

    const processSpan = tx?.startChild('task.async', 'Process habits');
    await processHabits();
    processSpan?.finish();

    tx?.setStatus('ok');
  } catch (error) {
    tx?.setStatus('unknown_error');
    throw error;
  } finally {
    tx?.finish();
  }
}
```

## Next Steps

1. **Install Package**: Run `npm install @sentry/react-native`
2. **Configure DSN**: Add `EXPO_PUBLIC_SENTRY_DSN` to `.env`
3. **Update Organization**: Change `"organization"` in app.json plugin config
4. **Source Maps**: Configure source map upload in EAS Build

## Dependencies

The implementation requires adding `@sentry/react-native` to package.json:

```bash
npm install @sentry/react-native
```

This package provides:
- Native crash reporting for iOS/Android
- JavaScript error tracking
- Performance monitoring
- Session tracking
- Hermes engine support

---

**Report End**

*Completed: 2026-01-22 by security-performance agent*
