# Centered Habit Creation Form with Optional Fields - Specification

## Overview

Implement a centered layout for habit creation that prioritizes the required name input while making emoji, color, and reminder customization clearly optional. This design balances the minimal flow (fast creation) with customization options (power users).

## Design Philosophy

1. **Identity Before Behavior**: Users first define what the habit is (name + visual identity), then when it happens (reminder)
2. **Progressive Disclosure**: Required field is prominent, optional fields are clearly labeled but accessible
3. **Smart Defaults**: Reduce cognitive load through keyword-based emoji suggestions
4. **Fast Flow**: Name → Create in 2 taps, customization available but not required

## User Flow

```
1. User opens "Create Habit" modal
2. Focus immediately on centered name input
3. User types habit name (e.g., "Read for 20 minutes")
4. Emoji suggestions auto-update based on keywords (📚 appears)
5. [OPTIONAL] User customizes emoji, color, reminder
6. User taps "Create Habit" or presses Enter
7. Habit created with selected options or smart defaults
```

## Visual Hierarchy

```
┌─────────────────────────────────────┐
│ Header: "Create Habit"          [×] │
├─────────────────────────────────────┤
│                                     │
│     What habit do you               │
│     want to build?                  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ e.g., Read for 20 minutes    │  │ ← PRIMARY FOCUS
│  └───────────────────────────────┘  │
│           0/50 characters           │
│                                     │
│     CUSTOMIZE (OPTIONAL)            │ ← VISUAL BREAK
│                                     │
│  🎯 ✨ 💪 📖 🧘 💧 [+]             │
│                       More          │
│                                     │
│  🔴 🟠 🟡 🟢 🔵 🟣 ...             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Remind me    [12:00 PM] ○│   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [     Create Habit     ]           │
└─────────────────────────────────────┘
```

## Component Structure

### 1. CreateHabitFormCentered Component

**File**: `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`

**Props**:

```typescript
interface CreateHabitFormCenteredProps {
  // Name field
  habitName: string;
  onHabitNameChange: (value: string) => void;

  // Emoji picker
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;

  // Color picker
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onCustomColorPress: () => void;

  // Reminder
  reminderEnabled: boolean;
  reminderTime: string;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimePress?: () => void;

  // Form submission
  onSubmit: () => void;
  autoFocus?: boolean;
}
```

**Layout**:

- Top section: Centered name input with heading
- Middle section: "CUSTOMIZE (OPTIONAL)" label
- Bottom section: Emoji picker, color picker, reminder selector (scrollable)

### 2. CreateHabitModalCentered Component

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Responsibilities**:

- Modal presentation and dismissal
- Form state management via `useCreateHabitForm` hook
- Smart defaults application
- Keyboard handling (KeyboardAvoidingView)
- Swipe-to-dismiss gesture

**Smart Defaults**:

- Time: Afternoon (phase2_pivot)
- Reminder: Enabled at 12:00 PM
- Frequency: Daily (7 days)
- Color: First in palette (#EF4444)
- Emoji: Auto-assigned from keyword map or first suggestion

### 3. EmojiPicker Enhancement

**File**: `src/components/CreateHabitModal/components/EmojiPicker.tsx`

**Change Required**: Add "More" label to plus button

**Current**:

```tsx
<Pressable className='h-12 w-12 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-100'>
  <Plus color='#a8a29e' size={20} />
</Pressable>
```

**New Design** (Option 2 - Subtle Label):

```tsx
<View className='items-center gap-1'>
  <Pressable className='h-12 w-12 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-100'>
    <Plus color='#a8a29e' size={20} />
  </Pressable>
  <Text
    className='text-[10px] font-semibold uppercase text-stone-500'
    style={{ letterSpacing: 0.3 }}
  >
    More
  </Text>
</View>
```

## Technical Implementation Details

### Field Order & Spacing

1. **Name Input Section** (marginTop: 40, marginBottom: 32)
   - Heading: 3xl (30px), bold, centered, 2 lines
   - Input: xl (20px), centered text, rounded-2xl (16px)
   - Counter: xs (12px), stone-400

2. **Optional Section Label** (marginBottom: 16)
   - Text: xs (12px), semibold, stone-500, uppercase, letter-spacing: 0.5

3. **Emoji Picker** (marginBottom: 32)
   - 6 emoji chips (48×48px) + 1 more button
   - Gap: 8px, flex-wrap, justify-center

4. **Color Picker** (marginBottom: 32)
   - 12 color chips (36×36px) + 1 custom button
   - Gap: 10px, flex-wrap, justify-center

5. **Reminder Card** (marginBottom: 20)
   - Border: 1px stone-200, shadow-sm
   - Padding: 14px, rounded-xl

### Keyboard Handling

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
```

**Enter Key Behavior**:

- When name is valid (≥2 chars), Enter key submits form
- Input has `returnKeyType="done"` and `onSubmitEditing` handler

### Validation Rules

**Required**:

- Habit name: minimum 2 characters, maximum 50 characters

**Optional**:

- Emoji: can be null (auto-assigned on creation)
- Color: defaults to first in palette
- Reminder: defaults to disabled (or enabled at 12 PM based on UX decision)

### Gesture Support

**Swipe-to-Dismiss**:

```typescript
const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationY > 0) {
      translateY.value = event.translationY;
    }
  })
  .onEnd((event) => {
    if (event.translationY > 100) {
      runOnJS(onClose)();
    } else {
      translateY.value = withSpring(0);
    }
  });
```

## Accessibility

### Screen Reader Support

1. **Name Input**:
   - Label: "What habit do you want to build?"
   - Placeholder: "e.g., Read for 20 minutes"
   - Hint: Character counter announced on change

2. **Emoji Picker**:
   - Each chip: "Select emoji [emoji]"
   - More button: "Browse all icons" (accessibilityHint: "Opens full emoji picker")
   - Selected state announced

3. **Color Picker**:
   - Each chip: "[Color name] color" + selected state
   - Uses getColorName utility for human-readable names

4. **Reminder Toggle**:
   - Label: "Remind me"
   - Switch: "Toggle reminder on/off"
   - Time display announced

### Reduced Motion

- Respects `useReduceMotion` hook
- Disables animations when user prefers reduced motion
- Maintains functionality without animations

## State Management

### Form Hook Integration

Uses existing `useCreateHabitForm` hook:

```typescript
const form = useCreateHabitForm();

// Access methods:
form.habitName;
form.setHabitName(value);
form.selectedEmoji;
form.setSelectedEmoji(emoji);
form.selectedColor;
form.setSelectedColor(color);
form.dayPhase;
form.setDayPhase(phase);
form.reminderTime;
form.setReminderTime(date);
form.remindersEnabled;
form.setRemindersEnabled(enabled);
form.frequency;
form.reset();
```

### Modal State

```typescript
const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);
const translateY = useSharedValue(0);
```

## Integration Path

### Option A: Replace Existing Modal (Recommended)

Update `src/screens/HabitsScreen.tsx`:

```typescript
import { CreateHabitModalCentered } from '../components/CreateHabitModal/CreateHabitModalCentered';

// Replace existing modal
<CreateHabitModalCentered
  visible={isCreateHabitModalVisible}
  onClose={() => setIsCreateHabitModalVisible(false)}
  onCreate={handleCreateHabit}
/>
```

### Option B: Side-by-Side (Testing)

Keep both implementations temporarily:

```typescript
const [modalVersion, setModalVersion] = useState<'original' | 'centered'>('centered');

{modalVersion === 'original' ? (
  <CreateHabitModal {...props} />
) : (
  <CreateHabitModalCentered {...props} />
)}
```

### Option C: Feature Flag

```typescript
const USE_CENTERED_LAYOUT = true; // or from config/feature flags

{USE_CENTERED_LAYOUT ? (
  <CreateHabitModalCentered {...props} />
) : (
  <CreateHabitModal {...props} />
)}
```

## Testing Requirements

### Unit Tests

1. **CreateHabitFormCentered**:
   - ✓ Renders with all required props
   - ✓ Name input updates on text change
   - ✓ Character counter updates correctly
   - ✓ Submit button disabled when name < 2 chars
   - ✓ Submit button enabled when name ≥ 2 chars
   - ✓ Enter key triggers submit when valid
   - ✓ Emoji selection updates state
   - ✓ Color selection updates state
   - ✓ Reminder toggle updates state

2. **CreateHabitModalCentered**:
   - ✓ Modal opens and closes correctly
   - ✓ Form resets on modal open
   - ✓ Smart defaults applied on creation
   - ✓ Swipe gesture dismisses modal when translateY > 100
   - ✓ Swipe gesture bounces back when translateY < 100
   - ✓ Custom color picker opens/closes
   - ✓ Time picker opens/closes
   - ✓ onCreate called with correct data structure

3. **EmojiPicker Enhancement**:
   - ✓ "More" label renders below plus button
   - ✓ More button opens full emoji picker
   - ✓ Accessibility labels correct

### Integration Tests

1. **Full Flow - Minimal Input**:
   - User types "Read"
   - 📚 emoji auto-suggested
   - User presses "Create Habit"
   - Habit created with defaults (afternoon, 12 PM, daily, red)

2. **Full Flow - Custom Options**:
   - User types "Meditate"
   - User selects 🧘 emoji
   - User selects purple color
   - User enables reminder, sets 7 AM
   - User presses "Create Habit"
   - Habit created with custom options

3. **Edge Cases**:
   - Empty name → button disabled
   - 1 character → button disabled
   - 2 characters → button enabled
   - 50 characters → accepts
   - 51 characters → truncated
   - Special characters in name → accepted
   - Emoji in name → accepted

### Manual QA Checklist

- [ ] Modal opens with smooth animation
- [ ] Focus immediately on name input
- [ ] Typing updates emoji suggestions in real-time
- [ ] "CUSTOMIZE (OPTIONAL)" label clearly visible
- [ ] "More" label visible and understandable
- [ ] Emoji selection has green ring indicator
- [ ] Color selection has outer ring shadow
- [ ] Reminder toggle animates smoothly
- [ ] Time picker opens on time press (when enabled)
- [ ] Custom color picker opens on "+" press
- [ ] Swipe down dismisses modal
- [ ] Small swipe bounces back
- [ ] Enter key creates habit (when valid)
- [ ] Button disabled state clear
- [ ] Button enabled state clear
- [ ] Created habit has correct data
- [ ] Modal resets after creation
- [ ] Keyboard avoidance works correctly
- [ ] Scrolling works with long content
- [ ] Safe area insets respected
- [ ] Reduced motion respected

## Performance Considerations

### Emoji Suggestion Debouncing

Current implementation uses 300ms debounce:

```typescript
const SUGGESTION_DEBOUNCE_MS = 300;

useEffect(() => {
  if (debounceTimeoutRef.current) {
    clearTimeout(debounceTimeoutRef.current);
  }

  debounceTimeoutRef.current = setTimeout(() => {
    setDebouncedHabitName(habitName || '');
  }, SUGGESTION_DEBOUNCE_MS);

  return () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  };
}, [habitName]);
```

**Why**: Prevents jittery updates while user is typing

### Memoization

Emoji suggestions are memoized:

```typescript
const suggestedEmojis = useMemo(() => {
  if (!debouncedHabitName.trim()) {
    return DEFAULT_EMOJIS;
  }
  return suggestEmojisForHabitName(debouncedHabitName, 6);
}, [debouncedHabitName]);
```

**Why**: Expensive keyword matching only runs when debounced name changes

### Animation Performance

- Uses `react-native-reanimated` for native-thread animations
- `useSharedValue` and `useAnimatedStyle` for smooth 60fps
- Worklet annotations for JS thread offloading

## Success Metrics

### Quantitative

- **Creation Time**: Target <15 seconds (vs ~60s wizard, ~30s single-page)
- **Completion Rate**: Target >90% of users who open modal
- **Customization Rate**: Track % who customize vs accept defaults
- **Error Rate**: Target <5% validation errors

### Qualitative

- User understands "More" button purpose
- User knows optional fields are optional
- User feels in control of customization
- User not overwhelmed by options

## Rollback Plan

If issues arise:

1. Keep both implementations in codebase
2. Add feature flag: `USE_CENTERED_LAYOUT`
3. Set to `false` to revert to original
4. Monitor crash analytics, user feedback
5. Fix issues in centered version
6. Re-enable when stable

## Future Enhancements

### V2 - Quick Templates

Add optional "Quick Start" section below name:

```
Quick Start (tap to auto-fill):
[📚 Daily Reading] [🧘 Morning Meditation] [💪 Workout]
```

### V3 - Contextual Hints

Show hints based on time of day:

```
Morning (8 AM): "Great time for meditation or exercise"
Evening (8 PM): "Perfect for reading or journaling"
```

### V4 - Recent Habits

Show "Recently Created" section:

```
Recently Created:
🏃 Run 3 miles  •  💧 Drink water  •  📖 Read
```

## Dependencies

### Existing Components (No Changes)

- `TimeOfDaySelector` - Time selection (morning/afternoon/evening)
- `FrequencySelector` - Day selection (M T W T F S S)
- `CustomColorPicker` - Full color picker modal
- `EmojiPickerSheet` - Full emoji picker modal

### Existing Utilities (No Changes)

- `suggestEmojisForHabitName` - Keyword matching
- `getColorName` - Color to human-readable name
- `useHapticFeedback` - Haptic feedback on interactions
- `useReduceMotion` - Reduced motion preference

### New Files

1. `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`
2. `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
3. `docs/specs/create-habit-modal/centered-optional-fields-spec.md` (this file)
4. `docs/specs/create-habit-modal/centered-optional-fields-tasks.md` (implementation tasks)

## Documentation Updates Required

- [ ] Update `INTEGRATION_GUIDE.md` with centered layout option
- [ ] Update `QUICK_START.md` with new component usage
- [ ] Add section to `STYLING_GUIDE.md` for centered layout
- [ ] Update screenshots in documentation

## Design Assets

HTML mockups for reference:

1. `.superdesign/design_iterations/habit_creation_centered_optional_fields.html` - Interactive prototype
2. `.superdesign/design_iterations/habit_creation_final_v11.html` - Final design with "More" label
3. `.superdesign/design_iterations/emoji_picker_options_comparison.html` - "More" button options

## Questions for Stakeholders

1. **Default Reminder State**: Should reminders be enabled by default (with 12 PM time), or disabled?
2. **Integration Timeline**: Replace immediately, A/B test, or feature flag?
3. **Emoji Fallback**: If no keyword match, use 🎯 or first default emoji?
4. **Character Limit**: Keep 50 chars or adjust based on UX feedback?
5. **Time Picker**: Native iOS/Android picker or custom component?

## Appendix: Color Palette

Default colors (12 total):

```typescript
const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
] as const;
```

## Appendix: Emoji Keyword Map

Sample keyword mappings:

```typescript
const emojiMap: Record<string, string> = {
  read: '📚',
  book: '📚',
  meditate: '🧘',
  meditation: '🧘',
  exercise: '💪',
  workout: '💪',
  gym: '💪',
  run: '🏃',
  running: '🏃',
  jog: '🏃',
  water: '💧',
  hydrate: '💧',
  drink: '💧',
  write: '✍️',
  journal: '✍️',
  gratitude: '🙏',
  yoga: '🧘',
  sleep: '😴',
  stretch: '🤸',
  walk: '🚶',
  code: '💻',
  study: '📖',
  learn: '📖',
  practice: '🎯',
  clean: '🧹',
  cook: '🍳',
  music: '🎵',
  guitar: '🎸',
  piano: '🎹',
  art: '🎨',
  draw: '🎨',
  paint: '🎨',
};
```

Full list in `src/utils/emojiKeywords.ts`
