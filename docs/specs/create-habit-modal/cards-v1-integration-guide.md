# Cards V1 Integration Guide

**Date:** 2026-01-04
**Status:** Ready for Implementation
**Target File:** `src/components/CreateHabitModal/CreateHabitModal.tsx`

---

## Overview

This guide shows the exact changes needed to integrate Cards V1 components into CreateHabitModal.tsx. All individual card components have been created (Tasks 1-9 complete). This is the final integration step (Task 10).

---

## Changes Required

### 1. Add New Imports

**Location:** Top of file (after existing imports)

```typescript
// Cards V1 imports
import { useFormCompletion } from './hooks/useFormCompletion';
import { ModalHeaderV1 } from './components/ModalHeaderV1';
import { BasicInfoCard } from './components/BasicInfoCard';
import { AppearanceCard } from './components/AppearanceCard';
import { ScheduleCard } from './components/ScheduleCard';
```

**Remove (no longer needed with cards):**
```typescript
// Remove these individual imports - now wrapped in cards
import { ModalHeader } from './components/ModalHeader';
import { HabitNameField } from './components/HabitNameField';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { TimeOfDaySelector, type TimeOfDay } from './components/TimeOfDaySelector';
import { ReminderSelector } from './components/ReminderSelector';
import { FrequencySelector } from './components/FrequencySelector';
```

---

### 2. Add Form Completion Hook

**Location:** Inside component, after existing state (around line 46)

```typescript
// Cards V1: Track form completion state
const completion = useFormCompletion(
  form.habitName,
  form.selectedEmoji,
  form.selectedColor,
  selectedDays
);
```

---

### 3. Replace ModalHeader with ModalHeaderV1

**Location:** Inside Modal render (around line 175)

**Before (V4):**
```tsx
<ModalHeader
  habitName={form.habitName}
  isEditMode={isEditMode}
  onClose={onClose}
  onSave={handleCreate}
/>
```

**After (Cards V1):**
```tsx
<ModalHeaderV1
  onClose={onClose}
  completedSections={completion.completedCount}
  totalSections={completion.totalCount}
/>
```

---

### 4. Replace LivePreview with Enhanced LivePreviewCard

**Location:** Inside ScrollView (around line 192)

**Before (V4):**
```tsx
<Animated.View entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}>
  <View className='mt-4' />
  <LivePreviewCard
    habitName={form.habitName}
    emoji={form.selectedEmoji}
    color={form.selectedColor}
    timeOfDay={timeOfDay}
    selectedDays={selectedDays}
  />
</Animated.View>
```

**After (Cards V1):**
```tsx
<Animated.View entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}>
  <View className='mt-4' />
  <LivePreviewCard
    habitName={form.habitName}
    emoji={form.selectedEmoji}
    color={form.selectedColor}
    timeOfDay={timeOfDay}
    selectedDays={selectedDays}
    reminderEnabled={reminderEnabled}
    reminderTime={reminderTime}
  />
</Animated.View>
```

---

### 5. Replace Inline Components with Cards

**Location:** Inside ScrollView, after LivePreviewCard

**Before (V4 - Inline Components):**
```tsx
<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY)}
>
  <HabitNameField
    autoFocus={visible && !isEditMode}
    value={form.habitName}
    onChange={handleNameChange}
  />
</Animated.View>

<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 2)}
>
  <EmojiPicker
    habitName={form.habitName}
    selectedEmoji={form.selectedEmoji}
    onSelect={handleEmojiSelect}
  />
</Animated.View>

<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 3)}
>
  <ColorPickerSection
    colors={HABIT_COLORS}
    selectedColor={form.selectedColor}
    onCustomPress={form.openColorPicker}
    onSelectColor={handleColorSelect}
  />
</Animated.View>

<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 4)}
>
  <TimeOfDaySelector
    value={timeOfDay}
    onChange={handleTimeOfDayChange}
  />
</Animated.View>

<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 5)}
>
  <ReminderSelector
    enabled={reminderEnabled}
    time={reminderTime}
    onToggle={handleReminderToggle}
  />
</Animated.View>

<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 6)}
>
  <FrequencySelector
    selectedDays={selectedDays}
    onChange={handleFrequencyChange}
  />
</Animated.View>
```

**After (Cards V1 - Card Components):**
```tsx
{/* Card 1: Basic Info */}
<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY)}
>
  <BasicInfoCard
    habitName={form.habitName}
    onHabitNameChange={handleNameChange}
    isComplete={completion.basicInfoComplete}
    autoFocus={visible && !isEditMode}
  />
</Animated.View>

{/* Card 2: Appearance */}
<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 2)}
>
  <AppearanceCard
    selectedEmoji={form.selectedEmoji}
    selectedColor={form.selectedColor}
    habitName={form.habitName}
    colors={HABIT_COLORS}
    onEmojiChange={handleEmojiSelect}
    onColorChange={handleColorSelect}
    onCustomPress={form.openColorPicker}
    isComplete={completion.appearanceComplete}
  />
</Animated.View>

{/* Card 3: Schedule */}
<Animated.View
  entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_STAGGER_DELAY * 3)}
>
  <ScheduleCard
    timeOfDay={timeOfDay}
    reminderEnabled={reminderEnabled}
    reminderTime={reminderTime}
    selectedDays={selectedDays}
    onTimeOfDayChange={handleTimeOfDayChange}
    onReminderToggle={handleReminderToggle}
    onReminderTimePress={() => {
      // TODO: Open time picker modal
      console.log('Open time picker');
    }}
    onFrequencyChange={handleFrequencyChange}
    isComplete={completion.scheduleComplete}
  />
</Animated.View>
```

---

### 6. Update Create Button Disabled Logic

**Location:** Sticky footer section (around line 291)

**Before (V4):**
```tsx
disabled={form.habitName.trim().length < 2}
```

**After (Cards V1):**
```tsx
disabled={!completion.isFormComplete}
```

**Also update the background color logic:**

**Before:**
```tsx
style={{
  backgroundColor: form.habitName.trim().length >= 2 ? '#10B981' : '#d6d3d1',
  opacity: form.habitName.trim().length >= 2 ? 1 : 0.5,
}}
```

**After:**
```tsx
style={{
  backgroundColor: completion.isFormComplete ? '#10B981' : '#d6d3d1',
  opacity: completion.isFormComplete ? 1 : 0.5,
}}
```

**And update accessibility hint:**

**Before:**
```tsx
accessibilityHint={
  form.habitName.trim().length < 2
    ? 'Enter at least 2 characters to create habit'
    : 'Create your new habit'
}
```

**After:**
```tsx
accessibilityHint={
  !completion.isFormComplete
    ? 'Complete required sections to create habit'
    : 'Create your new habit'
}
```

---

## Complete Diff Summary

Here's a summary of all changes:

### Additions
1. ✅ 5 new imports (useFormCompletion, ModalHeaderV1, BasicInfoCard, AppearanceCard, ScheduleCard)
2. ✅ 1 new hook call (useFormCompletion)
3. ✅ 3 new card components in render
4. ✅ 2 new props for LivePreviewCard (reminderEnabled, reminderTime)

### Removals
1. ❌ 7 removed imports (ModalHeader, HabitNameField, EmojiPicker, ColorPickerSection, TimeOfDaySelector, ReminderSelector, FrequencySelector)
2. ❌ 6 removed inline component sections (replaced with 3 cards)

### Modifications
1. 🔄 ModalHeader → ModalHeaderV1 with progress props
2. 🔄 Create button disabled logic (habitName.length → completion.isFormComplete)
3. 🔄 LivePreviewCard with reminder props

---

## Testing Checklist

After making these changes, test:

### Functional Testing
- [ ] Modal opens and displays all 3 cards
- [ ] Progress bar shows "0 of 3 complete" initially
- [ ] Entering habit name shows checkmark on Basic Info card
- [ ] Progress updates to "1 of 3 complete"
- [ ] Selecting emoji and color shows checkmark on Appearance card
- [ ] Progress updates to "2 of 3 complete"
- [ ] Selecting at least one day shows checkmark on Schedule card
- [ ] Progress updates to "3 of 3 complete"
- [ ] Create button is disabled until Basic Info + Schedule complete
- [ ] Create button is enabled even without Appearance (optional)
- [ ] Frequency presets work (Daily/Weekdays/Weekends)
- [ ] Smart emoji hints appear for keywords
- [ ] Character counter displays correctly
- [ ] Reminder time displays in live preview when enabled

### Visual Testing
- [ ] Card shadows and spacing match design
- [ ] Progress bar animates smoothly
- [ ] Checkmarks appear/disappear smoothly
- [ ] Badges show correct colors (red=required, blue=optional, green=complete)
- [ ] Live preview gradient background displays
- [ ] "Live" badge with sparkles icon displays

### Edge Cases
- [ ] Empty habit name doesn't mark Basic Info complete
- [ ] Whitespace-only name doesn't mark complete
- [ ] Deselecting all days removes Schedule checkmark
- [ ] Long habit names don't break layout
- [ ] Special characters and emoji work in habit name

---

## Rollback Plan

If issues occur, simply revert these changes:

1. Remove Cards V1 imports
2. Restore original imports (ModalHeader, HabitNameField, etc.)
3. Restore inline component sections
4. Restore original Create button disabled logic
5. Remove useFormCompletion hook call

The app will return to V4 exactly as before.

---

## Feature Flag Option (Recommended)

For safer deployment, wrap the Cards V1 code in a feature flag:

```typescript
const USE_CARDS_V1 = false; // Set to true when ready to test

// In render:
{USE_CARDS_V1 ? (
  // Cards V1 implementation
  <ModalHeaderV1 ... />
) : (
  // V4 implementation
  <ModalHeader ... />
)}
```

This allows A/B testing and instant rollback without code changes.

---

## Next Steps

1. ✅ Make the changes outlined above
2. ✅ Test thoroughly using the checklist
3. ✅ Run existing CreateHabitModal tests (ensure they pass)
4. ✅ Deploy to staging environment
5. ✅ User acceptance testing
6. ✅ Production deployment with monitoring

---

**All Cards V1 components are ready and tested. This integration is the final step to bring everything together!**
