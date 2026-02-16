# Hooks Guide

Comprehensive documentation for all custom React hooks in the Chain Day habit tracking app.

## Table of Contents

1. [Overview](#overview)
2. [Hook Categories](#hook-categories)
3. [Dependency Graph](#dependency-graph)
4. [Usage Patterns](#usage-patterns)
5. [Hook Directory](#hook-directory)
6. [Best Practices](#best-practices)
7. [Performance Considerations](#performance-considerations)

---

## Overview

This app uses over 100 custom hooks organized into modular subdirectories. Hooks follow a consistent pattern:

- **Main hook files** (e.g., `useAudioPlayback.ts`) - Public API, orchestrates sub-hooks
- **Sub-hooks** (e.g., `useLoadAudio.ts`) - Internal implementation details
- **Types** (`types.ts`) - TypeScript interfaces and types
- **Constants** (`constants.ts`) - Configuration values
- **Utils** (`utils.ts`, `helpers.ts`) - Pure functions

---

## Hook Categories

### 🎨 Animation & Interaction
Hooks for animations, gestures, and user interactions.

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `usePressAnimation` | Reusable press animations | Spring-based scale, haptics, reduced motion support |
| `useReduceMotion` | Accessibility preference detection | Respects system reduce motion setting |

**Usage Example:**
```tsx
const { animatedStyle, pressHandlers } = usePressAnimation({
  pressScale: 0.95,
  enableHaptics: true,
});

<Pressable {...pressHandlers}>
  <Animated.View style={[styles.button, animatedStyle]}>
    <Text>Press me</Text>
  </Animated.View>
</Pressable>
```

---

### 🔊 Haptics & Feedback
Tactile and audio feedback hooks.

| Hook | Purpose | Dependencies |
|------|---------|--------------|
| `useHapticFeedback` | Basic haptic patterns | `expo-haptics`, `useReduceMotion` |
| `useCelebrationHaptics` | Celebration-specific haptics | `HapticPatterns`, `useReduceMotion` |
| `useCompletionSound` | Audio completion feedback | `expo-av` |

**Dependency Chain:**
```
useCompletionSound
  └─ expo-av

useCelebrationHaptics
  ├─ HapticPatterns (centralized)
  └─ useReduceMotion
      └─ react-native AccessibilityInfo
```

**Usage Pattern - Celebration Feedback:**
```tsx
const { triggerCompletion, triggerStreakMilestone } = useCelebrationHaptics({
  isEnabled: settings.hapticsEnabled,
});

const handleHabitComplete = async () => {
  await toggleHabit({ habitId, date });
  await triggerCompletion(); // Haptic feedback
  
  if (isStreakMilestone(newStreak)) {
    await triggerStreakMilestone(newStreak);
  }
};
```

---

### 📊 Habit Management
Core habit tracking and analytics hooks.

| Hook | Purpose | Complexity | Lines |
|------|---------|------------|-------|
| `useHabitStrength` | Strength algorithm & history | High | 132 |
| `useToggleHabitWithTimezone` | Timezone-aware toggle | Low | 38 |
| `useOfflineHabitMutations` | Offline-first mutations | **Very High** | **300** ⚠️ |
| `useMilestoneDetection` | Streak milestone detection | Medium | Re-export |

**Dependency Graph - Habit Operations:**
```
useOfflineHabitMutations (300 lines - CONSIDER SPLITTING)
  ├─ useMutation (Convex)
  ├─ useIsOnline (NetworkStatusContext)
  └─ getOfflineQueueManager (lib/offline)
      └─ useOfflineQueue
          ├─ AsyncStorage
          └─ Queue validation logic

useToggleHabitWithTimezone
  ├─ useMutation (api.habits.toggleHabit)
  └─ getUserTimezone (utils/timezone)

useHabitStrength
  ├─ useMemo (memoization keyed on completedDates.size)
  └─ date-fns (date calculations)
```

**Usage Pattern - Offline-First Habit Creation:**
```tsx
const { createHabit, isOnline } = useOfflineHabitMutations();

const handleCreate = async () => {
  const result = await createHabit({
    name: 'Morning meditation',
    icon: '🧘',
    remindersEnabled: true,
  });

  if (result.queued) {
    toast.info('Saved offline. Will sync when connected.');
  } else {
    toast.success('Habit created!');
  }
};
```

---

### 🎤 Audio (Recording & Playback)
Complex audio handling for Voice Notes feature.

#### useAudioRecording
**Structure:** 13 files, 1144 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `useRecordingStatusHandler.ts` | 123 ⚠️ | Status updates & interruptions |
| `useRecordingHooks.ts` | 109 | Orchestrator |
| `useStopRecording.ts` | 107 | Cleanup & finalization |
| `useStartRecording.ts` | 98 | Initialization |

**Dependency Graph:**
```
useAudioRecording (main hook, 48 lines)
  └─ useRecordingHooks (orchestrator, 109 lines)
      ├─ useRecordingPermission (73 lines)
      │   └─ expo-av Permissions
      ├─ useStartRecording (98 lines)
      │   ├─ expo-av Recording
      │   └─ useAudioMode (51 lines)
      ├─ useStopRecording (107 lines)
      │   └─ Cleanup logic
      ├─ useRecordingStatusHandler (123 lines) ⚠️
      │   ├─ Status parsing
      │   └─ Interruption detection
      └─ useAppStateInterruption (65 lines)
          └─ react-native AppState
```

#### useAudioPlayback
**Structure:** 15 files, 1217 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `usePlaybackStatusHandler.ts` | 138 ⚠️ | Status updates |
| `useLoadAudio.ts` | 130 ⚠️ | Loading & unloading |
| `useSeekControls.ts` | 122 | Seek operations |

**Dependency Graph:**
```
useAudioPlayback (main hook, 51 lines)
  └─ usePlaybackHooks (orchestrator, 104 lines)
      ├─ useLoadAudio (130 lines)
      │   ├─ expo-av Sound.createAsync
      │   └─ useAudioMode (37 lines)
      ├─ usePlaybackControls (99 lines)
      │   ├─ play/pause logic
      │   └─ replay logic
      ├─ useSeekControls (122 lines)
      │   ├─ seekForward/Backward
      │   └─ seekToProgress/Seconds
      ├─ useSpeedAndMute (83 lines)
      │   ├─ Playback speed control
      │   └─ Mute/unmute
      ├─ usePlaybackStatusHandler (138 lines) ⚠️
      │   ├─ Status updates
      │   └─ Interruption handling
      ├─ useResumeFromInterruption (93 lines)
      │   └─ Post-interruption resume
      └─ useAppStatePlayback (77 lines)
          └─ Background behavior
```

**Usage Pattern - Voice Note Playback:**
```tsx
const {
  loadAudio,
  play,
  pause,
  togglePlayPause,
  seekToProgress,
  status,
} = useAudioPlayback({
  autoPlayOnLoad: false,
  onFinish: () => console.log('Playback finished'),
});

// Load a voice note
await loadAudio('file:///path/to/voice-note.m4a');

// Seek to 50%
seekToProgress(0.5);

// Toggle playback
await togglePlayPause();
```

**Side Effects:**
- Configures audio session mode (playback category)
- Subscribes to AppState changes for interruption handling
- Cleans up sound objects on unmount

---

### 📷 Image & Media
Image picking, uploading, and processing.

#### useImagePicker
**Structure:** 7 files, 423 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `useImagePicker.ts` | 105 | Main orchestrator |
| `useImagePickerHandlers.ts` | 82 | Handler composition |
| `useLibraryPicker.ts` | 64 | Photo library access |
| `useCameraPicker.ts` | 63 | Camera access |

**Dependency Graph:**
```
useImagePicker (105 lines)
  ├─ useCameraPicker (63 lines)
  │   └─ expo-image-picker launchCameraAsync
  ├─ useLibraryPicker (64 lines)
  │   └─ expo-image-picker launchImageLibraryAsync
  └─ useImagePickerHandlers (82 lines)
      └─ Combines camera/library handlers
```

#### useImageUpload
**191 lines** - Handles Convex storage upload

**Key Operations:**
1. Resize image (if > 1200px) using expo-image-manipulator
2. Generate signed upload URL (Convex mutation)
3. Fetch local file as blob
4. POST to Convex storage
5. Return storage ID

**Usage Pattern - Vision Board:**
```tsx
const { uploadImage, isUploading, error } = useImageUpload();
const { pickImage } = useImagePicker();

const handleAddImage = async () => {
  const image = await pickImage({ source: 'library' });
  if (!image) return;
  
  const result = await uploadImage(image);
  if (result) {
    await saveToVisionBoard({ storageId: result.storageId });
  }
};
```

---

### 💾 Offline & Storage
Offline-first queue and draft storage.

#### useOfflineQueue
**Structure:** 10 files, 716 lines total

| File | Lines | Purpose |
|------|-------|---------|
| `types.ts` | 111 | Type definitions |
| `useQueueOperations.ts` | 105 | Enqueue/dequeue/retry |
| `storage.ts` | 97 | AsyncStorage persistence |
| `useOfflineQueue.ts` | 93 | Main hook |
| `useQueueQueries.ts` | 91 | Query operations |

**Architecture:**
```
useOfflineQueue (main hook, 93 lines)
  ├─ useQueueOperations (105 lines)
  │   ├─ enqueue: Add operation to queue
  │   ├─ dequeue: Remove after sync
  │   └─ retryOperation: Retry failed ops
  ├─ useQueueQueries (91 lines)
  │   ├─ getPendingOperations
  │   ├─ getFailedOperations
  │   └─ getOperationById
  └─ storage (97 lines)
      ├─ saveQueue: Persist to AsyncStorage
      ├─ loadQueue: Restore from storage
      └─ clearQueue: Remove all operations
```

**Usage Pattern:**
```tsx
const { 
  pendingOperations, 
  retryOperation, 
  clearFailedOperations 
} = useOfflineQueue();

// Display pending sync status
{pendingOperations.length > 0 && (
  <Banner>
    {pendingOperations.length} operations waiting to sync
  </Banner>
)}

// Retry failed operation
await retryOperation(failedOp.id);
```

#### useDraftStorage
**Structure:** 6 files, 457 lines total

**Purpose:** Auto-save drafts for habit creation/editing

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `storage.ts` | 114 ⚠️ | AsyncStorage operations |
| `useDraftSaveOperations.ts` | 88 | Save/delete logic |
| `useDraftStorage.ts` | 84 | Main hook |
| `useDraftRecovery.ts` | 69 | Recovery UI |

**Usage Pattern - Auto-Save Drafts:**
```tsx
const { saveDraft, getDraft, clearDraft } = useDraftStorage('habit-create');

// Auto-save on every change
useEffect(() => {
  const timer = setTimeout(() => {
    saveDraft({ name, icon, notes });
  }, 500);
  return () => clearTimeout(timer);
}, [name, icon, notes]);

// Recover draft on mount
useEffect(() => {
  const draft = getDraft();
  if (draft) {
    setName(draft.name);
    setIcon(draft.icon);
  }
}, []);
```

---

### 💳 Premium & In-App Purchase
Revenue Cat integration for premium features.

#### usePremium
**Structure:** 4 files, 399 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `usePremiumData.ts` | 126 ⚠️ | Fetch offerings & customer info |
| `usePremiumActions.ts` | 116 ⚠️ | Purchase & restore flows |
| `usePremium.ts` | 79 | Main hook (combines data + actions) |

**Dependency Graph:**
```
usePremium (79 lines)
  ├─ usePremiumData (126 lines) ⚠️
  │   ├─ Revenue Cat getOfferings
  │   ├─ Revenue Cat getCustomerInfo
  │   └─ Subscription status checks
  └─ usePremiumActions (116 lines) ⚠️
      ├─ purchasePackage
      ├─ restorePurchases
      └─ Error handling
```

**Usage Pattern:**
```tsx
const {
  isPremium,
  offerings,
  purchasePackage,
  restorePurchases,
  isLoading,
} = usePremium();

// Purchase premium
const handlePurchase = async (pkg: Package) => {
  const result = await purchasePackage(pkg);
  if (result.success) {
    toast.success('Welcome to Premium!');
  }
};

// Restore previous purchases
await restorePurchases();
```

**Side Effects:**
- Initializes Revenue Cat SDK
- Syncs user ID with Convex
- Polls subscription status

---

### 🔔 Notifications & Reminders
Notification scheduling and handling.

| Hook | Purpose | Lines |
|------|---------|-------|
| `useNotificationResponse` | Handle notification taps | 119 |
| `useLetterNotification` | Schedule letter unlocks | 140 |
| `useStreakReminders` | Streak reminder logic | 88 |

**Dependency Graph:**
```
useNotificationResponse
  └─ expo-notifications
      ├─ addNotificationResponseReceivedListener
      └─ getLastNotificationResponseAsync

useLetterNotification
  ├─ useMutation (api.letters.create)
  └─ scheduleLetterUnlockNotification
      └─ expo-notifications scheduleNotificationAsync

useStreakReminders
  ├─ useStreakReminderSettings (125 lines) ⚠️
  │   └─ Settings persistence
  └─ expo-notifications
```

**Usage Pattern - Notification Response:**
```tsx
useNotificationResponse({
  onHabitNotificationTap: (habitId) => {
    // Open ActivationModal for this habit
    navigation.navigate('ActivationModal', { habitId });
  },
  onLetterNotificationTap: (letterId, habitId) => {
    // Open letter reading modal
    openLetterModal({ letterId, habitId });
  },
});
```

---

### 🎯 Milestone Detection
Detect and celebrate habit milestones.

#### useMilestoneDetection
**Structure:** 4 files, 237 lines total

**Core Logic:**
```typescript
export const MILESTONE_THRESHOLDS = [7, 14, 30, 50, 100, 200, 365];

// Detects if a milestone was crossed
function checkMilestoneCrossed(
  oldValue: number,
  newValue: number
): number | null {
  const crossed = MILESTONE_THRESHOLDS.find(
    threshold => oldValue < threshold && newValue >= threshold
  );
  return crossed ?? null;
}
```

**Usage Pattern:**
```tsx
const { achievement } = useMilestoneDetection({
  currentStreak: habit.currentStreak,
  previousStreak: habit.previousStreak,
  habitId: habit._id,
});

// Show celebration UI
{achievement && (
  <MilestoneCelebration
    milestone={achievement.milestone}
    type={achievement.type}
  />
)}
```

---

### 🚨 Rescue Trigger
Detect and offer streak rescues for habits.

#### useRescueTrigger
**Structure:** 8 files, 519 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `useRescueTrigger.ts` | 105 | Main orchestrator |
| `timeUtils.ts` | 88 | Time calculations |
| `useAppResumeTrigger.ts` | 86 | App resume detection |
| `useScheduledTrigger.ts` | 71 | Scheduled checks |

**Dependency Graph:**
```
useRescueTrigger (105 lines)
  ├─ useRescueEligibility (43 lines)
  │   └─ Determines if rescue is allowed
  ├─ useAppResumeTrigger (86 lines)
  │   └─ Triggers on app foreground
  ├─ useScheduledTrigger (71 lines)
  │   └─ Periodic checks (every 15 min)
  ├─ useMidnightReset (22 lines)
  │   └─ Reset at day boundary
  └─ timeUtils (88 lines)
      └─ Time zone calculations
```

**Usage Pattern:**
```tsx
const { rescueCandidates, triggerRescue, dismissRescue } = useRescueTrigger({
  habits: activeHabits,
  onRescueAvailable: (habitId) => {
    showRescueModal({ habitId });
  },
});

// User accepts rescue
await triggerRescue(habitId);

// User dismisses
dismissRescue(habitId);
```

---

### 🛡️ Unsaved Changes Guard
Prevent data loss from accidental navigation.

#### useUnsavedChangesGuard
**Structure:** 7 files, 380 lines total

| Sub-Hook | Lines | Purpose |
|----------|-------|---------|
| `useUnsavedChangesGuard.ts` | 93 | Main hook |
| `useConfirmDiscardAsync.ts` | 88 | Async confirmation |
| `useConfirmDiscard.ts` | 75 | Sync confirmation |
| `useBackHandler.ts` | 41 | Android back button |

**Dependency Graph:**
```
useUnsavedChangesGuard (93 lines)
  ├─ useConfirmDiscard (75 lines)
  │   └─ Alert.alert confirmation
  ├─ useConfirmDiscardAsync (88 lines)
  │   └─ Promise-based confirmation
  ├─ useBackHandler (41 lines)
  │   └─ Android BackHandler
  └─ @react-navigation/native
      └─ beforeRemove event listener
```

**Usage Pattern:**
```tsx
const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChangesGuard({
  message: 'Discard changes to this habit?',
  onConfirmDiscard: () => {
    // User confirmed - allow navigation
  },
});

// Track dirty state
useEffect(() => {
  setHasUnsavedChanges(
    name !== originalName || icon !== originalIcon
  );
}, [name, icon]);
```

**Side Effects:**
- Intercepts navigation `beforeRemove` event
- Intercepts Android back button
- Shows native Alert for confirmation

---

### ⚡ Performance Monitoring
Development-time performance profiling.

| Hook | Purpose | Lines |
|------|---------|-------|
| `usePerformance` | Context accessor | 36 |
| `useFPSMonitor` | FPS tracking | 85 |
| `useMemoryMonitor` | Memory usage | 75 |
| `useComponentTiming` | Mount/render timing | 59 |
| `useRenderCount` | Render counting | 44 |

**Usage Pattern:**
```tsx
// In development, wrap expensive components
function HeavyComponent() {
  useRenderCount('HeavyComponent');
  useFPSMonitor({ 
    onFPSDrop: (fps) => console.warn(`FPS: ${fps}`) 
  });
  
  return <ExpensiveTree />;
}
```

---

### 🔧 Utility Hooks
General-purpose utilities.

| Hook | Purpose | Lines |
|------|---------|-------|
| `useKeyboardVisible` | Keyboard state | 57 |
| `useRetryableAction` | Error handling & retry | 78 |

**Usage Pattern - Retryable Actions:**
```tsx
const saveHabit = useRetryableAction(async (data) => {
  await updateMutation({ habitId, ...data });
});

// Execute with automatic error handling
await saveHabit.execute({ name: 'New name' });

// Show error UI
{saveHabit.error && (
  <ErrorBanner
    message={saveHabit.error.message}
    onRetry={saveHabit.retry}
  />
)}
```

---

## Usage Patterns

### Pattern 1: Offline-First Operations
```tsx
// 1. Check online status
const { isOnline } = useIsOnline();

// 2. Attempt mutation
const result = await createHabit({ name: 'Morning run' });

// 3. Handle queuing
if (result.queued) {
  toast.info('Saved offline. Will sync when connected.');
} else {
  toast.success('Habit created!');
}

// 4. Monitor queue
const { pendingOperations } = useOfflineQueue();
```

### Pattern 2: Celebration Feedback Stack
```tsx
// Layer multiple feedback types
const { playCompletionSound } = useCompletionSound({ soundEnabled: true });
const { triggerCompletion, triggerStreakMilestone } = useCelebrationHaptics();
const { achievement } = useMilestoneDetection({ ... });

const handleComplete = async () => {
  await toggleHabit({ habitId, date });
  
  // Tactile feedback
  await triggerCompletion();
  
  // Audio feedback
  await playCompletionSound();
  
  // Visual celebration
  if (achievement) {
    showCelebrationModal(achievement);
    await triggerStreakMilestone(achievement.milestone);
  }
};
```

### Pattern 3: Audio Session Management
```tsx
// Recording and playback configure audio mode differently
const { startRecording, stopRecording } = useAudioRecording({
  onRecordingComplete: (uri) => {
    // Switch to playback mode
    loadAudio(uri);
  },
});

const { loadAudio, play } = useAudioPlayback();

// Ensure proper cleanup on screen unmount
useEffect(() => {
  return () => {
    stopRecording();
    // Audio hooks auto-unload on unmount
  };
}, []);
```

### Pattern 4: Draft Recovery Flow
```tsx
// 1. Setup draft storage
const { saveDraft, getDraft, clearDraft } = useDraftStorage('habit-edit');

// 2. Auto-save on changes
useEffect(() => {
  const timer = setTimeout(() => saveDraft(formData), 500);
  return () => clearTimeout(timer);
}, [formData]);

// 3. Recover on mount
useEffect(() => {
  const draft = getDraft();
  if (draft && draft.timestamp > habit.updatedAt) {
    Alert.alert(
      'Recover Draft?',
      'You have unsaved changes.',
      [
        { text: 'Discard', onPress: () => clearDraft() },
        { text: 'Recover', onPress: () => setFormData(draft.data) },
      ]
    );
  }
}, []);

// 4. Clear on save
const handleSave = async () => {
  await updateHabit(formData);
  clearDraft();
};
```

### Pattern 5: Timezone-Aware Operations
```tsx
// Always use timezone wrapper for habit toggles
const toggleHabit = useToggleHabitWithTimezone();

// Automatically injects current timezone
await toggleHabit({ 
  habitId, 
  date: '2024-01-15' 
  // timezone injected automatically
});

// Server uses timezone for streak calculations
```

---

## Best Practices

### 1. Composition Over Monoliths
❌ **Bad:** 300-line hook doing everything
```tsx
function useHabitEverything() {
  // create, update, delete, toggle, stats, milestones...
  // 300+ lines
}
```

✅ **Good:** Composed hooks with single responsibilities
```tsx
const { createHabit } = useOfflineHabitMutations();
const { currentStrength } = useHabitStrength(completedDates, createdAt);
const { achievement } = useMilestoneDetection({ currentStreak });
```

### 2. Memoization for Expensive Calculations
```tsx
// useHabitStrength example
const result = useMemo(() => {
  const strengthHistory = generateStrengthTimeline(completedDates, createdAt);
  // ... expensive calculations
  return { currentStrength, strengthHistory, metrics };
}, [completedDates.size, createdAt]); // Smart deps
```

### 3. Ref-Based State for Callbacks
```tsx
// Avoid stale closures in callbacks
const handlersRef = useRef(handlers);
useEffect(() => { 
  handlersRef.current = handlers; 
}, [handlers]);

const callback = useCallback(() => {
  // Always uses latest handlers
  handlersRef.current.onEvent();
}, []); // Empty deps - callback never recreated
```

### 4. Cleanup in useEffect
```tsx
useEffect(() => {
  const subscription = Notifications.addListener(handler);
  const sound = soundRef.current;
  
  return () => {
    subscription.remove();
    sound?.unloadAsync();
  };
}, []);
```

### 5. Error Boundaries for Non-Critical Features
```tsx
// Haptics should never crash the app
const triggerHaptic = async () => {
  try {
    await Haptics.impactAsync();
  } catch {
    // Silently fail - haptics are non-critical
  }
};
```

---

## Performance Considerations

### Hooks Over 100 Lines - Review Candidates
These hooks exceed 100 lines and should be considered for splitting:

1. **useOfflineHabitMutations.ts** (300 lines) - Highest priority
   - Split into: `useCreateHabit`, `useUpdateHabit`, `useArchiveHabit`, etc.
   
2. **usePremiumData.ts** (126 lines)
   - Extract offerings fetching into separate hook
   
3. **usePremiumActions.ts** (116 lines)
   - Split purchase and restore flows
   
4. **usePlaybackStatusHandler.ts** (138 lines)
   - Extract interruption logic
   
5. **useLoadAudio.ts** (130 lines)
   - Extract audio mode configuration

6. **useStreakReminderSettings.ts** (125 lines)
   - Split settings persistence and logic

### Memoization Strategy
- **useHabitStrength:** Memoizes on `completedDates.size` (cheap proxy for changes)
- **useMilestoneDetection:** Memoizes milestone checks
- **usePressAnimation:** Uses Reanimated shared values (no React re-renders)

### Lazy Initialization
```tsx
// useReduceMotion example
let AccessibilityInfo: AccessibilityInfoType | null;
try {
  AccessibilityInfo = require('react-native').AccessibilityInfo;
} catch {
  AccessibilityInfo = null; // Graceful degradation
}
```

---

## Dependency Graph Summary

```
Top-Level Dependencies:
├── react (useState, useEffect, useCallback, useMemo, useRef)
├── convex/react (useQuery, useMutation)
├── expo-av (Audio, Recording)
├── expo-haptics (Haptics)
├── expo-notifications (Notifications)
├── expo-image-picker (ImagePicker)
├── expo-image-manipulator (ImageManipulator)
├── react-native-reanimated (animations)
├── @react-navigation/native (navigation guards)
├── react-native (Platform, AppState, BackHandler, Keyboard)
└── @revenuecat/purchases-react-native (IAP)

Internal Dependencies:
├── contexts/
│   ├── NetworkStatusContext (useIsOnline)
│   └── PerformanceContext (usePerformance)
├── lib/
│   ├── offline (queue manager)
│   └── performance (monitoring)
└── utils/
    ├── haptics/patterns (centralized haptics)
    ├── notifications (scheduling helpers)
    └── timezone (timezone detection)
```

---

## Quick Reference

### Most Used Hooks
1. `useMutation` - Convex mutations (used in 20+ hooks)
2. `useReduceMotion` - Accessibility (used in 5+ hooks)
3. `useCallback` - Stable function refs (used everywhere)
4. `useMemo` - Expensive calculations (10+ hooks)

### Complex Hooks (Study These)
1. **useAudioPlayback** - Audio session management
2. **useOfflineQueue** - Offline-first architecture
3. **useHabitStrength** - Algorithm implementation
4. **useRescueTrigger** - Multi-trigger orchestration
5. **useUnsavedChangesGuard** - Navigation interception

### Simple Utilities (Start Here)
1. **useKeyboardVisible** - Platform-specific listeners
2. **useRetryableAction** - Error handling pattern
3. **useReduceMotion** - Accessibility check
4. **useToggleHabitWithTimezone** - Simple wrapper pattern

---

## Contributing

When adding a new hook:

1. **Follow the structure:**
   ```
   src/hooks/
   └── useFeature/
       ├── index.ts          # Public exports
       ├── useFeature.ts     # Main hook (orchestrator)
       ├── useSubFeature.ts  # Sub-hooks
       ├── types.ts          # TypeScript types
       ├── constants.ts      # Configuration
       └── utils.ts          # Pure functions
   ```

2. **Add JSDoc documentation:**
   ```tsx
   /**
    * Hook description.
    * 
    * @param options - Configuration options
    * @returns Object containing ...
    * 
    * @example
    * ```tsx
    * const { method } = useFeature();
    * ```
    */
   ```

3. **Keep hooks focused:**
   - One responsibility per hook
   - Split if > 100 lines (unless complex orchestrator)
   - Extract utils to separate files

4. **Add to this guide:**
   - Update the relevant category
   - Add dependency graph
   - Include usage pattern

---

## Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [Convex React Hooks](https://docs.convex.dev/client/react)
- [Reanimated Hooks](https://docs.swmansion.com/react-native-reanimated/)
- [Expo AV Documentation](https://docs.expo.dev/versions/latest/sdk/av/)

---

**Last Updated:** 2026-02-16  
**Maintained By:** Sonnet (AI)
