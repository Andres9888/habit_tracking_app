# Centered Layout Integration Guide - Complete Reference

## 🎯 Overview

This guide covers integration of the **Centered Habit Creation Modal** (`CreateHabitModalCentered`) - a streamlined, single-page layout that prioritizes the habit name while making customization options clearly optional.

**Key Features:**
- Centered name input with prominent heading
- "CUSTOMIZE (OPTIONAL)" section with emoji, color, reminder
- Smart defaults reduce cognitive load
- 2-tap creation flow (name → create)
- Swipe-to-dismiss gesture support

---

## 📋 Prerequisites

- ✅ Files already created:
  - `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
  - `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`
- ✅ No breaking changes to existing code
- ✅ All dependencies already installed (react-native-reanimated, react-native-gesture-handler)

---

## 🚀 Quick Integration

### Option 1: Direct Import and Use

**Step 1:** Import the component in your screen/container:

```typescript
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';
// or
import { CreateHabitModalCentered } from '@/components/CreateHabitModal';
```

**Step 2:** Use in your component:

```typescript
export function HabitsScreen() {
  const [isVisible, setIsVisible] = useState(false);

  const handleCreate = async (habitData: HabitFormData) => {
    // Create habit in your database/store
    await createHabit(habitData);
    setIsVisible(false);
  };

  return (
    <>
      <CreateHabitModalCentered
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
```

**Done!** The centered modal is now ready to use.

---

### Option 2: Feature Flag (Recommended for A/B Testing)

**Step 1:** Add feature flag to your config:

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_MODAL: false, // Toggle between layouts
} as const;
```

**Step 2:** Conditional rendering in HabitsModals component:

```typescript
import { CreateHabitModal } from '@/components/CreateHabitModal';
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';
import { FEATURE_FLAGS } from '@/config/featureFlags';

export function HabitsModals() {
  // ... your state and handlers

  const USE_CENTERED_LAYOUT = FEATURE_FLAGS.USE_CENTERED_HABIT_MODAL;

  return (
    <>
      {USE_CENTERED_LAYOUT ? (
        <CreateHabitModalCentered
          visible={isCreateHabitModalVisible}
          onClose={() => setIsCreateHabitModalVisible(false)}
          onCreate={handleCreateHabit}
        />
      ) : (
        <CreateHabitModal
          visible={isCreateHabitModalVisible}
          onClose={() => setIsCreateHabitModalVisible(false)}
          onCreate={handleCreateHabit}
        />
      )}
    </>
  );
}
```

**Step 3:** Enable the centered layout:

```typescript
// Change in featureFlags.ts
USE_CENTERED_HABIT_MODAL: true,
```

---

### Option 3: Environment-Based Configuration

For different environments (dev, staging, production):

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_MODAL: __DEV__ || process.env.EXPO_PUBLIC_ENV === 'staging',
} as const;
```

---

## 📚 Component API Reference

### CreateHabitModalCentered Props

```typescript
interface CreateHabitModalProps {
  // Modal visibility
  visible: boolean;
  onClose: () => void;

  // Habit creation
  onCreate: (habitData: HabitFormData) => void | Promise<void>;

  // Edit mode (optional)
  editMode?: boolean;
  initialData?: HabitFormData;
  onUpdate?: (habitData: HabitFormData) => void | Promise<void>;
}
```

**Prop Descriptions:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | ✅ Yes | Controls modal visibility |
| `onClose` | `() => void` | ✅ Yes | Called when modal should close (X button, swipe down) |
| `onCreate` | `(data: HabitFormData) => void \| Promise<void>` | ✅ Yes | Called when user creates a new habit |
| `editMode` | `boolean` | ❌ No | Set to `true` for edit mode, `false`/undefined for create mode |
| `initialData` | `HabitFormData` | ❌ No | Pre-fill form data (for edit mode) |
| `onUpdate` | `(data: HabitFormData) => void \| Promise<void>` | ❌ No | Called when user updates an existing habit (edit mode) |

### HabitFormData Type

```typescript
interface HabitFormData {
  // Required fields
  name: string;              // Habit name (2-50 characters)

  // Visual customization
  icon: string | null;       // Emoji (can be null, will auto-assign)
  color: string;             // Hex color (defaults to #EF4444)

  // Reminder settings
  reminderOption: ReminderOption; // Time configuration
  remindersEnabled: boolean;      // Toggle state

  // Frequency settings
  frequency: number[];       // Day indices [0-6] for Mon-Sun

  // Time of day (if using day phase system)
  dayPhase?: 'morning' | 'afternoon' | 'evening';
}
```

---

## 🎨 Integration Patterns

### Pattern 1: Create-Only Mode (Most Common)

```typescript
export function HabitsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { createHabit } = useHabits(); // Your habit management hook

  const handleCreateHabit = async (habitData: HabitFormData) => {
    try {
      await createHabit(habitData);
      setShowCreateModal(false);
      // Optional: Show success toast
    } catch (error) {
      console.error('Failed to create habit:', error);
      // Handle error
    }
  };

  return (
    <>
      <Button onPress={() => setShowCreateModal(true)}>
        Create Habit
      </Button>

      <CreateHabitModalCentered
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateHabit}
      />
    </>
  );
}
```

### Pattern 2: Create & Edit Mode

```typescript
export function HabitsScreen() {
  const [modalState, setModalState] = useState<{
    visible: boolean;
    mode: 'create' | 'edit';
    habitData?: HabitFormData;
  }>({ visible: false, mode: 'create' });

  const { createHabit, updateHabit } = useHabits();

  const handleCreate = async (data: HabitFormData) => {
    await createHabit(data);
    setModalState({ visible: false, mode: 'create' });
  };

  const handleUpdate = async (data: HabitFormData) => {
    await updateHabit(data);
    setModalState({ visible: false, mode: 'create' });
  };

  const openEditModal = (habit: HabitFormData) => {
    setModalState({
      visible: true,
      mode: 'edit',
      habitData: habit,
    });
  };

  return (
    <>
      <CreateHabitModalCentered
        visible={modalState.visible}
        onClose={() => setModalState({ visible: false, mode: 'create' })}
        editMode={modalState.mode === 'edit'}
        initialData={modalState.habitData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}
```

### Pattern 3: With Analytics Tracking

```typescript
export function HabitsScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const analytics = useAnalytics();

  const handleCreate = async (habitData: HabitFormData) => {
    // Track creation event
    analytics.track('habit_created', {
      hasCustomEmoji: habitData.icon !== null,
      hasCustomColor: habitData.color !== '#EF4444',
      hasReminder: habitData.remindersEnabled,
      frequency: habitData.frequency.length,
    });

    await createHabit(habitData);
    setIsVisible(false);
  };

  const handleClose = () => {
    analytics.track('habit_creation_cancelled');
    setIsVisible(false);
  };

  return (
    <CreateHabitModalCentered
      visible={isVisible}
      onClose={handleClose}
      onCreate={handleCreate}
    />
  );
}
```

---

## 🔄 State Management Integration

### Using the Built-in Hook

The modal uses `useCreateHabitModal` hook internally, which wraps `useHabitForm`:

```typescript
// Internal implementation (for reference)
const form = useCreateHabitModal({
  editMode,
  initialData,
  onClose,
  onCreate: handleCreate,
  onUpdate: handleUpdate,
});
```

### Custom State Management

If you need custom state management, you can use the lower-level `CreateHabitFormCentered` component:

```typescript
import { CreateHabitFormCentered } from '@/components/CreateHabitModal/components/CreateHabitFormCentered';

export function CustomHabitForm() {
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('12:00 PM');

  const handleSubmit = () => {
    // Your submission logic
  };

  return (
    <CreateHabitFormCentered
      habitName={habitName}
      onHabitNameChange={setHabitName}
      selectedEmoji={selectedEmoji}
      onEmojiSelect={setSelectedEmoji}
      colors={HABIT_COLORS}
      selectedColor={selectedColor}
      onColorSelect={setSelectedColor}
      onCustomColorPress={() => {/* Show color picker */}}
      reminderEnabled={reminderEnabled}
      reminderTime={reminderTime}
      onReminderToggle={setReminderEnabled}
      onReminderTimePress={() => {/* Show time picker */}}
      onSubmit={handleSubmit}
    />
  );
}
```

---

## 🎯 Smart Defaults Explained

The centered modal applies smart defaults to minimize user decisions:

### Default Values

| Field | Default Value | Rationale |
|-------|--------------|-----------|
| **Emoji** | Auto-assigned from keywords | Reduces decision fatigue |
| **Color** | `#EF4444` (Red) | First in palette, visually prominent |
| **Reminder** | Enabled at 12:00 PM | Afternoon timing works for most habits |
| **Day Phase** | `afternoon` | Balanced time of day |
| **Frequency** | All 7 days (Daily) | Most common habit pattern |

### Keyword-Based Emoji Suggestions

The modal suggests emojis based on habit name keywords:

```typescript
// Examples
"Read" → 📚
"Meditate" → 🧘
"Exercise" → 💪
"Drink water" → 💧
"Write journal" → ✍️
```

**How it works:**
1. User types habit name
2. System extracts keywords (debounced 300ms)
3. Matches keywords to emoji map
4. Updates suggested emoji chips in real-time
5. If no match, shows default emoji set

---

## 🧪 Testing Integration

### Unit Test Example

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';

describe('CreateHabitModalCentered Integration', () => {
  it('calls onCreate with habit data', async () => {
    const onCreate = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CreateHabitModalCentered
        visible={true}
        onClose={jest.fn()}
        onCreate={onCreate}
      />
    );

    // Enter habit name
    const input = getByPlaceholderText(/e.g., Read/i);
    fireEvent.changeText(input, 'Morning meditation');

    // Submit
    const submitButton = getByText('Create Habit');
    fireEvent.press(submitButton);

    // Verify onCreate called with data
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Morning meditation',
          icon: expect.any(String),
          color: '#EF4444',
        })
      );
    });
  });
});
```

### E2E Test Example (Detox)

```typescript
describe('Habit Creation Flow - Centered Layout', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create habit with minimal input', async () => {
    // Open modal
    await element(by.id('fab-create-habit')).tap();

    // Enter name
    await element(by.id('habit-name-input')).typeText('Read for 20 minutes');

    // Submit
    await element(by.text('Create Habit')).tap();

    // Verify habit appears in list
    await expect(element(by.text('Read for 20 minutes'))).toBeVisible();
  });

  it('should allow customization', async () => {
    await element(by.id('fab-create-habit')).tap();

    // Name
    await element(by.id('habit-name-input')).typeText('Meditate');

    // Customize emoji
    await element(by.id('emoji-chip-🧘')).tap();

    // Customize color
    await element(by.id('color-chip-#8B5CF6')).tap();

    // Enable reminder
    await element(by.id('reminder-switch')).tap();

    // Submit
    await element(by.text('Create Habit')).tap();

    await expect(element(by.text('Meditate'))).toBeVisible();
  });
});
```

---

## 🔧 Advanced Configuration

### Custom Color Palette

```typescript
// Define custom colors
const CUSTOM_COLORS = [
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Pastel Yellow
];

// Pass to form component
<CreateHabitFormCentered
  colors={CUSTOM_COLORS}
  // ... other props
/>
```

### Custom Emoji Keywords

```typescript
// Add custom keyword mappings
import { emojiKeywords } from '@/utils/emojiKeywords';

emojiKeywords['code'] = '💻';
emojiKeywords['debug'] = '🐛';
emojiKeywords['deploy'] = '🚀';
```

### Custom Validation

```typescript
const handleCreate = async (habitData: HabitFormData) => {
  // Custom validation
  if (habitData.name.length < 3) {
    Alert.alert('Error', 'Habit name must be at least 3 characters');
    return;
  }

  if (profanityCheck(habitData.name)) {
    Alert.alert('Error', 'Please use appropriate language');
    return;
  }

  // Proceed with creation
  await createHabit(habitData);
};
```

---

## 🔀 Migration from Original Modal

### Step-by-Step Migration

**Step 1:** Identify current usage

```typescript
// Before (Original modal)
<CreateHabitModal
  visible={isVisible}
  onClose={handleClose}
  onCreate={handleCreate}
/>
```

**Step 2:** Replace import

```typescript
// Change this:
import { CreateHabitModal } from '@/components/CreateHabitModal';

// To this:
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';
```

**Step 3:** Update component name

```typescript
// After (Centered modal)
<CreateHabitModalCentered
  visible={isVisible}
  onClose={handleClose}
  onCreate={handleCreate}
/>
```

**No prop changes needed!** The API is identical.

### Gradual Rollout Strategy

1. **Week 1**: Internal testing
   - Enable for team members only
   - Gather feedback on UX

2. **Week 2**: Beta users (10%)
   - Use feature flag with user segmentation
   - Monitor analytics (completion rate, customization rate)

3. **Week 3**: Expand (50%)
   - Increase if metrics are positive
   - Continue monitoring

4. **Week 4**: Full rollout (100%)
   - Remove feature flag
   - Deprecate original modal

---

## 📊 A/B Testing Setup

### Using Feature Flag with User Segmentation

```typescript
// utils/featureFlags.ts
export function shouldUseCenteredModal(userId: string): boolean {
  // Hash-based consistent assignment
  const hash = hashString(userId);
  const variant = hash % 100;

  // 50/50 split
  return variant < 50;
}

// In your component
const userId = useAuth().user.id;
const useCentered = shouldUseCenteredModal(userId);

return (
  <>
    {useCentered ? (
      <CreateHabitModalCentered {...props} />
    ) : (
      <CreateHabitModal {...props} />
    )}
  </>
);
```

### Analytics Events to Track

```typescript
// On modal open
analytics.track('habit_creation_modal_opened', {
  variant: useCentered ? 'centered' : 'original',
});

// On habit created
analytics.track('habit_created', {
  variant: useCentered ? 'centered' : 'original',
  duration_seconds: timeSinceModalOpened,
  customized_emoji: habitData.icon !== null,
  customized_color: habitData.color !== '#EF4444',
  enabled_reminder: habitData.remindersEnabled,
});

// On modal closed without creation
analytics.track('habit_creation_cancelled', {
  variant: useCentered ? 'centered' : 'original',
  had_text: habitName.length > 0,
});
```

### Metrics to Compare

| Metric | Description | Target |
|--------|-------------|--------|
| **Completion Rate** | % of opened modals that result in creation | >90% |
| **Time to Create** | Average seconds from open to submit | <15s |
| **Customization Rate** | % who change emoji, color, or reminder | 30-50% |
| **Abandonment Point** | Where users drop off (if they do) | Name input |

---

## ❌ Troubleshooting

### Issue: Modal doesn't appear

**Cause:** `visible` prop not properly controlled

**Solution:**
```typescript
// Ensure boolean state management
const [isVisible, setIsVisible] = useState(false);

// Not this:
const [isVisible, setIsVisible] = useState(undefined); // ❌
```

### Issue: onCreate not firing

**Cause:** Validation preventing submission

**Solution:**
```typescript
// Check minimum character requirement
console.log('Name length:', habitName.length); // Must be ≥2

// Verify onCreate handler is passed
<CreateHabitModalCentered
  onCreate={handleCreate} // ✅ Must be present
/>
```

### Issue: Swipe-to-dismiss not working

**Cause:** Missing gesture handler setup

**Solution:**
```typescript
// Ensure GestureHandlerRootView wraps your app
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

### Issue: Keyboard covering input on Android

**Cause:** KeyboardAvoidingView not configured

**Solution:** This is handled internally by the component. If issues persist:
```typescript
// In AndroidManifest.xml
<activity
  android:windowSoftInputMode="adjustResize"
>
```

### Issue: Form doesn't reset after creation

**Cause:** Modal visibility controlled incorrectly

**Solution:**
```typescript
const handleCreate = async (data: HabitFormData) => {
  await createHabit(data);
  setIsVisible(false); // ✅ Close modal triggers reset
};

// Not this:
const handleCreate = async (data: HabitFormData) => {
  setIsVisible(false); // ❌ Closes before creation
  await createHabit(data);
};
```

---

## 📝 Best Practices

### ✅ Do's

- **Use feature flags** for gradual rollout
- **Track analytics** to measure success
- **Test on both iOS and Android** - keyboard behavior differs
- **Provide feedback** on creation (toast, animation)
- **Handle errors gracefully** in onCreate/onUpdate
- **Respect user preferences** (reduced motion, accessibility)

### ❌ Don'ts

- **Don't modify form state externally** - let the component manage it
- **Don't skip error handling** in onCreate/onUpdate
- **Don't remove original modal** until centered version is stable
- **Don't ignore accessibility** - test with screen readers
- **Don't over-customize** - maintain consistency with design system

---

## 🔗 Related Documentation

- [Quick Start Guide](./QUICK_START_CENTERED.md) - Get started in 5 minutes
- [Styling Guide](./STYLING_GUIDE_CENTERED.md) - Customize appearance
- [Component API Spec](./centered-optional-fields.md) - Full technical specification
- [Accessibility Audit](../Working/accessibility-audit-centered-modal.md) - Accessibility compliance
- [Performance Review](../Working/performance-optimization-review.md) - Performance analysis

---

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review the [component tests](../../src/components/CreateHabitModal/__tests__/CreateHabitModalCentered.test.tsx) for usage examples
3. Consult the [full specification](./centered-optional-fields.md)
4. Open an issue with reproduction steps

---

**Last Updated:** January 5, 2026
**Version:** 1.0.0
**Component:** CreateHabitModalCentered
