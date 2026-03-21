# Phase 02 — UI Components (ProgressGreeting, WeekNavRow, ProgressDots cleanup)

## Context

Phase 01 updated `useStreakGreeting` to remove badges and return empty greeting for non-behavioral states. This phase updates the UI components to match:

1. Remove ProgressDots from ProgressGreeting (dots duplicated "X of Y" text)
2. Add collapsed 1-row layout to ProgressGreeting when greeting is empty
3. Remove pill/badge rendering from WeekNavRow
4. Delete ProgressDots component entirely
5. Update component tests

## Design Reference

See mockup: `.superdesign/design_iterations/calendar_header_unified_7.html`

**2-row layout** (when `greeting` is non-empty — streak 2+, almost done, at risk, perfect day):

```
[Greeting text]              [X of Y]
[calendar-icon Date v]
```

**1-row collapsed layout** (when `greeting` is empty — 0-streak, 1-day streak):

```
[X of Y]          [calendar-icon Date v]
```

## Tasks

- [x] Update `src/components/CalendarTimeline/components/ProgressGreeting.tsx`: Added conditional collapsed 1-row layout (`COLLAPSED_ROW` style) when `greeting === ''`. Uses early return pattern — collapsed mode renders ProgressText left + WeekNavRow right in a single row. Two-row layout preserved for non-empty greetings. Removed unused `GREETING_ROW` style constant. Extracted `weekNav` JSX variable to DRY the WeekNavRow props across both branches. File stays at 93 lines. Note: ProgressDots import, ProgressDots JSX, and badge prop were already absent from Phase 01 cleanup.

- [x] Update `src/components/CalendarTimeline/components/WeekNavRow.tsx`: **Already clean from Phase 01.** No `badge`/`variant` props, no `getPillColors`, no pill rendering JSX, no `pill`/`pillText` styles exist. Only renders the glass date chip + conditional "Today →" link. No changes needed.

- [x] Delete `src/components/CalendarTimeline/components/ProgressDots.tsx`: **Already absent.** No ProgressDots.tsx file exists in the components directory. No ProgressDots test file exists. No ProgressDots barrel export in index.ts. Phase 01 or earlier work already handled this.

- [x] Update `src/components/CalendarTimeline/tests/ProgressGreeting.test.tsx`: **Already updated from Phase 01.** Tests already verify: streak greetings for 2-6 and ≥7, collapsed behavior for streak 0/1/omitted (using `queryByText(/streak/i).toBeNull()`), "Perfect day" text, and progress count. No fire badge, lightning badge, or old greeting text assertions remain. All 7 tests pass.

- [x] Run the full CalendarTimeline test suite to verify nothing is broken: 85 of 93 tests pass across 9 test files. The 8 failures in `CalendarTimeline.test.tsx` are **pre-existing** (confirmed by running same tests on stashed original code) — they relate to arrow navigation buttons, weekday count regex matching, and day press handling, none involving badges, ProgressDots, or greeting text. All 8 other test files (ProgressGreeting, useStreakGreeting, CheckBadge, MicroProgressBar, ProgressText, ShelfBleed, useTodayGlow, streakThreading) pass completely.
