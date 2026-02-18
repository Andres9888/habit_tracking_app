# Performance Metrics & Logging System

## Overview

This document describes the comprehensive performance monitoring system added to track critical paths: **data fetching**, **rendering**, and **navigation** performance.

The system provides:
- ✅ Automatic performance tracking for data fetches and mutations
- ✅ Component-level render time measurement
- ✅ Navigation transition performance monitoring
- ✅ Configurable thresholds for slow operation detection
- ✅ Console logging in development (disabled in production)
- ✅ Server-side metric reporting capability

## Architecture

### Core Module: `lib/performanceLogging.ts`

The main performance logging module that handles all metric collection and reporting.

**Key Features:**
- Type-safe performance metrics
- Configurable thresholds based on web standards
- Severity classification (info, warn, error, critical)
- Safe logging (respects dev mode)
- Server-side reporting capability

**Configuration:**

```typescript
interface PerformanceLoggingConfig {
  enableConsoleLogging: boolean;      // Log to console in dev
  fetchThresholdMs: number;            // Default: 1000ms
  mutationThresholdMs: number;         // Default: 500ms
  navigationThresholdMs: number;       // Default: 300ms
  renderThresholdMs: number;           // Default: 16.67ms (60fps)
  sampleRate: number;                  // 0-1, default: 1 (all metrics)
  logToServer?: (metrics) => Promise;  // Optional server reporting
}
```

### Hooks: `hooks/performance/usePerformanceMetrics.ts`

React hooks that simplify performance tracking in components.

**Available Hooks:**

1. **`useRenderMetrics(componentName, deps?)`**
   - Automatically tracks component render time
   - Measures time between mount/update
   
2. **`useFetchMetrics(queryName, endpoint?)`**
   - Tracks data fetch performance
   - Returns `trackFetch()` callback
   
3. **`useMutationMetrics(operationName, endpoint?)`**
   - Tracks write operations (create, update, delete)
   - Returns `trackMutation()` callback
   
4. **`useNavigationMetrics()`**
   - Tracks navigation transitions
   - Returns `trackNav()` callback
   
5. **`useComponentMetrics(componentName)`**
   - Combined hook for render + fetch tracking
   - Returns both `trackData` and `trackRender`

## Usage Examples

### 1. Tracking Data Fetches

**In a component using async data:**

```typescript
import { useFetchMetrics } from '@/hooks/performance';

function HabitsListScreen() {
  const { trackFetch } = useFetchMetrics('habits-list');
  const [habits, setHabits] = useState([]);
  
  useEffect(() => {
    const load = async () => {
      const tracker = trackFetch();
      try {
        const data = await api.habits.list();
        tracker.finish({ 
          status: 200, 
          size: JSON.stringify(data).length 
        });
        setHabits(data);
      } catch (error) {
        tracker.finish({ error });
      }
    };
    load();
  }, [trackFetch]);
}
```

### 2. Enhanced useQueryWithCache Hook

The `useQueryWithCache` hook now automatically tracks query performance:

```typescript
// From src/hooks/useQueryWithCache.ts
const habits = useQueryWithCache(api.habits.list, undefined, {
  label: 'habits-list',
  trackPerformance: true,  // Optional, defaults to true in __DEV__
  staleTime: CACHE_TIMES.MEDIUM
});
// Automatically logs fetch time and detects slow queries
```

### 3. Tracking Component Renders

**Measure render time automatically:**

```typescript
import { useRenderMetrics } from '@/hooks/performance';

function ExpensiveComponent() {
  useRenderMetrics('ExpensiveComponent', [propsToMonitor]);
  
  return (
    // Component JSX
  );
}
```

### 4. Tracking Mutations

**Monitor create/update/delete operations:**

```typescript
import { useMutationMetrics } from '@/hooks/performance';

function CreateHabitModal() {
  const { trackMutation } = useMutationMetrics('create-habit');
  
  const handleCreate = async (habitData) => {
    const tracker = trackMutation();
    try {
      const result = await api.habits.create(habitData);
      tracker.finish({ status: 201 });
      // Handle success
    } catch (error) {
      tracker.finish({ error });
    }
  };
}
```

### 5. Tracking Navigation

**Monitor screen transitions:**

```typescript
import { useNavigationMetrics } from '@/hooks/performance';
import { useNavigation } from '@react-navigation/native';

function HabitsList() {
  const navigation = useNavigation();
  const { trackNav } = useNavigationMetrics();
  
  const handleNavigateToDetail = (habitId) => {
    const tracker = trackNav('habit-detail', 'habits-list');
    navigation.navigate('Detail', { habitId });
    tracker.finish({ transitionType: 'push' });
  };
}
```

## Direct API Usage

For more control, use the core functions directly from `lib/performanceLogging.ts`:

```typescript
import {
  trackDataFetch,
  trackRender,
  trackMutation,
  trackNavigation,
  getMetrics,
  getSlowMetrics,
  generateReport,
  flushMetrics,
} from '@/lib/performanceLogging';

// Manual tracking
const { finish } = trackDataFetch('my-query');
const data = await fetchData();
finish({ status: 200, size: data.length });

// Get all metrics
const allMetrics = getMetrics();

// Get only slow operations
const slowOps = getSlowMetrics();

// Generate performance report
const report = generateReport();
console.log(report);

// Send to server
await flushMetrics();
```

## Performance Report

The system can generate a comprehensive performance report:

```typescript
const report = generateReport();
/*
{
  timestamp: 1708284780000,
  totalMetrics: 45,
  averageDuration: {
    fetch: 245.5,      // ms
    mutation: 123.2,   // ms
    navigation: 87.1,  // ms
    render: 8.3        // ms
  },
  slowMetrics: {
    all: [...],
    byType: {
      fetch: [...],
      mutation: [...],
      navigation: [...],
      render: [...]
    }
  },
  fetchMetrics: [...]
}
*/
```

## Thresholds & Severity

### Default Performance Thresholds

Based on web performance standards:

| Operation | Threshold | Severity Levels |
|-----------|-----------|-----------------|
| Data Fetch | 1000ms | > 3000ms: Critical, > 2000ms: Error, > 1000ms: Warn |
| Mutation | 500ms | > 1500ms: Critical, > 1000ms: Error, > 500ms: Warn |
| Navigation | 300ms | > 900ms: Critical, > 600ms: Error, > 300ms: Warn |
| Render | 16.67ms | > 50ms: Critical, > 33ms: Error, > 16.67ms: Warn |

### Customizing Thresholds

```typescript
import { initPerformanceLogging } from '@/lib/performanceLogging';

initPerformanceLogging({
  fetchThresholdMs: 2000,      // Increase tolerance
  renderThresholdMs: 33,       // Target 30fps instead of 60fps
  sampleRate: 0.1,              // Log only 10% of metrics
  enableConsoleLogging: true,
});
```

## Development vs Production

**In Development (`__DEV__`):**
- Console logging enabled
- All metrics tracked (100% sample rate)
- Helps identify performance issues during development

**In Production:**
- Console logging disabled
- Can reduce sample rate (e.g., 10%)
- Server-side reporting for analytics

```typescript
// Configure for production
initPerformanceLogging({
  enableConsoleLogging: false,
  sampleRate: 0.1,  // Log 10% of operations
  logToServer: async (metrics) => {
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metrics)
    });
  }
});
```

## Critical Paths Instrumented

### 1. Data Fetching (`useQueryWithCache`)
- Automatically tracks Convex query performance
- Logs slow queries (> 1s by default)
- Captures response status and size

### 2. Component Rendering
- Can be added to any component with `useRenderMetrics`
- Tracks render time and re-render triggers
- Identifies expensive components

### 3. Navigation Transitions
- Track navigation latency with `useNavigationMetrics`
- Measure screen transition performance
- Detect jank in transitions

### 4. Mutations
- Track create/update/delete operations
- Monitor mutation latency
- Log mutation errors

## Integration Points

### With Sentry
The performance logging system complements Sentry's error tracking:
- Sentry: Errors and exceptions
- Performance Logging: Metrics and latency

### With Redux DevTools / State Management
Can integrate with your state management to correlate performance with state changes.

### With Analytics
Send performance metrics to your analytics platform for long-term trending.

## Best Practices

1. **Use appropriate hooks** - Match the hook to the operation type
2. **Label operations clearly** - Use descriptive names for debugging
3. **Handle errors** - Always call `finish()` even on error
4. **Consider sample rates** - Reduce in production to avoid overhead
5. **Monitor thresholds** - Adjust based on your app's performance targets
6. **Regular reviews** - Check reports weekly for performance regressions

## Files Added

- `src/lib/performanceLogging.ts` - Core performance logging module
- `src/hooks/performance/usePerformanceMetrics.ts` - React hooks for performance tracking
- `PERFORMANCE_METRICS.md` - This documentation

## Files Modified

- `src/App.tsx` - Initialize performance logging on app start
- `src/hooks/useQueryWithCache.ts` - Add automatic performance tracking
- `src/hooks/performance/index.ts` - Export new hooks

## Metrics Collection

All metrics are stored in memory and can be:
- Logged to console (development only)
- Retrieved via `getMetrics()` API
- Exported as a report via `generateReport()`
- Sent to server via `flushMetrics()`

## Future Enhancements

1. **Real User Monitoring (RUM)** - Collect metrics from production users
2. **Performance budgets** - Enforce maximum latency per operation
3. **Trend analysis** - Track performance over time
4. **Alerts** - Notify on regression detection
5. **Custom metrics** - User-defined performance tracking
6. **Correlation analysis** - Link performance to user actions

## Troubleshooting

### Metrics not appearing in console

Check that:
1. Development mode is enabled (`__DEV__ === true`)
2. Performance logging is initialized in `App.tsx`
3. Components are using the appropriate hooks

### Thresholds seem wrong

Adjust based on your target device performance:
```typescript
// For lower-end devices, increase thresholds
initPerformanceLogging({
  renderThresholdMs: 33.33,  // 30fps target
  navigationThresholdMs: 500,
});
```

### Too much console spam

Reduce the sample rate:
```typescript
initPerformanceLogging({
  sampleRate: 0.1,  // Log only 10% of operations
});
```

## References

- [Web Vitals](https://web.dev/vitals/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
