# Feature Flags Configuration

## Overview

This document describes the feature flag system for the Create Habit Modal V11 redesign. Feature flags allow gradual rollout, A/B testing, and quick rollback if issues arise.

## Feature Flag Types

### 1. Boolean Flags (Simple On/Off)
Basic enable/disable switches for V11 features.

### 2. Variant Flags (A/B Testing)
Multi-variant flags for comparing V10 vs V11 performance.

### 3. Percentage Rollout Flags
Gradual rollout to percentage of users.

## V11 Feature Flags

### Available Flags

```typescript
interface CreateHabitModalV11Flags {
  // Phase 1: Foundation (Low Risk)
  v11_progressive_spacing: boolean;
  v11_button_state_intelligence: boolean;
  v11_character_counter: boolean;

  // Phase 2: Core Features (Medium Risk, High Impact)
  v11_live_preview: boolean;
  v11_smart_emoji_suggestions: boolean;
  v11_time_aware_reminders: boolean;

  // Phase 3: Polish (Low Risk, Delight Features)
  v11_swipe_dismissal: boolean;
  v11_selection_animations: boolean;

  // Master flag (controls all V11 features)
  v11_enabled: boolean;
}
```

## Implementation Options

### Option 1: Simple TypeScript Configuration

**File**: `src/config/featureFlags.ts`

```typescript
/**
 * Feature flags for Create Habit Modal V11
 * Update these values to enable/disable features
 */
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  // Master switch - set to false to disable all V11 features
  v11_enabled: true,

  // Phase 1: Foundation
  v11_progressive_spacing: true,
  v11_button_state_intelligence: true,
  v11_character_counter: true,

  // Phase 2: Core Features
  v11_live_preview: true,
  v11_smart_emoji_suggestions: true,
  v11_time_aware_reminders: true,

  // Phase 3: Polish
  v11_swipe_dismissal: true,
  v11_selection_animations: true,
} as const;

/**
 * Check if a V11 feature is enabled
 */
export function isV11FeatureEnabled(
  feature: keyof typeof CREATE_HABIT_MODAL_V11_FLAGS
): boolean {
  // If master flag is off, all features are off
  if (!CREATE_HABIT_MODAL_V11_FLAGS.v11_enabled) {
    return false;
  }

  return CREATE_HABIT_MODAL_V11_FLAGS[feature];
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(
  feature: keyof typeof CREATE_HABIT_MODAL_V11_FLAGS
): boolean {
  return isV11FeatureEnabled(feature);
}
```

**Usage in Components**:

```tsx
import { useFeatureFlag } from '@/config/featureFlags';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const v11Enabled = useFeatureFlag('v11_enabled');
  const livePreviewEnabled = useFeatureFlag('v11_live_preview');
  const smartEmojisEnabled = useFeatureFlag('v11_smart_emoji_suggestions');

  return (
    <Modal>
      {v11Enabled && livePreviewEnabled && (
        <LivePreview emoji={emoji} color={color} habitName={habitName} />
      )}

      <EmojiPicker
        emojis={
          v11Enabled && smartEmojisEnabled
            ? getEmojiSuggestions(habitName)
            : DEFAULT_EMOJIS
        }
      />
    </Modal>
  );
}
```

### Option 2: Environment-Based Configuration

**File**: `.env.local`

```bash
# Create Habit Modal V11 Feature Flags
EXPO_PUBLIC_V11_ENABLED=true
EXPO_PUBLIC_V11_LIVE_PREVIEW=true
EXPO_PUBLIC_V11_SMART_EMOJIS=true
EXPO_PUBLIC_V11_TIME_AWARE_REMINDERS=true
EXPO_PUBLIC_V11_SWIPE_DISMISSAL=true
EXPO_PUBLIC_V11_SELECTION_ANIMATIONS=true
```

**File**: `src/config/featureFlags.ts`

```typescript
/**
 * Load feature flags from environment variables
 */
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: process.env.EXPO_PUBLIC_V11_ENABLED === 'true',
  v11_live_preview: process.env.EXPO_PUBLIC_V11_LIVE_PREVIEW === 'true',
  v11_smart_emoji_suggestions:
    process.env.EXPO_PUBLIC_V11_SMART_EMOJIS === 'true',
  v11_time_aware_reminders:
    process.env.EXPO_PUBLIC_V11_TIME_AWARE_REMINDERS === 'true',
  v11_swipe_dismissal: process.env.EXPO_PUBLIC_V11_SWIPE_DISMISSAL === 'true',
  v11_selection_animations:
    process.env.EXPO_PUBLIC_V11_SELECTION_ANIMATIONS === 'true',
} as const;
```

### Option 3: Remote Configuration (LaunchDarkly)

**Installation**:
```bash
npm install launchdarkly-react-client-sdk
```

**File**: `src/config/launchDarkly.ts`

```typescript
import { withLDProvider } from 'launchdarkly-react-client-sdk';

const ldConfig = {
  clientSideID: 'YOUR_LAUNCHDARKLY_CLIENT_ID',
  user: {
    key: 'user-key', // Replace with actual user ID
    anonymous: true,
  },
};

export const withFeatureFlags = withLDProvider(ldConfig);
```

**Usage**:

```tsx
import { useFlags } from 'launchdarkly-react-client-sdk';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const flags = useFlags();

  const v11Enabled = flags.v11Enabled;
  const livePreviewEnabled = flags.v11LivePreview;

  return (
    <Modal>
      {v11Enabled && livePreviewEnabled && <LivePreview ... />}
    </Modal>
  );
}
```

### Option 4: Custom Convex-Based Remote Config

**File**: `convex/featureFlags.ts`

```typescript
import { v } from 'convex/values';
import { query } from './_generated/server';

// Store feature flags in Convex database
export const getFeatureFlags = query({
  args: {},
  handler: async (ctx) => {
    // For now, return hardcoded flags
    // In production, fetch from database table
    return {
      v11_enabled: true,
      v11_live_preview: true,
      v11_smart_emoji_suggestions: true,
      v11_time_aware_reminders: true,
      v11_swipe_dismissal: true,
      v11_selection_animations: true,
    };
  },
});

// Admin mutation to update flags
export const updateFeatureFlag = mutation({
  args: {
    flag: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, { flag, enabled }) => {
    // Update feature flag in database
    // Requires admin authentication
  },
});
```

**Usage**:

```tsx
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const flags = useQuery(api.featureFlags.getFeatureFlags) ?? {
    v11_enabled: false,
  };

  return (
    <Modal>
      {flags.v11_enabled && flags.v11_live_preview && <LivePreview ... />}
    </Modal>
  );
}
```

## Recommended Approach

For this project, we recommend **Option 1 (Simple TypeScript Configuration)** because:

1. ✅ **Simple**: No external dependencies, easy to understand
2. ✅ **Fast**: No network requests, instant flag evaluation
3. ✅ **Version Control**: Flags tracked in git with code changes
4. ✅ **Type Safe**: TypeScript ensures correct flag names
5. ✅ **No Setup**: Works immediately without configuration

For larger teams or complex rollouts, consider **Option 3 (LaunchDarkly)** for remote control.

## Rollout Strategy with Feature Flags

### Week 1: Phase 1 Foundation (100% Rollout)

```typescript
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: true,

  // Phase 1: Enable for all users
  v11_progressive_spacing: true,
  v11_button_state_intelligence: true,
  v11_character_counter: true,

  // Phase 2: Not ready yet
  v11_live_preview: false,
  v11_smart_emoji_suggestions: false,
  v11_time_aware_reminders: false,

  // Phase 3: Not ready yet
  v11_swipe_dismissal: false,
  v11_selection_animations: false,
};
```

### Week 2: Phase 2 A/B Test (50% Rollout)

```typescript
// Option A: Simple random 50/50 split
export function isV11FeatureEnabled(
  feature: keyof typeof CREATE_HABIT_MODAL_V11_FLAGS
): boolean {
  if (!CREATE_HABIT_MODAL_V11_FLAGS.v11_enabled) {
    return false;
  }

  // Phase 2 features: 50% rollout
  const phase2Features = [
    'v11_live_preview',
    'v11_smart_emoji_suggestions',
    'v11_time_aware_reminders',
  ];

  if (phase2Features.includes(feature)) {
    // Simple random 50/50 split
    return Math.random() < 0.5 && CREATE_HABIT_MODAL_V11_FLAGS[feature];
  }

  return CREATE_HABIT_MODAL_V11_FLAGS[feature];
}

// Option B: Consistent user-based split (better)
import { useUser } from '@/hooks/useUser';

export function useFeatureFlag(
  feature: keyof typeof CREATE_HABIT_MODAL_V11_FLAGS
): boolean {
  const user = useUser();

  if (!CREATE_HABIT_MODAL_V11_FLAGS.v11_enabled) {
    return false;
  }

  const phase2Features = [
    'v11_live_preview',
    'v11_smart_emoji_suggestions',
    'v11_time_aware_reminders',
  ];

  if (phase2Features.includes(feature)) {
    // Consistent hash-based split
    const userId = user?.id ?? 'anonymous';
    const hash = simpleHash(userId);
    const inTestGroup = hash % 100 < 50; // 50% of users

    return inTestGroup && CREATE_HABIT_MODAL_V11_FLAGS[feature];
  }

  return CREATE_HABIT_MODAL_V11_FLAGS[feature];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

### Week 3: Phase 2 Full Rollout (100%)

```typescript
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: true,

  // Phase 1: Enabled
  v11_progressive_spacing: true,
  v11_button_state_intelligence: true,
  v11_character_counter: true,

  // Phase 2: Now enabled for all users (A/B test successful)
  v11_live_preview: true,
  v11_smart_emoji_suggestions: true,
  v11_time_aware_reminders: true,

  // Phase 3: Not ready yet
  v11_swipe_dismissal: false,
  v11_selection_animations: false,
};
```

### Week 4: Phase 3 Polish (100% Rollout)

```typescript
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: true,

  // All features enabled
  v11_progressive_spacing: true,
  v11_button_state_intelligence: true,
  v11_character_counter: true,
  v11_live_preview: true,
  v11_smart_emoji_suggestions: true,
  v11_time_aware_reminders: true,
  v11_swipe_dismissal: true,
  v11_selection_animations: true,
};
```

## Emergency Rollback

If issues arise, quickly disable problematic features:

```typescript
// Emergency: Disable all V11 features
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: false, // ← Master kill switch
  // ... rest of flags don't matter
};

// Or disable specific feature:
export const CREATE_HABIT_MODAL_V11_FLAGS = {
  v11_enabled: true,
  v11_live_preview: false, // ← Disable only this feature
  // ... rest remain enabled
};
```

## Testing Feature Flags

### Unit Tests

```typescript
import { isV11FeatureEnabled } from '@/config/featureFlags';

describe('Feature Flags', () => {
  it('should disable all features when master flag is off', () => {
    // Mock flags
    jest.mock('@/config/featureFlags', () => ({
      CREATE_HABIT_MODAL_V11_FLAGS: {
        v11_enabled: false,
        v11_live_preview: true,
      },
    }));

    expect(isV11FeatureEnabled('v11_live_preview')).toBe(false);
  });

  it('should enable features when master flag is on', () => {
    expect(isV11FeatureEnabled('v11_live_preview')).toBe(true);
  });
});
```

### Integration Tests

```tsx
import { render } from '@testing-library/react-native';
import { CREATE_HABIT_MODAL_V11_FLAGS } from '@/config/featureFlags';

describe('CreateHabitModal with Feature Flags', () => {
  it('should render LivePreview when v11_live_preview is enabled', () => {
    const { getByTestId } = render(<CreateHabitModal visible={true} />);

    if (CREATE_HABIT_MODAL_V11_FLAGS.v11_live_preview) {
      expect(getByTestId('live-preview')).toBeTruthy();
    } else {
      expect(() => getByTestId('live-preview')).toThrow();
    }
  });
});
```

## Monitoring Feature Flag Impact

Track feature flag usage with analytics:

```typescript
import { trackEvent } from '@/utils/createHabitModalAnalytics';

export function useFeatureFlag(
  feature: keyof typeof CREATE_HABIT_MODAL_V11_FLAGS
): boolean {
  const enabled = isV11FeatureEnabled(feature);

  // Track feature flag evaluation
  useEffect(() => {
    trackEvent({
      type: 'feature_flag_evaluated',
      feature,
      enabled,
      timestamp: Date.now(),
    });
  }, [feature, enabled]);

  return enabled;
}
```

## Best Practices

### 1. Always Use Master Flag
Check `v11_enabled` master flag before checking individual feature flags.

### 2. Default to Safe State
If flag evaluation fails, default to `false` (disabled) for safety.

### 3. Log Flag State
In development, log all flag evaluations for debugging.

### 4. Clean Up After Rollout
Once V11 is 100% rolled out and stable, remove feature flag code.

### 5. Document Flag Purpose
Add comments explaining why each flag exists.

### 6. Test Both States
Write tests for both enabled and disabled states of each flag.

## Migration Path (Removing Feature Flags)

After V11 is 100% rolled out for 2-4 weeks and proven stable:

### Step 1: Remove Conditional Logic

```tsx
// Before (with flags):
{flags.v11_live_preview && (
  <LivePreview emoji={emoji} color={color} habitName={habitName} />
)}

// After (flags removed):
<LivePreview emoji={emoji} color={color} habitName={habitName} />
```

### Step 2: Remove Flag Configuration

Delete `src/config/featureFlags.ts` and all flag-related code.

### Step 3: Update Tests

Remove flag mocking from all tests.

### Step 4: Clean Up Analytics

Remove feature flag tracking events.

---

**Last Updated**: 2026-01-03
**Version**: 1.0
**Recommended Approach**: Option 1 (Simple TypeScript Configuration)
