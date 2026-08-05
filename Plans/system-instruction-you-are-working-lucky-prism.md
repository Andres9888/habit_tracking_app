# Habit Strength — Bottom Stats Row Redesign

## Context

On the habit detail screen's "Habit Strength" card, the bottom 3-stat row ("Since Start | Last Month | Last Week") doesn't earn its space:

- **Since Start** is literally `Math.round(currentStrength)` (`metricsCalculation.ts:64`, comment: *"Since start = current (started at 0)"*) — same number as the big circular gauge.
- **Last Month** duplicates the "+0% vs last month" badge already shown beside the "Strong" label in `StrengthHero/StatusDisplay.tsx`.
- **Last Week** is the only unique number, but for established habits at high strength, deltas trend toward 0%.

Also: the **1M / 3M / 1Y toggle** at the top of the card only changes the chart — the stats row is hardcoded and doesn't respond, so the toggle feels orphaned.

Andres asked: *"what can we remove or improve — the time section doesn't seem to do much"* and requested **HTML mockups in the browser** to compare options before committing to a direction.

Design intent (from memory `project_habit_strength_intent.md`): *bias toward what keeps users engaged and coming back.*

## Approach

**Two-step plan.** Mockups first (no React Native changes), then implementation of the chosen option.

### Step 1 — Generate comparison mockups (this PR)

Create one HTML file in `.superdesign/design_iterations/` that renders the **current state** plus **four option mockups** stacked vertically, all themed to match the iOS screenshot (cream background, orange/coral accent, rounded card, system font stack). Each mockup is a full reproduction of the strength card so visual comparison is fair.

Mockups to render:

- **Option 0 — Current** (baseline, as shown in `simulator_screenshot_778B96F2…png`)
  - Since Start 100% | Last Month 0% | Last Week 0%

- **Option A — Delete the row entirely**
  - Hero gauge + chart only. No stats row, tighter card.

- **Option B — Peak / Avg / Streak (range-reactive)** ★ Plan agent's recommendation
  - Peak (in selected range) | Avg (in selected range) | Current Streak (global)
  - 1M / 3M / 1Y toggle now changes Peak & Avg — gives the toggle a real purpose
  - Each stat is genuinely unique; Streak adds engagement axis missing today

- **Option C — Compress (Last Week + Streak)**
  - Last Week | Current Streak. Two stats, drops the two redundant ones, adds one motivating metric.

- **Option D — Three static motivating stats**
  - Current Streak | Best Streak | Peak Strength. Toggle remains chart-only.

Each option block: small header ("Option X — name"), one-line "why this works" caption, and the rendered card.

File path: `.superdesign/design_iterations/habit_strength_stats_row_options.html`

### Step 2 — Implementation (separate, after Andres picks)

I'll come back with a focused implementation plan for the chosen option. Likely files to touch:

- `src/components/HabitStrengthSection/utils/metricsCalculation.ts` (lines 24–67) — change what `extendedMetrics` returns
- `src/components/HabitStrengthSection/types.ts` — update `ExtendedStrengthMetrics` and `StrengthStatsRowProps`
- `src/components/HabitStrengthSection/StrengthStatsRow.tsx` (125 lines, only consumer is the parent) — relabel / restructure or delete
- `src/components/HabitStrengthSection/HabitStrengthSection.tsx:149-153` — update props passed
- For Options B/C/D: import `computeCurrentStreakFromDates` from `src/utils/streak.ts:41` (already exists)
- For Option B: add `peakInRange` / `avgInRange` reducers over `filteredHistory` (already filtered by `filterHistoryByTimeRange`)

## Critical files (read-only references)

- `src/components/HabitStrengthSection/HabitStrengthSection.tsx`
- `src/components/HabitStrengthSection/StrengthStatsRow.tsx`
- `src/components/HabitStrengthSection/StrengthHero/StatusDisplay.tsx`
- `src/components/HabitStrengthSection/utils/metricsCalculation.ts`
- `src/utils/streak.ts` (exports `computeCurrentStreakFromDates`)
- `.context/attachments/simulator_screenshot_778B96F2-022F-47DA-BCBD-DE435C2E560A.png` (source visual)

## Verification (Step 1)

1. Write `.superdesign/design_iterations/habit_strength_stats_row_options.html`.
2. Open it in the default browser via `open` so Andres can review:
   ```bash
   open .superdesign/design_iterations/habit_strength_stats_row_options.html
   ```
3. Andres compares options visually, picks one, and we proceed to Step 2.
4. No production code is modified in Step 1.
