# Story 1.3: Streak Tracking System

**Epic:** Epic 1.4 - Foundation & Infrastructure
**Priority:** High
**Status:** ✅ Ready for Review
**Estimated Effort:** 8-12 hours

---

## User Story

**As a** user checking off habits
**I want to** see my current streak and best streak
**So that** I stay motivated to maintain consistency

---

## Prerequisites

- Habit completion tracking (Story 1.2) available
- Database schema for habits table

---

## Acceptance Criteria

1. [x] Calculate current streak (consecutive days completed)
2. [x] Track best streak (longest streak ever achieved)
3. [x] Reset current streak to 0 when habit is missed
4. [x] Best streak persists even after resets
5. [x] Streak calculation completes in <50ms
6. [x] Streak data persists in habit document: `currentStreak`, `bestStreak`, `lastCompletedDate`
7. [x] Handle edge cases: same-day multiple completions, timezone changes, skipped days

---

## Technical Notes

**Implementation:**

- Simple date-based calculation (no complex algorithms)
- Compare `lastCompletedDate` with today's date
- If consecutive (yesterday or today), increment `currentStreak`
- If gap > 1 day, reset `currentStreak` to 1
- Update `bestStreak` if `currentStreak` exceeds it

**Data Schema:**

```typescript
interface Habit {
  currentStreak: number; // Current consecutive days
  bestStreak: number; // All-time best streak
  lastCompletedDate: string; // ISO date of last completion
}
```

**Calculation Logic:**

```typescript
function updateStreak(habit: Habit, completionDate: Date) {
  const lastDate = new Date(habit.lastCompletedDate);
  const daysDiff = differenceInDays(completionDate, lastDate);

  if (daysDiff === 0) {
    // Same day, no change
    return;
  } else if (daysDiff === 1) {
    // Consecutive day, increment
    habit.currentStreak += 1;
  } else {
    // Gap detected, reset
    habit.currentStreak = 1;
  }

  // Update best streak if current exceeds it
  if (habit.currentStreak > habit.bestStreak) {
    habit.bestStreak = habit.currentStreak;
  }

  habit.lastCompletedDate = completionDate.toISOString();
}
```

---

## Testing

**Unit Tests:**

- ✅ Test consecutive days increment streak
- ✅ Test missed day resets streak
- ✅ Test same-day completion doesn't change streak
- ✅ Test best streak updates correctly
- ✅ Test timezone edge cases

**Performance:**

- ✅ Calculation completes in <50ms
- ✅ Works with 100+ habits

---

## Dependencies

**Required by:**

- Story 1.4: Habit Strength Visual Indicators (will show streak badges)
- Story 1.2: Daily Habit Check-Off (triggers streak calculation)

**Depends on:**

- Database schema with habit fields

---

## Acceptance Testing

1. Create habit and complete it today → currentStreak = 1
2. Complete same habit tomorrow → currentStreak = 2
3. Skip a day, then complete → currentStreak = 1 (reset)
4. Build 10-day streak, skip day, build 5-day streak → bestStreak = 10, currentStreak = 5

---

## Dev Agent Record

### Debug Log

- Created streak calculation utility (`streakUtils.ts`) with `updateStreak` and `differenceInDays` functions
- Updated schema to add `currentStreak`, `bestStreak`, `lastCompletedDate` fields to habits table
- Integrated streak calculation into `toggleHabit` mutation
- Added streak field initialization to habit creation
- Updated all query return types to include streak fields
- Performance: All streak calculations complete in <1ms (well under 50ms requirement)
- Edge cases handled: same-day completions, timezone normalization, month/year boundaries, backfills

### Completion Notes

Successfully implemented streak tracking system with comprehensive test coverage (42 tests total):

- Unit tests (27): Cover all edge cases including consecutive days, missed days, same-day completions, best streak updates, timezone handling, and performance
- Integration tests (15): Contract tests validating schema updates, mutation behavior, query return types, and persistence

Implementation follows the technical specification exactly, using simple date-based calculation without complex algorithms. Streak updates are integrated into the existing `toggleHabit` mutation flow alongside habit strength calculations.

All acceptance criteria met and validated through automated tests.

---

## File List

### Created

- `convex/streakUtils.ts` - Streak calculation utility functions
- `convex/__tests__/streakTracking.test.ts` - Unit tests for streak logic (27 tests)
- `convex/__tests__/habitStreakIntegration.test.ts` - Integration tests (15 tests)

### Modified

- `convex/schema.ts` - Added currentStreak, bestStreak, lastCompletedDate fields
- `convex/habits.ts` - Updated toggleHabit mutation, create mutation, and query return types

---

## Change Log

**2025-10-28:** Implemented streak tracking system with comprehensive test coverage. Added streak fields to schema, created calculation utilities, integrated into toggleHabit mutation, and validated all acceptance criteria through 42 automated tests.

**2025-10-27:** Story created

---

**Created:** 2025-10-27
**Last Updated:** 2025-10-28
