# App Health Monitoring

Comprehensive health monitoring including crash-free rate tracking and performance metrics.

## Features

### 📊 Crash-Free Rate Tracking
- Automatically tracks if a session crashes
- Reports session health summary to Sentry
- Integrates with React Error Boundary

### ⚡ Performance Metrics

#### 1. Screen Render Times
Track how long each screen takes to become interactive:

```tsx
import { useScreenRenderTracking } from '@/lib/performance';

function HomeScreen() {
  // Automatically tracks render time until screen is interactive
  useScreenRenderTracking('HomeScreen');

  return <View>{/* ... */}</View>;
}
```

**Manual control** (for complex screens):

```tsx
import { useScreenRenderTrackingManual } from '@/lib/performance';

function ComplexScreen() {
  const { markInteractive } = useScreenRenderTrackingManual('ComplexScreen');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (dataLoaded) {
      // Mark as interactive when data is ready
      markInteractive();
    }
  }, [dataLoaded, markInteractive]);

  return <View>{/* ... */}</View>;
}
```

#### 2. API Response Times (Convex Queries)
Track Convex query performance:

```tsx
import { useQuery } from 'convex/react';
import { useConvexQueryTracking } from '@/lib/performance';

function HabitList() {
  const habits = useQuery(api.habits.list);
  
  // Automatically tracks query performance
  useConvexQueryTracking(
    'habits.list',
    habits === undefined, // isLoading
    undefined,            // error
    habits?.length        // resultSize (optional)
  );

  return <FlatList data={habits} />;
}
```

**For mutations** (manual tracking):

```tsx
import { useMutation } from 'convex/react';
import { useConvexQueryTrackingManual } from '@/lib/performance';

function CreateHabit() {
  const createHabit = useMutation(api.habits.create);
  const trackQuery = useConvexQueryTrackingManual();

  const handleCreate = async (name: string) => {
    const queryId = trackQuery.start('habits.create');
    try {
      const result = await createHabit({ name });
      trackQuery.end(queryId, { resultSize: 1 });
      return result;
    } catch (error) {
      trackQuery.end(queryId, { error: error as Error });
      throw error;
    }
  };

  return <Button onPress={() => handleCreate('Exercise')} />;
}
```

#### 3. JS Thread Frame Drops
Automatically monitors frame drops in the JavaScript thread:

- **Minor**: 16-32ms (1-2 frames)
- **Moderate**: 32-64ms (2-4 frames)
- **Severe**: 64-100ms (4-6 frames)
- **Critical**: >100ms (6+ frames)

Only severe/critical drops are reported to Sentry to reduce noise.

#### 4. User Flow Breadcrumbs
Track user actions and navigation:

```tsx
import { useUserActionTracking } from '@/lib/performance';

function HabitCard({ habit }: Props) {
  const { trackAction, trackNavigation } = useUserActionTracking();

  const handleComplete = () => {
    trackAction('habit.complete', {
      habitId: habit.id,
      habitName: habit.name,
      streak: habit.streak,
    });
    // ... complete habit logic
  };

  const handleNavigate = () => {
    trackNavigation('HabitList', 'HabitDetail');
    navigation.navigate('HabitDetail', { id: habit.id });
  };

  return (
    <TouchableOpacity onPress={handleComplete}>
      {/* ... */}
    </TouchableOpacity>
  );
}
```

## Performance Thresholds

### Screen Render Times
- **Fast**: <200ms
- **Acceptable**: 200-500ms
- **Slow**: 500-1000ms ⚠️
- **Critical**: >1000ms 🚨

### API Response Times
- **Fast**: <100ms
- **Acceptable**: 100-300ms
- **Slow**: 300-1000ms ⚠️
- **Critical**: >1000ms 🚨

### Frame Drops
- **Minor**: 16-32ms (1-2 frames)
- **Moderate**: 32-64ms (2-4 frames)
- **Severe**: 64-100ms (4-6 frames) ⚠️
- **Critical**: >100ms 🚨

## Session Health Reporting

Session health is automatically tracked and can be retrieved:

```tsx
import { getPerformanceMonitor } from '@/lib/performance';

const monitor = getPerformanceMonitor();
const health = monitor.getSessionHealth();

console.log(health);
// {
//   crashFree: true,
//   duration: 12345,
//   frameDropCount: 10,
//   severeFrameDrops: 2
// }

// Report to Sentry
monitor.reportSessionHealth();
```

## Integration with Sentry

All metrics are automatically reported to Sentry:

1. **Breadcrumbs** for user actions, navigation, and performance events
2. **Transactions** for screen renders and API calls
3. **Performance issues** for slow renders and queries
4. **Crash tracking** integrated with Error Boundary

## Best Practices

### 1. Track Critical User Paths
```tsx
function CheckInFlow() {
  useScreenRenderTracking('CheckInFlow');
  const { trackAction } = useUserActionTracking();

  const handleCheckIn = (habitId: string) => {
    trackAction('habit.checkin', { habitId });
    // ... check-in logic
  };
}
```

### 2. Monitor Expensive Queries
```tsx
function AnalyticsScreen() {
  const stats = useQuery(api.analytics.getStats, { timeRange: '30d' });
  
  // Track this expensive query
  useConvexQueryTracking(
    'analytics.getStats',
    stats === undefined,
    undefined,
    stats ? Object.keys(stats).length : undefined
  );
}
```

### 3. Track User Actions in Critical Flows
```tsx
function SubscriptionPurchase() {
  const { trackAction } = useUserActionTracking();

  const handlePurchase = (productId: string) => {
    trackAction('subscription.purchase_initiated', { productId });
    // ... purchase logic
  };
}
```

## Viewing Metrics in Sentry

All performance data is available in Sentry:

1. **Performance Dashboard**: View transaction times, throughput
2. **Breadcrumbs**: See user flow leading to issues
3. **Issues**: Performance warnings for slow operations
4. **Session Health**: Crash-free rate and session duration

## Architecture

```
App.tsx
  └─ initPerformanceMonitoring()
       └─ PerformanceMonitor
            ├─ Frame Drop Monitoring (requestAnimationFrame)
            ├─ Screen Render Tracking
            ├─ API Response Tracking
            ├─ User Action Breadcrumbs
            └─ Session Health Tracking

SentryErrorBoundary
  └─ markSessionCrashed() on error
```

## Technical Details

- **Frame monitoring** runs on `requestAnimationFrame` loop
- **Screen tracking** uses `InteractionManager.runAfterInteractions`
- **Zero impact** on app startup (initialized with `requestIdleCallback`)
- **Automatic cleanup** of old metrics to prevent memory leaks
- **Sentry integration** via breadcrumbs and transactions
