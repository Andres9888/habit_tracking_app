# Add Swipe Gestures to MonthlyCalendar (inside HabitCalendarModal)

## Context

Today the `MonthlyCalendar` component inside `HabitCalendarModal` only supports
changing months via the chevron buttons in `MonthNavigator`. The user wants to
add a horizontal swipe gesture so that:

- Swipe **left** → advance to the **next** month
- Swipe **right** → go back to the **previous** month

This brings the modal's calendar in line with the gestural mental model users
have for paged content (Photos, native iOS Calendar). It also reduces the need
to aim at the small chevron hit targets while a modal sheet is open.

Both required libraries are already installed:

- `react-native-gesture-handler` v2.28.0
- `react-native-reanimated` v4.1.1

`GestureHandlerRootView` is already mounted at the app root
(`src/features/habits/HabitsApp.tsx` and `src/components/auth/AuthGate.tsx`),
so no provider wiring is needed.

There is also an existing in-app reference for direction-aware month change
with haptics at
`src/components/BinaryHeatmap/MonthlyCalendarGrid/MonthlyCalendarGrid.tsx:32-42`
(uses `triggerHaptic('selection')` on each month change). We will follow that
same haptic pattern for consistency.

Scope is intentionally narrow: only the `MonthlyCalendar` inside
`HabitCalendarModal`. The other two month-view components
(`HabitCalendarView`, `BinaryHeatmap/MonthlyCalendarGrid`) are out of scope
for this change.

## Approach

Wrap the calendar grid in a `GestureDetector` driven by a `Gesture.Pan()`
configured to only activate on horizontal movement, then map the final
translation direction to the existing `goToNextMonth` / `goToPreviousMonth`
handlers.

Use the modern v2 Gestures API (`Gesture.Pan()` + `GestureDetector`) rather
than the legacy `PanGestureHandler` — this is the recommended API for
`react-native-gesture-handler` v2.x and matches the version installed.

### Files to modify

**1. `src/components/HabitCalendarModal/MonthlyCalendar/MonthlyCalendar.tsx`**
(currently 89 lines — change must keep file ≤100 lines per project rule)

Changes:
- Import `Gesture`, `GestureDetector` from `react-native-gesture-handler`
- Import `triggerHaptic` from `@/utils/haptics` (reuse existing util, do not
  add a new haptics call site)
- Define a `Gesture.Pan()` instance configured with:
  - `activeOffsetX([-15, 15])` — only activates after ~15px of horizontal
    movement, so it doesn't fight vertical scroll inside the modal sheet
  - `failOffsetY([-20, 20])` — fails (yields) if the user moves more than
    ~20px vertically first, preserving any parent vertical scroll
  - `.onEnd((event) => { ... })` worklet that reads `event.translationX`,
    and uses `runOnJS` to call either `goToNextMonth` (translationX < -50)
    or `goToPreviousMonth` (translationX > 50). Threshold of 50px avoids
    accidental triggers on small drags.
- Wrap the days grid `<View className='flex-row flex-wrap'>` in a
  `<GestureDetector gesture={pan}>` so the swipe area is the grid itself
  (the header with chevrons stays tap-only to keep the chevrons reliable).
- Add `triggerHaptic('selection')` inside `goToPreviousMonth` and
  `goToNextMonth` so both gesture and chevron paths feel the same.

If after these edits the file crosses 100 lines (estimate: ~95–105),
extract the gesture creation + month handlers into a small hook
`MonthlyCalendar.hooks.ts` exporting `useMonthlyCalendarLogic({ initialDate })`
that returns `{ currentDate, goToNextMonth, goToPreviousMonth, pan }`. This
matches the decomposition pattern documented in the project CLAUDE.md.

### Files to read but NOT modify

- `src/components/HabitCalendarModal/MonthlyCalendar/MonthNavigator.tsx`
  (no change — chevrons still call the same handlers)
- `src/components/BinaryHeatmap/MonthlyCalendarGrid/MonthlyCalendarGrid.tsx`
  (reference for haptic pattern only)
- `src/features/habits/HabitsApp.tsx` (confirms `GestureHandlerRootView`
  already in tree — no provider work needed)

### Reused existing utilities

- `triggerHaptic('selection')` from `src/utils/haptics` — already the
  established pattern for month-change haptics in
  `BinaryHeatmap/MonthlyCalendarGrid.tsx:34`.
- `Gesture.Pan` / `GestureDetector` — already imported elsewhere in the
  codebase via `react-native-gesture-handler`.

## Verification

1. **Static checks**
   - `npm run lint` (no new ESLint errors; `max-lines` rule still passes for
     `MonthlyCalendar.tsx`)
   - `npx tsc --noEmit` (no new TypeScript errors)

2. **Unit / integration tests**
   - Existing tests under `src/components/HabitCalendarModal/` and
     `src/features/habits/tests/` must still pass (`npm test`).
   - No new test is required since gesture handlers are notoriously
     hard to exercise in Jest; we rely on manual device verification for
     the gesture itself, and existing tests still cover the chevron path.

3. **Manual on-device / simulator**
   - Open the app, open a habit's calendar modal so `MonthlyCalendar` is
     visible.
   - Swipe left on the days grid → header title changes to the next month,
     a light haptic fires, and the day cells update.
   - Swipe right → previous month, same behavior.
   - Tap the next/prev chevrons → still works as before, also with haptic.
   - Scroll the modal sheet vertically without swiping horizontally → the
     sheet scrolls normally and the month does NOT change.
   - Try a small (<50px) horizontal drag → month does NOT change.
