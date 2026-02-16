# E2E Analytics Integration Guide

## Overview

This guide shows how to integrate the new E2E analytics infrastructure into Chain Day's key user flows.

## ✅ Already Integrated

### App Initialization
- ✅ Deep link tracking enabled in `App.tsx`
- ✅ Session lifecycle tracking enabled
- ✅ App state monitoring active

## 🔨 Integration Points

### 1. Onboarding Flow

```tsx
// src/screens/onboarding/OnboardingScreen.tsx
import { trackFunnelStep, EngagementEvents } from '@/lib/analytics';
import { useScreenTracking } from '@/lib/analytics/hooks';

function OnboardingScreen({ onComplete }: Props) {
  useScreenTracking('onboarding');

  const handleStepComplete = (stepIndex: number, stepName: string) => {
    trackFunnelStep({
      funnel: 'onboarding',
      step: stepName,
      stepIndex,
      timestamp: Date.now(),
    });
  };

  const handleFinish = () => {
    trackFunnelStep({
      funnel: 'onboarding',
      step: 'completed',
      stepIndex: 5,
      timestamp: Date.now(),
    });
    onComplete();
  };

  // ... rest of component
}
```

### 2. Habit Creation

```tsx
// src/features/habits/components/CreateHabitForm.tsx
import { EngagementEvents, trackFunnelStep } from '@/lib/analytics';

function CreateHabitForm() {
  const handleCreateHabit = async (habitData: HabitInput) => {
    // Track funnel step
    trackFunnelStep({
      funnel: 'habit_creation',
      step: 'habit_created',
      stepIndex: 3,
      timestamp: Date.now(),
      metadata: {
        hasTemplate: !!habitData.templateId,
        hasReminder: !!habitData.reminder,
      },
    });

    // Create habit
    const habit = await createHabit(habitData);

    // Track engagement
    EngagementEvents.habitCreated(habit._id, habitData.templateId);
  };

  // ... rest of component
}
```

### 3. Habit Check-in

```tsx
// src/components/HabitCard.tsx
import { EngagementEvents } from '@/lib/analytics';

function HabitCard({ habit }: Props) {
  const handleCheckIn = async () => {
    await completeHabit(habit._id);
    
    const newStreak = habit.streak + 1;
    
    // Track completion
    EngagementEvents.habitCompleted(habit._id, newStreak);

    // Track milestone
    if ([7, 21, 30, 50, 100].includes(newStreak)) {
      EngagementEvents.streakMilestone(habit._id, newStreak);
    }
  };

  // ... rest of component
}
```

### 4. Paywall & Subscriptions

```tsx
// src/screens/PaywallScreen.tsx
import { ConversionEvents } from '@/lib/analytics';
import { useScreenTracking } from '@/lib/analytics/hooks';

function PaywallScreen({ source }: Props) {
  useScreenTracking('paywall', { source });

  useEffect(() => {
    // Track paywall view
    ConversionEvents.paywallViewed(source);
  }, [source]);

  const handlePurchase = async (product: Product) => {
    // Track funnel step
    trackFunnelStep({
      funnel: 'subscription_purchase',
      step: 'purchase_initiated',
      stepIndex: 1,
      timestamp: Date.now(),
      metadata: { product: product.id, price: product.price },
    });

    try {
      const result = await purchaseProduct(product);
      
      if (result.success) {
        // Track conversion
        ConversionEvents.subscriptionCompleted(
          product.id,
          product.price,
          product.price
        );

        // Mark deep link as converted (if applicable)
        await markDeepLinkConverted();

        trackFunnelStep({
          funnel: 'subscription_purchase',
          step: 'purchase_completed',
          stepIndex: 2,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      // Track failure
      trackEvent('subscription_failed', {
        timestamp: Date.now(),
        sessionId: '',
        category: 'error',
        priority: 'high',
        product: product.id,
        error: String(error),
      });
    }
  };

  // ... rest of component
}
```

### 5. User Properties Sync

```tsx
// src/features/habits/HabitsApp.tsx or similar
import { setUserProperties } from '@/lib/analytics';
import { useAuth } from '@clerk/clerk-expo';

function HabitsApp() {
  const { userId } = useAuth();
  const habits = useQuery(api.habits.list);
  const userStats = useQuery(api.users.getStats);

  useEffect(() => {
    if (!userId || !userStats) return;

    // Sync user properties for segmentation
    setUserProperties({
      userId,
      lastSeenAt: Date.now(),
      totalHabitsCreated: habits?.length || 0,
      totalCheckins: userStats.totalCheckins,
      longestStreak: userStats.longestStreak,
      userSegment: calculateSegment(userStats),
      isPremium: userStats.isPremium,
    });
  }, [userId, habits, userStats]);

  // ... rest of component
}

function calculateSegment(stats: UserStats): 'power_user' | 'casual' | 'at_risk' | 'new' {
  if (stats.daysSinceInstall < 7) return 'new';
  if (stats.daysActive > 30 && stats.consecutiveDays > 7) return 'power_user';
  if (stats.lastSeenAt < Date.now() - 14 * 24 * 60 * 60 * 1000) return 'at_risk';
  return 'casual';
}
```

### 6. Retention Tracking

```tsx
// src/components/auth/AuthGate.tsx or App.tsx
import { RetentionEvents } from '@/lib/analytics';
import { useAuth } from '@clerk/clerk-expo';

function AuthGate() {
  const { userId } = useAuth();
  const userCreatedAt = useQuery(api.users.getCreatedAt);

  useEffect(() => {
    if (!userCreatedAt || !userId) return;

    const daysSinceInstall = Math.floor(
      (Date.now() - userCreatedAt) / (24 * 60 * 60 * 1000)
    );

    // Track retention milestones
    if (daysSinceInstall === 1) {
      RetentionEvents.day1Return();
    } else if (daysSinceInstall === 7) {
      RetentionEvents.day7Return();
    } else if (daysSinceInstall === 30) {
      RetentionEvents.day30Return();
    }
  }, [userCreatedAt, userId]);

  // ... rest of component
}
```

### 7. A/B Test Example

```tsx
// Example: Testing different onboarding flows
import { useExperiment } from '@/lib/analytics';
import { useAuth } from '@clerk/clerk-expo';

function OnboardingScreen() {
  const { userId } = useAuth();
  const { variant, trackExposure, trackGoal } = useExperiment(
    'onboarding_flow',
    userId || 'anonymous'
  );

  useEffect(() => {
    // Track that user saw this variant
    trackExposure();
  }, [trackExposure]);

  const handleComplete = () => {
    // Track goal conversion
    trackGoal('onboarding_completed');
  };

  // Render different flows based on variant
  switch (variant) {
    case 'variant_a':
      return <NewOnboardingFlow onComplete={handleComplete} />;
    case 'control':
    default:
      return <OriginalOnboardingFlow onComplete={handleComplete} />;
  }
}
```

### 8. Feature Flag Example

```tsx
// Example: Gradual rollout of AI suggestions
import { useFeatureFlag } from '@/lib/analytics';
import { useAuth } from '@clerk/clerk-expo';

function CreateHabitScreen() {
  const { userId } = useAuth();
  const { enabled: aiEnabled, loading } = useFeatureFlag(
    'ai_habit_suggestions',
    userId,
    userSegment
  );

  if (loading) return <Loading />;

  return (
    <View>
      <CreateHabitForm />
      {aiEnabled && <AISuggestionsPanel />}
    </View>
  );
}
```

## 📊 Key Metrics Dashboard

Once integrated, you'll be tracking:

### Engagement
- Total sessions
- Avg session duration
- Screens per session
- Daily active users
- Weekly active users

### Retention
- Day 1 retention: X%
- Day 7 retention: X%
- Day 30 retention: X%

### Conversion
- Paywall view rate
- Trial start rate
- Subscription conversion rate
- Average LTV

### Funnels
- Onboarding completion: X%
- Habit creation: X%
- Subscription purchase: X%

### Attribution
- Top sources
- Campaign performance
- Deep link conversions

## 🚀 Next Steps

1. ✅ Analytics infrastructure implemented
2. ⏳ Integrate into onboarding flow
3. ⏳ Integrate into habit creation
4. ⏳ Integrate into paywall/subscriptions
5. ⏳ Set up retention tracking
6. ⏳ Configure first A/B test
7. ⏳ Enable first feature flag
8. ⏳ Build analytics dashboard (separate project)

## 🔧 Testing

```bash
# Dev mode - check console for analytics logs
npm run dev

# Check event queue
# Events are batched and flushed every 5 seconds or 10 events

# Reset experiments (dev only)
import { resetExperiments } from '@/lib/analytics';
await resetExperiments();

# Check deep link handling
# Use a test deep link with UTM params:
# habit-tracker://open?utm_source=email&utm_campaign=retention
```

## 📚 Reference

- See `src/lib/analytics/README.md` for full API documentation
- See `src/lib/analytics/types.ts` for type definitions
- See `src/lib/analytics/hooks.ts` for React hooks
