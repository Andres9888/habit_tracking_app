# Calendar Heatmap Fix & UX Improvements

## Problem
The calendar heatmap in the Habit Details Progress tab does not toggle completion when tapping dates. The `onDayPress` callback is empty (line 836-838 in HabitDetailScreen.tsx).

## Root Cause
```tsx
onDayPress={(date, completed) => {
  // Future: Could open day detail or allow editing past dates
}}
```
The handler is empty - it was left as a placeholder.

## Expected Behavior
- Tap any past date → Toggle completion status
- Tap today → Toggle completion status
- Tap future dates → No action (disabled)
- Tap dates before habit creation → No action (disabled)

## Current State
- DayCell component correctly calls `onPress(date, completed)` ✓
- DayCell correctly prevents press for future/pre-creation dates ✓
- CalendarHeatmap passes `onDayPress` prop ✓
- **HabitDetailScreen has empty handler** ✗

## Tasks

### T1: Implement Date Toggle Handler
- [ ] T1.1: Add `handleCalendarDayPress` function in HabitDetailScreen
- [ ] T1.2: Call `toggleCompletion` mutation with the selected date
- [ ] T1.3: Add haptic feedback on toggle
- [ ] T1.4: Handle loading state during toggle

### T2: Visual Feedback Improvements
- [ ] T2.1: Add press animation to DayCell (already has scale animation on press)
- [ ] T2.2: Add optimistic UI update - show completion immediately before server confirms
- [ ] T2.3: Add subtle success animation when toggling (checkmark pop-in)
- [ ] T2.4: Show loading spinner on cell while mutation is in progress

### T3: Calendar UI/UX Enhancements
- [ ] T3.1: Add "Tap to mark complete" tooltip on first visit
- [ ] T3.2: Add legend showing cell states (completed, today, empty, future)
- [ ] T3.3: Improve month transition animations
- [ ] T3.4: Add confetti burst when completing today's date

### T4: Edge Cases & Error Handling
- [ ] T4.1: Debounce rapid taps on same date
- [ ] T4.2: Show error toast if toggle fails
- [ ] T4.3: Revert optimistic update on failure
- [ ] T4.4: Handle offline state gracefully

### T5: Testing
- [ ] T5.1: Test toggling today's date
- [ ] T5.2: Test toggling past dates
- [ ] T5.3: Test toggling date from previous month
- [ ] T5.4: Verify streak updates correctly after toggle
- [ ] T5.5: Test rapid tap handling

## Implementation Details

### Files to Modify
- `src/screens/HabitDetailScreen.tsx` - Add handler implementation
- `src/components/CalendarHeatmap/DayCell.tsx` - Add loading/success states (optional)

### Handler Implementation
```tsx
const handleCalendarDayPress = useCallback(async (date: string, currentlyCompleted: boolean) => {
  if (!habit) return;

  // Haptic feedback
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  // Toggle completion
  await toggleCompletion({
    habitId: habit._id,
    date,
  });
}, [habit, toggleCompletion]);
```

### Streak Calculation
Already fixed to use `calculateStreakFromHistory()` - backfilled dates will correctly update streak.

## Design Notes
- Completed cells: Filled with habit color + check icon ✓
- Today (incomplete): Amber border + pulse animation ✓
- Past (incomplete): Light gray background ✓
- Future: Dashed border, disabled ✓
- Before creation: Very dimmed, disabled ✓
