# Create Habit Modal - Integration Guide

## Overview

This guide covers how to integrate the Create Habit Modal components into your application. The modal supports two layout variants:

1. **Original Layout** - Multi-step wizard-style creation flow
2. **Centered Layout** - Streamlined single-page creation with centered name input (NEW)

Both variants share the same props interface and can be easily swapped via feature flag.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Integration Options](#integration-options)
- [Props Interface](#props-interface)
- [Feature Flag Configuration](#feature-flag-configuration)
- [State Management](#state-management)
- [Examples](#examples)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Basic Integration

```typescript
import CreateHabitModal from '@/components/CreateHabitModal';

function MyScreen() {
  const [visible, setVisible] = useState(false);

  const handleCreate = (habit: HabitFormData) => {
    // Save the habit to your data store
    console.log('Creating habit:', habit);
    setVisible(false);
  };

  return (
    <>
      <Button title="Create Habit" onPress={() => setVisible(true)} />

      <CreateHabitModal
        visible={visible}
        onClose={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
```

### Using the Centered Layout

```typescript
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';

function MyScreen() {
  const [visible, setVisible] = useState(false);

  const handleCreate = (habit: HabitFormData) => {
    // Save the habit to your data store
    console.log('Creating habit:', habit);
    setVisible(false);
  };

  return (
    <>
      <Button title="Create Habit" onPress={() => setVisible(true)} />

      <CreateHabitModalCentered
        visible={visible}
        onClose={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
```

---

## Integration Options

### Option 1: Direct Import (Recommended for New Projects)

Replace the existing modal with the centered version:

```typescript
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';

<CreateHabitModalCentered
  visible={isCreateModalVisible}
  onClose={() => setIsCreateModalVisible(false)}
  onCreate={handleCreateHabit}
/>
```

**Pros:**
- Simpler code
- No conditional logic
- Clear intent

**Cons:**
- No easy rollback
- Requires code changes to switch back

### Option 2: Feature Flag (Recommended for Gradual Rollout)

Use a feature flag to toggle between layouts:

```typescript
import CreateHabitModal from '@/components/CreateHabitModal';
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';

const USE_CENTERED_LAYOUT = true; // or from config/feature flags

function MyScreen() {
  const ModalComponent = USE_CENTERED_LAYOUT
    ? CreateHabitModalCentered
    : CreateHabitModal;

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      onCreate={onCreate}
    />
  );
}
```

**Pros:**
- Easy A/B testing
- Quick rollback if needed
- Gradual user migration

**Cons:**
- Slightly more complex code
- Both implementations in bundle

### Option 3: Environment-Based Configuration

Use environment variables for different builds:

```typescript
// config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_CREATION: process.env.EXPO_PUBLIC_USE_CENTERED_MODAL === 'true',
} as const;

// Usage
import { FEATURE_FLAGS } from '@/config/featureFlags';

const ModalComponent = FEATURE_FLAGS.USE_CENTERED_HABIT_CREATION
  ? CreateHabitModalCentered
  : CreateHabitModal;
```

**Pros:**
- Environment-specific behavior
- No code changes between environments
- Testable in different modes

**Cons:**
- Requires build for changes
- Less dynamic than runtime flags

---

## Props Interface

Both modal variants share the same `CreateHabitModalProps` interface:

```typescript
export interface CreateHabitModalProps {
  // Visibility control
  visible: boolean;
  onClose: () => void;

  // Habit creation callback
  onCreate: (habit: HabitFormData) => void;

  // Edit mode (optional)
  habit?: Habit;
  habitId?: string;
  onSave?: (habit: HabitFormData) => void;
}
```

### Habit Form Data Type

The `onCreate` callback receives a `HabitFormData` object:

```typescript
interface HabitFormData {
  name: string;              // Habit name (2-50 characters)
  emoji: string | null;      // Selected emoji or null (auto-assigned)
  color: string;             // Hex color code
  dayPhase: DayPhase;        // 'morning' | 'afternoon' | 'evening'
  reminderTime: Date;        // Reminder time
  remindersEnabled: boolean; // Whether reminders are enabled
  frequency: number[];       // Array of day indices (0-6 for Sun-Sat)
}
```

---

## Feature Flag Configuration

### File-Based Configuration

Create a feature flags file:

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_CREATION: false, // Default to original
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
```

Update as needed:

```typescript
// src/features/habits/components/HabitsModals.tsx
import { FEATURE_FLAGS } from '@/config/featureFlags';

const USE_CENTERED_MODAL = FEATURE_FLAGS.USE_CENTERED_HABIT_CREATION;
```

### Remote Configuration (Advanced)

For dynamic toggling without app updates:

```typescript
// hooks/useFeatureFlags.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useFeatureFlag(flagName: string, defaultValue: boolean = false) {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    async function loadFlag() {
      try {
        const value = await AsyncStorage.getItem(`feature_${flagName}`);
        if (value !== null) {
          setEnabled(value === 'true');
        }
      } catch (error) {
        console.error('Failed to load feature flag:', error);
      }
    }
    loadFlag();
  }, [flagName]);

  return enabled;
}

// Usage
const useCenteredModal = useFeatureFlag('centered_habit_creation', false);
```

---

## State Management

### Using the useCreateHabitModal Hook

The centered modal uses the `useCreateHabitModal` hook internally for state management:

```typescript
const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
```

This hook provides:
- `isEditMode`: Boolean indicating edit vs create mode
- `form`: Form state management from `useHabitForm` hook
- `handleCreate`: Callback that applies smart defaults and calls onCreate

### Custom State Management

For advanced use cases, you can manage state directly:

```typescript
import { useHabitForm } from '@/components/CreateHabitModal/hooks/useHabitForm';

function MyCustomModal() {
  const form = useHabitForm();

  const handleSubmit = () => {
    const habitData: HabitFormData = {
      name: form.habitName,
      emoji: form.selectedEmoji,
      color: form.selectedColor,
      dayPhase: form.dayPhase,
      reminderTime: form.reminderTime,
      remindersEnabled: form.remindersEnabled,
      frequency: form.frequency,
    };

    onCreate(habitData);
  };

  return (
    <CreateHabitFormCentered
      habitName={form.habitName}
      onHabitNameChange={form.setHabitName}
      selectedEmoji={form.selectedEmoji}
      onEmojiSelect={form.setSelectedEmoji}
      // ... other props
      onSubmit={handleSubmit}
    />
  );
}
```

---

## Examples

### Example 1: Basic Create Flow

```typescript
import { useState } from 'react';
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';
import type { HabitFormData } from '@/components/CreateHabitModal/types';

export function HabitsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateHabit = (habit: HabitFormData) => {
    console.log('Creating habit:', habit);
    // Add habit to your data store
    // ...
    setModalVisible(false);
  };

  return (
    <View>
      <Button title="Add Habit" onPress={() => setModalVisible(true)} />

      <CreateHabitModalCentered
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateHabit}
      />
    </View>
  );
}
```

### Example 2: Edit Mode

```typescript
const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

const handleEditHabit = (habit: Habit) => {
  setEditingHabit(habit);
};

const handleSaveHabit = (updatedData: HabitFormData) => {
  // Update habit in your data store
  updateHabit(editingHabit.id, updatedData);
  setEditingHabit(null);
};

<CreateHabitModalCentered
  visible={editingHabit !== null}
  onClose={() => setEditingHabit(null)}
  onCreate={handleSaveHabit}
  habit={editingHabit}
  habitId={editingHabit?.id}
  onSave={handleSaveHabit}
/>
```

### Example 3: With Feature Flag and Analytics

```typescript
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { trackEvent } from '@/utils/analytics';

function HabitsModals() {
  const ModalComponent = FEATURE_FLAGS.USE_CENTERED_HABIT_CREATION
    ? CreateHabitModalCentered
    : CreateHabitModal;

  const handleCreate = (habit: HabitFormData) => {
    // Track which layout was used
    trackEvent('habit_created', {
      layout: FEATURE_FLAGS.USE_CENTERED_HABIT_CREATION ? 'centered' : 'original',
      customized: habit.emoji !== null || habit.remindersEnabled,
    });

    // Save habit
    createHabit(habit);
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      onCreate={handleCreate}
    />
  );
}
```

---

## Migration Guide

### From Original Modal to Centered Layout

**Step 1: Update Import**

```diff
- import CreateHabitModal from '@/components/CreateHabitModal';
+ import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';
```

**Step 2: Update Component Usage**

```diff
- <CreateHabitModal
+ <CreateHabitModalCentered
    visible={visible}
    onClose={onClose}
    onCreate={onCreate}
  />
```

**Step 3: Test the Integration**

- Verify modal opens and closes correctly
- Test habit creation with minimal input (name only)
- Test habit creation with full customization
- Verify keyboard handling works on iOS and Android
- Test swipe-to-dismiss gesture
- Check accessibility with screen reader

**Step 4: Update Tests**

```typescript
// Update test imports
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';

// Test centered layout specific features
it('displays centered heading', () => {
  const { getByText } = render(<CreateHabitModalCentered {...props} />);
  expect(getByText(/What habit do you/i)).toBeTruthy();
});

it('supports swipe-to-dismiss', () => {
  const { getByTestId } = render(<CreateHabitModalCentered {...props} />);
  const gestureDetector = getByTestId('swipe-gesture');
  expect(gestureDetector).toBeTruthy();
});
```

### Gradual Migration with A/B Testing

```typescript
// 1. Add user segmentation
const userId = getCurrentUserId();
const isInCenteredGroup = userId % 2 === 0; // 50/50 split

// 2. Track which version users see
useEffect(() => {
  if (visible) {
    trackEvent('modal_shown', {
      variant: isInCenteredGroup ? 'centered' : 'original',
    });
  }
}, [visible, isInCenteredGroup]);

// 3. Render appropriate version
const ModalComponent = isInCenteredGroup
  ? CreateHabitModalCentered
  : CreateHabitModal;

return (
  <ModalComponent
    visible={visible}
    onClose={onClose}
    onCreate={(habit) => {
      trackEvent('habit_created', {
        variant: isInCenteredGroup ? 'centered' : 'original',
      });
      onCreate(habit);
    }}
  />
);
```

---

## Troubleshooting

### Modal Not Opening

**Issue**: Modal doesn't appear when `visible` is set to true.

**Solution**:
1. Verify `visible` prop is actually changing to `true`
2. Check that modal is rendered in the component tree
3. Ensure no parent View has `overflow: hidden` that clips the modal
4. Check z-index or elevation conflicts

```typescript
// Add debug logging
<CreateHabitModalCentered
  visible={visible}
  onClose={() => {
    console.log('Modal closing');
    setVisible(false);
  }}
  onCreate={(habit) => {
    console.log('Habit created:', habit);
    handleCreate(habit);
  }}
/>
```

### Keyboard Covering Input

**Issue**: Keyboard appears over the name input on iOS or Android.

**Solution**: The centered modal includes `KeyboardAvoidingView` internally. If still having issues:

```typescript
// Wrap in additional KeyboardAvoidingView if needed
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <CreateHabitModalCentered {...props} />
</KeyboardAvoidingView>
```

### Swipe Gesture Conflicts with Scrolling

**Issue**: Swipe-to-dismiss interferes with scrolling the form content.

**Solution**: The gesture is configured to only respond to downward swipes starting from the top. If issues persist:

1. Check that ScrollView has `scrollEnabled={true}`
2. Verify no conflicting gesture handlers in parent components
3. Adjust `SWIPE_DISMISS_THRESHOLD` if needed

### Smart Defaults Not Applied

**Issue**: Created habits don't have expected default values.

**Solution**: Smart defaults are applied in the `handleCreate` function. Ensure you're using the `onCreate` callback:

```typescript
// ✅ Correct - uses onCreate callback
<CreateHabitModalCentered
  onCreate={handleCreate}
  // ...
/>

// ❌ Incorrect - bypasses smart defaults
<CreateHabitModalCentered
  onCreate={(habit) => {
    // Custom logic here may skip defaults
    saveHabit(habit);
  }}
/>
```

### TypeScript Errors

**Issue**: Type errors when using the modal.

**Solution**: Ensure you're importing types correctly:

```typescript
import type { CreateHabitModalProps, HabitFormData } from '@/components/CreateHabitModal/types';
```

### Performance Issues

**Issue**: Modal animation is laggy or stuttering.

**Solution**:
1. Ensure `react-native-reanimated` is properly installed
2. Check that animations run on the native thread
3. Verify no heavy computations during render
4. Use React DevTools Profiler to identify bottlenecks

```typescript
// Check reanimated setup
import { useSharedValue } from 'react-native-reanimated';
// Should work without errors
```

---

## Advanced Topics

### Custom Styling

While the centered modal has predefined styles, you can customize colors:

```typescript
// Update color palette
import { HABIT_COLORS } from '@/components/CreateHabitModal/constants';

// Modify in your copy or override
const customColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1',
  // ... your custom colors
];
```

### Analytics Integration

Track user behavior with the centered modal:

```typescript
import { trackEvent } from '@/utils/analytics';

const handleCreate = (habit: HabitFormData) => {
  trackEvent('habit_created', {
    layout: 'centered',
    has_emoji: habit.emoji !== null,
    has_reminder: habit.remindersEnabled,
    name_length: habit.name.length,
  });

  createHabit(habit);
};

// Track modal interactions
const handleEmojiMore = () => {
  trackEvent('emoji_more_clicked');
  // Open emoji picker sheet
};
```

### Testing Strategies

```typescript
// Test file: CreateHabitModalCentered.integration.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('CreateHabitModalCentered Integration', () => {
  it('creates habit with minimal input', async () => {
    const onCreate = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CreateHabitModalCentered visible onCreate={onCreate} onClose={jest.fn()} />
    );

    const input = getByPlaceholderText(/e.g., Read/i);
    fireEvent.changeText(input, 'Read daily');

    const button = getByText('Create Habit');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Read daily',
          emoji: expect.any(String), // Auto-assigned
        })
      );
    });
  });
});
```

---

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review test files for usage examples
- See [QUICK_START.md](./QUICK_START.md) for basic usage
- See [STYLING_GUIDE.md](./STYLING_GUIDE.md) for customization

---

## Changelog

### v11.0 - Centered Layout Release
- ✅ Added `CreateHabitModalCentered` component
- ✅ Implemented swipe-to-dismiss gesture
- ✅ Added "More" label to emoji picker
- ✅ Smart defaults for quick creation
- ✅ Centered heading layout
- ✅ Optional customization section
- ✅ Full accessibility support
- ✅ Comprehensive test coverage
