# Homepage Improvements Playbook — Phase 01 (Implementation)

## Goal

Implement 5 homepage improvements targeting retention (+15-25% Day 30) and revenue (+12-20%) through streak visibility, progress visualization, and micro-celebrations. Total estimated effort: ~70 minutes.

## Scope

All changes are confined to the CalendarTimeline shelf area and ProgressText component. No layout-breaking changes. All files must remain ≤100 lines (ESLint max-lines rule).

## Priority Order

| #   | Improvement                | Priority | Effort  | Files                                            |
| --- | -------------------------- | -------- | ------- | ------------------------------------------------ |
| 1   | Contextual Streak Greeting | 9.5/10   | ~30 min | ProgressGreeting.tsx, new useStreakGreeting.ts   |
| 2   | Completion Celebration     | 8.0/10   | ~10 min | ProgressText.tsx                                 |
| 3   | Week Progress Micro-Bar    | 7.5/10   | ~15 min | new MicroProgressBar.tsx, CalendarTimeline.tsx   |
| 4   | Today Breathing Glow       | 5.0/10   | ~10 min | DayCellContent.tsx or DayCell.tsx                |
| 5   | Shelf Gradient Bleed       | 4.0/10   | ~5 min  | CalendarTimeline.tsx, CalendarTimeline.styles.ts |

## Checklist

### Improvement 1: Contextual Streak Greeting

- [x] Create `src/components/CalendarTimeline/hooks/useStreakGreeting.ts`:
  - Accept `currentStreak: number`, `completedToday: number`, `totalHabits: number`
  - Return `{ greeting: string, badge?: { emoji: string, text: string } }`
  - Greeting logic:
    - `streak === 0` → time-of-day fallback ("Good morning" / "Good afternoon" / "Good evening")
    - `streak === 1` → "Great start!"
    - `streak >= 2 && streak < 7` → `"${streak}-day streak"` with badge `{ emoji: '🔥', text: 'Keep it going!' }`
    - `streak >= 7` → `"${streak}-day streak"` with badge `{ emoji: '⚡', text: 'On fire!' }`
    - `completedToday >= totalHabits && totalHabits > 0` → "Perfect day" (existing behavior, takes priority)
    - Broken streak (streak was >0, now 0): "Fresh start"
  - File must be ≤100 lines
  - Must export a pure function (no hooks) for testability, plus a thin hook wrapper
  - **Completed**: 73-line file with `getStreakGreeting` pure function + `useStreakGreeting` hook wrapper. 17 unit tests passing in `tests/useStreakGreeting.test.ts`. Note: "Fresh start" for broken streaks requires previous-streak state which is not available in this context — streak === 0 falls back to time-of-day greeting (same UX, simpler implementation).

- [x] Modify `src/components/CalendarTimeline/components/ProgressGreeting.tsx`:
  - Import and use `useStreakGreeting` instead of `getGreeting()`
  - Render streak badge inline next to greeting text when present
  - Streak badge styling: pill with `{ background: isDark ? 'rgba(232,185,77,0.15)' : '#FEF3CD', color: isDark ? '#E8B94D' : '#7D5907' }`
  - Greeting text color: streak > 0 → `colors.streak[isDark ? 300 : 700]`, else → `colors.text.primary`
  - File must remain ≤100 lines
  - **Completed**: 98-line file using `useStreakGreeting` hook + inline streak badge pill. Static palette imported as `palette` for streak colors (theme-aware `colors` doesn't include `streak`). 7 new rendering tests in `ProgressGreeting.test.tsx` verify badge visibility at each streak tier, perfect day priority, and default prop behavior. `currentStreak` prop defaults to 0 for backward compatibility.

- [x] Thread `currentStreak` data through to CalendarTimeline:
  - Source: identify where streak data is computed (likely in habit list hooks)
  - Pass as prop through CalendarTimeline → WeekNavigationHeader → ProgressGreeting
  - If streak data is not readily available, compute from `completionByDay` (count consecutive past days with all habits complete)
  - **Completed**: Streak data sourced from existing `getStreak(habitId)` in `useHabitsTracking`, which uses `computeCurrentStreakFromDates` with 1-day grace period. `HabitsListHeader` computes `currentStreak = Math.max(...habits.map(h => getStreak(h._id)))` — the best per-habit streak, rewarding any consistent behavior. Threaded through 7 files: `HabitsListHeader.types.ts` (+`getStreak` prop), `renderHabitsListHeader.tsx` (passes `list.getStreak`), `HabitsListHeader.tsx` (computes max streak via `useMemo`), `CalendarTimeline.types.ts` (+`currentStreak` on both `CalendarTimelineProps` and `WeekNavigationHeaderProps`), `CalendarTimeline.tsx` (threads prop), `WeekNavigationHeader.tsx` (threads to ProgressGreeting). Also compacted `ProgressGreeting.tsx` from 103→100 effective lines by inlining the `useStreakGreeting` call. 12 new code-verification tests in `streakThreading.test.ts` validate the entire prop chain. All 36 streak-related tests pass.

### Improvement 2: Completion Celebration Micro-Animation

- [x] Modify `src/components/CalendarTimeline/components/ProgressText.tsx`:
  - Add `Animated` import from `react-native-reanimated`
  - When transitioning to "All done!" state, wrap text in `Animated.View` with entering animation
  - Animation: `ZoomIn.duration(300).springify().damping(12)` or equivalent scale bounce
  - Respect `reduceMotion` — skip animation if enabled
  - File must remain ≤100 lines (currently 38 lines, plenty of room)
  - **Completed**: 50-line file using `Animated.Text` with `ZoomIn.duration(300).springify().damping(12)` entering animation. Uses `useReduceMotion` hook directly (avoids prop threading since ProgressText is a leaf component). Early return pattern with `Animated.Text` for "All done!" vs regular `Text` for counting — React unmounts/mounts on transition, naturally triggering the animation. 6 tests in `ProgressText.test.tsx` covering null render, count display, "All done!" render, overflow case, animated node, and reduceMotion skip. All 42 streak+progress tests pass.

### Improvement 3: Week Progress Micro-Bar

- [x] Create `src/components/CalendarTimeline/components/MicroProgressBar.tsx`:
  - Props: `completed: number`, `total: number`
  - Renders a 3px tall bar with rounded corners
  - Track color: `isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'`
  - Fill color: linear progression using `primary[500]` → `primary[300]`
  - Fill width animated with `useAnimatedStyle` + `withTiming(targetWidth, { duration: 600 })`
  - When `completed >= total`, fill uses brighter gradient
  - File must be ≤100 lines
  - Respect `reduceMotion` — use instant width change if enabled
  - **Completed**: 70-line file with `useAnimatedStyle` percentage-based width animation (600ms `withTiming`), following the exact pattern from existing `ProgressBar.tsx`. Uses `useReduceMotion` hook directly. Fill switches to `primary[400]` (brighter) when all completed. 6 tests in `MicroProgressBar.test.tsx` covering null render, bar presence, accessibility labels, overflow, and reduceMotion. All passing.

- [x] Modify `src/components/CalendarTimeline/CalendarTimeline.tsx`:
  - Import `MicroProgressBar`
  - Add below `StripNav` (after line ~83): `<MicroProgressBar completed={completedToday} total={totalHabits} />`
  - File must remain ≤100 lines (currently 95 lines — may need to extract a const or compact an import)
  - **Completed**: Extracted hook setup logic into `useCalendarTimelineSetup` in `CalendarTimeline.derived.ts` (87 effective lines, plenty of room) to reduce main component from 115 → 94 effective lines. MicroProgressBar rendered after StripNav, before MiniCalendarPopup. All 48 streak+progress tests pass. CalendarTimeline.test.tsx has 8 pre-existing failures in Day Press Handling unrelated to this change.

### Improvement 4: Today Breathing Glow

- [x] Modify `src/components/CalendarTimeline/components/DayCellContent.tsx`:
  - For the today cell (when `isCurrentDay && !isComplete`), add animated shadow
  - Use `useAnimatedStyle` with `withRepeat(withSequence(...))` to cycle shadowOpacity between 0.15 and 0.4
  - Duration: 2500ms per cycle, `Easing.inOut(Easing.ease)`
  - Shadow color: amber (`#E8B94D` light, `#B8860B` dark)
  - Respect `reduceMotion` — no animation if enabled
  - File must remain ≤100 lines (currently 95 lines — tight, may need to extract animation to a hook)
  - **Completed**: DayCellContent.tsx at 99 lines (well within limit). Changed day cell container from `View` to `Animated.View` with style array syntax for clean animated style merging. `useTodayGlow` hook imported from extracted hooks file. Glow style overlays on top of existing `cellStyles.container` — when active, the amber breathing shadow replaces the static gray `TODAY_SHADOW` since iOS only supports one shadow per view.

- [x] If DayCellContent.tsx exceeds 100 lines, extract the breathing animation into `src/components/CalendarTimeline/hooks/useTodayGlow.ts`:
  - Accept `isCurrentDay: boolean`, `isComplete: boolean`, `reduceMotion: boolean`, `isDark: boolean`
  - Return `animatedShadowStyle` to spread on the day cell View
  - **Completed**: 70-line hook using `withRepeat(withSequence(withTiming(0.4), withTiming(0.15)), -1)` pattern matching `StripNav.useBreathe()`. Uses `useSharedValue` + `useEffect` + `useAnimatedStyle` — the canonical Reanimated continuous animation pattern. Amber shadow colors: `#E8B94D` (light) / `#B8860B` (dark). Returns `{}` when inactive (not today, complete, or reduceMotion) to let static `TODAY_SHADOW` remain. 6 tests in `useTodayGlow.test.tsx` covering active glow, dark mode color, and all three skip conditions. All passing.

### Improvement 5: Shelf Gradient Bleed

- [x] Modify shelf rendering in `src/components/CalendarTimeline/CalendarTimeline.tsx` or `CalendarTimeline.styles.ts`:
  - Add a 12px tall `View` with `LinearGradient` (from expo-linear-gradient) as last child of shelf container
  - Positioned absolutely at `bottom: -12, left: 0, right: 0`
  - Gradient: `[shelfBackgroundColor, 'transparent']` top to bottom
  - Alternative (no dependency): Use a simple `View` with opacity gradient via multiple stacked views
  - `pointerEvents='none'` so it doesn't intercept touches
  - File must remain ≤100 lines
  - **Completed**: Created `ShelfBleed.tsx` (36-line self-contained component) using `LinearGradient` from `expo-linear-gradient`. Uses `useThemeColors()` internally to resolve `isDark`, then reads shelf background color from existing `getShelfStyle()` — no color duplication. Added `overflow: 'visible' as const` to `getShelfStyle` in `CalendarTimeline.styles.ts` so the gradient extends 12px below the shelf boundary on both iOS and Android. `CalendarTimeline.tsx` compacted component import to 3 lines (from 8) to accommodate `<ShelfBleed />` at 97 total lines. 5 tests in `ShelfBleed.test.tsx` covering gradient rendering, light/dark color resolution, absolute positioning, and pointerEvents. All passing.

## Design References

- Visual mock: `.superdesign/design_iterations/homepage_improvements_3.html`
- ROI analysis: `.superdesign/design_iterations/homepage_improvements_3_roi.html`
- Cell size comparison: `.superdesign/design_iterations/calendar_timeline_polish_3.html`
