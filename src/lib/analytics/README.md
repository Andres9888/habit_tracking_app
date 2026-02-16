# Analytics & E2E Infrastructure

Comprehensive engagement and experimentation tracking system for Chain Day.

## 🎯 Features

### 1. **Event Tracking**
- Automatic session tracking
- Custom event logging
- Event batching and queuing
- Sentry integration for error correlation

### 2. **Deep Link Analytics**
- UTM parameter capture
- Attribution tracking
- Conversion tracking
- Source/campaign analysis

### 3. **A/B Testing**
- Client-side variant assignment
- Consistent hashing for stable experiments
- Exposure and goal tracking
- React hooks for easy integration

### 4. **Feature Flags**
- Remote feature toggles
- Gradual rollout support (percentage-based)
- User/segment targeting
- Local caching with TTL

### 5. **Session Analytics**
- Duration tracking
- Screen navigation tracking
- Deep link attribution per session
- Automatic timeout handling

### 6. **Funnel Tracking**
- Onboarding funnel
- Habit creation funnel
- Subscription purchase funnel
- Drop-off analysis ready

## 🚀 Quick Start

### Initialize Analytics

```tsx
import { useAnalytics } from '@/lib/analytics/hooks';

function App() {
  useAnalytics(); // Handles deep links, sessions, lifecycle
  
  return <YourApp />;
}
```

### Track Events

```tsx
import { trackEvent, EngagementEvents } from '@/lib/analytics';

// Custom event
trackEvent('button_clicked', {
  timestamp: Date.now(),
  sessionId: '',
  category: 'engagement',
  buttonId: 'create_habit',
});

// Convenience methods
EngagementEvents.habitCreated('habit_123', 'template_456');
ConversionEvents.paywallViewed('onboarding');
```

### Track Screens

```tsx
import { useScreenTracking } from '@/lib/analytics/hooks';

function SettingsScreen() {
  useScreenTracking('settings');
  
  return <View>...</View>;
}
```

### Track Funnels

```tsx
import { trackFunnelStep } from '@/lib/analytics';

trackFunnelStep({
  funnel: 'onboarding',
  step: 'name_entered',
  stepIndex: 1,
  timestamp: Date.now(),
  metadata: { hasTemplate: true },
});
```

### A/B Testing

```tsx
import { useExperiment } from '@/lib/analytics';

function OnboardingScreen() {
  const { variant, trackExposure, trackGoal } = useExperiment(
    'onboarding_flow',
    userId
  );
  
  useEffect(() => {
    trackExposure(); // Track that user saw this variant
  }, []);
  
  const handleComplete = () => {
    trackGoal('onboarding_completed');
  };
  
  return variant === 'variant_a' ? <NewFlow /> : <OldFlow />;
}
```

### Feature Flags

```tsx
import { useFeatureFlag } from '@/lib/analytics';

function ProfileScreen() {
  const { enabled, loading } = useFeatureFlag(
    'social_features',
    userId,
    userSegment
  );
  
  if (loading) return <Loading />;
  
  return (
    <View>
      {enabled && <SocialFeedSection />}
    </View>
  );
}
```

### Deep Link Attribution

```tsx
import { 
  getDeepLinkAttribution, 
  markDeepLinkConverted 
} from '@/lib/analytics';

// Check attribution
const attribution = await getDeepLinkAttribution();
if (attribution?.campaign === 'email_blast') {
  // Show special content
}

// Mark conversion
await markDeepLinkConverted(); // e.g., after subscription
```

## 📊 Event Categories

- `engagement` - User interactions (clicks, views, completions)
- `conversion` - Monetization events (purchases, trials)
- `retention` - Return visits (day 1, 7, 30)
- `onboarding` - First-time user flow
- `monetization` - Revenue-related events
- `feature_usage` - Feature adoption tracking
- `error` - Error and crash tracking
- `performance` - Performance metrics

## 🔧 Configuration

### Add New Experiments

Edit `src/lib/analytics/experiments.ts`:

```ts
const EXPERIMENTS = {
  new_experiment: {
    id: 'new_experiment',
    name: 'New Experiment',
    enabled: true, // Toggle on/off
    variants: [
      { id: 'control', name: 'Control', weight: 50 },
      { id: 'variant_a', name: 'Test A', weight: 50 },
    ],
  },
};
```

### Add New Feature Flags

Edit `src/lib/analytics/featureFlags.ts`:

```ts
const DEFAULT_FLAGS = {
  new_feature: {
    id: 'new_feature',
    enabled: true,
    rolloutPercentage: 25, // 25% of users
    enabledForSegments: ['power_user'], // Optional targeting
  },
};
```

## 🎨 Integration Points

### App Initialization
- `src/App.tsx` - Add `useAnalytics()` hook

### Screen Tracking
- Add `useScreenTracking('screen_name')` to each screen

### Conversion Events
- Subscription flow - `ConversionEvents.subscriptionCompleted()`
- Paywall views - `ConversionEvents.paywallViewed()`
- Habit creation - `EngagementEvents.habitCreated()`

### Retention Tracking
- Day 1 return - `RetentionEvents.day1Return()`
- Day 7 return - `RetentionEvents.day7Return()`
- Day 30 return - `RetentionEvents.day30Return()`

## 📈 Key Metrics Tracked

### Engagement
- ✅ Sessions per user
- ✅ Session duration
- ✅ Screens per session
- ✅ Habit completions
- ✅ Streak milestones

### Retention
- ✅ Day 1, 7, 30 retention rates
- ✅ Consecutive active days
- ✅ Days since install

### Conversion
- ✅ Paywall views
- ✅ Trial starts
- ✅ Subscription conversions
- ✅ Lifetime value

### Attribution
- ✅ Install source
- ✅ Campaign tracking
- ✅ Deep link conversions

## 🧪 Testing

```tsx
// Reset experiments (dev only)
import { resetExperiments } from '@/lib/analytics';
await resetExperiments();

// Force variant (dev only)
const variant = await getExperimentVariant('test', 'user_id');
console.log('Assigned variant:', variant);

// Check feature flags
const enabled = await isFeatureEnabled('new_feature', 'user_id');
console.log('Feature enabled:', enabled);
```

## 🚨 Privacy & Compliance

- ❌ No PII collected by default
- ✅ User IDs are anonymized
- ✅ Events stored locally and batched
- ✅ Can be disabled per user preference
- ✅ GDPR/CCPA compliant design

## 📦 Storage Keys

- `@analytics/session` - Current session data
- `@analytics/user_properties` - User metadata
- `@analytics/event_queue` - Pending events
- `@analytics/experiments` - A/B test assignments
- `@analytics/feature_flags` - Feature flag cache
- `@analytics/deep_link_attribution` - Attribution data

## 🔮 Future Enhancements

1. **Remote Config** - Fetch experiments/flags from backend
2. **Cohort Analysis** - Automated cohort reporting
3. **Heatmaps** - UI interaction tracking
4. **Backend Integration** - Send events to analytics service
5. **Real-time Dashboards** - Live metrics visualization

## 📚 Resources

- [Sentry Breadcrumbs](https://docs.sentry.io/platforms/react-native/enriching-events/breadcrumbs/)
- [Expo Linking](https://docs.expo.dev/guides/linking/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
