# Centered Habit Creation Form - Specification & Implementation Guide

## Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [User Flow](#user-flow)
- [Visual Hierarchy](#visual-hierarchy)
- [Component Structure](#component-structure)
- [Technical Implementation](#technical-implementation)
- [Implementation Tasks](#implementation-tasks)
- [Testing Strategy](#testing-strategy)
- [Deployment Plan](#deployment-plan)
- [Success Metrics](#success-metrics)
- [Appendices](#appendices)

---

## Overview

Implement a centered layout for habit creation that prioritizes the required name input while making emoji, color, and reminder customization clearly optional. This design balances the minimal flow (fast creation) with customization options (power users).

**Key Features:**

- Centered name input with prominent heading
- "CUSTOMIZE (OPTIONAL)" section with emoji, color, reminder
- Subtle "More" label on emoji picker for discoverability
- Smart defaults reduce cognitive load
- 2-tap creation flow (name → create)

**Estimated Effort:** 18.5 hours (~2.5 days)

---

## Design Philosophy

1. **Identity Before Behavior**: Users first define what the habit is (name + visual identity), then when it happens (reminder)
2. **Progressive Disclosure**: Required field is prominent, optional fields are clearly labeled but accessible
3. **Smart Defaults**: Reduce cognitive load through keyword-based emoji suggestions
4. **Fast Flow**: Name → Create in 2 taps, customization available but not required

---

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

---

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

---

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

---

## Technical Implementation

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

### Accessibility

**Screen Reader Support**:

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

**Reduced Motion**:

- Respects `useReduceMotion` hook
- Disables animations when user prefers reduced motion
- Maintains functionality without animations

### State Management

**Form Hook Integration**:

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

**Modal State**:

```typescript
const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);
const translateY = useSharedValue(0);
```

### Performance Considerations

**Emoji Suggestion Debouncing** (300ms):

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

**Memoization**:

```typescript
const suggestedEmojis = useMemo(() => {
  if (!debouncedHabitName.trim()) {
    return DEFAULT_EMOJIS;
  }
  return suggestEmojisForHabitName(debouncedHabitName, 6);
}, [debouncedHabitName]);
```

**Animation Performance**:

- Uses `react-native-reanimated` for native-thread animations
- `useSharedValue` and `useAnimatedStyle` for smooth 60fps
- Worklet annotations for JS thread offloading

---

## Implementation Tasks

### Phase 1: Core Form Component (5 hours)

#### Task 1.1: Create CreateHabitFormCentered Component

**File**: `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`

**Estimated Effort**: 2 hours

**Dependencies**: None

**Acceptance Criteria**:

- [ ] Component accepts all required props (interface defined)
- [ ] Centered layout with heading split across 2 lines
- [ ] Name input with placeholder and character counter
- [ ] "CUSTOMIZE (OPTIONAL)" section label renders
- [ ] EmojiPicker component integrated
- [ ] ColorPickerSection component integrated
- [ ] ReminderSelector component integrated
- [ ] Keyboard submit (Enter key) triggers onSubmit
- [ ] Submit enabled only when name ≥ 2 chars

**Test Coverage**:

- Unit test: Component renders correctly
- Unit test: Name input updates state
- Unit test: Character counter shows correct count
- Unit test: Submit validation works

---

#### Task 1.2: Create CreateHabitModalCentered Component

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Estimated Effort**: 3 hours

**Dependencies**: Task 1.1

**Acceptance Criteria**:

- [ ] Modal presentation with pageSheet style
- [ ] Header with title and close button
- [ ] Form component integrated
- [ ] Footer with Create button
- [ ] KeyboardAvoidingView for iOS/Android
- [ ] useCreateHabitForm hook integrated
- [ ] Smart defaults applied on submit
- [ ] Custom color picker modal integration
- [ ] Time picker modal integration
- [ ] Modal resets on open

**Test Coverage**:

- Unit test: Modal opens/closes
- Unit test: Form resets on open
- Unit test: onCreate called with correct data
- Unit test: Smart defaults applied

---

### Phase 2: Emoji Picker Enhancement (1 hour)

#### Task 2.1: Add "More" Label to EmojiPicker

**File**: `src/components/CreateHabitModal/components/EmojiPicker.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: None (can run parallel with Phase 1)

**Acceptance Criteria**:

- [ ] Plus button wrapped in View with vertical layout
- [ ] "More" text label added below plus icon
- [ ] Label: 10px, semibold, uppercase, stone-500
- [ ] 4px gap between icon and label
- [ ] Accessibility labels updated
- [ ] Existing functionality preserved
- [ ] Animation/hover states work correctly

**Test Coverage**:

- Unit test: More label renders
- Unit test: Accessibility labels correct
- Snapshot test: Visual regression

---

### Phase 3: Gesture & Animation (2 hours)

#### Task 3.1: Implement Swipe-to-Dismiss Gesture

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Estimated Effort**: 2 hours

**Dependencies**: Task 1.2

**Acceptance Criteria**:

- [ ] Pan gesture detects downward swipe
- [ ] translateY tracks finger position
- [ ] Swipe > 100px dismisses modal
- [ ] Swipe < 100px springs back to 0
- [ ] Animated.View applies transform
- [ ] No interference with scrolling

**Test Coverage**:

- Unit test: Gesture handler registered
- Manual QA: Swipe behavior correct

---

### Phase 4: Integration & Testing (6 hours)

#### Task 4.1: Integrate into HabitsScreen

**File**: `src/screens/HabitsScreen.tsx`

**Estimated Effort**: 1 hour

**Dependencies**: Tasks 1.1, 1.2, 2.1

**Acceptance Criteria**:

- [ ] Import CreateHabitModalCentered
- [ ] Replace/conditional render with feature flag
- [ ] handleCreateHabit works with new modal
- [ ] No breaking changes to existing flow
- [ ] TypeScript types compatible

**Test Coverage**:

- Integration test: Full creation flow
- Integration test: Modal lifecycle

---

#### Task 4.2: Write Unit Tests

**Files**:

- `src/components/CreateHabitModal/components/CreateHabitFormCentered.test.tsx`
- `src/components/CreateHabitModal/CreateHabitModalCentered.test.tsx`
- `src/components/CreateHabitModal/components/EmojiPicker.test.tsx`

**Estimated Effort**: 3 hours

**Dependencies**: Tasks 1.1, 1.2, 2.1

**Acceptance Criteria**:

- [ ] All test cases from spec passing
- [ ] Code coverage > 80%
- [ ] Edge cases covered
- [ ] Snapshot tests for visual components
- [ ] Accessibility tests pass

**Test Coverage**: N/A (this is test creation)

---

#### Task 4.3: Manual QA Testing

**Estimated Effort**: 2 hours

**Dependencies**: Task 4.1

**Manual QA Checklist**:

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
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Tested on physical device (if available)
- [ ] Accessibility tested with screen reader

---

### Phase 5: Documentation & Polish (4.5 hours)

#### Task 5.1: Update Documentation

**Files**:

- `docs/specs/create-habit-modal/INTEGRATION_GUIDE.md`
- `docs/specs/create-habit-modal/QUICK_START.md`
- `docs/specs/create-habit-modal/STYLING_GUIDE.md`

**Estimated Effort**: 2 hours

**Dependencies**: Task 4.1

**Acceptance Criteria**:

- [ ] Integration guide includes centered layout option
- [ ] Quick start updated with new component
- [ ] Styling guide has centered layout section
- [ ] Code examples accurate
- [ ] Screenshots updated (if applicable)

---

#### Task 5.2: Performance Optimization Review

**File**: All components

**Estimated Effort**: 1 hour

**Dependencies**: All previous tasks

**Acceptance Criteria**:

- [ ] Emoji debouncing working (300ms)
- [ ] Memoization effective (no unnecessary re-renders)
- [ ] Animations run at 60fps
- [ ] No memory leaks (cleanup functions)
- [ ] React DevTools Profiler shows good performance

---

#### Task 5.3: Accessibility Audit

**Files**: All components

**Estimated Effort**: 1.5 hours

**Dependencies**: All previous tasks

**Acceptance Criteria**:

- [ ] All interactive elements have accessibility labels
- [ ] Screen reader announces state changes
- [ ] Focus order logical
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion preference respected
- [ ] Keyboard navigation works

---

### Task Summary

**Total Estimated Effort**: 18.5 hours (~2.5 days)

**Phase Breakdown**:

- Phase 1 (Core): 5 hours
- Phase 2 (Enhancement): 1 hour
- Phase 3 (Gestures): 2 hours
- Phase 4 (Integration): 6 hours
- Phase 5 (Polish): 4.5 hours

**Critical Path**:

1. Task 1.1 → Task 1.2 → Task 4.1 → Task 4.3
2. Task 2.1 (parallel with Phase 1)
3. Task 3.1 (depends on Task 1.2)
4. Task 4.2 (parallel with Task 4.3)
5. Phase 5 (after all features complete)

**Dependencies Graph**:

```
Task 1.1 ──┬─→ Task 1.2 ──┬─→ Task 3.1
           │              │
           │              ├─→ Task 4.1 ──┬─→ Task 4.3 ──→ Phase 5
           │              │               │
           └──────────────┴─→ Task 4.2 ───┘

Task 2.1 ────────────────────┘
```

**Risk Assessment**:

**High Risk**:

- Task 3.1 (Swipe gesture conflicts with scroll)
- Task 4.1 (Integration breaking changes)

**Medium Risk**:

- Task 1.2 (Smart defaults complexity)
- Task 4.3 (Manual QA finding issues)

**Low Risk**:

- Task 1.1 (Straightforward component)
- Task 2.1 (Minor UI change)

---

## Testing Strategy

### Unit Tests (Jest + React Native Testing Library)

```typescript
// Example: CreateHabitFormCentered.test.tsx
describe('CreateHabitFormCentered', () => {
  it('renders centered heading', () => {
    const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
    expect(getByText(/What habit do you/i)).toBeTruthy();
  });

  it('enables submit when name is valid', () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateHabitFormCentered {...defaultProps} />
    );
    const input = getByPlaceholderText(/e.g., Read/i);

    fireEvent.changeText(input, 'Re'); // 2 chars

    const button = getByText('Create Habit');
    expect(button).not.toBeDisabled();
  });

  it('calls onSubmit when Enter pressed', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <CreateHabitFormCentered {...defaultProps} habitName="Read" onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText(/e.g., Read/i);
    fireEvent(input, 'onSubmitEditing');

    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Integration Tests (Detox)

```typescript
// Example: CreateHabitFlow.e2e.ts
describe('Create Habit - Centered Layout', () => {
  it('should create habit with minimal input', async () => {
    await element(by.id('create-habit-button')).tap();
    await element(by.id('habit-name-input')).typeText('Read for 20 minutes');
    await element(by.text('Create Habit')).tap();

    await expect(element(by.text('Read for 20 minutes'))).toBeVisible();
  });

  it('should create habit with custom options', async () => {
    await element(by.id('create-habit-button')).tap();
    await element(by.id('habit-name-input')).typeText('Meditate');
    await element(by.id('emoji-picker-🧘')).tap();
    await element(by.id('color-picker-#8B5CF6')).tap();
    await element(by.id('reminder-switch')).tap();
    await element(by.text('Create Habit')).tap();

    await expect(element(by.text('Meditate'))).toBeVisible();
  });
});
```

### Edge Cases

- Empty name → button disabled
- 1 character → button disabled
- 2 characters → button enabled
- 50 characters → accepts
- 51 characters → truncated
- Special characters in name → accepted
- Emoji in name → accepted

---

## Deployment Plan

### Step 1: Feature Flag Setup

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_CREATION: false, // Start disabled
} as const;
```

### Step 2: Gradual Rollout

1. **Week 1**: Internal testing (flag enabled for team)
2. **Week 2**: Beta users (10% of users)
3. **Week 3**: Expand to 50% of users
4. **Week 4**: Full rollout (100% of users)

### Step 3: Monitoring

Track metrics:

- Modal open rate
- Completion rate (created / opened)
- Average creation time
- Customization rate (% who change defaults)
- Error rate
- Crash rate

### Step 4: Rollback Criteria

Rollback if any of:

- Completion rate drops > 10%
- Crash rate increases > 5%
- Major accessibility issues reported
- Critical bugs found

### Integration Options

**Option A: Replace Existing Modal (Recommended)**:

```typescript
import { CreateHabitModalCentered } from '../components/CreateHabitModal/CreateHabitModalCentered';

<CreateHabitModalCentered
  visible={isCreateHabitModalVisible}
  onClose={() => setIsCreateHabitModalVisible(false)}
  onCreate={handleCreateHabit}
/>;
```

**Option B: Feature Flag**:

```typescript
const USE_CENTERED_LAYOUT = true; // or from config/feature flags

{
  USE_CENTERED_LAYOUT ? (
    <CreateHabitModalCentered {...props} />
  ) : (
    <CreateHabitModal {...props} />
  );
}
```

---

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

### Success Criteria

**Must Have** (Blockers):

- ✅ All unit tests passing
- ✅ No TypeScript errors
- ✅ Accessibility labels complete
- ✅ Manual QA checklist 100% pass
- ✅ No performance regressions

**Should Have** (Nice to Have):

- ✅ Integration tests passing
- ✅ Code coverage > 80%
- ✅ Documentation complete
- ✅ Performance optimizations applied

**Could Have** (Future):

- Performance improvements over baseline
- Higher completion rates in A/B test
- Positive user feedback
- Reduced support tickets

---

## Code Review Checklist

### Before Submitting PR

- [ ] All tasks marked complete
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No console.log statements
- [ ] All TODOs resolved or documented
- [ ] Accessibility labels present
- [ ] Performance profiling done
- [ ] Documentation updated

### Reviewer Focus Areas

1. **Accessibility**: Screen reader support, keyboard navigation
2. **Performance**: Memoization, animation performance
3. **Edge Cases**: Empty states, validation, error handling
4. **Design Consistency**: Spacing, colors, typography
5. **Code Quality**: Reusability, maintainability, clarity

---

## Rollback Plan

If issues arise:

1. Keep both implementations in codebase
2. Add feature flag: `USE_CENTERED_LAYOUT`
3. Set to `false` to revert to original
4. Monitor crash analytics, user feedback
5. Fix issues in centered version
6. Re-enable when stable

---

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

---

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

---

## Design Assets

HTML mockups for reference:

1. `.superdesign/design_iterations/habit_creation_centered_optional_fields.html` - Interactive prototype
2. `.superdesign/design_iterations/habit_creation_final_v11.html` - Final design with "More" label
3. `.superdesign/design_iterations/emoji_picker_options_comparison.html` - "More" button options

---

## Questions & Decisions

1. **Q**: Should we A/B test vs original?
   **A**: TBD - Discuss with product team

2. **Q**: Default reminder state?
   **A**: TBD - Analyze current user behavior

3. **Q**: Remove old modal when?
   **A**: After 2 weeks of stable rollout

4. **Q**: Custom emoji picker needed?
   **A**: No - existing EmojiPickerSheet sufficient

5. **Q**: Analytics events to track?
   **A**:
   - `habit_creation_modal_opened`
   - `habit_creation_modal_closed`
   - `habit_created`
   - `habit_creation_customized` (if any optional field changed)
   - `habit_creation_emoji_browsed` (if More button tapped)

---

## Appendices

### Appendix A: Color Palette

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

### Appendix B: Emoji Keyword Map

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

### Appendix C: Notes

- Keep original `CreateHabitModal` until centered version is stable
- Add feature flag for easy rollback
- Monitor analytics closely during rollout
- Gather user feedback through in-app surveys
- Consider A/B testing if possible

### Appendix D: Documentation Updates Required

- [ ] Update `INTEGRATION_GUIDE.md` with centered layout option
- [ ] Update `QUICK_START.md` with new component usage
- [ ] Add section to `STYLING_GUIDE.md` for centered layout
- [ ] Update screenshots in documentation
