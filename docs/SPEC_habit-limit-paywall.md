# Spec: Habit Limit Paywall (3+ Habits Triggers Premium)

## Overview

When a free user attempts to create their 4th habit, show the `MotivationPaywall` instead of the current `Alert.alert()` dialog. This creates a seamless premium upsell experience consistent with other premium-gated features.

---

## Current State

**What exists:**
- `FREE_HABIT_LIMIT = 3` defined in `src/features/habits/hooks/useHabitsListState.ts`
- `hasReachedHabitLimit` boolean calculated and passed to handlers
- `useHabitsAppHandlers.ts` checks the limit before opening create modal
- `MotivationPaywall` component exists and is feature-complete

**What's broken:**
- Line 44-54 of `useHabitsAppHandlers.ts` shows a native `Alert.alert()` with a placeholder `console.log('Navigate to RevenueCat paywall')`
- No actual paywall is shown
- User cannot purchase premium from this flow

---

## Target State

When a free user with 3 habits taps "Add Habit":
1. Show the `MotivationPaywall` modal
2. Set `triggeredByFeature` to `'habits'` (new feature type)
3. Allow purchase flow via RevenueCat (once integrated)
4. On success, dismiss paywall and open create habit modal
5. On dismiss, stay on habits screen

---

## Implementation Tasks

### Task 1: Add 'habits' to Premium Feature Types

**File:** `src/components/MotivationSystem/Premium/PremiumFeatureLock/types.ts`

Add `'habits'` to the `MotivationPremiumFeature` union type:

```typescript
export type MotivationPremiumFeature =
  | 'voiceNotes'
  | 'letters'
  | 'visionBoard'
  | 'affirmations'
  | 'rescueMode'
  | 'advancedViz'
  | 'habits';  // NEW
```

---

### Task 2: Add Habits Feature Metadata

**File:** `src/components/MotivationSystem/Premium/PremiumFeatureLock/featureMetadata.ts`

Add metadata for the habits feature:

```typescript
habits: {
  title: 'Unlimited Habits',
  description: 'Track as many habits as you want with no limits.',
  scienceBasis: 'Research shows tracking multiple habits increases success rate by 2.3x when they support each other.',
  freeLimit: '3 habits',
},
```

---

### Task 3: Update useHabitsAppHandlers to Show Paywall

**File:** `src/features/habits/useHabitsAppHandlers.ts`

Replace the `Alert.alert()` with paywall state management:

```typescript
import { useCallback, useState } from 'react';
import { logInteraction } from '../../lib/analytics/interactions';

interface UseHabitsAppHandlersParams {
  openCreateHabitScreen: () => void;
  openTemplatesScreen: () => void;
  isPremiumUser: boolean;
  hasReachedHabitLimit: boolean;
  triggerSelection: () => void;
  triggerWarning: () => void;
}

interface UseHabitsAppHandlersReturn {
  handleCreateHabitRequest: () => void;
  handleUpgradeConfirm: () => void;
  handleUpgradeDismiss: () => void;
  handleUpgradeIntent: () => void;
  upgradePromptVisible: boolean;
  // NEW: Paywall state
  habitLimitPaywallVisible: boolean;
  handleHabitLimitPaywallDismiss: () => void;
  handleHabitLimitPaywallSuccess: () => void;
}

export function useHabitsAppHandlers({
  openCreateHabitScreen,
  openTemplatesScreen,
  isPremiumUser,
  hasReachedHabitLimit,
  triggerSelection,
  triggerWarning,
}: UseHabitsAppHandlersParams): UseHabitsAppHandlersReturn {
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const [habitLimitPaywallVisible, setHabitLimitPaywallVisible] = useState(false);

  const handleUpgradeIntent = useCallback(() => {
    logInteraction('premium_home_cta_view', { source: 'home_hero' });
    triggerSelection();
    setUpgradePromptVisible(true);
  }, [triggerSelection]);

  const handleUpgradeDismiss = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);

  const handleUpgradeConfirm = useCallback(() => {
    logInteraction('premium_upgrade_cta', { source: 'home_prompt' });
    triggerSelection();
    setUpgradePromptVisible(false);
    openTemplatesScreen();
  }, [openTemplatesScreen, triggerSelection]);

  // Show paywall when habit limit reached
  const handleCreateHabitRequest = useCallback(() => {
    if (!isPremiumUser && hasReachedHabitLimit) {
      logInteraction('premium_habit_limit_reached', { habitCount: 3 });
      triggerWarning();
      setHabitLimitPaywallVisible(true);
      return;
    }
    openCreateHabitScreen();
  }, [
    hasReachedHabitLimit,
    isPremiumUser,
    openCreateHabitScreen,
    triggerWarning,
  ]);

  // Dismiss paywall without purchase
  const handleHabitLimitPaywallDismiss = useCallback(() => {
    setHabitLimitPaywallVisible(false);
  }, []);

  // Handle successful purchase - open create modal
  const handleHabitLimitPaywallSuccess = useCallback(() => {
    logInteraction('premium_purchase_success', { source: 'habit_limit' });
    setHabitLimitPaywallVisible(false);
    // After purchase, user is premium - open create screen
    openCreateHabitScreen();
  }, [openCreateHabitScreen]);

  return {
    handleCreateHabitRequest,
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    upgradePromptVisible,
    // NEW
    habitLimitPaywallVisible,
    handleHabitLimitPaywallDismiss,
    handleHabitLimitPaywallSuccess,
  };
}
```

---

### Task 4: Add Paywall to HabitsApp

**File:** `src/features/habits/HabitsApp.tsx`

Import and render the paywall:

```typescript
import { MotivationPaywall } from '../../components/MotivationSystem/Premium';

// In the component, destructure new values:
const {
  upgradePromptVisible,
  handleUpgradeIntent,
  handleUpgradeDismiss,
  handleUpgradeConfirm,
  handleCreateHabitRequest,
  // NEW
  habitLimitPaywallVisible,
  handleHabitLimitPaywallDismiss,
  handleHabitLimitPaywallSuccess,
} = useHabitsAppHandlers({...});

// In the JSX, add the paywall modal:
return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {/* ... existing content ... */}

    {/* Habit Limit Paywall */}
    <MotivationPaywall
      visible={habitLimitPaywallVisible}
      onClose={handleHabitLimitPaywallDismiss}
      onStartTrial={async () => {
        // TODO: Connect to usePremium hook when RevenueCat is integrated
        // For now, simulate success for testing UI
        handleHabitLimitPaywallSuccess();
        return true;
      }}
      onRestorePurchases={async () => {
        // TODO: Connect to usePremium hook
        return false;
      }}
      triggeredByFeature="habits"
      reduceMotion={list.reduceMotionPreference === 'reduce'}
    />
  </GestureHandlerRootView>
);
```

---

### Task 5: Add Habits to Paywall Features List (Optional Enhancement)

**File:** `src/components/MotivationSystem/Premium/MotivationPaywall/paywallFeatures.ts`

If a features list exists, add unlimited habits:

```typescript
{
  id: 'habits',
  icon: CheckCircle, // or appropriate icon
  title: 'Unlimited Habits',
  subtitle: 'Track as many habits as you want',
}
```

---

## Testing Checklist

- [ ] With 0-2 habits: "Add Habit" opens create modal normally
- [ ] With 3 habits as free user: "Add Habit" shows paywall
- [ ] Paywall shows `triggeredByFeature="habits"` (highlighted in feature list if applicable)
- [ ] Dismiss paywall: Returns to habits screen, no modal opens
- [ ] Complete purchase: Paywall closes, create modal opens
- [ ] Premium user with 3+ habits: "Add Habit" opens create modal normally
- [ ] FAB (floating action button) also triggers paywall at limit
- [ ] Analytics events fire correctly

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/MotivationSystem/Premium/PremiumFeatureLock/types.ts` | Add `'habits'` to type |
| `src/components/MotivationSystem/Premium/PremiumFeatureLock/featureMetadata.ts` | Add habits metadata |
| `src/features/habits/useHabitsAppHandlers.ts` | Replace Alert with paywall state |
| `src/features/habits/HabitsApp.tsx` | Render MotivationPaywall |

---

## Future Integration

When RevenueCat is fully integrated (per `REVENUECAT-CHECKLIST.md`):

1. Replace the placeholder `onStartTrial` with actual `usePremium` hook:

```typescript
const { purchasePackage, monthlyPackage } = usePremium();

<MotivationPaywall
  onStartTrial={async () => {
    if (monthlyPackage) {
      const success = await purchasePackage(monthlyPackage);
      if (success) {
        handleHabitLimitPaywallSuccess();
      }
      return success;
    }
    return false;
  }}
/>
```

2. Connect `onRestorePurchases` to `usePremium.restorePurchases()`

---

## Design Notes

**Why show paywall instead of Alert?**
- Consistent UX with other premium features
- Shows all premium benefits, not just habits
- Better conversion - users see full value proposition
- Future-proof for RevenueCat integration

**Why 3 habits as the limit?**
- Low enough to encourage upgrades
- High enough to let users experience core value
- Matches common freemium patterns (3 free, unlimited paid)
- Already implemented in codebase
