# Plan: Apply Strength Decay Between Toggles

## Context

**Bug report (Andres):** "A habit that has not been set for a while will reset when a recent day was toggled. It doesn't seem that we have a decay."

**What's actually happening:** Strength decay IS implemented in the algorithm (2%/day backend, 5%/day frontend chart), but it's only applied when the user toggles a day. The stored `habit.strength` field is frozen between toggles. So:

1. User has a habit at e.g. 80% strength.
2. They stop tracking for 60 days. The hero ring keeps showing 80% — no decay applied in real-time.
3. They finally toggle a recent day. `recalculateStreakAndStrength` fires, re-simulates the whole timeline, and the stored strength drops to e.g. 6%.
4. The ring snaps from 80% → 6%, which the user perceives as a "reset" and reads as "there's no decay" (because the only time decay shows is at the moment of a toggle, instead of gradually as time passes).

**Evidence trail:**
- Stored strength is only written in `recalculateStreakAndStrength` (`convex/habits/toggle.ts:142`).
- No cron applies decay over time (`convex/crons.ts` — only purges deletedHabits and recomputes template popularity).
- The query `convex/habits/get.ts:13` returns the stored field as-is.
- The hero ring reads the stored value preferentially (`src/components/HabitStrengthSection/HabitStrengthSection.hooks.ts:55-59` — `habitStrength === undefined ? calculated : Math.round(habitStrength * 100)`).
- The chart bypasses the stored value and recomputes from completion data on the client (`src/components/HabitStrengthSection/utils/chartDataGeneration.ts:48`), which is why the chart already shows decay correctly. This produces a real visual mismatch: chart trending down vs. ring sitting at the stale high value.

**Intended outcome:** The displayed strength reflects decay continuously as days pass, not just at the moment of a toggle. The hero ring and chart agree.

## Recommended approach

Apply decay-since-last-update at the **Convex query layer**, so every consumer sees a strength that reflects elapsed missed days. This avoids touching the ~50 client files that read `habit.strength`.

The closed-form decay formula collapses the day-by-day loop in `calculateNewStrength` for the gap between "last time strength was written" and "now":

```
daysSinceUpdate = floor((now - habit.strengthUpdatedAt) / MS_PER_DAY)
decayMultiplier = (1 - baseDecayForMode) ^ daysSinceUpdate
adjustedStrength = storedStrength * decayMultiplier
```

This is mathematically equivalent to the loop applying `strength * (1 - baseDecay)` for `daysSinceUpdate` consecutive misses. Toggling re-runs the full algorithm and overwrites — no drift.

### Why a single chokepoint

- `habit.strength` is read in 50+ files (`Grep` confirmed). Wrapping at the query means we change a handful of places and every consumer is correct.
- Convex queries are pure and reactive — when `Date.now()` changes between renders the value will still be correct because the query re-runs on the data it returns (clients refetch on focus / on changes). Worst case: stale by a render cycle, which is acceptable for a percentage display.
- Mode-aware (uses same `baseDecay` as the next recalculation), so toggling produces a value continuous with what was displayed.

### Critical files to modify

**Backend (Convex) — apply decay before returning:**

1. **`convex/habits/get.ts`** — wrap returned habit through a `withDecayedStrength(habit)` helper.
2. **`convex/habits/list.ts`** — same wrapper, applied to each habit in the array.
3. **New backend helper** `convex/habitStrength/decayAdjustment.ts` (≤100 lines):
   - `withDecayedStrength(habit)` — pure function, returns a new habit object with `strength` and `strengthLevel` adjusted for elapsed days since `strengthUpdatedAt`.
   - Uses `getAlgorithmConfig(resolveAlgorithmMode(habit.strengthAlgorithm))` from `convex/habitStrength/algorithmConfig.ts` to get `baseDecay`.
   - Uses `getStrengthLevel` from `convex/habitStrength/strengthLevel.ts` to recompute the band after decay.
   - Edge cases: missing `strengthUpdatedAt` → no adjustment; days ≤ 0 → no adjustment; days > 3650 → clamp; `strength === 0` → short-circuit.

**Backend check (other queries that surface habits):**

4. Scan `convex/habits/` and `convex/analytics*.ts` for any other query returning a habit document and apply the wrapper. Confirmed list: `get.ts`, `list.ts` — others likely don't surface `strength` to UI, but I'll grep for `fullHabitValidator` returns and verify before shipping.

**Frontend chart — make decay mode-aware:**

5. **`src/components/HabitStrengthSection/utils/chartDataGeneration.ts`** — replace hard-coded `GROWTH_RATE = 0.05` / `DECAY_RATE = 0.95` with values from `ALGORITHM_MODE_CONFIGS[mode]`. Function signature gains a `mode: StrengthAlgorithmMode` parameter; default to `'balanced'`.
6. **`src/components/HabitStrengthSection/HabitStrengthSection.hooks.ts`** — pass `habit.strengthAlgorithm` through to `generateChartDataFromCompletions`.
7. **Wire `strengthAlgorithm` into the HabitStrengthSection props** at the call site (`src/screens/HabitDetailScreen/components/HabitDetailContent.tsx`).

**Optional but consistent:** `src/components/HabitStrengthHistory/strengthUtils/strengthIterator.ts` uses the same hard-coded constants. If `useHabitStrength` is still used for the hero ring's `currentStrength` fallback path, update it too to take a mode parameter. (`HabitStrengthSection.hooks.ts:55-59` shows the fallback path exists.)

### What we deliberately do NOT change

- Backend algorithm (`convex/habitStrength/momentum.ts`) — already correct; the decay wrapper is a closed-form extrapolation of it, not a replacement.
- The stored `habit.strength` field — stays as the last-recalculated snapshot, since the wrapper extrapolates from it.
- Cron jobs — no daily recompute needed because the wrapper handles staleness lazily.
- Component-level call sites — not editing each of the 50 read sites. They all go through Convex queries.

### Reuse, don't recreate

- Backend: `getAlgorithmConfig`, `resolveAlgorithmMode`, `getStrengthLevel`, `MS_PER_DAY` — all already exist in `convex/habitStrength/`.
- Frontend: `ALGORITHM_MODE_CONFIGS` in `src/components/HabitStrengthHistory/strengthUtils/constants.ts:12-19` — reuse for chart.

## Verification

1. **Manual repro of the bug (must fail before, pass after):**
   - Open a habit that has high stored strength and `strengthUpdatedAt` from weeks ago (or seed one in dev).
   - Before fix: hero ring shows the stale high value; chart shows the decayed value → mismatch.
   - After fix: hero ring shows roughly the same decayed value as the chart's most recent point.

2. **Toggle behavior:**
   - Toggle a recent day. The hero ring should NOT snap dramatically — it was already showing the decayed value, so the post-toggle recalculation should produce a similar number (slightly higher because of the gap-fill growth on the completion day).

3. **Mode awareness:**
   - Switch the habit's algorithm mode between forgiving / balanced / strict and confirm the displayed decay rate matches `ALGORITHM_MODE_CONFIGS`.

4. **Edge cases:**
   - Habit with no `strengthUpdatedAt` → falls back to stored value (no decay applied, no crash).
   - Habit toggled today → `daysSinceUpdate = 0` → displayed = stored.
   - Habit untouched for >10 years → clamped, doesn't iterate forever.

5. **Run:**
   - `npm run lint`
   - `npm run tsc` (or whatever the typecheck command is in this repo)
   - Open the app, navigate to HabitDetailScreen for the affected habit, verify visually against the chart.

## Answered

1. **Scope:** Fix everywhere `habit.strength` is read → handled via Convex query wrapper, not per-call-site edits.
2. **Chart:** Make mode-aware in the same change so ring and chart agree.
