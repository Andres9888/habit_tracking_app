# HealthKit Integration Module

Auto-complete health-related habits using Apple HealthKit data.

## Quick Start

### 1. Request Permissions

```tsx
import { useHealthKitPermissions } from '@/hooks/useHealthKitPermissions';

function SettingsScreen() {
  const { isAvailable, hasPermission, requestAccess } = useHealthKitPermissions();

  if (!isAvailable) {
    return <Text>HealthKit not available on this device</Text>;
  }

  return (
    <Button onPress={requestAccess} disabled={hasPermission}>
      {hasPermission ? 'HealthKit Enabled' : 'Enable HealthKit'}
    </Button>
  );
}
```

### 2. Sync Habits

```tsx
import { useHealthKitSync } from '@/hooks/useHealthKitSync';

function HabitsScreen() {
  const habits = useQuery(api.habits.list);
  const completeHabit = useMutation(api.habits.complete);

  const { syncNow, isSyncing, lastSync } = useHealthKitSync({
    habits,
    onHabitComplete: completeHabit,
    enabled: true,
  });

  return (
    <Button onPress={syncNow} disabled={isSyncing}>
      {isSyncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
```

### 3. Display Health Data

```tsx
import { HealthDataCard } from '@/components/health/HealthDataCard';

function HabitDetailScreen({ habit }) {
  return (
    <View>
      <Text>{habit.name}</Text>
      <HealthDataCard habitName={habit.name} enabled={true} />
    </View>
  );
}
```

## How It Works

1. **Detection**: Analyzes habit names for health keywords (steps, sleep, workout)
2. **Threshold Extraction**: Parses goals from names ("10K steps" → 10,000)
3. **Data Fetching**: Queries HealthKit for today's data
4. **Auto-Completion**: Completes habits when thresholds are met

## Supported Habits

| Pattern | Health Type | Example Threshold |
|---------|-------------|-------------------|
| "steps", "walk", "10k" | Steps | 10,000 steps |
| "sleep", "rest" | Sleep | 8 hours |
| "exercise", "workout", "gym" | Workouts | 1 workout |

## Installation

See [HEALTH_INTEGRATION.md](../../../../HEALTH_INTEGRATION.md) for full setup instructions.

## Created By

Sonnet (Claude Sonnet 4.5) - 2026-02-16
