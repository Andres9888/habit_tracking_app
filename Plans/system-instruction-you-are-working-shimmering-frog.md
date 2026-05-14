# Simpler Goal tab — drop milestones, coach card, and projected date

## Context

The Goal tab on the Habit Detail screen currently renders a milestone-heavy
"scoreboard" layout: ring + numbers + next-milestone pill + a row of milestone
badges + coach card + projected-date banner. {PRINCIPAL.NAME} wants a simpler,
focused design — just **the streak the user is aiming for**, with no
milestones, no coach card, no projected-date copy.

Final spec is locked to `.superdesign/design_iterations/streak_goal_simple_3.html`
minus the orange "📅 At your pace, you'll hit it around June 11" projected card.
Specifically: card title + current-streak hero + progress bar with labels.
Nothing else inside the goal card. The Adjust modal stays.

## Files to modify

### 1. `src/screens/HabitDetailScreen/components/GoalTabContent.tsx`

- Remove the `<GoalCoachLine ... />` render (lines 88–92) and its import
  (line 16) — drops the "You got this" / "You're past the hard part" card.
- Change the card title from `Goal` (line 59) to
  `` `Aiming for ${goalDuration} day${goalDuration === 1 ? '' : 's'}` ``.
- Change `Adjust goal` (line 73) to just `Adjust`.
- Replace the `<StreakGoalCard ... />` render with a new local presentation
  block (or a new `SimpleStreakGoalHero` sub-component) that matches the
  mockup: eyebrow "Current streak" → big serif number → "of N days" subtitle
  → full-width progress bar → "{percent}% complete · {daysRemaining} to go".
- Reuse `useStreakGoalData(currentStreak, goalDuration)` from
  `StreakGoalCard.hooks.ts` to get `overallPercent` and `daysRemaining`.
- Keep `GoalWhyAnchor`, `GoalTabEmptyState`, `GoalAdjustSheet` untouched.

### 2. **Do not modify** `StreakGoalCard.tsx` or its sub-components

`ProgressSectionConsolidated.tsx:97` is the second consumer of `StreakGoalCard`
and still wants milestones / projected / coach context for that surface.
Surgical fix rule: don't gut a shared component because one of its consumers
wants a simpler view. Build the simpler view next to it instead.

Files that stay as-is:

- `src/components/ProgressSectionConsolidated/StreakGoalCard/StreakGoalCard.tsx`
- `src/components/ProgressSectionConsolidated/StreakGoalCard/CompactHero.tsx`
- `src/components/ProgressSectionConsolidated/StreakGoalCard/NextMilestonePill.tsx`
- `src/components/ProgressSectionConsolidated/StreakGoalCard/MilestonesRow.tsx`
- `src/components/ProgressSectionConsolidated/StreakGoalCard/ProjectedBanner.tsx`
- `src/screens/HabitDetailScreen/components/GoalCoachLine/*`
  (component remains exported in case it's needed elsewhere; just unwired
  from GoalTabContent)

### 3. Reuse, do not re-derive

- `useStreakGoalData` already returns `{ overallPercent, daysRemaining }` —
  reuse it. Drop the unused `milestones` and `projectedDate` from the
  destructure.

## Anti-criteria

- Do not remove `GoalWhyAnchor` — it's conditional user content (only renders
  when the user has set a why/identity/woopWish).
- Do not remove `<StreakGoalCard>` from `ProgressSectionConsolidated.tsx`.
- Do not rename the Edit screen's "Streak Goal" section (separate scope).
- Do not delete the GoalCoachLine source files (only unwire from GoalTabContent).

## Verification

1. `npm run lint:max-lines` — confirm GoalTabContent.tsx still under 100
   lines (currently 104 — the inline hero will need to be a sub-component
   or the file split per the project's decomposition rules).
2. Open the app, navigate to Habit Detail → Goal tab on a habit with an
   active streak goal (e.g. the meditation habit with goalDuration=66).
   Screen should render: habit head → tabs → card with "Aiming for 66 days"
   title + Adjust + Current streak eyebrow + big number + "of 66 days" +
   progress bar + "X% complete · N to go". Nothing below the card except
   the existing GoalAdjustSheet trigger.
3. Compare side-by-side against
   `.superdesign/design_iterations/streak_goal_simple_3.html` minus the
   projected card. Use the browser mockup to verify alignment of:
   eyebrow case/letterspacing, number size, subtitle copy, bar fill color,
   and label row.
4. Open another habit with no goal — should still see `GoalTabEmptyState`
   untouched.
5. Open the screen where `ProgressSectionConsolidated` renders — milestone
   row, next-milestone pill, and projected banner should all still be
   present there (the other consumer is untouched).
6. `npm run typecheck` (or `tsc -p tsconfig.app.json -noEmit`) passes.

## Open question (call out, don't block)

The mockup card title reads "Aiming for 100 days". I'll implement it that
way. If you'd rather keep the simpler "Goal" title and let the count itself
carry the spec, tell me and I'll flip a one-line change.
