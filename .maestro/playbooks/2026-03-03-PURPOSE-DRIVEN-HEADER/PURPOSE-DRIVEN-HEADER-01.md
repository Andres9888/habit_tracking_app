# Phase 01 — Core Greeting Logic (useStreakGreeting)

## Context

Implementing the "Purpose-Driven Header" redesign for the CalendarTimeline. This phase updates the core greeting logic in `useStreakGreeting` to:

1. Remove all badge/pill data from return values (pills are being cut across all states)
2. Merge badge info into the greeting text for "streak at risk" state
3. Cut "Good morning/afternoon/evening" for 0-streak users (no behavioral value)
4. Cut "Great start!" for 1-day streak (no loss aversion at 1 day)
5. Signal collapsed header layout when there's no behavioral greeting

## Design Reference

See mockup: `.superdesign/design_iterations/calendar_header_unified_7.html`

**Key behavioral rules:**

- Streak 0, no habits done → greeting is empty string, header collapses to 1 row
- Streak 1 → greeting is empty string, header collapses to 1 row
- Streak 2-6 → "X-day streak" (no badge)
- Streak 7+ → "X-day streak" (no badge)
- Almost done (1 left) → "Just 1 left!" (no badge)
- Streak at risk → "X-day streak at risk" (merged, no badge)
- Perfect day → "Perfect day" (no badge, no change)

## Tasks

- [x] Update `src/components/CalendarTimeline/hooks/useStreakGreeting.ts`: Removed `StreakBadge` interface, `badge` from `StreakGreetingResult`, and `getTimeOfDayGreeting` helper. Added `variant?: 'risk' | 'success' | 'almostDone'` to result type. Added "almost done" branch (1 habit left → `Just 1 left!` with `almostDone` variant) and "streak at risk" branch (8pm+, streak > 0, no progress → `X-day streak at risk` with `risk` variant). Changed streak 0 and streak 1 to return empty greeting for header collapse. Removed badges from streak 2-6 and streak >= 7 branches. Also updated `ProgressGreeting.tsx` consumer to remove badge rendering and conditionally hide greeting when empty.

- [x] Update `src/components/CalendarTimeline/tests/useStreakGreeting.test.ts` to match the new logic: All badge assertions removed. Added "almost done" test suite (2 tests). Added "streak at risk" test suite (4 tests: triggers after 8pm, doesn't trigger before 8pm / streak 0 / some habits done). Streak 0 tests changed to expect empty string with renamed describe. Streak 1 test changed to expect empty string. Also updated `ProgressGreeting.test.tsx` to remove badge rendering expectations. **All 29 tests pass (22 unit + 7 integration).**
