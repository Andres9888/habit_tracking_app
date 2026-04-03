# Fix: Habit detail screen doesn't reflect edits until reopened

## Context

When editing a habit (changing emoji, name, or color) and saving, the HabitDetailScreen continues showing the old values. The user has to navigate back to the homepage and re-open the detail to see changes. This is because the sync hook that keeps `selectedHabit` in sync with fresh Convex query data only tracks `currentStreak` and `strength` — it ignores visual fields like `icon`, `name`, `color`.

## Root Cause

**File:** `src/features/habits/hooks/useHabitStateSync.ts` (lines 38-43)

The hook compares only `currentStreak` and `strength` to decide whether to update the local `selectedHabit` state. When the edit screen mutates `icon`, `name`, `color`, `iconColor` via Convex, the habits list updates reactively, but the sync hook doesn't detect those changes, so `selectedHabit` stays stale.

## Fix — Single file change

**`src/features/habits/hooks/useHabitStateSync.ts`**

Add `name`, `icon`, `color`, `iconColor` to the tracked fields in `prevValuesRef` and the change detection condition. Same pattern already used for streak/strength — primitive `!==` comparisons.

The file goes from 54 to ~70 lines (within 100-line limit).

## Verification

1. Open habit detail screen, tap Edit, change emoji, save — emoji should update immediately on detail screen
2. Repeat for name and color changes
3. Confirm streak/strength sync still works (existing behavior)
