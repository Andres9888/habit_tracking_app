# Home Screen Micro-Interactions Polish

## Context

The home screen's structure is solid, but several micro-interactions feel
half-finished: modals enter with animation but pop out instantly, destructive
swipe actions fire silently with no haptic, selection-mode toggles have no
tactile confirmation, and the progress ring hits 100% without any celebration
moment. This is a small, focused polish pass — animations and haptics only,
no layout or structural changes.

Goal: every state change the user triggers on the home screen should give
both visual and tactile feedback that feels intentional.

## Audit Findings (micro-interactions only, ranked by impact / effort)

| # | Gap | Where |
|---|-----|-------|
| 1 | `UpgradePrompt` enters with `FadeInDown` but exits instantly | `src/features/habits/components/HabitsList/UpgradePrompt.tsx:35-50` |
| 2 | `UpgradePrompt` CTA buttons use opacity-only press feedback (no scale) | `src/features/habits/components/HabitsList/UpgradePrompt.tsx:82-120` |
| 3 | `SelectionActionBar` enters with `FadeInUp` but exits instantly | `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx:33-35` |
| 4 | Selection mode enter/exit via buttons has no haptic (only long-press has one) | `src/features/habits/HabitsApp.tsx:54-59` |
| 5 | Swipe-to-archive / swipe-to-delete commits silently — no haptic on action | `src/components/DraggableHabit/SwipeActions.tsx:17-80` |
| 6 | Progress ring fills to 100% with no celebration haptic | `src/features/habits/components/BottomActionBar/useCelebrationAnimations.ts:50-55,94-110` |
| 7 | `InlineTrialBar` unmounts without transition (creates content jump, breaks "smoothness") | `src/components/CalendarTimeline/CalendarTimeline.tsx:65-70` |

Confirmed already wired correctly (no-op): day-strip cell tap haptic
(`DayCell.tsx:57`), habit-completion haptic, FAB press haptic, long-press
selection entry haptic.

## Recommended Scope (this PR)

All seven items are bounded to micro-interactions. Bundle them as one
"interaction polish" PR — they're independent and each is a small change.

### Fix 1 — `UpgradePrompt` exit animation
Add `exiting={FadeOutDown.duration(200)}` to the modal root. Already imports
Reanimated; one-line addition.

### Fix 2 — `UpgradePrompt` button press scale
Add `transform: [{ scale: pressed ? 0.96 : 1 }]` with spring config to both
CTA Pressables, matching the BottomActionBar button pattern. Reuse the spring
config used elsewhere — don't define a new one.

### Fix 3 — `SelectionActionBar` exit animation
Add `exiting={FadeOutDown.duration(durations.quick)}` to the root
`Animated.View`. Mirrors the entrance ritual.

### Fix 4 — Selection mode toggle haptics
- `triggerSelection()` (light) when `enterSelectionMode` is called via the
  Select-All button or "Select" button (not long-press, which already has one).
- `trigger('tap')` (light) when `exitSelectionMode` is called.
- Wire in `HabitsApp.tsx:54-59` next to the existing handlers.

### Fix 5 — Swipe-action commit haptic
Fire `trigger('warning')` inside the `onArchive` / `onDelete` Pressable
handlers in `SwipeActions.tsx`. Matches the destructive-action haptic pattern.

### Fix 6 — Progress ring 100% celebration haptic
In `useCelebrationAnimations.ts`, when the ring progress crosses to 1.0
(detect inside the existing reaction / animation completion callback), fire
`trigger('celebration')` once per crossing. Guard with a ref so it doesn't
re-fire on re-renders while already at 100%.

### Fix 7 — `InlineTrialBar` collapse transition
Wrap the conditional render in `Animated.View` with Reanimated `Layout`
transition (e.g., `LinearTransition.duration(220)`) so the bar collapses
smoothly when `daysRemaining` hits 0 instead of unmounting and snapping the
content up.

## Out of scope (defer)

- Layout / padding / above-the-fold density changes
- Wiring `MonetizationHero` (separate concern, not micro-interaction)
- Habit row spacing unification
- BottomActionBar geometry rework
- Entrance stagger tuning (perf, not feel)
- Day-strip haptic (already wired correctly)

## Files to Modify

- `src/features/habits/components/HabitsList/UpgradePrompt.tsx` — exiting animation + button press scale
- `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx` — exiting animation
- `src/features/habits/HabitsApp.tsx` — haptics on selection mode toggle handlers
- `src/components/DraggableHabit/SwipeActions.tsx` — haptic on archive/delete commit
- `src/features/habits/components/BottomActionBar/useCelebrationAnimations.ts` — celebration haptic at 100%
- `src/components/CalendarTimeline/CalendarTimeline.tsx` — Layout transition wrapping InlineTrialBar

## Reusable Pieces (don't reinvent)

- `useHapticFeedback` / `trigger('tap' | 'warning' | 'selection' | 'celebration')` — already used across the codebase
- Reanimated `FadeOutDown`, `FadeOutUp`, `LinearTransition` — already in use elsewhere
- `durations.quick` from animation tokens — used by SelectionActionBar entrance
- The button press-scale pattern from `BottomActionBar` — copy the spring config, don't define new

## Verification

1. Start the app in the simulator with a fresh profile.
2. **UpgradePrompt**: trigger the modal, dismiss via backdrop and via "Maybe later" — card should fade-down with haptic, not vanish. Press buttons — should feel a snap-scale.
3. **SelectionActionBar**: enter selection mode, then deselect all — bar should fade out, not pop.
4. **Selection mode toggles**: tap "Select" button — light haptic. Tap "Cancel" — light haptic. Long-press still works as before.
5. **Swipe actions**: swipe a habit and commit archive — warning haptic fires. Same for delete.
6. **Progress ring celebration**: complete the last remaining habit so ring fills to 100% — celebration haptic fires once. Re-render the screen — does NOT fire again.
7. **Trial bar collapse**: simulate trial expiry (or temporarily flip the flag) — the bar collapses smoothly, content slides up over ~220ms instead of snapping.
8. Take a short screen recording of each interaction; per Andres' rule, validate against the rendered result, not just lint/types passing.
9. Run `npm run lint:max-lines` on touched files; all stay ≤100 lines.
