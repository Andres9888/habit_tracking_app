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

- [ ] Modify `src/components/CalendarTimeline/components/ProgressText.tsx`:
  - Add `Animated` import from `react-native-reanimated`
  - When transitioning to "All done!" state, wrap text in `Animated.View` with entering animation
  - Animation: `ZoomIn.duration(300).springify().damping(12)` or equivalent scale bounce
  - Respect `reduceMotion` — skip animation if enabled
  - File must remain ≤100 lines (currently 38 lines, plenty of room)

### Improvement 3: Week Progress Micro-Bar

- [ ] Create `src/components/CalendarTimeline/components/MicroProgressBar.tsx`:
  - Props: `completed: number`, `total: number`
  - Renders a 3px tall bar with rounded corners
  - Track color: `isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'`
  - Fill color: linear progression using `primary[500]` → `primary[300]`
  - Fill width animated with `useAnimatedStyle` + `withTiming(targetWidth, { duration: 600 })`
  - When `completed >= total`, fill uses brighter gradient
  - File must be ≤100 lines
  - Respect `reduceMotion` — use instant width change if enabled

- [ ] Modify `src/components/CalendarTimeline/CalendarTimeline.tsx`:
  - Import `MicroProgressBar`
  - Add below `StripNav` (after line ~83): `<MicroProgressBar completed={completedToday} total={totalHabits} />`
  - File must remain ≤100 lines (currently 95 lines — may need to extract a const or compact an import)

### Improvement 4: Today Breathing Glow

- [ ] Modify `src/components/CalendarTimeline/components/DayCellContent.tsx`:
  - For the today cell (when `isCurrentDay && !isComplete`), add animated shadow
  - Use `useAnimatedStyle` with `withRepeat(withSequence(...))` to cycle shadowOpacity between 0.15 and 0.4
  - Duration: 2500ms per cycle, `Easing.inOut(Easing.ease)`
  - Shadow color: amber (`#E8B94D` light, `#B8860B` dark)
  - Respect `reduceMotion` — no animation if enabled
  - File must remain ≤100 lines (currently 95 lines — tight, may need to extract animation to a hook)

- [ ] If DayCellContent.tsx exceeds 100 lines, extract the breathing animation into `src/components/CalendarTimeline/hooks/useTodayGlow.ts`:
  - Accept `isCurrentDay: boolean`, `isComplete: boolean`, `reduceMotion: boolean`, `isDark: boolean`
  - Return `animatedShadowStyle` to spread on the day cell View

### Improvement 5: Shelf Gradient Bleed

- [ ] Modify shelf rendering in `src/components/CalendarTimeline/CalendarTimeline.tsx` or `CalendarTimeline.styles.ts`:
  - Add a 12px tall `View` with `LinearGradient` (from expo-linear-gradient) as last child of shelf container
  - Positioned absolutely at `bottom: -12, left: 0, right: 0`
  - Gradient: `[shelfBackgroundColor, 'transparent']` top to bottom
  - Alternative (no dependency): Use a simple `View` with opacity gradient via multiple stacked views
  - `pointerEvents='none'` so it doesn't intercept touches
  - File must remain ≤100 lines

## Design References

- Visual mock: `.superdesign/design_iterations/homepage_improvements_3.html`
- ROI analysis: `.superdesign/design_iterations/homepage_improvements_3_roi.html`
- Cell size comparison: `.superdesign/design_iterations/calendar_timeline_polish_3.html`
