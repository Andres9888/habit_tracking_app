# Streak Recovery Feature

Premium feature to restore broken streaks by spending coins.

## Overview

Users can recover broken streaks by spending premium coins. This feature helps users maintain momentum when they miss a day and want to restore their progress.

## Features

### Backend (Convex)

#### Schema Changes
- Added `streakRecoveries` table to track all recovery attempts
- Tracks: habitId, userId, recoveredStreakLength, cost, brokenDate, monthKey

#### Mutations
- `api.habits.recoverStreak.recoverStreak` - Recover a broken streak
- `api.habits.recoverStreak.canRecoverStreak` - Check if recovery is possible
- `api.habits.recoverStreak.getRecoveryHistory` - Get recovery history for a habit
- `api.habits.recoverStreak.getUserRecoveries` - Get all user recoveries

#### Cost Structure
- `< 7 days`: Free
- `7-29 days`: 1-2 coins (linear scale)
- `≥ 30 days`: 3 coins

#### Limits
- **Free users**: 1 recovery per habit per month
- **Premium users**: 3 recoveries per habit per month

### Frontend

#### Components

1. **StreakRecoveryModal** (`src/components/StreakRecoveryModal/`)
   - Full-featured modal for recovering streaks
   - Shows cost, streak length, and remaining recoveries
   - Displays recovery history
   - Includes pricing info

2. **StreakRecoveryButton** (`src/components/StreakRecoveryModal/`)
   - Compact button for quick access
   - Shows when streak is broken
   - Displays cost in subtitle

3. **RecoveryHistoryScreen** (`src/screens/`)
   - Full history screen showing all recoveries
   - Grouped by month
   - Shows total stats (recoveries, coins spent)

#### Hooks

**useStreakRecovery** (`src/hooks/useStreakRecovery.ts`)
```typescript
const {
  canRecover,
  streakLength,
  cost,
  remainingRecoveries,
  showRecoveryModal,
  StreakRecoveryModal,
} = useStreakRecovery({
  habitId: '...',
  habitName: 'Morning Meditation',
  onRecoverySuccess: () => {
    // Refresh habit data
  },
});
```

## Integration Examples

### In Habit Detail Screen

```tsx
import { useStreakRecovery } from '../hooks/useStreakRecovery';
import { StreakRecoveryButton } from '../components/StreakRecoveryModal';

function HabitDetailScreen() {
  const { canRecover, showRecoveryModal, StreakRecoveryModal } = useStreakRecovery({
    habitId: habit._id,
    habitName: habit.name,
    onRecoverySuccess: () => refetchHabit(),
  });

  return (
    <View>
      {/* Your existing content */}

      {/* Show recovery button when streak is broken */}
      {canRecover && (
        <StreakRecoveryButton
          habitId={habit._id}
          onPress={showRecoveryModal}
          style={{ margin: 16 }}
        />
      )}

      {/* The modal component */}
      <StreakRecoveryModal />
    </View>
  );
}
```

### Quick Recovery Action

```tsx
import { StreakRecoveryButton } from '../components/StreakRecoveryModal';
import { StreakRecoveryModal } from '../components/StreakRecoveryModal';

function MyComponent() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {habit.currentStreak < habit.bestStreak && habit.bestStreak >= 7 && (
        <StreakRecoveryButton
          habitId={habit._id}
          onPress={() => setModalVisible(true)}
        />
      )}

      <StreakRecoveryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        habitId={habit._id}
        habitName={habit.name}
        onSuccess={() => {
          // Handle success
        }}
      />
    </>
  );
}
```

## Navigation

To access the recovery history screen:

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to recovery history
router.push('/screens/RecoveryHistoryScreen');
```

## Cost Calculation

The cost function (`calculateRecoveryCost`) uses linear scaling:

```typescript
function calculateRecoveryCost(streakLength: number): number {
  if (streakLength < 7) return 0;
  if (streakLength >= 30) return 3;
  return Math.ceil(1 + ((streakLength - 7) / 22) * 2);
}
```

## Testing

Run the existing tests:

```bash
npm test -- tests/unit/convex/habits.streak.recovery.test.ts
```

## Future Enhancements

- Track user coin balance
- Add coin purchase flow
- Recovery statistics dashboard
- Recovery streak streaks (recoveries in a row)
- Discounted recovery bundles
