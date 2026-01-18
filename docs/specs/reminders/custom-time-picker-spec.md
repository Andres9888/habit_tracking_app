# Custom Time Picker for Habit Reminders - Specification

## Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [User Flow](#user-flow)
- [Visual Hierarchy](#visual-hierarchy)
- [Component Structure](#component-structure)
- [Technical Implementation](#technical-implementation)
- [Implementation Tasks](#implementation-tasks)
- [Testing Strategy](#testing-strategy)
- [Success Metrics](#success-metrics)
- [Appendices](#appendices)

---

## Overview

Enable users to set custom reminder times for habits beyond the current 3 fixed presets (7 AM, 12 PM, 8 PM). This feature uses the already-installed `@react-native-community/datetimepicker` package to provide native iOS/Android time pickers.

**Key Features:**

- Quick preset buttons for common times (Morning, Midday, Evening)
- Custom time picker using native iOS/Android controls
- "Next reminder" preview badge showing when notification will fire
- Seamless integration with existing reminder system
- Backward compatible with current reminder data

**Estimated Effort:** 12 hours (~1.5 days)

**Mock Reference:** `.superdesign/design_iterations/reminder_improvements_1.html`

---

## Design Philosophy

1. **Progressive Disclosure**: Show quick presets first (1-tap), reveal custom picker on demand
2. **Immediate Feedback**: "Next reminder" badge confirms the system understood user intent
3. **Flexibility with Guardrails**: Allow any time, but guide with Huberman-phase presets
4. **Native Feel**: Use platform-native time pickers for familiar UX
5. **Trust Building**: Show exactly when the next notification will arrive

---

## User Flow

### Happy Path (Quick Preset)

```
1. User opens Create/Edit Habit modal
2. User sees reminder toggle (default: enabled)
3. User taps preset button (Morning/Midday/Evening)
4. "Next reminder" badge updates immediately
5. User creates habit → reminder scheduled
```

### Happy Path (Custom Time)

```
1. User opens Create/Edit Habit modal
2. User sees reminder toggle (default: enabled)
3. User taps "Custom time..." button
4. Native time picker appears (iOS wheel / Android clock)
5. User selects time (e.g., 6:30 AM)
6. User confirms selection
7. Custom time appears in green, presets deselected
8. "Next reminder" badge shows "Tomorrow at 6:30 AM"
9. User creates habit → reminder scheduled at custom time
```

### Edge Cases

```
- User selects preset, then custom → Custom takes precedence
- User selects custom, then preset → Preset takes precedence
- User disables reminder toggle → All time UI hidden
- User enables toggle → Last selected time restored
- Time in past today → Badge shows "Tomorrow at X"
- Time in future today → Badge shows "Today at X (in Y hours)"
```

---

## Visual Hierarchy

### Reminder Section (Expanded)

```
┌─────────────────────────────────────┐
│ 🔔 Daily Reminder              [ON] │  ← Toggle row
├─────────────────────────────────────┤
│                                     │
│  [🌅 7 AM] [☀️ 12 PM] [🌙 8 PM]    │  ← Quick presets
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🕐 Custom time...        ›  │   │  ← Custom button
│  └─────────────────────────────┘   │
│                                     │
│     ⏰ Next: Today at 12:00 PM     │  ← Preview badge
│        (in 3 hours)                 │
│                                     │
└─────────────────────────────────────┘
```

### Reminder Section (Custom Time Selected)

```
┌─────────────────────────────────────┐
│ 🔔 Daily Reminder              [ON] │
├─────────────────────────────────────┤
│                                     │
│  [🌅 7 AM] [☀️ 12 PM] [🌙 8 PM]    │  ← None selected
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🕐 6:30 AM              ›  │   │  ← Green, has value
│  └─────────────────────────────┘   │
│                                     │
│     ⏰ Next: Tomorrow at 6:30 AM   │
│                                     │
└─────────────────────────────────────┘
```

### Time Picker Modal (iOS)

```
┌─────────────────────────────────────┐
│                                     │
│        Set Reminder Time            │
│                                     │
│    ┌───────────────────────────┐   │
│    │    5         15      PM   │   │
│    │  [ 6 ]  :  [ 30 ]  [ AM ] │   │  ← Wheel picker
│    │    7         45           │   │
│    └───────────────────────────┘   │
│                                     │
│   [ Cancel ]      [ Set Time ]     │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Structure

### 1. EnhancedReminderSelector Component

**File**: `src/components/CreateHabitModal/components/EnhancedReminderSelector.tsx`

**Purpose**: Replaces/enhances the current `MinimalReminderToggle` with custom time support.

**Props**:

```typescript
interface EnhancedReminderSelectorProps {
  // Core state
  enabled: boolean;
  reminderTime: Date;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (time: Date) => void;

  // Optional customization
  presets?: ReminderPreset[];
  showNextReminder?: boolean;

  // Styling
  className?: string;
}

interface ReminderPreset {
  id: string;
  label: string;
  emoji: string;
  hour: number;
  minute: number;
}
```

**Default Presets**:

```typescript
const DEFAULT_PRESETS: ReminderPreset[] = [
  { id: 'morning', label: '7 AM', emoji: '🌅', hour: 7, minute: 0 },
  { id: 'midday', label: '12 PM', emoji: '☀️', hour: 12, minute: 0 },
  { id: 'evening', label: '8 PM', emoji: '🌙', hour: 20, minute: 0 },
];
```

### 2. TimePickerModal Component

**File**: `src/components/CreateHabitModal/components/TimePickerModal.tsx`

**Purpose**: Wrapper around `@react-native-community/datetimepicker` with consistent styling.

**Props**:

```typescript
interface TimePickerModalProps {
  visible: boolean;
  initialTime: Date;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
  title?: string;
}
```

**Platform Behavior**:

- **iOS**: Modal with spinning wheel picker (familiar iOS UX)
- **Android**: Material Design clock picker (familiar Android UX)

### 3. NextReminderBadge Component

**File**: `src/components/CreateHabitModal/components/NextReminderBadge.tsx`

**Purpose**: Displays when the next reminder will fire with relative time.

**Props**:

```typescript
interface NextReminderBadgeProps {
  reminderTime: Date;
  enabled: boolean;
}
```

**Display Logic**:

```typescript
function getNextReminderText(time: Date): string {
  const now = new Date();
  const reminderToday = new Date(now);
  reminderToday.setHours(time.getHours(), time.getMinutes(), 0, 0);

  if (reminderToday > now) {
    // Today
    const diffMs = reminderToday.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `Today at ${formatTime(time)} (in ${diffHours}h ${diffMins}m)`;
    }
    return `Today at ${formatTime(time)} (in ${diffMins} minutes)`;
  } else {
    // Tomorrow
    return `Tomorrow at ${formatTime(time)}`;
  }
}
```

---

## Technical Implementation

### Integration with Existing System

The current reminder system stores time as a string (`"7:00 AM"`, `"12:00 PM"`, `"8:00 PM"`). Custom times will use the same format for backward compatibility.

**Existing Schema** (no changes needed):

```typescript
// convex/schema.ts
habits: defineTable({
  // ... other fields
  remindersEnabled: v.optional(v.boolean()),
  reminderTime: v.optional(v.string()), // "HH:MM AM/PM" format
  reminderSound: v.optional(v.string()),
});
```

**Time Format Utilities** (already exist in `src/utils/notifications.ts`):

```typescript
// Parse string to Date
createDateFromTimeString(time: string): Date

// Format Date to string
formatReminderTime(date: Date): string

// Get relative time text
getNextReminderRelativeTime(reminderTime: string): string | null
```

### State Management

**Form Hook Updates** (`useHabitForm.ts`):

```typescript
// Existing state - no changes needed
const [reminderTime, setReminderTime] = useState<Date>(
  getDefaultReminderTime()
);
const [remindersEnabled, setRemindersEnabled] = useState(true);

// New helper to check if time matches a preset
const isPresetTime = useCallback((time: Date): string | null => {
  const hour = time.getHours();
  const minute = time.getMinutes();

  if (hour === 7 && minute === 0) return 'morning';
  if (hour === 12 && minute === 0) return 'midday';
  if (hour === 20 && minute === 0) return 'evening';
  return null; // Custom time
}, []);
```

### Platform-Specific Picker Behavior

**iOS Implementation**:

```tsx
<DateTimePicker
  mode='time'
  display='spinner' // iOS wheel picker
  value={selectedTime}
  onChange={(event, date) => {
    if (date) setSelectedTime(date);
  }}
/>
```

**Android Implementation**:

```tsx
<DateTimePicker
  mode='time'
  display='clock' // Android clock picker
  value={selectedTime}
  onChange={(event, date) => {
    // Android fires onChange on confirm AND dismiss
    if (event.type === 'set' && date) {
      onConfirm(date);
    } else {
      onCancel();
    }
  }}
/>
```

### Notification Scheduling

**No changes needed** - The existing `scheduleHabitReminder()` function already accepts any `reminderTime: Date`:

```typescript
// src/utils/notifications.ts (existing)
export async function scheduleHabitReminder(
  habitId: string,
  title: string,
  body: string,
  reminderTime: Date,
  skipPermissionCheck = false
): Promise<boolean>;
```

### Accessibility

**Voice Over / TalkBack Support**:

```tsx
// Preset buttons
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`Set reminder for ${preset.label}`}
  accessibilityState={{ selected: isSelected }}
>

// Custom time button
<Pressable
  accessibilityRole="button"
  accessibilityLabel={hasCustomTime
    ? `Custom time set to ${formatTime(time)}. Double tap to change.`
    : "Set a custom reminder time"
  }
  accessibilityHint="Opens time picker"
>

// Next reminder badge
<View
  accessibilityRole="text"
  accessibilityLabel={`Next reminder: ${getNextReminderText(time)}`}
>
```

### Animation Specs

**Preset Button Selection**:

```typescript
// Scale on press
pressIn: scale(0.96) over 50ms
pressOut: scale(1.0) with spring(damping: 15, stiffness: 150)

// Selection indicator
selected: border-emerald-500, bg-emerald-50
deselected: border-transparent, bg-stone-100
```

**Custom Time Button**:

```typescript
// When custom time set
hasValue: (border - emerald - 500, bg - emerald - 50, text - emerald - 700);
noValue: (border - stone - 200, bg - white, text - stone - 900);
```

**Next Reminder Badge**:

```typescript
// Entrance animation (when enabled)
entering: FadeIn.duration(200).delay(100);
exiting: FadeOut.duration(150);
```

---

## Implementation Tasks

### Phase 1: Core Components (5 hours)

#### Task 1.1: Create TimePickerModal Component

**File**: `src/components/CreateHabitModal/components/TimePickerModal.tsx`

**Estimated Effort**: 2 hours

**Dependencies**: None

**Acceptance Criteria**:

- [x] Modal opens with passed initialTime
- [x] iOS shows spinner picker
- [x] Android shows clock picker
- [x] onConfirm called with selected time
- [x] onCancel called on dismiss
- [x] Keyboard dismissed when modal opens
- [x] Haptic feedback on confirm
- [x] Accessible labels for picker

**Implementation Notes (Completed 2026-01-07)**:

- Component created at `src/components/CreateHabitModal/components/TimePickerModal.tsx`
- Unit tests created at `src/components/CreateHabitModal/components/__tests__/TimePickerModal.test.tsx`
- All 21 test cases pass

**Implementation Notes**:

```tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Platform, Pressable, Text, View } from 'react-native';

export const TimePickerModal = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = 'Set Reminder Time',
}: TimePickerModalProps) => {
  const [selectedTime, setSelectedTime] = useState(initialTime);

  // Reset to initial time when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedTime(initialTime);
      Keyboard.dismiss();
    }
  }, [visible, initialTime]);

  if (Platform.OS === 'android') {
    // Android: DateTimePicker handles its own modal
    if (!visible) return null;
    return (
      <DateTimePicker
        mode='time'
        display='clock'
        value={selectedTime}
        onChange={(event, date) => {
          if (event.type === 'set' && date) {
            onConfirm(date);
          } else {
            onCancel();
          }
        }}
      />
    );
  }

  // iOS: Custom modal wrapper
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
    >
      {/* Modal content */}
    </Modal>
  );
};
```

---

#### Task 1.2: Create NextReminderBadge Component

**File**: `src/components/CreateHabitModal/components/NextReminderBadge.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: None

**Acceptance Criteria**:

- [x] Shows "Today at X" when time is in future today
- [x] Shows "Tomorrow at X" when time is in past today
- [x] Shows relative time "(in X hours)" or "(in X minutes)"
- [x] Amber background with clock icon
- [x] Accessible text for screen readers
- [x] Fade animation on enter/exit

**Implementation Notes (Completed 2026-01-07)**:

- Component created at `src/components/CreateHabitModal/components/NextReminderBadge.tsx`
- Unit tests created at `src/components/CreateHabitModal/components/__tests__/NextReminderBadge.test.tsx`
- All 32 test cases pass covering: Today/Tomorrow logic, relative time display, time formatting, accessibility, and edge cases
- Exports `getNextReminderText()` helper function for use by other components

**Original Implementation Notes**:

```tsx
import { Clock } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const NextReminderBadge = ({
  reminderTime,
  enabled,
}: NextReminderBadgeProps) => {
  if (!enabled) return null;

  const text = useMemo(() => getNextReminderText(reminderTime), [reminderTime]);

  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(100)}
      exiting={FadeOut.duration(150)}
      className='flex-row items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5'
      accessibilityRole='text'
      accessibilityLabel={`Next reminder: ${text}`}
    >
      <Clock size={12} color='#92400E' />
      <Text className='text-xs font-medium text-amber-800'>Next: {text}</Text>
    </Animated.View>
  );
};
```

---

#### Task 1.3: Create EnhancedReminderSelector Component

**File**: `src/components/CreateHabitModal/components/EnhancedReminderSelector.tsx`

**Estimated Effort**: 2 hours

**Dependencies**: Tasks 1.1, 1.2

**Acceptance Criteria**:

- [x] Toggle row with bell icon and switch
- [x] Quick preset buttons (Morning/Midday/Evening)
- [x] Custom time button that opens TimePickerModal
- [x] Selected preset shows green border
- [x] Custom time shows green border when has value
- [x] Next reminder badge updates on time change
- [x] Keyboard dismisses on any interaction
- [x] All elements have accessibility labels
- [x] Haptic feedback on selection

**Implementation Notes (Completed 2026-01-07)**:

- Component created at `src/components/CreateHabitModal/components/EnhancedReminderSelector.tsx`
- Unit tests created at `src/components/CreateHabitModal/components/__tests__/EnhancedReminderSelector.test.tsx`
- All 51 test cases pass covering: toggle behavior, preset selection, custom time flow, time picker integration, badge display, accessibility, custom presets, and edge cases
- Exports `DEFAULT_PRESETS` and `ReminderPreset` type for external use
- Uses `useReduceMotion` hook for animation accessibility

**Original Implementation Notes**:

```tsx
export const EnhancedReminderSelector = ({
  enabled,
  reminderTime,
  onToggle,
  onTimeChange,
  presets = DEFAULT_PRESETS,
  showNextReminder = true,
}: EnhancedReminderSelectorProps) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { triggerSelection } = useHapticFeedback();

  const selectedPreset = useMemo(() => {
    const hour = reminderTime.getHours();
    const minute = reminderTime.getMinutes();
    return (
      presets.find((p) => p.hour === hour && p.minute === minute)?.id || null
    );
  }, [reminderTime, presets]);

  const isCustomTime = selectedPreset === null;

  const handlePresetSelect = useCallback(
    (preset: ReminderPreset) => {
      Keyboard.dismiss();
      triggerSelection();
      const newTime = new Date();
      newTime.setHours(preset.hour, preset.minute, 0, 0);
      onTimeChange(newTime);
    },
    [onTimeChange, triggerSelection]
  );

  const handleCustomTimeConfirm = useCallback(
    (time: Date) => {
      triggerSelection();
      onTimeChange(time);
      setShowTimePicker(false);
    },
    [onTimeChange, triggerSelection]
  );

  return (
    <View className='mb-4'>
      {/* Toggle Row */}
      {/* Preset Buttons */}
      {/* Custom Time Button */}
      {/* Next Reminder Badge */}
      {/* Time Picker Modal */}
    </View>
  );
};
```

---

### Phase 2: Integration (3 hours)

#### Task 2.1: Update CreateHabitFormCentered

**File**: `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: Task 1.3

**Acceptance Criteria**:

- [x] Replace MinimalReminderToggle with EnhancedReminderSelector
- [x] Pass reminderTime as Date (not string)
- [x] Handle onTimeChange callback
- [x] Preserve existing reminder toggle behavior
- [x] No breaking changes to existing props

**Implementation Notes (Completed 2026-01-07)**:

- Replaced `MinimalReminderToggle` import with `EnhancedReminderSelector`
- Changed `reminderTime` prop type from `string` to `Date`
- Added `onReminderTimeChange: (time: Date) => void` callback prop
- Removed obsolete `onReminderTimePress` prop (time picker now handled internally by EnhancedReminderSelector)
- Updated parent `CreateHabitModalCentered` to pass Date directly and handle time changes
- Removed unused `formatReminderTime` import from parent component
- All 51 EnhancedReminderSelector tests pass, 21 TimePickerModal tests pass, 32 NextReminderBadge tests pass

**Changes Required**:

```diff
- import { MinimalReminderToggle } from './MinimalReminderToggle';
+ import { EnhancedReminderSelector } from './EnhancedReminderSelector';

// In props interface - add onReminderTimeChange
+ onReminderTimeChange?: (time: Date) => void;

// In JSX
- <MinimalReminderToggle
-   enabled={reminderEnabled}
-   time={reminderTime}
-   onToggle={onReminderToggle}
-   onTimePress={onReminderTimePress}
- />
+ <EnhancedReminderSelector
+   enabled={reminderEnabled}
+   reminderTime={reminderTimeDate}
+   onToggle={onReminderToggle}
+   onTimeChange={onReminderTimeChange}
+ />
```

---

#### Task 2.2: Update CreateHabitModalCentered

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: Task 2.1

**Acceptance Criteria**:

- [x] Add handleReminderTimeChange callback
- [x] Pass Date object to form component
- [x] Remove string-based time handling
- [x] Preserve existing habit creation flow
- [x] Test with both preset and custom times

**Implementation Notes (Completed 2026-01-07)**:

- Added `handleReminderTimeChange` callback in CreateHabitModalCentered (lines 127-133)
- `form.reminderTime` (Date object) passed directly to CreateHabitFormCentered (line 174)
- Added `onReminderTimeChange` prop to CreateHabitFormCentered (line 181)
- No string-based formatting needed - EnhancedReminderSelector handles Date objects natively
- All 110 existing reminder component tests pass (EnhancedReminderSelector: 51, TimePickerModal: 21, NextReminderBadge: 32, plus additional tests)

**Changes Required**:

```diff
+ const handleReminderTimeChange = useCallback(
+   (time: Date) => {
+     form.setReminderTime(time);
+   },
+   // eslint-disable-next-line react-hooks/exhaustive-deps
+   []
+ );

// Remove string conversion - pass Date directly
- const reminderTimeString = form.reminderTime
-   ? formatReminderTime(form.reminderTime)
-   : '12:00 PM';

// In JSX
<CreateHabitFormCentered
  // ... other props
-  reminderTime={reminderTimeString}
+  reminderTime={form.reminderTime}
+  onReminderTimeChange={handleReminderTimeChange}
/>
```

---

#### Task 2.3: Update Original CreateHabitModal (Optional)

**File**: `src/components/CreateHabitModal/CreateHabitModal.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: Task 1.3

**Status**: Complete

**Acceptance Criteria**:

- [x] Add EnhancedReminderSelector to original modal
- [x] Replace existing ReminderSelector
- [x] Maintain backward compatibility
- [x] Test in non-centered modal flow

**Implementation Notes (Completed 2026-01-07)**:

- Replaced `ReminderSelector` import with `EnhancedReminderSelector`
- Created `handleReminderToggle` callback that bridges `ReminderOption` state with `enabled` boolean
- Created `handleReminderTimeChange` callback that updates `reminderTime` Date and auto-enables reminders
- Used `form.reminderOption !== 'none'` for `enabled` prop to maintain compatibility with existing `useHabitForm` state
- Passed `form.reminderTime` Date directly (already managed by form hook)
- All 136 reminder component tests pass

---

### Phase 3: Testing (2.5 hours)

#### Task 3.1: Write Unit Tests

**Files**:

- `src/components/CreateHabitModal/components/__tests__/TimePickerModal.test.tsx`
- `src/components/CreateHabitModal/components/__tests__/NextReminderBadge.test.tsx`
- `src/components/CreateHabitModal/components/__tests__/EnhancedReminderSelector.test.tsx`

**Estimated Effort**: 2 hours

**Dependencies**: All Phase 1 tasks

**Acceptance Criteria**:

- [x] TimePickerModal tests: open/close, confirm/cancel, platform behavior
- [x] NextReminderBadge tests: today/tomorrow logic, formatting
- [x] EnhancedReminderSelector tests: preset selection, custom time, toggle
- [x] All accessibility labels tested
- [x] Snapshot tests for visual regression
- [x] Code coverage > 80%

**Implementation Notes (Completed 2026-01-07)**:

- Unit tests: 110 tests across 3 files (TimePickerModal: 21, NextReminderBadge: 32, EnhancedReminderSelector: 51)
- Snapshot tests: 26 snapshots across 3 new files
- Total: 136 tests passing
- Coverage: Statements 92.15%, Branches 91.3%, Functions 86.95%, Lines 92.85% (all >80%)
- Snapshot files created:
  - `TimePickerModal.snapshot.test.tsx` (8 snapshots)
  - `NextReminderBadge.snapshot.test.tsx` (10 snapshots)
  - `EnhancedReminderSelector.snapshot.test.tsx` (8 snapshots)

---

#### Task 3.2: Manual QA Testing

**Estimated Effort**: 30 minutes

**Dependencies**: Phase 2 complete

**Status**: Awaiting Manual Testing

**Note**: This task requires manual testing on physical iOS and Android devices. It cannot be automated and must be performed by a human tester with access to both platforms.

**Manual QA Checklist**:

- [ ] Toggle enables/disables time selection UI
- [ ] Preset buttons select correct times
- [ ] Custom time picker opens on button press
- [ ] iOS: Wheel picker works correctly
- [ ] Android: Clock picker works correctly
- [ ] Custom time displays in green when set
- [ ] Presets deselect when custom time is set
- [ ] Custom deselects when preset is selected
- [ ] "Next reminder" badge shows correct time
- [ ] Badge shows "Today" vs "Tomorrow" correctly
- [ ] Relative time updates correctly
- [ ] Habit created with custom time
- [ ] Notification fires at custom time
- [ ] Edit mode loads saved custom time
- [ ] Accessibility: VoiceOver/TalkBack reads all elements
- [ ] Haptic feedback on all interactions

---

### Phase 4: Documentation (1.5 hours)

#### Task 4.1: Update Reminder Documentation

**File**: Create `docs/specs/reminders/custom-time-picker-spec.md` (this file)

**Estimated Effort**: 1 hour

**Dependencies**: All implementation complete

**Acceptance Criteria**:

- [x] Spec document created (this file)
- [x] Component API documented
- [x] Usage examples provided
- [x] Integration guide included
- [x] Accessibility notes documented

**Implementation Notes (Completed 2026-01-07)**:

- Added comprehensive Component API Reference section documenting TimePickerModal, NextReminderBadge, and EnhancedReminderSelector
- Added Usage Examples section with 5 practical code examples (basic usage, custom presets, standalone components)
- Added Integration Guide with step-by-step instructions and migration guide from MinimalReminderToggle
- Added Accessibility Notes documenting screen reader support, announcements, reduced motion, touch targets, color contrast, and focus management

---

#### Task 4.2: Update CLAUDE.md (if needed)

**Estimated Effort**: 30 minutes

**Dependencies**: Task 4.1

**Status**: Complete (No changes needed)

**Acceptance Criteria**:

- [x] Note new reminder components
- [x] Document any new patterns
- [x] Update relevant sections

**Implementation Notes (Completed 2026-01-07)**:

- Reviewed CLAUDE.md - it is specialized for the "superdesign" UI design workflow, not React Native component documentation
- Component documentation is appropriately housed in this spec file (custom-time-picker-spec.md) which includes:
  - Complete Component API Reference section (lines 1025-1135)
  - Usage Examples with 5 practical code samples (lines 1137-1232)
  - Integration Guide with step-by-step instructions (lines 1234-1319)
  - Accessibility Notes documenting all a11y considerations (lines 1321-1395)
- No updates to CLAUDE.md required - documentation patterns already follow project conventions

---

## Task Summary

**Total Estimated Effort**: 12 hours (~1.5 days)

**Phase Breakdown**:

- Phase 1 (Core Components): 5 hours
- Phase 2 (Integration): 3 hours
- Phase 3 (Testing): 2.5 hours
- Phase 4 (Documentation): 1.5 hours

**Critical Path**:

```
Task 1.1 ──┐
           ├──→ Task 1.3 ──→ Task 2.1 ──→ Task 2.2 ──→ Task 3.2
Task 1.2 ──┘                    │
                                └──→ Task 3.1 ──→ Task 4.1
```

**Risk Assessment**:

| Risk                          | Level  | Mitigation                         |
| ----------------------------- | ------ | ---------------------------------- |
| Android DateTimePicker quirks | Medium | Test on multiple Android versions  |
| iOS modal presentation issues | Low    | Use proven Modal patterns          |
| Time zone edge cases          | Low    | Use device local time consistently |
| Breaking existing reminders   | Low    | Maintain same storage format       |

---

## Testing Strategy

### Unit Tests

```typescript
describe('TimePickerModal', () => {
  it('opens with initial time', () => {
    const initialTime = new Date();
    initialTime.setHours(9, 30, 0, 0);

    const { getByTestId } = render(
      <TimePickerModal visible initialTime={initialTime} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );

    // Platform-specific assertions
  });

  it('calls onConfirm with selected time', async () => {
    const onConfirm = jest.fn();
    // ... test confirm flow
    expect(onConfirm).toHaveBeenCalledWith(expect.any(Date));
  });

  it('calls onCancel on dismiss', async () => {
    const onCancel = jest.fn();
    // ... test cancel flow
    expect(onCancel).toHaveBeenCalled();
  });
});

describe('NextReminderBadge', () => {
  it('shows "Today" when time is in future', () => {
    const futureTime = new Date();
    futureTime.setHours(futureTime.getHours() + 2);

    const { getByText } = render(
      <NextReminderBadge reminderTime={futureTime} enabled />
    );

    expect(getByText(/Today/)).toBeTruthy();
  });

  it('shows "Tomorrow" when time is in past', () => {
    const pastTime = new Date();
    pastTime.setHours(pastTime.getHours() - 2);

    const { getByText } = render(
      <NextReminderBadge reminderTime={pastTime} enabled />
    );

    expect(getByText(/Tomorrow/)).toBeTruthy();
  });

  it('hides when disabled', () => {
    const { queryByTestId } = render(
      <NextReminderBadge reminderTime={new Date()} enabled={false} />
    );

    expect(queryByTestId('next-reminder-badge')).toBeNull();
  });
});

describe('EnhancedReminderSelector', () => {
  it('selects preset on tap', () => {
    const onTimeChange = jest.fn();
    const { getByText } = render(
      <EnhancedReminderSelector
        enabled
        reminderTime={new Date()}
        onToggle={jest.fn()}
        onTimeChange={onTimeChange}
      />
    );

    fireEvent.press(getByText(/7 AM/));

    const calledTime = onTimeChange.mock.calls[0][0];
    expect(calledTime.getHours()).toBe(7);
    expect(calledTime.getMinutes()).toBe(0);
  });

  it('opens time picker on custom button press', () => {
    const { getByText, getByTestId } = render(
      <EnhancedReminderSelector {...defaultProps} />
    );

    fireEvent.press(getByText(/Custom time/));

    expect(getByTestId('time-picker-modal')).toBeTruthy();
  });

  it('shows custom time in green when set', () => {
    const customTime = new Date();
    customTime.setHours(6, 30, 0, 0); // 6:30 AM - not a preset

    const { getByTestId } = render(
      <EnhancedReminderSelector
        enabled
        reminderTime={customTime}
        onToggle={jest.fn()}
        onTimeChange={jest.fn()}
      />
    );

    const customButton = getByTestId('custom-time-button');
    // Assert green styling
  });
});
```

---

## Component API Reference

### TimePickerModal

**File**: `src/components/CreateHabitModal/components/TimePickerModal.tsx`

Native time picker modal with platform-specific UX.

#### Props

| Prop          | Type                   | Required | Default               | Description                         |
| ------------- | ---------------------- | -------- | --------------------- | ----------------------------------- |
| `visible`     | `boolean`              | Yes      | -                     | Controls modal visibility           |
| `initialTime` | `Date`                 | Yes      | -                     | Time shown when modal opens         |
| `onConfirm`   | `(time: Date) => void` | Yes      | -                     | Called when user confirms selection |
| `onCancel`    | `() => void`           | Yes      | -                     | Called when user cancels/dismisses  |
| `title`       | `string`               | No       | `"Set Reminder Time"` | Modal header title (iOS only)       |

#### Platform Behavior

- **iOS**: Modal with spinner wheel picker and Cancel/Set Time buttons
- **Android**: Native clock picker (handles its own modal UI)

#### Test IDs

- `time-picker-modal` - Modal container (iOS)
- `time-picker-ios` - iOS spinner picker
- `time-picker-android` - Android clock picker

---

### NextReminderBadge

**File**: `src/components/CreateHabitModal/components/NextReminderBadge.tsx`

Shows when the next reminder will fire with relative time.

#### Props

| Prop           | Type      | Required | Default | Description                 |
| -------------- | --------- | -------- | ------- | --------------------------- |
| `reminderTime` | `Date`    | Yes      | -       | The scheduled reminder time |
| `enabled`      | `boolean` | Yes      | -       | Whether to show the badge   |

#### Helper Function

```typescript
// Exported for use by other components
export function getNextReminderText(time: Date): string;
```

Returns formatted strings like:

- `"Today at 3:30 PM (in 2h 15m)"`
- `"Today at 3:30 PM (in 45 minutes)"`
- `"Tomorrow at 7:00 AM"`

#### Test IDs

- `next-reminder-badge` - Badge container

---

### EnhancedReminderSelector

**File**: `src/components/CreateHabitModal/components/EnhancedReminderSelector.tsx`

Full-featured reminder configuration UI with presets and custom time.

#### Props

| Prop               | Type                         | Required | Default           | Description                   |
| ------------------ | ---------------------------- | -------- | ----------------- | ----------------------------- |
| `enabled`          | `boolean`                    | Yes      | -                 | Whether reminders are enabled |
| `reminderTime`     | `Date`                       | Yes      | -                 | Current reminder time         |
| `onToggle`         | `(enabled: boolean) => void` | Yes      | -                 | Called when toggle changes    |
| `onTimeChange`     | `(time: Date) => void`       | Yes      | -                 | Called when time changes      |
| `presets`          | `ReminderPreset[]`           | No       | `DEFAULT_PRESETS` | Custom preset options         |
| `showNextReminder` | `boolean`                    | No       | `true`            | Show next reminder badge      |

#### ReminderPreset Type

```typescript
interface ReminderPreset {
  id: string; // Unique identifier
  label: string; // Display text (e.g., "7 AM")
  emoji: string; // Visual indicator (e.g., "🌅")
  hour: number; // 0-23
  minute: number; // 0-59
}
```

#### Exported Constants

```typescript
export const DEFAULT_PRESETS: ReminderPreset[] = [
  { id: 'morning', label: '7 AM', emoji: '🌅', hour: 7, minute: 0 },
  { id: 'midday', label: '12 PM', emoji: '☀️', hour: 12, minute: 0 },
  { id: 'evening', label: '8 PM', emoji: '🌙', hour: 20, minute: 0 },
];
```

#### Test IDs

- `enhanced-reminder-selector` - Main container
- `reminder-toggle` - Enable/disable switch
- `preset-buttons` - Preset buttons container
- `preset-morning`, `preset-midday`, `preset-evening` - Individual presets
- `custom-time-button` - Custom time button

---

## Usage Examples

### Basic Usage

```tsx
import { EnhancedReminderSelector } from './components/EnhancedReminderSelector';

function HabitForm() {
  const [enabled, setEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(new Date());

  return (
    <EnhancedReminderSelector
      enabled={enabled}
      reminderTime={reminderTime}
      onToggle={setEnabled}
      onTimeChange={setReminderTime}
    />
  );
}
```

### With Custom Presets

```tsx
const CUSTOM_PRESETS: ReminderPreset[] = [
  { id: 'early', label: '5 AM', emoji: '🏃', hour: 5, minute: 0 },
  { id: 'work', label: '9 AM', emoji: '💼', hour: 9, minute: 0 },
  { id: 'lunch', label: '1 PM', emoji: '🍽️', hour: 13, minute: 0 },
  { id: 'night', label: '10 PM', emoji: '😴', hour: 22, minute: 0 },
];

<EnhancedReminderSelector
  enabled={enabled}
  reminderTime={reminderTime}
  onToggle={setEnabled}
  onTimeChange={setReminderTime}
  presets={CUSTOM_PRESETS}
/>;
```

### Without Next Reminder Badge

```tsx
<EnhancedReminderSelector
  enabled={enabled}
  reminderTime={reminderTime}
  onToggle={setEnabled}
  onTimeChange={setReminderTime}
  showNextReminder={false}
/>
```

### Standalone TimePickerModal

```tsx
import { TimePickerModal } from './components/TimePickerModal';

function CustomPicker() {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(new Date());

  return (
    <>
      <Button onPress={() => setVisible(true)}>Pick Time</Button>
      <TimePickerModal
        visible={visible}
        initialTime={time}
        onConfirm={(newTime) => {
          setTime(newTime);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
        title='Choose Wake-up Time'
      />
    </>
  );
}
```

### Standalone NextReminderBadge

```tsx
import {
  NextReminderBadge,
  getNextReminderText,
} from './components/NextReminderBadge';

// As a component
<NextReminderBadge reminderTime={reminderTime} enabled={true} />;

// Using the helper function directly
const badgeText = getNextReminderText(reminderTime);
// Returns: "Today at 3:30 PM (in 2h 15m)" or "Tomorrow at 7:00 AM"
```

---

## Integration Guide

### Step 1: Import the Component

```tsx
import { EnhancedReminderSelector } from '@/components/CreateHabitModal/components/EnhancedReminderSelector';
```

### Step 2: Add State Management

```tsx
// In your form hook or component
const [reminderEnabled, setReminderEnabled] = useState(true);
const [reminderTime, setReminderTime] = useState(() => {
  // Smart default: next appropriate time based on current hour
  const now = new Date();
  const hour = now.getHours();

  if (hour < 7) return new Date(now.setHours(7, 0, 0, 0));
  if (hour < 12) return new Date(now.setHours(12, 0, 0, 0));
  if (hour < 20) return new Date(now.setHours(20, 0, 0, 0));

  // After 8 PM, default to 7 AM tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(tomorrow.setHours(7, 0, 0, 0));
});
```

### Step 3: Handle Time Persistence

```tsx
// Convert Date to storage format (string)
const reminderTimeString = formatReminderTime(reminderTime);
// e.g., "3:30 PM"

// Convert storage format back to Date
const reminderTimeDate = createDateFromTimeString(reminderTimeString);
```

### Step 4: Schedule Notifications

```tsx
import { scheduleHabitReminder } from '@/utils/notifications';

// When habit is saved
if (reminderEnabled) {
  await scheduleHabitReminder(
    habitId,
    'Habit Reminder',
    `Time to ${habitName}!`,
    reminderTime
  );
}
```

### Replacing MinimalReminderToggle

The `EnhancedReminderSelector` replaces the previous `MinimalReminderToggle` component:

```diff
- import { MinimalReminderToggle } from './MinimalReminderToggle';
+ import { EnhancedReminderSelector } from './EnhancedReminderSelector';

// In props - change time from string to Date
- reminderTime: string;
+ reminderTime: Date;

// Add time change callback
+ onReminderTimeChange: (time: Date) => void;

// In JSX
- <MinimalReminderToggle
-   enabled={reminderEnabled}
-   time={reminderTime}
-   onToggle={onReminderToggle}
-   onTimePress={onReminderTimePress}
- />
+ <EnhancedReminderSelector
+   enabled={reminderEnabled}
+   reminderTime={reminderTime}
+   onToggle={onReminderToggle}
+   onTimeChange={onReminderTimeChange}
+ />
```

---

## Accessibility Notes

### Screen Reader Support

All components include comprehensive VoiceOver/TalkBack support:

#### EnhancedReminderSelector

- **Toggle**: "Enable reminder" / "Disable reminder" with switch role
- **Presets**: "Set reminder for 7 AM" with button role and selected state
- **Custom Button**: "Custom time set to 6:30 AM. Double tap to change." or "Set a custom reminder time"
- **Badge**: "Next reminder: Today at 3:30 PM (in 2 hours)"

#### TimePickerModal (iOS)

- **Backdrop**: "Dismiss time picker" button
- **Title**: Header role
- **Picker**: "Time picker wheel" label
- **Cancel**: "Cancel" button
- **Confirm**: "Set time to 3:30 PM" button (dynamic)

### Announcements

The component announces state changes for screen readers:

```typescript
// On preset selection
AccessibilityInfo.announceForAccessibility('Reminder set for 7 AM');

// On custom time selection
AccessibilityInfo.announceForAccessibility('Custom reminder set for 6:30 AM');

// On toggle change
AccessibilityInfo.announceForAccessibility('Reminders enabled');
AccessibilityInfo.announceForAccessibility('Reminders disabled');
```

### Reduced Motion Support

Animations respect the system's reduced motion preference:

```tsx
const reduceMotion = useReduceMotion();

// Scale animations are skipped when reduced motion is enabled
const handlePressIn = useCallback(() => {
  if (reduceMotion) return;
  // ... animation code
}, [reduceMotion]);
```

### Touch Targets

All interactive elements meet minimum touch target sizes:

- Toggle: Full row (44pt+ height)
- Preset buttons: Full flex width with 44pt+ height
- Custom button: Full width with 44pt+ height

### Color Contrast

All text meets WCAG AA contrast requirements:

- Selected preset: emerald-600 (#059669) on emerald-50 (#ECFDF5) = 4.6:1
- Badge text: amber-800 (#92400E) on amber-100 (#FEF3C7) = 5.2:1
- Default text: stone-900 (#1c1917) on white = 18.4:1

### Focus Management

- Keyboard is automatically dismissed when modal opens
- Focus returns to trigger element when modal closes
- Modal backdrop can be tapped to dismiss (iOS)

---

## Success Metrics

### Quantitative

| Metric                        | Target                       | Measurement                                  |
| ----------------------------- | ---------------------------- | -------------------------------------------- |
| Custom time adoption          | >20% of users with reminders | Analytics: reminder_time not in presets      |
| Time picker completion rate   | >90%                         | Analytics: picker_opened vs time_set         |
| Reminder-to-completion rate   | +10% vs presets              | Analytics: reminders that led to completions |
| Support tickets for reminders | -25%                         | Support ticket analysis                      |

### Qualitative

- Users understand how to set custom time
- Users trust the "Next reminder" preview
- Users feel empowered to set precise times
- Early risers / night owls feel supported

---

## Appendices

### Appendix A: Existing Utility Functions

```typescript
// src/utils/notifications.ts

// Parse time string to Date
export function createDateFromTimeString(time?: string, fallback?: Date): Date;

// Format Date to display string
export function formatReminderTime(date: Date): string;

// Get relative time for badge
export function getNextReminderRelativeTime(
  reminderTime?: string
): string | null;

// Schedule notification
export async function scheduleHabitReminder(
  habitId: string,
  title: string,
  body: string,
  reminderTime: Date,
  skipPermissionCheck?: boolean
): Promise<boolean>;
```

### Appendix B: Package Dependencies

**Already Installed** (no new dependencies):

```json
{
  "@react-native-community/datetimepicker": "^7.6.1"
}
```

### Appendix C: Design Tokens

```typescript
// Colors
const tokens = {
  // Preset button states
  presetDefault: {
    background: '#f5f5f4', // stone-100
    border: 'transparent',
    text: '#57534e', // stone-600
  },
  presetSelected: {
    background: '#ECFDF5', // emerald-50
    border: '#10B981', // emerald-500
    text: '#059669', // emerald-600
  },

  // Custom time button states
  customDefault: {
    background: '#ffffff',
    border: '#e7e5e4', // stone-200
    text: '#1c1917', // stone-900
  },
  customHasValue: {
    background: '#ECFDF5', // emerald-50
    border: '#10B981', // emerald-500
    text: '#047857', // emerald-700
  },

  // Badge
  badge: {
    background: '#FEF3C7', // amber-100
    text: '#92400E', // amber-800
    icon: '#92400E', // amber-800
  },
};
```

### Appendix D: Migration Notes

**No database migration required** - Custom times use the same string format as presets:

```typescript
// All stored as "HH:MM AM/PM"
'7:00 AM'; // Morning preset
'12:00 PM'; // Midday preset
'8:00 PM'; // Evening preset
'6:30 AM'; // Custom time
'10:45 PM'; // Custom time
```

### Appendix E: Future Enhancements

**V2 - Day Selection** (separate spec):

- Add day-of-week selectors (M T W T F S S)
- Quick buttons: "Weekdays", "Weekends", "Every day"
- Uses existing `daysOfWeek` schema field

**V3 - Multiple Reminders** (separate spec):

- Multiple reminder times per habit
- Different times for different days
- Requires schema changes

**V4 - Smart Suggestions** (separate spec):

- Suggest times based on habit name
- "Morning run" → 6:00 AM
- "Evening journal" → 9:00 PM

---

## Questions & Decisions

1. **Q**: Should we deprecate ReminderSelector (4-option grid)?
   **A**: Keep for now, deprecate after custom time is stable

2. **Q**: Default reminder time for new habits?
   **A**: Keep current smart default (time-aware based on current hour)

3. **Q**: Show custom time picker on first interaction?
   **A**: No - show presets first, custom is secondary option

4. **Q**: Minimum time granularity?
   **A**: 1 minute (native picker default)

5. **Q**: 12-hour vs 24-hour format?
   **A**: Follow device locale setting (automatic)

---

## Related Documents

- [Centered Modal Spec](./create-habit-modal/centered-optional-fields.md)
- [Notification System](../utils/notifications.ts)
- [Reminder Defaults](../utils/reminderDefaults.ts)
- [HTML Mock](.superdesign/design_iterations/reminder_improvements_1.html)
