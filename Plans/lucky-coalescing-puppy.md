# Fix: Calendar Timeline Bottom Sheet Shows Double Emoji

## Context

When tapping a date in the calendar timeline, the bottom sheet shows each habit with a double emoji — e.g., "🤪 🐶 BbhHj" instead of "🐶 BbhHj". This happens because:

1. **Save handler** (`useHabitSaveHandler.ts:42-44`) stores `name` as `"${emoji} ${text}"` AND also stores `icon: selectedEmoji` separately
2. **HabitDayToggleRow** renders `habit.icon` (line 75) AND `habit.name` (line 84) — resulting in emoji shown twice

The main habit cards (`DraggableHabit`) already handle this correctly by using `getEmojiAndName()` to strip the emoji from the name before display.

## Fix

**File:** `src/components/DayHabitsBottomSheet/HabitDayToggleRow/HabitDayToggleRow.tsx`

1. Import `getEmojiAndName` from `DraggableHabit.hooks`
2. Parse `habit.name` to extract just the text (without leading emoji)
3. Display the parsed name instead of `habit.name` on line 84
4. Also fix the accessibility label on line 55

The existing utility `getEmojiAndName` at `src/components/DraggableHabit/DraggableHabit.hooks.ts:12-25` does exactly this.

## Verification

- Open the app, tap a date in the calendar timeline
- Confirm each habit row shows: **one emoji icon + text name** (no duplicate emoji)
- Check habits both with and without custom icons
