# Habit Pause Feature - PR Summary

## Overview
This PR implements a **Habit Pause** feature that allows users to temporarily pause habits (e.g., during vacation, illness, or breaks) without losing their streak or progress.

## Changes Made

### Backend (Convex)

#### Schema Updates
- **No new schema fields** - The schema already contained `paused`, `pausedAt`, `resumedAt`, `pausedAtStrength`, `pausedAtAccessibility` fields
- These fields are now actively used by the pause/resume system

#### Queries
1. **`habits.list`** - Modified to include paused habits alongside active habits
   - Paused habits are no longer filtered out at the query level
   - Frontend displays them with dimmed appearance and "Paused" badge
   
2. **`habits.listPaused`** - Existing query that returns only paused habits for a user

#### Mutations
1. **`habits.pause(habitId, timezone?)`**
   - Marks a habit as paused
   - Saves current state: `accessibility`, `strength`, `pausedAt` timestamp
   - Automatically recalculates streak excluding paused period
   - Preserves habit data for resume

2. **`habits.resume(habitId, timezone?)`**
   - Resumes a paused habit
   - Restores saved `strength` and `accessibility` from pause
   - Sets `resumedAt` timestamp
   - Recalculates streak to include post-pause completion

#### Streak Calculation Updates
- **`streakUtils/historyCalculation.ts`**
  - Added `PauseInfo` interface to track pause periods
  - Updated `calculateStreakFromHistory()` to accept optional `pauseInfo`
  - Filters out tracking entries during paused periods
  - Ensures streaks aren't broken by missed days while paused

- **`habits/toggle.ts`**
  - Updated `recalculateStreakAndStrength()` to pass pause info
  - Ensures streak calculation respects paused periods

### Frontend (React Native)

#### Component Type Updates
1. **`DraggableHabit/types.ts`**
   - Added `isPaused?: boolean` to `DraggableHabitProps`
   - Added `onPause?: (habitId: Id<'habits'>) => void`
   - Added `onResume?: (habitId: Id<'habits'>) => void`
   - Updated `Habit` interface to include pause fields

2. **`DraggableHabitCard/types.ts`**
   - Added `isPaused` prop
   - Added `onPause` and `onResume` callbacks

#### New Components
1. **`PauseAction.tsx`**
   - Swipe action component for pause/resume
   - Shows purple action for pause, green for resume
   - Animated icons with smooth transitions
   - Follows same pattern as `ArchiveAction`

#### Modified Components
1. **`CardHeader.tsx`**
   - Added `isPaused` prop
   - Displays "Paused" badge (purple pill) next to habit name
   - Badge only shown when habit is paused

2. **`DraggableHabitCard.tsx`**
   - Added dimmed appearance for paused habits (60% opacity)
   - Integrated `PauseAction` swipe action
   - Added resume button below paused habit cards
   - Resume button shows "Resume Habit" with play icon
   - Dim effect applies to both card and pressable feedback

3. **`CardContent.tsx`**
   - Passes `isPaused` to `CardHeader`

4. **`DraggableHabit.tsx`**
   - Accepts and passes `isPaused`, `onPause`, `onResume` props
   - Wires pause/resume callbacks through component hierarchy

5. **`HabitRenderContent.tsx`**
   - Added `handlePause` and `handleResume` props
   - Passes `isPaused` status from habit data
   - Connects pause/resume handlers to DraggableHabit

#### Hooks Updates
1. **`useHabitMutations.ts`**
   - Added `resumeHabit` to mutation exports
   - Now supports both `pauseHabit` and `resumeHabit` mutations

## User Experience

### Paused Habit Display
- ✅ Dimmed appearance (60% opacity) to indicate inactive status
- ✅ "Paused" badge on card header
- ✅ Included in habit list (not hidden)
- ✅ Swipe right to pause/resume active habits
- ✅ Resume button displayed for paused habits

### Streak Preservation
- ✅ Current streak frozen when habit is paused
- ✅ Missed days during pause don't break streak
- ✅ Streak resumes after habit is resumed
- ✅ Best streak preserved across pause periods

### State Preservation
- ✅ Habit strength saved before pausing
- ✅ Habit accessibility saved before pausing
- ✅ Restored when habit is resumed
- ✅ Timestamps (`pausedAt`, `resumedAt`) tracked

## Testing Recommendations

1. **Pause Functionality**
   - Pause an active habit - should show "Paused" badge and dim appearance
   - Check streak is preserved - should stay current streak
   - Check strength is preserved - should save before pause

2. **Resume Functionality**
   - Resume a paused habit - should return to normal appearance
   - Check streak continues correctly - should not skip days
   - Check strength is restored - should match saved value

3. **Streak Calculation**
   - Complete days before pause
   - Pause habit
   - Miss days while paused
   - Resume habit
   - Verify streak continued from pre-pause period (not broken by missed days)

4. **Multiple Pauses**
   - Pause and resume multiple times
   - Verify streak calculation handles multiple pause periods correctly

## API Usage

### Client-Side Mutations
```typescript
// Using useHabitMutations hook
const { pauseHabit, resumeHabit } = useHabitMutations();

// Pause a habit
await pauseHabit({ habitId: "habit_123", timezone: "America/Denver" });

// Resume a habit
await resumeHabit({ habitId: "habit_123", timezone: "America/Denver" });
```

### Backend Queries
```typescript
// List all habits (including paused)
const habits = await useQuery(api.habits.list);

// List only paused habits
const pausedHabits = await useQuery(api.habits.listPaused);
```

## Breaking Changes
- None. Existing functionality remains unchanged.
- Paused habits are now included in the main list query but can be identified by `paused === true`

## Future Enhancements
1. **Pause Until Date** - Allow users to set a resume date (pausedUntil)
2. **Pause Notifications** - Notify user when pause period ends
3. **Pause Analytics** - Track why habits are paused (vacation, sick, break, etc.)
4. **Bulk Pause** - Pause multiple habits at once
5. **Auto-Resume** - Automatically resume on set date

## Credits
Implemented by: **Claude (Opus)** with Haiku assistance

---

**Status**: Ready for review, rebase on origin/main, resolve any conflicts, and create PR
**Do NOT merge** - awaiting review
