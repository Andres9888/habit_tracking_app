# Merge Why & Benefits + Restructure Tabs

## Context

The current branch (`weekly-habit-duration`) added a new **Time** tab containing `WeeklyTimeCard` (log minutes, set daily/weekly minute goals) and left the **Goal** tab as-is (`GoalWhyAnchor` + `StreakGoalCard` + `GoalCoachLine`).

A sibling branch (`habit-why-benefits`, in `/Users/andres/conductor/workspaces/habit_tracking_app/habit-why-benefits`) built a richer motivation surface: `HabitWhyBenefitsCard` (collapsible card with why / identity / WOOP wish + bulleted benefits + science note) plus a `WhyBenefitsEditModal` editor. It currently swaps `GoalWhyAnchor` → `HabitWhyBenefitsCard` inside the Goal tab.

Goal: merge that branch, then restructure tabs to **Calendar | Strength | Goals | Why**, where:
- **Goals** absorbs both time goals (current Time tab) and streak goal (current Goal tab) into one consolidated tab.
- **Why** becomes its own dedicated tab hosting `HabitWhyBenefitsCard`.

Outcome: 4 tabs instead of 4-with-overlap; the streak/time/why concerns are cleanly separated; the new editor + benefits surface lands in a tab dedicated to motivation.

---

## Approach

### Step 1 — Merge `habit-why-benefits`

```bash
git merge habit-why-benefits
```

**Anticipated conflicts** (both branches touched these):
- `convex/schema.ts` — both added optional fields to the `habits` table. Keep ALL: `dailyMinutesGoal`, `weeklyMinutesGoal` (from this branch) AND `benefits`, `scienceNote` (from why-benefits). The `habitGroupBy` passthrough on `userSettings` (commit `82a8f207b`) was already added by the why-benefits author specifically to accept rows written by this branch — keep it.
- `convex/habits/types.ts` — both extended `updateHabitArgs`. Keep all four new optional fields.
- `convex/habits/validators.ts` — both added validation. Keep both rule sets (minute goals + benefits/scienceNote).
- `convex/_generated/api.d.ts` — auto-generated; let `npx convex dev` regenerate after manual resolution.

Resolve manually, then run `npx convex dev` once to regenerate types.

### Step 2 — Rename / restructure tab system

**File: `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx:10`**

Change type:
```ts
export type DetailView = 'calendar' | 'strength' | 'goals' | 'why';
```

**File: `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx:25–30`**

Change tabs array to:
```ts
const TABS: Array<{ label: string; view: DetailView }> = [
  { label: 'Calendar', view: 'calendar' },
  { label: 'Strength', view: 'strength' },
  { label: 'Goals', view: 'goals' },
  { label: 'Why', view: 'why' },
];
```

**File: `src/screens/HabitDetailScreen/components/useDetailScrollSpy.ts`**

- Line 27: change initial `sectionYsRef` to `{ calendar: 0, strength: 0, goals: 0, why: 0 }`.
- Lines 26 & 66: change initial state default from `'calendar'` (no change) but rewrite scroll-detection (lines 67–69) to:
  ```ts
  let next: DetailView = 'calendar';
  if (sections.why > 0 && scrollY >= sections.why) next = 'why';
  else if (sections.goals > 0 && scrollY >= sections.goals) next = 'goals';
  else if (sections.strength > 0 && scrollY >= sections.strength) next = 'strength';
  ```

### Step 3 — Create `GoalsTabContent` (new component)

**New file: `src/screens/HabitDetailScreen/components/GoalsTabContent/`**

Combines time goals (existing `WeeklyTimeCard`) + streak goal (existing `StreakGoalCard` + `GoalCoachLine` + `GoalAdjustSheet` + `GoalTabEmptyState`) into one tab.

Reuse without modification:
- `./WeeklyTimeCard` (already in this branch)
- `../../../components/ProgressSectionConsolidated/StreakGoalCard`
- `./GoalCoachLine`
- `./GoalAdjustSheet`
- `./GoalTabEmptyState`

Render order inside the tab: `WeeklyTimeCard` → divider → streak section (header "Streak goal" + `StreakGoalCard` + `GoalCoachLine` + `GoalAdjustSheet`).

Each subsection sits in its own card so they read as two distinct goal types.

Stay ≤100 lines per file (project rule). Decompose:
```
GoalsTabContent/
├── index.ts
├── GoalsTabContent.tsx        (orchestration)
├── StreakGoalSection.tsx      (header + StreakGoalCard + CoachLine + AdjustSheet)
└── GoalsTabContent.types.ts
```

### Step 4 — Wire new tabs into `HabitDetailContent.tsx`

**File: `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx`**

- Replace import of `WeeklyTimeCard` with `GoalsTabContent`.
- Remove import of `GoalTabContent`.
- Add import of `HabitWhyBenefitsCard` (newly arrived from merge).
- Lines 93–106: replace the two separate Time + Goal sections with:
  ```tsx
  <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('goals')}>
    <ErrorBoundary>
      <GoalsTabContent
        completionRate={completionRate}
        habit={habit}
        habitColor={habitColor}
      />
    </ErrorBoundary>
  </View>

  <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('why')}>
    <ErrorBoundary>
      <HabitWhyBenefitsCard habit={habit} />
    </ErrorBoundary>
  </View>
  ```

### Step 5 — Clean up obsolete files

- Delete the old `GoalTabContent.tsx` (its content now lives in `GoalsTabContent` + `StreakGoalSection`).
- Delete the old `GoalWhyAnchor/` directory (replaced by `HabitWhyBenefitsCard`, which the merge already swapped in).
- Update `src/screens/HabitDetailScreen/components/index.ts` to export `GoalsTabContent` and remove `GoalTabContent` / `GoalWhyAnchor`.
- Search for any remaining imports of `GoalTabContent` or `GoalWhyAnchor` and remove them.

### Step 6 — Update file-level docstrings

- `DetailViewTabs.tsx:1–4` — update header comment from "Calendar / Strength / Goal" to "Calendar / Strength / Goals / Why".
- `useDetailScrollSpy.ts:1–7` — same.
- `HabitDetailContent.tsx:1–4` — same.

---

## Critical Files

| File | Change |
| --- | --- |
| `convex/schema.ts` | Merge resolve — keep all new optional fields |
| `convex/habits/types.ts` | Merge resolve — keep all updateHabitArgs additions |
| `convex/habits/validators.ts` | Merge resolve — keep both validation blocks |
| `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx` | Update `DetailView` type |
| `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx` | Update `TABS` array |
| `src/screens/HabitDetailScreen/components/useDetailScrollSpy.ts` | Update section keys + detection |
| `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` | Swap Time+Goal sections for Goals+Why |
| `src/screens/HabitDetailScreen/components/GoalsTabContent/*` | NEW — orchestrates time + streak goal |
| `src/screens/HabitDetailScreen/components/index.ts` | Re-export updates |
| `src/screens/HabitDetailScreen/components/GoalTabContent.tsx` | DELETE |
| `src/screens/HabitDetailScreen/components/GoalWhyAnchor/` | DELETE |

---

## Reused (no modification)

- `WeeklyTimeCard` (from this branch) — `src/screens/HabitDetailScreen/components/WeeklyTimeCard/`
- `StreakGoalCard` — `src/components/ProgressSectionConsolidated/StreakGoalCard`
- `GoalCoachLine`, `GoalAdjustSheet`, `GoalTabEmptyState` — already in `HabitDetailScreen/components/`
- `HabitWhyBenefitsCard` (arrives via merge) — `src/screens/HabitDetailScreen/components/HabitWhyBenefitsCard/`
- `WhyBenefitsEditModal` (arrives via merge) — `src/screens/HabitDetailScreen/components/WhyBenefitsEditModal/`
- `ErrorBoundary`, `useThemeColors`, `shadows.card`, `borderRadius`

---

## Verification

1. **Type check:** `npx tsc --noEmit` — should pass cleanly after merge resolution and tab refactor.
2. **Lint:** `npm run lint` — no new violations; check `max-lines` for `GoalsTabContent.tsx` (<100 lines).
3. **Convex regenerate:** `npx convex dev` — generates fresh `_generated/api.d.ts` from merged schema; verify no schema validation errors.
4. **Functional walk-through (in simulator/device):**
   - Open a habit's detail screen.
   - Verify 4 tabs render in order: **Calendar, Strength, Goals, Why**.
   - Tap each tab → smooth scroll to its section, indicator pill animates.
   - Scroll manually → active tab updates correctly per scroll-spy.
   - Goals tab: see `WeeklyTimeCard` (log time, set time goals) AND streak goal section (StreakGoalCard + adjust streak goal).
   - Why tab: see `HabitWhyBenefitsCard`. Tap edit pencil → `WhyBenefitsEditModal` opens. Edit fields → save → values persist (round-trip via Convex).
   - Habit with no goal/no why → empty states render in their respective tabs.
5. **Compare against mockups** in `.superdesign/design_iterations/habit_detail_why_benefits_*.html` (came in with the merge) for the Why tab visual.
6. **Regression check:** previous Time + Goal tab data still works (existing `dailyMinutesGoal`, `weeklyMinutesGoal`, `goalDuration` fields untouched).
