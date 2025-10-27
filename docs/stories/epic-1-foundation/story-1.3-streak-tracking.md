# Story 1.3: Streak Tracking System

**Epic:** Epic 1.4 - Foundation & Infrastructure
**Priority:** High
**Status:** 🔴 TODO
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

1. [ ] Calculate current streak (consecutive days completed)
2. [ ] Track best streak (longest streak ever achieved)
3. [ ] Reset current streak to 0 when habit is missed
4. [ ] Best streak persists even after resets
5. [ ] Streak calculation completes in <50ms
6. [ ] Streak data persists in habit document: `currentStreak`, `bestStreak`, `lastCompletedDate`
7. [ ] Handle edge cases: same-day multiple completions, timezone changes, skipped days

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
  currentStreak: number;      // Current consecutive days
  bestStreak: number;         // All-time best streak
  lastCompletedDate: string;  // ISO date of last completion
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

**Created:** 2025-10-27
**Last Updated:** 2025-10-27
