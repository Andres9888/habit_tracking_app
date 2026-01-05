# Create Habit Modal - Quick Start Guide

## Overview

Get up and running with the Create Habit Modal in minutes. This guide covers the essentials for integrating either the original or centered layout version into your app.

---

## Installation

The Create Habit Modal is already part of the project. No additional installation required.

**Location**: `src/components/CreateHabitModal/`

**Dependencies**:
- `react-native`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `expo-haptics`
- `lucide-react-native`

---

## Choose Your Layout

### Original Layout (Default)

Multi-step wizard-style creation flow with separate screens for each customization option.

```typescript
import CreateHabitModal from '@/components/CreateHabitModal';
```

**Best for:**
- Users who want guided step-by-step experience
- Applications with complex habit configurations
- Users new to the app

### Centered Layout (New)

Streamlined single-page creation with centered name input and optional customization.

```typescript
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';
```

**Best for:**
- Quick habit creation (2 taps: name → create)
- Power users who know what they want
- Minimalist UI preferences
- Mobile-first experiences

---

## Basic Usage

### 1. Import the Component

```typescript
import { useState } from 'react';
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';
import type { HabitFormData } from '@/components/CreateHabitModal/types';
```

### 2. Add State Management

```typescript
function MyScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateHabit = (habit: HabitFormData) => {
    console.log('Creating habit:', habit);
    // TODO: Save to your data store
    setIsModalVisible(false);
  };

  return (
    // ... your screen content
  );
}
```

### 3. Render the Modal

```typescript
return (
  <View style={{ flex: 1 }}>
    {/* Your screen content */}
    <Button
      title="Create Habit"
      onPress={() => setIsModalVisible(true)}
    />

    {/* The modal */}
    <CreateHabitModalCentered
      visible={isModalVisible}
      onClose={() => setIsModalVisible(false)}
      onCreate={handleCreateHabit}
    />
  </View>
);
```

---

## Complete Example

```typescript
import { useState } from 'react';
import { View, Button } from 'react-native';
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';
import type { HabitFormData } from '@/components/CreateHabitModal/types';

export function HabitsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateHabit = (habit: HabitFormData) => {
    // The habit object contains:
    // - name: string (required, 2-50 characters)
    // - emoji: string | null (auto-assigned if null)
    // - color: string (hex color)
    // - dayPhase: 'morning' | 'afternoon' | 'evening'
    // - reminderTime: Date
    // - remindersEnabled: boolean
    // - frequency: number[] (day indices 0-6)

    console.log('New habit:', habit);

    // Save to your data store
    // await createHabit(habit);

    // Close modal
    setIsModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Trigger button */}
      <Button
        title="Add New Habit"
        onPress={() => setIsModalVisible(true)}
      />

      {/* Modal */}
      <CreateHabitModalCentered
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreate={handleCreateHabit}
      />
    </View>
  );
}
```

---

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback when modal should close |
| `onCreate` | `(habit: HabitFormData) => void` | Callback when habit is created |

### Optional Props (Edit Mode)

| Prop | Type | Description |
|------|------|-------------|
| `habit` | `Habit` | Existing habit data for editing |
| `habitId` | `string` | ID of habit being edited |
| `onSave` | `(habit: HabitFormData) => void` | Callback for saving edits |

---

## What You Get

### Smart Defaults

The centered modal applies intelligent defaults when creating a habit:

```typescript
{
  name: "User's input",          // What user typed
  emoji: "📚",                    // Auto-suggested from name keywords
  color: "#EF4444",              // First in color palette (red)
  dayPhase: "afternoon",         // Phase2_pivot default
  reminderTime: Date(12:00 PM),  // Noon
  remindersEnabled: true,        // Enabled by default
  frequency: [0,1,2,3,4,5,6]    // Daily (all 7 days)
}
```

### Keyword-Based Emoji Suggestions

The modal suggests emojis based on habit name keywords:

- "Read" → 📚
- "Meditate" → 🧘
- "Exercise" → 💪
- "Water" → 💧
- "Journal" → ✍️

### User Experience

1. **Modal opens** → Focus immediately on name input
2. **User types "Read"** → Emoji suggestions auto-update (📚 appears)
3. **User presses Enter** → Habit created with smart defaults
4. **Total time**: ~5 seconds

**Optional**: User can customize emoji, color, or reminder before creating.

---

## Common Patterns

### Pattern 1: Create Only

Most common use case - just creating new habits:

```typescript
<CreateHabitModalCentered
  visible={visible}
  onClose={() => setVisible(false)}
  onCreate={handleCreate}
/>
```

### Pattern 2: Create and Edit

Support both creation and editing:

```typescript
const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

// For creating
<Button onPress={() => {
  setModalMode('create');
  setVisible(true);
}} />

// For editing
<Button onPress={() => {
  setModalMode('edit');
  setEditingHabit(someHabit);
  setVisible(true);
}} />

// Modal
<CreateHabitModalCentered
  visible={visible}
  onClose={() => {
    setVisible(false);
    setEditingHabit(null);
  }}
  onCreate={modalMode === 'create' ? handleCreate : undefined}
  habit={editingHabit}
  habitId={editingHabit?.id}
  onSave={modalMode === 'edit' ? handleSave : undefined}
/>
```

### Pattern 3: With Confirmation

Add confirmation before closing:

```typescript
const [isDirty, setIsDirty] = useState(false);

const handleClose = () => {
  if (isDirty) {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', onPress: () => setVisible(false) },
      ]
    );
  } else {
    setVisible(false);
  }
};

<CreateHabitModalCentered
  visible={visible}
  onClose={handleClose}
  onCreate={handleCreate}
/>
```

---

## Customization Quick Reference

### Change Default Colors

```typescript
// src/components/CreateHabitModal/constants.ts
export const HABIT_COLORS = [
  '#YOUR_COLOR_1',
  '#YOUR_COLOR_2',
  // ... up to 12 colors
];
```

### Modify Smart Defaults

The modal uses the `useHabitForm` hook which sets defaults. To customize:

```typescript
// src/components/CreateHabitModal/hooks/useHabitForm.ts
// Modify the initial state or resetForm function
```

### Add Custom Emoji Keywords

```typescript
// src/utils/emojiKeywords.ts
export const EMOJI_KEYWORDS = {
  // Add your custom mappings
  'custom': '🎯',
  'myhabit': '✨',
};
```

---

## Testing Your Integration

### Manual Testing Checklist

- [ ] Modal opens when trigger button pressed
- [ ] Focus is on name input when modal opens
- [ ] Typing updates emoji suggestions
- [ ] Can select emoji from suggestions
- [ ] Can select color from palette
- [ ] Can toggle reminder on/off
- [ ] Create button disabled when name empty
- [ ] Create button enabled when name ≥ 2 characters
- [ ] Pressing Enter creates habit (when valid)
- [ ] Swipe down dismisses modal
- [ ] Small swipe bounces back
- [ ] Modal closes after creation
- [ ] onCreate callback receives correct data

### Automated Testing

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('creates habit when name is valid', () => {
  const onCreate = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <CreateHabitModalCentered visible onCreate={onCreate} onClose={jest.fn()} />
  );

  const input = getByPlaceholderText(/e.g., Read/i);
  fireEvent.changeText(input, 'Morning run');

  const button = getByText('Create Habit');
  fireEvent.press(button);

  expect(onCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Morning run',
    })
  );
});
```

---

## Next Steps

- **Full Integration Details**: See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Styling Customization**: See [STYLING_GUIDE.md](./STYLING_GUIDE.md)
- **Advanced Patterns**: Check the integration guide for A/B testing, analytics, etc.
- **Component API**: Review TypeScript types in `src/components/CreateHabitModal/types.ts`

---

## FAQ

### Q: Can I use both layouts in the same app?

Yes! Use a feature flag to toggle between them:

```typescript
const USE_CENTERED = true;
const Modal = USE_CENTERED ? CreateHabitModalCentered : CreateHabitModal;
```

### Q: How do I disable smart defaults?

Smart defaults are applied in the form hook. You can:
1. Use the form directly and skip the modal's `handleCreate`
2. Modify the `useHabitForm` hook to change defaults
3. Override values in your `onCreate` callback

### Q: Does this work with React Navigation?

Yes! The modal is a standard React Native Modal component and works with any navigation library.

### Q: Can I customize the heading text?

Currently the heading is hardcoded. To customize, you'd need to:
1. Fork the component
2. Add a `headingText` prop
3. Pass it to the `CreateHabitFormCentered` component

### Q: How do I handle errors?

Add error handling in your `onCreate` callback:

```typescript
const handleCreate = async (habit: HabitFormData) => {
  try {
    await createHabit(habit);
    setVisible(false);
  } catch (error) {
    Alert.alert('Error', 'Failed to create habit');
    console.error(error);
  }
};
```

### Q: Can I add custom fields?

The modal uses a fixed set of fields. To add custom fields:
1. Extend the `HabitFormData` type
2. Modify the form component to include your fields
3. Update the form hook to manage the new state

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Check `visible` prop is true, verify no parent overflow issues |
| Keyboard covers input | Modal includes KeyboardAvoidingView, ensure no conflicts |
| Swipe doesn't work | Check `react-native-gesture-handler` is installed and configured |
| TypeScript errors | Import types from `@/components/CreateHabitModal/types` |
| Emoji suggestions wrong | Review keyword mappings in `src/utils/emojiKeywords.ts` |

---

## Support

Need help? Check:
- [Full Integration Guide](./INTEGRATION_GUIDE.md) for detailed examples
- [Styling Guide](./STYLING_GUIDE.md) for customization options
- Test files in `src/components/CreateHabitModal/__tests__/` for usage examples
- Component source code in `src/components/CreateHabitModal/`

---

## Quick Reference

```typescript
// Minimal example
import CreateHabitModalCentered from '@/components/CreateHabitModal/CreateHabitModalCentered';

<CreateHabitModalCentered
  visible={visible}
  onClose={() => setVisible(false)}
  onCreate={(habit) => {
    console.log(habit);
    setVisible(false);
  }}
/>
```

That's it! You're ready to create habits. 🎉
