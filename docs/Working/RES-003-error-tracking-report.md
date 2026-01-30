---
type: report
title: RES-003 Error Tracking Implementation Report
created: 2026-01-22
tags:
  - security-performance
  - sentry
  - error-tracking
related:
  - "[[PERF-005-performance-monitoring-report]]"
  - "[[RES-001-comprehensive-offline-support-report]]"
---

# RES-003: Comprehensive Error Tracking Implementation

## Executive Summary

Implemented comprehensive error tracking using Sentry, building on the performance monitoring infrastructure from PERF-005. The implementation includes automatic error classification integration, mutation/query tracking, breadcrumb trails, and React hooks for easy component integration.

## Implementation Details

### Files Created (10 files, ~575 lines)

#### Core Error Tracking Module
| File | Lines | Description |
|------|-------|-------------|
| `src/lib/sentry/errorTracking/types.ts` | 85 | Type definitions for error tracking |
| `src/lib/sentry/errorTracking/tracker.ts` | 95 | Core error tracker with classification |
| `src/lib/sentry/errorTracking/mutationTracker.ts` | 98 | Convex mutation error tracking |
| `src/lib/sentry/errorTracking/queryTracker.ts` | 75 | Convex query error tracking |
| `src/lib/sentry/errorTracking/hooks.ts` | 95 | React hooks for components |
| `src/lib/sentry/errorTracking/index.ts` | 45 | Barrel exports |

#### Additional Hooks
| File | Lines | Description |
|------|-------|-------------|
| `src/lib/sentry/hooks/useSentryBreadcrumbs.ts` | 85 | General breadcrumb tracking |

#### Test Files
| File | Tests | Description |
|------|-------|-------------|
| `__tests__/tracker.test.ts` | 13 | Core tracker unit tests |
| `__tests__/mutationTracker.test.ts` | 7 | Mutation tracking tests |
| `__tests__/hooks.test.ts` | 7 | React hooks tests |

### Files Modified

| File | Changes |
|------|---------|
| `src/lib/sentry/hooks/index.ts` | Added `useSentryBreadcrumbs` export |
| `src/lib/sentry/index.ts` | Added error tracking module exports |

## Key Features

### 1. Error Classification Integration

Bridges the existing offline error classifier with Sentry:

```typescript
import { trackError } from '@/lib/sentry';

// Automatically classifies and reports
const result = trackError(error, {
  tags: { feature: 'habits' },
  extra: { habitId: 'h123' },
});

// result.classified.category - 'network', 'server', 'auth', etc.
// result.eventId - Sentry event ID
// result.reported - Whether sent to Sentry
```

### 2. Mutation Tracking

Automatic tracking for Convex mutations:

```typescript
import { useTrackedMutation } from '@/lib/sentry';

// Wrap mutation with automatic tracking
const trackedMutation = useTrackedMutation('toggleHabit', mutation);

// Or use the factory
const wrapped = createTrackedMutation('toggleHabit', mutation);
```

Features:
- Automatic breadcrumb on mutation start
- Duration tracking
- Success breadcrumb with timing
- Error tracking with classification
- Argument sanitization (removes passwords, tokens)

### 3. Query Tracking

Track query errors with context:

```typescript
import { useQueryErrorTracking } from '@/lib/sentry';

const { trackError, addBreadcrumb } = useQueryErrorTracking('getHabits');

// Track query failure
trackError(error, { userId: 'u123' });
```

### 4. Breadcrumb Trail

General-purpose user action tracking:

```typescript
import { useSentryBreadcrumbs } from '@/lib/sentry';

const {
  trackUserAction,
  trackNavigation,
  trackModal,
  trackFormSubmit,
} = useSentryBreadcrumbs();

// Track actions
trackUserAction('habit_toggle', { habitId: 'h123' });
trackNavigation('HabitDetail', { id: 'h123' }, 'HabitsList');
trackModal('SettingsModal', true);
```

### 5. Component Error Handling

Hook for component-level error handling:

```typescript
import { useComponentErrorHandler } from '@/lib/sentry';

const handleError = useComponentErrorHandler('HabitCard');

// In error boundary or try/catch
handleError(error, { componentStack: '...' });
```

### 6. Async Operation Tracking

Track any async operation:

```typescript
import { useAsyncErrorTracking } from '@/lib/sentry';

const { wrap } = useAsyncErrorTracking('imageUpload');

const result = await wrap(async () => {
  return await uploadImage(file);
});
```

## Error Categories & Severity

| Category | Severity | Reported | Use Case |
|----------|----------|----------|----------|
| server | error | Yes | 5xx responses |
| auth | warning | Yes | 401/403 responses |
| validation | warning | Yes | 400/422 responses |
| timeout | warning | Yes | Request timeouts |
| rateLimit | warning | Yes | 429 responses |
| network | info | No* | Offline scenarios |
| notFound | warning | Yes | 404 responses |
| conflict | warning | Yes | 409 responses |
| unknown | error | Yes | Unclassified errors |

*Network errors add breadcrumbs but don't report to avoid noise from offline users

## Rate Limiting & Sampling

The error tracker includes built-in safeguards:

```typescript
import { configureErrorTracker } from '@/lib/sentry';

configureErrorTracker({
  sampleRate: 0.5,              // Report 50% of errors
  rateLimitPerMinute: 30,       // Max 30 errors/minute
  reportSilentCategories: false, // Don't report network errors
});
```

## Test Coverage

Total: **27 tests**

| Category | Tests | Coverage |
|----------|-------|----------|
| Core Tracker | 13 | Classification, rate limiting, sampling, context |
| Mutation Tracker | 7 | Breadcrumbs, sanitization, error tracking |
| React Hooks | 7 | All 5 hooks tested |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│   │ useTracked  │     │ useQuery    │     │ useSentry   │  │
│   │ Mutation    │     │ ErrorTrack  │     │ Breadcrumbs │  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘  │
│          │                   │                   │          │
│          ▼                   ▼                   ▼          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Error Tracking Module                   │  │
│   │  ┌───────────┐  ┌────────────┐  ┌────────────────┐  │  │
│   │  │ tracker   │  │ mutation   │  │ query          │  │  │
│   │  │  .ts      │  │ Tracker.ts │  │ Tracker.ts     │  │  │
│   │  └─────┬─────┘  └─────┬──────┘  └────────┬───────┘  │  │
│   │        │              │                  │           │  │
│   │        └──────────────┼──────────────────┘           │  │
│   │                       ▼                              │  │
│   │               ┌──────────────┐                       │  │
│   │               │ classifyError│ ◄── offline/errorClassifier
│   │               └──────┬───────┘                       │  │
│   │                      │                               │  │
│   └──────────────────────┼───────────────────────────────┘  │
│                          ▼                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Sentry Reporter                         │   │
│   │  ┌───────────┐  ┌─────────────┐  ┌──────────────┐   │   │
│   │  │ capture   │  │ add         │  │ set          │   │   │
│   │  │ Error()   │  │ Breadcrumb()│  │ Tags()       │   │   │
│   │  └───────────┘  └─────────────┘  └──────────────┘   │   │
│   └─────────────────────────────────────────────────────┘   │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           ▼
                    ┌──────────────┐
                    │   Sentry     │
                    │   Cloud      │
                    └──────────────┘
```

## Integration with Existing Infrastructure

- **Builds on PERF-005**: Uses existing Sentry initialization and reporter
- **Integrates RES-001**: Bridges offline error classifier for categorization
- **Complements ErrorBoundary**: Works alongside existing component error boundary

## Usage Recommendations

1. **Mutations**: Use `useTrackedMutation` for all Convex mutations
2. **Queries**: Use `useQueryErrorTracking` when handling query errors
3. **Components**: Use `useComponentErrorHandler` in error boundaries
4. **User Actions**: Use `useSentryBreadcrumbs` for navigation and user interactions
5. **Async Operations**: Use `useAsyncErrorTracking` for file uploads, external API calls

## Configuration Required

The error tracking uses the existing Sentry configuration from PERF-005:

```bash
# Already required for PERF-005
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

No additional configuration required.
