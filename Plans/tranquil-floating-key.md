# Streak Goal System

## Context

Users currently see fixed milestone targets (3, 7, 14, 21, 30... 365 days) but can't set personal streak goals. The schema already has unused `goalDuration` and `goalUnit` fields. This feature lets users set a custom streak goal per habit (e.g., "reach 21 days"), see progress toward it, and celebrate when achieved.

---

## Phase 0: Browser Mock

Create an interactive HTML mockup in `.superdesign/design_iterations/` showing both screens:
1. **Goal Setting** — Preset grid (7/14/21/30/60/90 days) + custom input, inside the edit habit modal style
2. **Goal Progress** — Progress bar with "12/21 days", motivational copy, achieved state variant
3. **Goal Celebration** — Achievement modal with confetti-style visuals

Mobile-first (390px), dark theme matching the app's existing style. Interactive state toggling.

---

## Phase 1: Backend — Data + Validation

### 1a. Add `goalAchievedAt` to schema
**File:** `convex/schema.ts`
- Add `goalAchievedAt: v.optional(v.number())` to the `habits` table
- This tracks when the current goal was hit (null = not yet achieved)

### 1b. Update validation
**File:** `convex/habits/validation.ts`
- Add `goalDuration` validation: positive integer, min 1, max 3650
- Validate `goalUnit` is `"streak_days"` when `goalDuration` is set

### 1c. Wire goalDuration into create mutation
**File:** `convex/habits/create.ts`
- Pass `goalDuration` and `goalUnit` through to `ctx.db.insert` (they're already in the schema, just not being used)

### 1d. Goal achievement detection on toggle
**File:** `convex/habits/toggle.ts` (the `recalculateStreakAndStrength` path)
- After computing `currentStreak`, check: if `habit.goalDuration && !habit.goalAchievedAt && currentStreak >= habit.goalDuration` → set `goalAchievedAt = Date.now()`
- Include in the existing `ctx.db.patch` call

### 1e. Update types/validators
**Files:** `convex/habits/types.ts`, `convex/habits/validators.ts`
- Add `goalAchievedAt` to relevant validators (update args, removed habit data validator for delete/restore)

---

## Phase 2: Goal Setting UI (Edit Screen)

### 2a. Create StreakGoalSection component
**New file:** `src/screens/HabitEditScreen/StreakGoalSection.tsx`
- Preset buttons: 7, 14, 21, 30, 60, 90 days (3x2 grid)
- "Custom" button → numeric input (1-3650)
- "No goal" option to clear
- If goal already achieved: show achievement badge + "Set new goal" prompt
- Uses existing `SectionLabel` for the header

**New file:** `src/screens/HabitEditScreen/StreakGoalSection.types.ts`

### 2b. Wire into edit screen state
**File:** `src/screens/HabitEditScreen/useHabitEditScreen.ts`
- Add `goalDuration` state, initialized from `habit.goalDuration`
- Add setter callback

### 2c. Wire into save handler
**File:** `src/screens/HabitEditScreen/useHabitSaveHandler.ts` (or equivalent)
- Include `goalDuration`, `goalUnit: "streak_days"` in update mutation call
- When goal changes, clear `goalAchievedAt` (so new goal starts fresh)

### 2d. Add section to edit screen layout
**File:** `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- Render `StreakGoalSection` between `CustomizeSection` and the Danger Zone

---

## Phase 3: Progress Visualization

### 3a. Create StreakGoalProgress component
**New directory:** `src/components/ProgressSectionConsolidated/StreakGoalProgress/`
- `index.ts` — barrel export
- `StreakGoalProgress.tsx` — main component showing: label ("Streak Goal: 21 Days"), progress bar, "12/21 days (57%)" text, motivational micro-copy
- `GoalProgressBar.tsx` — animated fill bar (Reanimated)
- `GoalAchievedState.tsx` — golden highlight + "Set new goal" link when achieved

### 3b. Create calculation helpers
**New file:** `src/components/ProgressSectionConsolidated/streakGoalCalculations.ts`
- `calculateStreakGoalProgress(currentStreak, goalDuration, goalAchievedAt)` → `{ progressPercentage, daysRemaining, isAchieved, displayState }`
- `displayState`: `'no-goal' | 'in-progress' | 'achieved' | 'exceeded'`

### 3c. Integrate into ProgressSectionConsolidated
**File:** `src/components/ProgressSectionConsolidated/ProgressSectionConsolidated.tsx`
- When `habit.goalDuration` is set: render `StreakGoalProgress` as primary progress indicator (above or instead of `MilestoneProgress`)
- When no goal: keep current `MilestoneProgress` behavior

---

## Phase 4: Goal Achievement Celebration

### 4a. Add goal milestone factory
**File:** `src/components/StreakMilestoneCelebration/constants.ts`
- Add `createGoalMilestone(goalDuration)` returning `{ days, emoji: '🎯', title: '${n}-Day Goal Achieved!', color: '#10b981' }`

### 4b. Extend celebration provider
**File:** `src/components/StreakMilestoneCelebration/StreakMilestoneProvider.tsx`
- Extend `checkAndCelebrate` to accept `goalDuration` and check for goal crossing alongside fixed milestones
- Goal celebration takes priority over fixed milestone if both trigger simultaneously

### 4c. Wire goal data into celebration check
**File:** `src/components/StreakMilestoneCelebration/useCelebrationHandlers.ts`
- Pass `habit.goalDuration` into the celebration check path

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Goal <= current streak | Mark as achieved immediately on save. Skip celebration. |
| Streak breaks before goal | Progress bar resets naturally with streak. No special logic. |
| Goal changed after achievement | Clear `goalAchievedAt`. New goal starts fresh. |
| Goal removed | Set `goalDuration = undefined`. UI falls back to fixed milestones. |
| Reached while paused | Cannot happen — streaks don't advance while paused. |
| Goal = 0 or negative | Backend validation rejects. |

---

## Existing code to reuse

- **Schema fields:** `goalDuration`, `goalUnit` already in `convex/schema.ts:80-83`
- **Milestone calculations:** `src/components/ProgressSectionConsolidated/milestoneCalculations.ts` — pattern for progress calculation
- **Celebration system:** `src/components/StreakMilestoneCelebration/` — modal, confetti, haptics
- **CelebrationSystem confetti:** `src/components/CelebrationSystem/` — `burstType: 'streakMilestone'`
- **SectionLabel:** `src/screens/HabitEditScreen/SectionLabel.tsx` — for edit screen section headers
- **AnimatedGoalNumber:** `src/components/ProgressSectionConsolidated/TodaysFocusCard/` — animated number display

---

## Verification

1. **Set a goal:** Edit a habit → set 7-day goal → verify `goalDuration=7` saved in Convex dashboard
2. **Progress display:** With goal set, check habit detail shows progress bar with correct fraction
3. **Achievement:** Complete habit for N consecutive days → verify celebration fires when streak hits goal
4. **Change goal:** After achieving, set a new goal → verify `goalAchievedAt` cleared, new progress shown
5. **Remove goal:** Clear goal → verify UI falls back to standard milestone display
6. **Edge: goal < streak:** Set goal to 3 when streak is 10 → verify shows as achieved immediately
7. **Validation:** Try setting goal to 0, -1, or 5000 → verify rejected
