# Personal Bests Calculation Bug Fix

## Problem Statement

The Personal Bests section in the Progress tab displays wildly incorrect streak values (e.g., showing "104 days" when actual best streak is 5-6 days). The streak records are being calculated incorrectly, producing phantom high values.

## Root Cause Analysis

### Duplicate Code with Different Logic

There are **two separate** implementations of streak calculation:

1. **`src/components/InsightsSection/InsightsSection.tsx`** - Fixed version using UTC utilities
2. **`src/components/ProgressSection/utils.ts`** - **BUGGY** version still using old logic

The ProgressSection (which powers the Personal Bests card) uses the buggy version.

### Issues in ProgressSection/utils.ts

**Lines 80-108: `calculateCurrentStreak()`**
```typescript
const todayStr = current.toISOString().split('T')[0];  // BUG: timezone issue
const dateStr = current.toISOString().split('T')[0];   // BUG: timezone issue
```

**Lines 117-203: `calculateStreakRecords()`**
```typescript
const prevDate = new Date(completedDates[0]);          // BUG: no timezone handling
const currDate = new Date(completedDates[i]);          // BUG: no timezone handling
const diffDays = Math.round(                           // BUG: should be Math.floor
  (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
);
```

**Lines 166-171: isCurrent check**
```typescript
const today = new Date().toISOString().split('T')[0];  // BUG: timezone issue
```

### Why "104 Days" Appears

1. `toISOString()` converts to UTC, which can shift the date forward/backward
2. When dates are parsed without `'T00:00:00'` suffix, they use local timezone
3. The mismatch causes `diffDays` to sometimes be 0 when it should be 1
4. This makes the algorithm think consecutive dates are the "same day", concatenating separate streaks
5. Example: If you have completions across 100+ days with gaps, the algorithm might merge them all into one giant streak

## Solution

Replace the buggy utility functions in `ProgressSection/utils.ts` with the fixed UTC-based utilities from `src/utils/dateUtils.ts`.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ProgressSection/utils.ts` | Import and use `differenceInDays`, `getTodayString`, `formatDateString` from `../../utils/dateUtils` |

## Specific Changes

### 1. Add import
```typescript
import { differenceInDays, getTodayString, formatDateString } from '../../utils/dateUtils';
```

### 2. Fix `calculateCurrentStreak()` (lines 80-108)
- Replace `current.toISOString().split('T')[0]` with `formatDateString(current)`
- Use `getTodayString()` for today's date

### 3. Fix `calculateStreakRecords()` (lines 117-203)
- Replace `Math.round()` with call to `differenceInDays()`
- Replace `new Date().toISOString().split('T')[0]` with `getTodayString()`
- Replace `startDate.toISOString().split('T')[0]` with `formatDateString(startDate)`

### 4. Fix `calculateDayOfWeekStats()` and `calculateTrendComparison()`
- Replace `current.toISOString().split('T')[0]` with `formatDateString(current)`

## Acceptance Criteria

- [ ] Personal Bests shows correct streak values matching actual completion history
- [ ] Streak records match between InsightsSection and ProgressSection
- [ ] No phantom 100+ day streaks appearing
- [ ] Current streak calculation is consistent across all components
- [ ] Existing tests pass

## Test Cases

1. **Actual 5-day streak**: Should show "5" not "104"
2. **Multiple separate streaks**: Each should be counted separately
3. **Timezone edge case**: Completion at 11:59 PM should not merge with next day
4. **Fresh habit**: Should show accurate small streaks

## Priority

**High** - This is a data display bug showing completely wrong values to users.

## Estimated Effort

Small - Importing existing utilities and replacing 5-6 function calls.
