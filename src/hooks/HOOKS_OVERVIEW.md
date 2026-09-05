# Hooks Overview

Comprehensive documentation of all custom React hooks in the Chain Day habit tracking app.

## Table of Contents

- [Hook Categories](#hook-categories)
- [Hook Dependencies](#hook-dependencies)
- [Hooks Requiring Refactoring](#hooks-requiring-refactoring)
- [Usage Guidelines](#usage-guidelines)

---

## Hook Categories

### Animation & Interaction

#### `usePressAnimation`

**Purpose**: The single press primitive — spring scale on press-in, spring back
on press-out. `ui/AnimatedPressable` wraps it; use that component unless you need
the raw shared value.

**Location**: `usePressAnimation.ts`

**Key Features**:

- Spring-based scale animation (`springs.standard`, `pressScale` 0.97)
- Haptics **off by default** — callers fire haptics on commit, not press-in.
  Pass `enableHaptics: true` only where the press tap is the sole tactile channel.
- Optional `lift` for the translateY(-1) + elevated-shadow card treatment
- Reduced motion support via Reanimated's `useReducedMotion`

**Dependencies**:

- `react-native-reanimated` (animation + reduced motion)
- `@/utils/haptics` (haptic feedback)
- `@/theme/animations` (spring token)

**Usage**:

```tsx
const { animatedStyle, pressHandlers } = usePressAnimation();
```

#### `useReduceMotion`

**Purpose**: Detects system-level reduced motion accessibility setting, with an
optional caller-supplied override.

**Location**: `useReduceMotion.ts` (89 lines)

**Status**: Narrowed. Components read reduced motion from Reanimated's
`useReducedMotion()` directly — it is already a shared value on the UI thread and
needs no React state. This hook survives only for the callers that pass a
`{ preference }` override the system setting cannot express: `useHaptics`,
`useHapticFeedback`, and `useHabitDayToggleAnimations`. Do not add new callers;
use `useReducedMotion` from `react-native-reanimated` instead.

**Key Features**:

- Platform-specific implementation (iOS/Native Handset)
- Optional `{ preference }` override that wins over the system setting
- Safe fallback when AccessibilityInfo unavailable

**Dependencies**:

- `react-native` (AccessibilityInfo API)

**Used By**:

- `useCelebrationHaptics`
- `useHapticFeedback`

---

### Haptics & Feedback

#### `useCelebrationHaptics`

**Purpose**: Enhanced haptic feedback for celebrations and milestones.

**Location**: `useCelebrationHaptics.ts` (106 lines)

**Key Features**:

- Multiple celebration patterns (completion, streak, all-complete)
- Centralized haptic patterns library
- Automatic reduced motion respect
- Safe error handling

**Dependencies**:

- `HapticPatterns` from `utils/haptics/patterns`
- `useReduceMotion`

**Triggers**:

- `triggerCompletion()` - Single habit completion
- `triggerFirstCompletion()` - First-ever completion
- `triggerAllComplete()` - All habits complete for day
- `triggerStreakMilestone(days)` - Milestone celebration
- `triggerUndo()` - Undo feedback

#### `useHapticFeedback`

**Purpose**: Legacy-compatible haptic wrapper (prefer `useHaptics` for new code).

**Location**: `useHapticFeedback.ts` (88 lines)

**Key Features**:

- Multiple impact styles (light/medium/heavy)
- Success/warning/error patterns
- Selection feedback

**Dependencies**:

- `HapticPatterns` from `utils/haptics/patterns`
- `useReduceMotion`

**Note**: This is a legacy hook. New code should use `useHaptics` from `@/utils/haptics`.

#### `useCompletionSound`

**Purpose**: Premium feature for playing completion sounds.

**Location**: `useCompletionSound.ts` (95 lines)

**Key Features**:

- Three sound types: chime, pop, success
- Auto-cleanup after playback
- Volume control
- Non-critical error handling

**Dependencies**:

- `expo-audio` (Audio playback)
- Bundled sound assets

---

### Habit Management

#### `useHabitStrength`

**Purpose**: Calculates habit strength using exponential smoothing algorithm.

**Location**: `useHabitStrength.ts` (132 lines)

**Key Features**:

- Exponential smoothing (Loop Habit Tracker algorithm)
- Historical timeline generation
- Peak/lowest tracking
- 30-day and 1-year comparison metrics

**Algorithm**:

- Growth on completion: `strength + (1 - strength) * 0.05`
- Decay on miss: `strength * 0.95`
- Reaches ~100% after 60-90 days of perfect consistency

**Dependencies**:

- `date-fns` (date calculations)
- Strength calculation utilities

**Performance**: Memoized based on `completedDates.size` and `habitCreatedAt`.

#### `useToggleHabitWithTimezone`

**Purpose**: Wrapper around `toggleHabit` mutation that injects user timezone.

**Location**: `useToggleHabitWithTimezone.ts` (37 lines)

**Key Features**:

- Automatic timezone injection
- Handles timezone switching (travel)
- Server-side streak calculation using local time

**Dependencies**:

- Convex `toggleHabit` mutation
- `getUserTimezone` utility

#### `useOfflineHabitMutations`

**Purpose**: Offline-aware habit mutations with queue support.

**Location**: `useOfflineHabitMutations.ts` (276 lines) ⚠️ **LARGE HOOK**

**Key Features**:

- Queue operations when offline
- Immediate execution when online
- Fallback to queue on network errors
- Support for: create, update, archive, pause, remove

**Dependencies**:

- Convex mutations
- `useIsOnline` from NetworkStatusContext
- `getOfflineQueueManager`

**Operations**:

- `createHabit()` - Returns temporary ID for optimistic UI
- `updateHabit()` - Partial updates supported
- `archiveHabit()` - Soft delete
- `pauseHabit()` - Pause tracking
- `removeHabit()` - Hard delete

**Note**: This hook is quite large (276 lines) and could potentially be split into:

- `useOfflineCreate`
- `useOfflineUpdate`
- `useOfflineArchive`

---

### Milestones & Notifications

#### `useMilestoneDetection`

**Purpose**: Detects when user crosses streak milestones (7, 30, 60, 100 days).

**Location**: `useMilestoneDetection.ts` (re-export from directory)

**Key Features**:

- Single-habit and multi-habit variants
- Configurable thresholds
- Achievement tracking

**Dependencies**:

- Milestone detection utilities

**Thresholds**: 7, 30, 60, 100, 365, 500, 1000 days

#### `useNotificationResponse`

**Purpose**: Handles notification tap responses.

**Location**: `useNotificationResponse.ts` (119 lines)

**Key Features**:

- Routes habit reminder taps to ActivationModal
- Routes letter unlock taps to reading modal
- Handles app launch from notification
- Uses stable handler refs to avoid re-subscription

**Dependencies**:

- `expo-notifications`
- Notification constants

**Scientific Basis**:

- Implementation intentions (Gollwitzer): 2-3x follow-through
- Context-aware intervention

#### `useLetterNotification`

**Purpose**: Creates letters with automatic unlock notification scheduling.

**Location**: `useLetterNotification.ts` (140 lines)

**Key Features**:

- Creates letter in Convex
- Schedules unlock notification
- Cancels notifications when letter deleted
- Error handling with callbacks

**Dependencies**:

- Convex `letters.create` mutation
- Notification scheduling utilities

**Scientific Basis**:

- Temporal self-continuity
- Anticipation psychology

#### `useStreakReminders`

**Purpose**: Manages streak reminder notifications.

**Location**: `useStreakReminders/` (directory-based hook)

**Key Features**:

- Configurable reminder times
- Per-habit reminder settings
- Integration with notification system

---

### Media & Storage

#### `useImagePicker`

**Purpose**: Pick images from camera or gallery.

**Location**: `useImagePicker.ts` (re-export from directory)

**Key Features**:

- Camera capture
- Gallery selection
- Permission handling
- Image metadata extraction

**Dependencies**:

- `expo-image-picker`

#### `useImageUpload`

**Purpose**: Uploads images to Convex file storage.

**Location**: `useImageUpload.ts` (191 lines) ⚠️ **LARGE HOOK**

**Key Features**:

- Automatic image resizing (max 1200px)
- Signed URL generation
- Progress tracking
- 10MB size limit
- App Store compliance

**Flow**:

1. Resize image if needed
2. Get signed upload URL
3. Fetch local file as blob
4. POST to signed URL
5. Return storage ID

**Dependencies**:

- `expo-image-manipulator` (resizing)
- Convex storage mutations

**Note**: Could potentially be split into:

- `useImageResize`
- `useImageUpload`

#### `useAudioPlayback`

**Purpose**: Audio playback controls for voice notes.

**Location**: `useAudioPlayback/` (directory-based hook)

**Key Features**:

- Play/pause controls
- Seek functionality
- Playback status tracking
- Auto-cleanup

**Dependencies**:

- `expo-audio`

#### `useAudioRecording`

**Purpose**: Audio recording for voice notes.

**Location**: `useAudioRecording/` (directory-based hook)

**Key Features**:

- Record/stop controls
- Permission handling
- Recording status
- File management

**Dependencies**:

- `expo-audio`

---

### Premium Features

#### `usePremium`

**Purpose**: Premium subscription status and actions.

**Location**: `usePremium/` (directory-based hook)

**Key Features**:

- Subscription status checking
- Feature gating
- Purchase flow integration
- Trial management

**Dependencies**:

- Revenue Cat integration
- Convex premium queries

---

### Rescue & Recovery

#### `useRescueTrigger`

**Purpose**: Detects when user needs motivation (habit rescue).

**Location**: `useRescueTrigger/` (directory-based hook)

**Key Features**:

- Missed habit detection
- Rescue content triggering
- Configurable thresholds

**Dependencies**:

- Habit completion data

---

### UI & Navigation

#### `useKeyboardVisible`

**Purpose**: Tracks keyboard visibility and height.

**Location**: `useKeyboardVisible.ts` (54 lines)

**Key Features**:

- Platform-specific events (will/did)
- Height tracking
- Safe event cleanup

**Dependencies**:

- React Native Keyboard API

**Platform Differences**:

- iOS: `keyboardWillShow/Hide` (smoother)
- Native Handset: `keyboardDidShow/Hide`

#### `useUnsavedChangesGuard`

**Purpose**: Warns users about unsaved changes.

**Location**: `useUnsavedChangesGuard.ts` (re-export from directory)

**Key Features**:

- Dirty state tracking
- Navigation blocking
- Custom warning messages

**Dependencies**:

- Navigation context

#### `useDraftStorage`

**Purpose**: Persists form drafts to local storage.

**Location**: `useDraftStorage/` (directory-based hook)

**Key Features**:

- Auto-save to AsyncStorage
- Draft restoration
- Cleanup on submit

**Dependencies**:

- AsyncStorage

---

### Utilities

#### `useRetryableAction`

**Purpose**: Wraps async actions with error handling and retry.

**Location**: `useRetryableAction.ts` (48 lines)

**Key Features**:

- Automatic error capture
- One-click retry with same args
- Loading state tracking
- Error clearing

**Dependencies**: None (pure utility hook)

---

## Hook Dependencies

### Dependency Graph

```
useReduceMotion (base utility)
    ├── useCelebrationHaptics
    └── useHapticFeedback

HapticPatterns library
    ├── useCelebrationHaptics
    └── useHapticFeedback

Network Status Context
    ├── useOfflineHabitMutations

Convex Mutations
    ├── useOfflineHabitMutations
    ├── useToggleHabitWithTimezone
    ├── useLetterNotification
    └── useImageUpload

expo-audio
    ├── useCompletionSound
    ├── useAudioPlayback
    └── useAudioRecording

expo-notifications
    ├── useNotificationResponse
    ├── useLetterNotification
    └── useStreakReminders
```

### Critical Dependencies

**Haptics Chain**:
`useReduceMotion` → `useCelebrationHaptics` → habit completion flows

**Offline Chain**:
`NetworkStatusContext` → `useOfflineHabitMutations` → all habit mutations

**Notification Chain**:
`useNotificationResponse` → `useLetterNotification` → letter creation

---

## Hooks Requiring Refactoring

### Large Hooks (>100 lines)

These hooks exceed 100 lines and could benefit from decomposition:

1. **useOfflineHabitMutations.ts** (276 lines) ⚠️
   - **Current**: Single file with all offline mutations
   - **Suggested**: Split into separate hooks or create a shared helper
   - **Reason**: Each mutation (create/update/archive/pause/remove) follows the same pattern

2. **useImageUpload.ts** (191 lines) ⚠️
   - **Current**: Handles resizing + upload in one hook
   - **Suggested**: Extract `useImageResize` utility
   - **Reason**: Resizing logic could be reused elsewhere

3. **useLetterNotification.ts** (140 lines)
   - **Current**: Manageable but approaching threshold
   - **Status**: OK for now, monitor growth

4. **useHabitStrength.ts** (132 lines)
   - **Current**: Complex calculation logic
   - **Status**: OK - complexity is inherent to the feature
   - **Note**: Already uses external utilities for calculations

5. **usePressAnimation.ts**
   - **Current**: Well-structured with clear sections
   - **Status**: OK - mostly type definitions and config

6. **useNotificationResponse.ts** (119 lines)
   - **Current**: Handles multiple notification types
   - **Status**: OK - logic is cohesive

7. **useCelebrationHaptics.ts** (106 lines)
   - **Current**: Multiple trigger functions
   - **Status**: OK - each trigger is simple

### Refactoring Recommendations

#### High Priority

**useOfflineHabitMutations** - Extract shared pattern:

```tsx
// Create: src/hooks/offline/useOfflineMutation.ts
function useOfflineMutation(
  mutationName: string,
  convexMutation: any,
  operationType: string
) {
  // Shared offline/online logic
}

// Then simplify:
export const useCreateHabit = () =>
  useOfflineMutation('createHabit', api.habits.create, 'create');
```

#### Medium Priority

**useImageUpload** - Extract resizing:

```tsx
// Create: src/hooks/media/useImageResize.ts
export function useImageResize(maxDimension = 1200) {
  return useCallback(
    async (image: PickedImage) => {
      // Resizing logic
    },
    [maxDimension]
  );
}
```

---

## Usage Guidelines

### When to Create a New Hook

✅ **Create a new hook when**:

- Logic is reused in 2+ components
- Logic has complex state management
- Logic involves side effects (subscriptions, timers)
- Logic interfaces with external APIs
- You need to test the logic in isolation

❌ **Don't create a hook when**:

- Logic is only used once
- It's just a simple calculation (use a utility function)
- It's purely presentational (use a component)

### Hook Naming Conventions

- **Always** start with `use` prefix
- **Use descriptive names**: `useHabitStrength` not `useStrength`
- **Action-based**: `useToggleHabit` not `useHabitToggler`
- **Feature-based**: `useCelebrationHaptics` not `useHaptics`

### File Organization

**Simple hooks**: Single `.ts` file

```
useKeyboardVisible.ts
useReduceMotion.ts
```

**Complex hooks**: Directory with barrel export

```
useAudioPlayback/
  ├── index.ts (barrel export)
  ├── useAudioPlayback.ts (main hook)
  ├── useLoadAudio.ts (sub-hook)
  ├── useSeekControls.ts (sub-hook)
  └── types.ts
```

### Testing Guidelines

All hooks should have:

- ✅ Unit tests in `__tests__/`
- ✅ Type safety (no `any` types)
- ✅ JSDoc documentation
- ✅ Usage examples in JSDoc

### Documentation Standards

Each hook must have:

1. **Purpose statement** - What does it do?
2. **@param tags** - What are the inputs?
3. **@returns tag** - What does it return?
4. **@example block** - How do you use it?
5. **Dependencies** - What does it rely on?
6. **Scientific basis** (if applicable) - Why this approach?

---

## Related Documentation

- **Theme Layer**: See `src/theme/THEME_ARCHITECTURE.md`
- **Haptics**: See `src/utils/haptics/README.md`
- **Offline System**: See `src/lib/offline/README.md`
- **Animations**: See `src/utils/animations/README.md`

---

_Last updated: 2024-02-16_
_Maintained by: Development Team_
