# Quick Start Guide - Centered Habit Creation Modal

## 🚀 5-Minute Integration

Get the centered habit creation modal up and running in your app in just 5 minutes.

---

## Step 1: Import the Component (30 seconds)

```typescript
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';
```

---

## Step 2: Add State Management (1 minute)

```typescript
export function HabitsScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleCreateHabit = async (habitData: HabitFormData) => {
    // Your habit creation logic here
    console.log('Creating habit:', habitData);
    setIsCreateModalVisible(false);
  };

  return (
    // ... your screen content
  );
}
```

---

## Step 3: Add the Modal (1 minute)

```typescript
return (
  <View style={{ flex: 1 }}>
    {/* Your existing screen content */}
    <Button onPress={() => setIsCreateModalVisible(true)}>
      Create Habit
    </Button>

    {/* Add the centered modal */}
    <CreateHabitModalCentered
      visible={isCreateModalVisible}
      onClose={() => setIsCreateModalVisible(false)}
      onCreate={handleCreateHabit}
    />
  </View>
);
```

---

## Step 4: Test It! (2.5 minutes)

1. **Open the modal**: Tap your create button
2. **Type a habit name**: e.g., "Read for 20 minutes"
3. **Watch the magic**: Emoji suggestions update automatically (📚 appears)
4. **Create**: Tap "Create Habit" or press Enter
5. **Done!** Your habit is created with smart defaults

---

## ✅ Complete Working Example

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';
import type { HabitFormData } from '@/types/habit';

export function HabitsScreen() {
  const [isVisible, setIsVisible] = useState(false);

  const handleCreate = async (habitData: HabitFormData) => {
    try {
      // Create habit in your database/store
      await createHabitInDatabase(habitData);

      // Close modal
      setIsVisible(false);

      // Optional: Show success message
      Alert.alert('Success', `"${habitData.name}" created!`);
    } catch (error) {
      console.error('Failed to create habit:', error);
      Alert.alert('Error', 'Failed to create habit');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Your habit list */}
      <HabitList />

      {/* FAB or create button */}
      <Button
        title="Create Habit"
        onPress={() => setIsVisible(true)}
      />

      {/* Centered creation modal */}
      <CreateHabitModalCentered
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onCreate={handleCreate}
      />
    </View>
  );
}
```

---

## 📊 What You Get

### Layout Comparison

| Feature | Original Modal | **Centered Modal** |
|---------|---------------|-------------------|
| Layout | All fields equally weighted | Name prominently centered |
| Optional Fields | Not clearly marked | "CUSTOMIZE (OPTIONAL)" label |
| Emoji Selection | Static 6 emojis | Dynamic suggestions based on name |
| Creation Flow | Multiple taps | 2 taps (name → create) |
| Visual Hierarchy | Flat | Clear primary/secondary distinction |
| Gesture Support | No swipe | Swipe down to dismiss |

### User Experience Flow

```
1. User taps "+" FAB
   ↓
2. Modal opens, name input auto-focused
   ↓
3. User types "Drink water"
   ↓
4. Emoji suggestions update → 💧 appears
   ↓
5. User presses Enter or taps "Create Habit"
   ↓
6. Habit created with:
   - Name: "Drink water"
   - Emoji: 💧 (auto-selected)
   - Color: Red (#EF4444)
   - Reminder: Enabled at 12:00 PM
   - Frequency: Daily (7 days)
   ↓
Total time: ~5 seconds
```

---

## 🎨 Component Props Reference

### Required Props

```typescript
visible: boolean          // Controls modal visibility
onClose: () => void      // Called when modal should close
onCreate: (data: HabitFormData) => void  // Called when habit is created
```

### Optional Props (Edit Mode)

```typescript
editMode?: boolean                        // Enable edit mode
initialData?: HabitFormData              // Pre-fill form data
onUpdate?: (data: HabitFormData) => void // Called when habit is updated
```

### HabitFormData Structure

```typescript
interface HabitFormData {
  name: string;              // Habit name (2-50 chars)
  icon: string | null;       // Emoji (null = auto-assign)
  color: string;             // Hex color (e.g., "#EF4444")
  reminderOption: ReminderOption; // Reminder configuration
  remindersEnabled: boolean; // Reminder toggle state
  frequency: number[];       // Days [0-6] for Mon-Sun
  dayPhase?: 'morning' | 'afternoon' | 'evening'; // Time of day
}
```

---

## 🎯 Smart Defaults Explained

The modal automatically assigns sensible defaults so users can create habits quickly:

### Automatic Emoji Assignment

Based on keywords in the habit name:

| You Type | Auto-Suggested Emoji |
|----------|---------------------|
| "Read..." | 📚 |
| "Meditate" | 🧘 |
| "Exercise", "Workout", "Gym" | 💪 |
| "Run", "Jog" | 🏃 |
| "Water", "Drink", "Hydrate" | 💧 |
| "Write", "Journal" | ✍️ |
| "Walk" | 🚶 |
| "Code", "Program" | 💻 |
| "Study", "Learn" | 📖 |
| "Yoga" | 🧘 |

**Full keyword map**: See `src/utils/emojiKeywords.ts`

### Default Settings

```typescript
{
  emoji: auto-assigned from keywords or first suggestion,
  color: '#EF4444' (red),
  reminder: enabled at 12:00 PM,
  dayPhase: 'afternoon',
  frequency: [0, 1, 2, 3, 4, 5, 6] // Daily (all days)
}
```

---

## 💡 Common Usage Patterns

### Pattern 1: Simple Create

```typescript
<CreateHabitModalCentered
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  onCreate={handleCreate}
/>
```

### Pattern 2: Create & Edit

```typescript
const [modalConfig, setModalConfig] = useState({
  visible: false,
  mode: 'create',
  habitData: null,
});

// Open for creating
const openCreateModal = () => {
  setModalConfig({ visible: true, mode: 'create', habitData: null });
};

// Open for editing
const openEditModal = (habit) => {
  setModalConfig({ visible: true, mode: 'edit', habitData: habit });
};

<CreateHabitModalCentered
  visible={modalConfig.visible}
  onClose={() => setModalConfig({ ...modalConfig, visible: false })}
  editMode={modalConfig.mode === 'edit'}
  initialData={modalConfig.habitData}
  onCreate={handleCreate}
  onUpdate={handleUpdate}
/>
```

### Pattern 3: With Confirmation Dialog

```typescript
const handleCreate = async (habitData: HabitFormData) => {
  // Show confirmation
  Alert.alert(
    'Create Habit?',
    `Create "${habitData.name}" with ${habitData.frequency.length} days/week?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async () => {
          await createHabit(habitData);
          setIsVisible(false);
        },
      },
    ]
  );
};
```

---

## 🎨 Customization Quick Reference

### Change Default Color

```typescript
// In your habit creation logic
const handleCreate = async (habitData: HabitFormData) => {
  const data = {
    ...habitData,
    color: habitData.color === '#EF4444' ? '#3B82F6' : habitData.color, // Blue instead of red
  };
  await createHabit(data);
};
```

### Change Default Reminder Time

```typescript
// In useHabitForm hook or your creation logic
const DEFAULT_REMINDER_TIME = '08:00 AM'; // Morning instead of noon
```

### Add Custom Emoji Keywords

```typescript
// In src/utils/emojiKeywords.ts
export const emojiKeywords = {
  // ... existing keywords
  'debug': '🐛',
  'deploy': '🚀',
  'meeting': '👥',
  'coffee': '☕',
};
```

---

## ✅ Testing Checklist

### Manual Testing

- [ ] Modal opens smoothly
- [ ] Name input auto-focuses
- [ ] Typing updates emoji suggestions
- [ ] Character counter shows (0/50)
- [ ] "CUSTOMIZE (OPTIONAL)" label visible
- [ ] Emoji chips display with "More" label
- [ ] Color chips display correctly
- [ ] Reminder toggle works
- [ ] Swipe down dismisses modal
- [ ] Enter key creates habit (when name is valid)
- [ ] Create button disabled when name < 2 chars
- [ ] Create button enabled when name ≥ 2 chars
- [ ] Habit created with correct data
- [ ] Modal resets after creation

### Automated Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';

test('creates habit with minimal input', async () => {
  const onCreate = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <CreateHabitModalCentered
      visible={true}
      onClose={jest.fn()}
      onCreate={onCreate}
    />
  );

  // Type habit name
  const input = getByPlaceholderText(/e.g., Read/i);
  fireEvent.changeText(input, 'Morning meditation');

  // Submit
  const button = getByText('Create Habit');
  fireEvent.press(button);

  // Verify onCreate called
  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Morning meditation',
      })
    );
  });
});
```

---

## 🐛 Troubleshooting

### Modal doesn't appear

**Issue**: `visible={true}` but modal not showing

**Solution**:
```typescript
// Ensure GestureHandlerRootView wraps your app
import { GestureHandlerRootView } from 'react-native-gesture-handler';

<GestureHandlerRootView style={{ flex: 1 }}>
  <App />
</GestureHandlerRootView>
```

### Keyboard covers input on Android

**Issue**: Input hidden behind keyboard

**Solution**: Already handled by `KeyboardAvoidingView` in the component. If persists:
```xml
<!-- AndroidManifest.xml -->
<activity android:windowSoftInputMode="adjustResize">
```

### onCreate not firing

**Issue**: Button press doesn't call onCreate

**Solution**: Ensure name has at least 2 characters:
```typescript
habitName.length >= 2 // Required for submission
```

### Emoji suggestions not updating

**Issue**: Typing doesn't change emoji suggestions

**Solution**: Check debounce timing (300ms). Wait briefly after typing.

### Form doesn't reset

**Issue**: Old data persists after creation

**Solution**: Ensure you close the modal in onCreate:
```typescript
const handleCreate = async (data) => {
  await createHabit(data);
  setIsVisible(false); // ✅ This triggers reset
};
```

---

## 📚 What's Next?

### Learn More

- **[Integration Guide](./INTEGRATION_GUIDE_CENTERED.md)** - Advanced integration patterns
- **[Styling Guide](./STYLING_GUIDE_CENTERED.md)** - Customize colors, fonts, spacing
- **[Full Specification](./centered-optional-fields.md)** - Complete technical details

### Try These Features

1. **Edit Mode**: Pass `editMode={true}` and `initialData` to enable editing
2. **Custom Colors**: Modify the color palette in CreateHabitFormCentered
3. **Custom Emojis**: Add your own keyword mappings in emojiKeywords.ts
4. **Analytics**: Track user behavior with onCreate/onClose callbacks
5. **A/B Testing**: Use feature flags to test vs original modal

---

## ❓ FAQ

### Q: Can I use this alongside the original modal?

**A:** Yes! Both can coexist. Use feature flags to switch between them.

```typescript
const USE_CENTERED_LAYOUT = true; // Toggle here

{USE_CENTERED_LAYOUT ? (
  <CreateHabitModalCentered {...props} />
) : (
  <CreateHabitModal {...props} />
)}
```

### Q: How do I disable smart defaults?

**A:** Smart defaults are applied on submission. You can override them in your `onCreate` handler:

```typescript
const handleCreate = async (habitData: HabitFormData) => {
  const data = {
    ...habitData,
    remindersEnabled: false, // Force reminders off
    icon: null, // Force no emoji
  };
  await createHabit(data);
};
```

### Q: Can I customize the color palette?

**A:** Yes, in two ways:

1. **Modify defaults** in `src/constants/colors.ts`
2. **Pass custom colors** to `CreateHabitFormCentered` component

### Q: Does this work with TypeScript?

**A:** Yes! All types are exported:

```typescript
import type {
  CreateHabitModalProps,
  HabitFormData,
  ReminderOption,
} from '@/components/CreateHabitModal';
```

### Q: How do I handle errors?

**A:** Use try/catch in your `onCreate` handler:

```typescript
const handleCreate = async (habitData: HabitFormData) => {
  try {
    await createHabit(habitData);
    setIsVisible(false);
  } catch (error) {
    Alert.alert('Error', 'Failed to create habit. Please try again.');
    // Don't close modal on error
  }
};
```

### Q: Can I track when users customize habits?

**A:** Yes! Check if values differ from defaults:

```typescript
const handleCreate = async (habitData: HabitFormData) => {
  const customized = {
    emoji: habitData.icon !== null,
    color: habitData.color !== '#EF4444',
    reminder: !habitData.remindersEnabled,
  };

  analytics.track('habit_created', {
    customized_emoji: customized.emoji,
    customized_color: customized.color,
    customized_reminder: customized.reminder,
  });

  await createHabit(habitData);
};
```

---

## 🎉 Success!

You've successfully integrated the centered habit creation modal! Your users can now:

- ✅ Create habits in ~5 seconds
- ✅ Get smart emoji suggestions
- ✅ Enjoy clear visual hierarchy
- ✅ Understand what's required vs optional
- ✅ Swipe to dismiss
- ✅ Use keyboard shortcuts (Enter to submit)

**Need help?** Check the [Integration Guide](./INTEGRATION_GUIDE_CENTERED.md) or [open an issue](https://github.com/yourrepo/issues).

---

## 📌 Minimal Quick Reference

```typescript
// 1. Import
import { CreateHabitModalCentered } from '@/components/CreateHabitModal/CreateHabitModalCentered';

// 2. Add state
const [isVisible, setIsVisible] = useState(false);

// 3. Add handler
const handleCreate = async (data: HabitFormData) => {
  await createHabit(data);
  setIsVisible(false);
};

// 4. Render
<CreateHabitModalCentered
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  onCreate={handleCreate}
/>
```

**That's it! 🚀**

---

**Last Updated:** January 5, 2026
**Version:** 1.0.0
**Component:** CreateHabitModalCentered
