---
task: Habit detail page month navigation UX polish
slug: 20260311-140000_habit-detail-month-nav-ux-polish
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-11T14:00:00-06:00
updated: 2026-03-11T14:06:00-06:00
---

## Context

Polish the habit detail page calendar section with four UX improvements: add slide animation on month navigation, add haptic feedback on nav arrows, rename "HISTORY" label to "CALENDAR", and fix layout shifts when months have different row counts (5 vs 6 weeks).

### Risks
- Animation timing must feel natural, not sluggish or jarring
- Fixed calendar height must accommodate 6-week months without clipping
- Haptic pattern choice must match interaction weight (light tap, not heavy)

## Criteria

- [x] ISC-1: Month grid slides left when navigating to next month
- [x] ISC-2: Month grid slides right when navigating to previous month
- [x] ISC-3: Slide animation duration is 250-350ms with ease-out curve
- [x] ISC-4: Haptic feedback fires on previous month button press
- [x] ISC-5: Haptic feedback fires on next month button press
- [x] ISC-6: Haptic pattern is "selection" weight (ultra-light)
- [x] ISC-7: Section label reads "CALENDAR" instead of "HISTORY"
- [x] ISC-8: Calendar container has fixed height for 6-week months
- [x] ISC-9: 5-week months render without vertical jump in container
- [x] ISC-10: No layout shift visible in CalendarSummary or MonthNavigation positions

## Decisions

- Used `SlideInRight`/`SlideInLeft` with `.springify().damping(20)` for natural-feeling spring animation
- Removed `.duration()` since `.springify()` supersedes timing-based config — spring physics control the duration
- Set `opacity: 0` in `withInitialValues` for fade-in effect without `.combine(FadeIn)`
- Added `overflow: 'hidden'` to `weeksContainer` to clip content during slide animation (especially needed on Android)
- Extracted `AnimatedWeeksGrid` into its own file to keep under 100-line ESLint limit
- Used `minHeight: 6 * 41` (246px) for weeks container — 6 rows × (40px cell + 1px margin)
- Direction tracked via `useRef` instead of `useState` to avoid double render

## Verification

- TypeScript: `npx tsc --noEmit` passes for all changed files
- ESLint: 0 errors on all changed files (only pre-existing warnings)
- Line counts: MonthlyCalendarGrid 90 lines, AnimatedWeeksGrid 48 lines — both under 100
- /simplify review: 3 agents ran in parallel, caught 2 real issues (overflow + duration), both fixed
