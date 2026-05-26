# Habit Strength section — improvement mock

Mocks and reference images for redesigning the **Habit Strength** section on
the Habit Detail screen (`src/components/HabitStrengthSection`).

| File | What it is |
| --- | --- |
| `habit-strength-improvements.html` | Interactive, fully laid-out mockup (open in a browser). Includes a side-by-side before/after, three variant explorations, an empty-state redesign, and a prioritisation matrix. |
| `images/habit-strength-improvements-hero.png` | Hero comparison image — current vs. proposed, two phones side by side. |
| `images/habit-strength-improvements-proposed.png` | Single-screen detail of the proposed redesign. |
| `images/habit-strength-improvements-variants.png` | Three alternate visual directions (growth ladder, density heatmap, dark/minimal). |

## Problem

The current section is clean but **purely descriptive**:

- A number ("72%") with no narrative — _72% of what?_
- A curve that shows the past but not the future
- Three flat stat columns that read like a spreadsheet
- The streak shield game mechanic (already in the v2 rework) is invisible
- Empty state is a dead end — no "what comes next"

## Proposed direction

Same vertical footprint, but every element is rewritten to answer a user
question instead of just stating a fact:

1. **Tier ring + countdown** — replaces the bare percentage with a
   "STRONG · TIER 3" pill and "13 more days to reach Unstoppable", plus a
   5-segment tier progress bar (Seed → Sprout → Sapling → Strong → Unstoppable).
2. **Insight chip** — a single sentence forecast: _"Keep your 7-day pace and
   you'll hit Unstoppable on Jun 8."_ Sources data already computed in
   `extendedMetrics` and `deltaCalculations`.
3. **Forecast curve** — the existing chart gains milestone markers (7d, 21d…),
   a dashed projected curve, and a dashed green target line at 100%.
4. **30-day density strip** — a thin row of 30 cells under the chart showing
   completion density at a glance. Reuses `completedDates`.
5. **Sparkline stat cards** — replaces the 3-column flat row with three small
   cards that each carry a sparkline (best streak, vs last month, consistency).
6. **Streak Shield card** — surfaces the v2 rework's hidden mechanic with a
   "3 of 5 shields used" reveal. Only shown when relevant.
7. **3-step empty state** — turns "Not enough data yet" into "Day 1 of 3 to
   Sprout" with a clear CTA.

## Variants

- **A · Growth ladder** — replace the ring with a five-step "ladder" glyph
  (Seed → Unstoppable). Stronger metaphor, less number-driven.
- **B · Density heatmap** — swap the curve for a GitHub-style 13-week heatmap
  that emphasises consistency texture.
- **C · Dark / minimal** — stripped-back dark-mode version for power users.

## Reuse map

| New piece | Existing module to extend |
| --- | --- |
| Tier ring + countdown | `StrengthHero/ProgressRing.tsx` + `constants.ts` (tier colors) |
| Insight chip | `HabitStrengthSection.hooks.ts` (compute forecast date) |
| Forecast curve | `StrengthChart/ChartCurve.tsx` + new `ForecastCurve.tsx` |
| 30-day density strip | New `DayDensityStrip.tsx` next to `StrengthChart` |
| Sparkline stat cards | Replace `StrengthStatsRow.tsx` |
| Streak shield card | New conditional sub-component, sourced from habit doc |
| Empty state | `components/EmptyState.tsx` |

## Effort vs. impact

See the "What each idea solves" table at the bottom of the HTML mock.
TL;DR — _tier ring + insight chip + streak shield card_ deliver the highest
motivational lift with the smallest code change.
