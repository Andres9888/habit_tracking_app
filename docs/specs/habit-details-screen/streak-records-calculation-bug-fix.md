# Streak Records Calculation Bug Fix

## Problem Statement

The habit details screen displays incorrect streak record values. Users are seeing values like "104 days" and "5 days" when these don't match the actual streak history.

## Root Cause Analysis

### Primary Issue: Date Calculation Inconsistency

The frontend `calculateStreakRecords()` function in `InsightsSection.tsx` uses a different date calculation approach than the backend `streakUtils.ts`, causing streak records to be calculated incorrectly.

**Frontend (InsightsSection.tsx:137-139):**
```typescript
const diffDays = Math.round(
  (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
);
```

**Backend (streakUtils.ts:12-22):**
```typescript
export function differenceInDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);  // Normalizes to midnight
  d2.setHours(0, 0, 0, 0);
  const diffMs = d1.getTime() - d2.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));  // Uses floor
}
```

### Issues Identified

| Issue | Frontend | Backend | Impact |
|-------|----------|---------|--------|
| Rounding method | `Math.round()` | `Math.floor()` | Can cause off-by-one errors |
| Time normalization | None | `setHours(0,0,0,0)` | Timezone-dependent miscalculations |
| Date creation | `new Date(dateString)` | `new Date(dateString + 'T00:00:00')` | Timezone inconsistency |

### Why "104 and 5 days" Appears

1. The `Math.round()` approach can round a 0.9999-day difference to 1 or a 1.0001-day difference to 1
2. Without time normalization, dates created from strings can have subtle millisecond differences
3. This causes the algorithm to sometimes:
   - Incorrectly merge separate streaks (making them appear longer)
   - Incorrectly split a single streak (creating phantom short streaks)
   - Report a current streak that doesn't match the calculated records

## Solution

### Approach: Use Shared Date Utility

Refactor the frontend to use the same `differenceInDays()` logic from `streakUtils.ts` to ensure consistent streak calculations across the entire app.

### Implementation Steps

1. **Export the utility function for client-side use**
   - The `differenceInDays` function in `convex/streakUtils.ts` is already exported
   - Create a shared utility that can be used on both client and server

2. **Refactor `calculateStreakRecords()` in InsightsSection.tsx**
   - Replace inline date difference calculation with proper utility
   - Ensure dates are normalized to midnight before comparison
   - Use `Math.floor()` instead of `Math.round()`

3. **Fix date string parsing**
   - Append `'T00:00:00'` to date strings when creating Date objects
   - This ensures consistent timezone handling

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/InsightsSection/InsightsSection.tsx` | Refactor `calculateStreakRecords()` function (lines 116-200) |
| `src/utils/dateUtils.ts` (new or existing) | Add client-side `differenceInDays()` utility if needed |

## Acceptance Criteria

- [x] Streak records display matches the actual completion history
  - **COMPLETED**: Refactored `calculateStreakRecords()` in InsightsSection.tsx to use consistent UTC-based date calculations
- [x] Frontend and backend streak calculations produce identical results
  - **COMPLETED**: Created `src/utils/dateUtils.ts` with `differenceInDays()` that uses UTC midnight normalization, matching backend logic
- [x] No off-by-one errors in streak counting
  - **COMPLETED**: Using UTC dates avoids DST/timezone issues that caused Math.round vs Math.floor discrepancies
- [x] Date calculations work correctly across all timezones
  - **COMPLETED**: All date comparisons now use `parseToUTCMidnight()` to normalize dates to UTC before comparison
- [x] Current streak indicator correctly identifies the active streak
  - **COMPLETED**: Updated isCurrent check to use `differenceInDays()` with proper UTC comparison
- [x] Existing tests pass and new tests cover edge cases
  - **COMPLETED**: Added 23 new tests in `src/utils/__tests__/dateUtils.test.ts` covering edge cases (DST transitions, leap years, timezone handling)

## Test Cases

1. **Single streak**: Verify a continuous 10-day streak shows as "10 days"
2. **Multiple streaks**: Verify separate streaks (e.g., 5 days, gap, 3 days) show correctly
3. **Timezone edge case**: Test completion at 11:59 PM in one timezone
4. **Current streak matching**: Verify current streak matches the record when it should
5. **Backfill scenario**: Verify completing past dates recalculates records correctly

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing streak display | Low | Medium | Comprehensive testing before release |
| Performance impact | Low | Low | Simple calculation change, no new API calls |
| Edge cases missed | Medium | Low | Add comprehensive test coverage |

## Priority

**High** - This is a data display bug that shows incorrect information to users, potentially undermining trust in the streak tracking feature.

## Estimated Effort

Small - This is a focused bug fix requiring changes to a single calculation function.
