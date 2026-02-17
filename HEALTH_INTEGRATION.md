# 🍎 Apple Health (HealthKit) Integration

## Overview
Sync health-related habits with Apple HealthKit to auto-complete habits based on real health data.

## Features

### Phase 1: Auto-Completion (MVP)
- ✅ **Exercise Habit**: Auto-complete when workout detected in HealthKit
- ✅ **Sleep Habit**: Auto-complete "Sleep 8 hours" when sleep data meets goal
- ✅ **Steps Habit**: Auto-complete "10K steps" from step counter
- ✅ **Health Data Display**: Show live health metrics on habit detail screen

### Phase 2: Enhanced Integration
- 📊 Historical sync (backfill completed habits from past week)
- 🔔 Smart notifications (remind only if health data shows incomplete)
- 📈 Trend visualization (show 7-day health trends on habit cards)
- 🎯 Custom thresholds (let users set their own step/sleep goals)

## Technical Architecture

### Dependencies
```json
{
  "react-native-health": "^1.24.1"  // HealthKit integration for React Native
}
```

### File Structure
```
src/
├── lib/
│   └── healthkit/
│       ├── index.ts                 # Main HealthKit service
│       ├── permissions.ts           # Permission handling
│       ├── types.ts                 # Type definitions
│       └── syncEngine.ts            # Auto-completion logic
├── hooks/
│   ├── useHealthKitPermissions.ts   # Permission hook
│   ├── useHealthKitSync.ts          # Sync hook
│   └── useHealthData.ts             # Fetch health data for UI
└── screens/
    └── HabitDetailScreen/
        └── HealthDataCard.tsx       # Display health metrics
```

### Data Flow

1. **Permission Request** (on first launch or settings)
   ```
   User enables HealthKit → Request read permissions → Store consent
   ```

2. **Background Sync** (every 30 minutes via background task)
   ```
   Check HealthKit → Match habits → Auto-complete if threshold met → Update Convex
   ```

3. **UI Display** (habit detail screen)
   ```
   Fetch today's health data → Display in card → Show progress bar
   ```

## Implementation Plan

### Step 1: Install Dependencies
```bash
npm install react-native-health
npx pod-install  # iOS only
```

### Step 2: Configure iOS Permissions
Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSHealthShareUsageDescription": "Chain Day uses HealthKit to automatically complete your health-related habits based on real activity data.",
        "NSHealthUpdateUsageDescription": "Chain Day may write habit completions to Health for tracking."
      }
    },
    "plugins": [
      [
        "react-native-health",
        {
          "isCaloriesEnabled": false,
          "isStepsEnabled": true,
          "isDistanceEnabled": false,
          "isFlightsClimbedEnabled": false,
          "isHeartRateEnabled": false,
          "isSleepAnalysisEnabled": true,
          "isWorkoutEnabled": true
        }
      ]
    ]
  }
}
```

### Step 3: Create HealthKit Service

**lib/healthkit/index.ts**
- Initialize HealthKit
- Request permissions (steps, workouts, sleep)
- Fetch data methods:
  - `getStepsToday(): Promise<number>`
  - `getSleepHoursToday(): Promise<number>`
  - `getWorkoutsToday(): Promise<Workout[]>`
- Export singleton instance

**lib/healthkit/syncEngine.ts**
- `syncHealthDataWithHabits()` - Main sync function
- Match habit names to health data types:
  - "Exercise" / "Workout" → workouts
  - "10K steps" / "Steps" → step count
  - "Sleep 8 hours" / "Sleep" → sleep analysis
- Auto-complete logic:
  - Query HealthKit for today's data
  - Check if thresholds met
  - Call Convex mutation to complete habit
  - Store last sync timestamp

### Step 4: Create React Hooks

**hooks/useHealthKitPermissions.ts**
```typescript
export function useHealthKitPermissions() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  
  const requestPermissions = async () => { /* ... */ };
  
  return { isAvailable, hasPermission, requestPermissions };
}
```

**hooks/useHealthKitSync.ts**
```typescript
export function useHealthKitSync(habits: Habit[]) {
  const syncNow = async () => {
    // Fetch health data
    // Match to habits
    // Auto-complete if criteria met
  };
  
  useEffect(() => {
    // Register background task
  }, []);
  
  return { syncNow, lastSyncTime };
}
```

**hooks/useHealthData.ts**
```typescript
export function useHealthData(habitId: string) {
  const [data, setData] = useState<HealthMetric | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Determine habit type (steps/sleep/workout)
    // Fetch relevant health data
    // Update state
  }, [habitId]);
  
  return { data, loading };
}
```

### Step 5: UI Components

**screens/HabitDetailScreen/HealthDataCard.tsx**
```tsx
// Display health metrics for the habit
// - Steps: "8,432 / 10,000 steps today"
// - Sleep: "7.2 / 8.0 hours last night"
// - Workout: "45 min strength training"
// Show sync status and last update time
```

### Step 6: Settings Integration
Add HealthKit toggle in Settings screen:
- Enable/disable HealthKit sync
- Show permission status
- Re-request permissions if denied
- Display which habits are synced

### Step 7: Background Task Setup
Register background task to sync every 30 minutes:
```typescript
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const HEALTH_SYNC_TASK = 'health-sync-task';

TaskManager.defineTask(HEALTH_SYNC_TASK, async () => {
  await syncHealthDataWithHabits();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

BackgroundFetch.registerTaskAsync(HEALTH_SYNC_TASK, {
  minimumInterval: 30 * 60, // 30 minutes
  stopOnTerminate: false,
  startOnBoot: true,
});
```

## Habit Matching Logic

### Name-Based Detection
```typescript
const HEALTH_HABIT_PATTERNS = {
  steps: /\b(step|walk|10k)\b/i,
  sleep: /\b(sleep|rest)\b/i,
  workout: /\b(exercise|workout|gym|run|bike)\b/i,
};

function detectHealthType(habitName: string): HealthType | null {
  if (HEALTH_HABIT_PATTERNS.steps.test(habitName)) return 'steps';
  if (HEALTH_HABIT_PATTERNS.sleep.test(habitName)) return 'sleep';
  if (HEALTH_HABIT_PATTERNS.workout.test(habitName)) return 'workout';
  return null;
}
```

### Threshold Detection
```typescript
const THRESHOLDS = {
  steps: 10000,           // Extract from habit name if possible
  sleep: 8 * 3600,        // 8 hours in seconds
  workout: 1,             // At least 1 workout
};

// Smart extraction from habit name:
// "10K steps" → 10000
// "Sleep 8 hours" → 8
// "30 min workout" → 1800 seconds
```

## Testing Strategy

### Unit Tests
- HealthKit service mocks
- Habit matching algorithm
- Threshold extraction
- Auto-completion logic

### Integration Tests
- Permission flow
- Sync engine with mock HealthKit data
- UI rendering with health data

### Manual Testing
1. Create habits: "10K steps", "Sleep 8 hours", "Exercise"
2. Enable HealthKit permissions
3. Trigger manual sync
4. Verify auto-completion
5. Check habit detail screen shows health data

## Privacy & Permissions

- **User Control**: Users must explicitly enable HealthKit sync
- **Transparency**: Clear explanation of what data is read and why
- **No Writing**: We only read health data, never write to HealthKit
- **Local Processing**: Health data never leaves device (only completion status syncs to Convex)

## Performance Considerations

- Cache health data for 5 minutes to reduce HealthKit queries
- Debounce sync requests
- Background sync only when device is charging (optional)
- Limit historical queries to last 24 hours

## Future Enhancements

- 🏃‍♂️ More health types: water intake, mindfulness, heart rate
- 🎨 Custom health cards with charts
- 🔗 Link multiple habits to same health metric
- 📅 Weekly health summaries in habit stats
- 🏆 Health-based achievements

## Implementation Timeline

- **Day 1**: Install deps, create service skeleton, permissions
- **Day 2**: Implement sync engine, habit matching logic
- **Day 3**: Create hooks, UI components
- **Day 4**: Settings integration, background tasks
- **Day 5**: Testing, polish, documentation

## Success Metrics

- ✅ Permissions successfully requested (>80% grant rate)
- ✅ Auto-completion accuracy (>95% correct matches)
- ✅ Sync latency (<30 seconds from health event to habit completion)
- ✅ User satisfaction (based on feature usage and retention)

---

**Created by:** Sonnet (Claude Sonnet 4.5)
**Date:** 2026-02-16
**Status:** 🚀 Ready for implementation
