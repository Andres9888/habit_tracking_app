# Habit Strength — Replace stats row with single hero stat

## Context

The Habit Strength card on the habit detail screen ends in a three-column stats row (Since Start / Last Month / Last Week). Two of the three values duplicate the hero (the hero already shows current strength + "vs last month" delta), so the row mostly repeats numbers that are already on screen. On a fresh habit it reads as "100% / 0% / 0%" which makes the card feel hollow rather than rewarding.

Decision (after reviewing mocks at `.superdesign/design_iterations/habit_strength_stats_options_1.html`): **replace the stats row with a single hero stat** showing longest streak prominently, with a small subline of total completions and days tracked. No early-habit guard — ship as-is even when the streak is small. (Variant C in the mock.)

## Approach

Swap the existing `<StrengthStatsRow />` for a new `<StrengthMilestoneStat />` component. The new component:

- Takes a single visual block: warm habit-color tinted background, white icon container with a flame icon, then a two-line text stack.
- Headline: **"{N}-day longest streak"** (handles 0 / 1 / many gracefully via pluralization).
- Subline: **"{N} completions over {N} days tracked"**.
- Background gradient and accent colors derive from `habitColor` (passed into `HabitStrengthSection`) so it matches per-habit theming, not hardcoded orange. Use the same color-derivation approach already used for the ring + chart.

The deltas (`deltaVsMonth`, `deltaVsWeek`, `sinceStart`) become unused — remove them from the hook return shape and from the metrics calculation utility.

## Files to modify

1. **`src/components/HabitStrengthSection/HabitStrengthSection.tsx`** (lines 149-153)
   - Replace `<StrengthStatsRow />` with `<StrengthMilestoneStat />`.
   - Pass `longestStreak`, `totalCompletions`, `daysTracked`, `habitColor`.

2. **`src/components/HabitStrengthSection/StrengthMilestoneStat.tsx`** (NEW, ≤100 lines)
   - Pure presentational component. Props: `longestStreak: number`, `totalCompletions: number`, `daysTracked: number`, `color: string`.
   - Pluralization helpers inline (no external lib needed).
   - Uses `lucide-react-native` `Flame` icon (already in deps — confirm during exec).
   - Theme-aware via `useThemeColors`.

3. **`src/components/HabitStrengthSection/HabitStrengthSection.hooks.ts`**
   - Add to the return: `longestStreak`, `totalCompletions`, `daysTracked`.
   - `longestStreak`: call `calculateBestStreakFromDates([...completedDates])` from `src/lib/offline/calculations/streakFromDates.ts:17` — already exists, reuse it.
   - `totalCompletions`: `completedDates.size`.
   - `daysTracked`: `differenceInDays(today, habitCreatedAt) + 1`, clamped to ≥ 1.
   - Remove `extendedMetrics.deltaVsWeek`, `deltaVsMonth`, `sinceStart` from the consumed shape (the hero still uses `deltaVsMonth` — keep that one).

4. **`src/components/HabitStrengthSection/utils/metricsCalculation.ts`**
   - Keep `deltaVsMonth` (hero needs it).
   - Drop `deltaVsWeek` and `sinceStart` calculations if no other callers — verify with grep before deleting.

5. **`src/components/HabitStrengthSection/types.ts`**
   - Update `ExtendedStrengthMetrics` to drop unused fields.
   - Remove `StrengthStatsRowProps`.
   - Add `StrengthMilestoneStatProps`.

6. **`src/components/HabitStrengthSection/StrengthStatsRow.tsx`** — DELETE.

7. **Tests** — if `StrengthStatsRow` has snapshot/unit tests, replace with equivalents for `StrengthMilestoneStat`.

## Reuse

- **`calculateBestStreakFromDates(dates: string[])`** — `src/lib/offline/calculations/streakFromDates.ts:17`. Takes an array of YYYY-MM-DD strings, returns the longest consecutive run. Convert the `completedDates` Set to an array before passing.
- **`differenceInDays`** — same module's `dateHelpers`. Already used for streak math in this file.
- **Color helpers** — whatever `StrengthHero` and `StrengthChart` use to derive tinted backgrounds from `habitColor` (likely in `./constants.ts` via `getThemeColors`). Match their pattern; don't introduce a new color system.
- **Pluralization** — none in repo for this case; inline ternary is fine (`n === 1 ? 'day' : 'days'`).

## Visual spec (from mock variant C)

- Container: `borderRadius: 14`, padding `14px 16px`, flex row, gap 12px.
- Background: gradient from `habitColor` at ~8% opacity → ~20% opacity, top to bottom. Adjust with theme — in dark mode use a darker tinted surface.
- Icon container: 38×38, `borderRadius: 12`, `backgroundColor: themeColors.card`, subtle shadow, centered Flame icon at 20px in `habitColor`.
- Headline text: 17px, weight 700, `habitColor` darkened ~30% (or use `themeColors.text.primary` if simpler — check what reads).
- Subline text: 11px, weight 500, muted version of headline color.
- All three numbers come from real data — no fake states.

## Edge cases (resolved)

- **0-day streak / 0 completions / day-0 habit**: ship it. "0-day longest streak / 0 completions over 1 day tracked". User explicitly chose no guard.
- **Singular**: "1-day longest streak", "1 completion over 1 day tracked".
- **Reduced motion**: no new animation introduced; existing card-level FadeInDown remains.
- **Accessibility**: set `accessibilityLabel` on the container summarizing all three numbers in a sentence.
- **Skeleton loader**: update lines 67-71 of `HabitStrengthSection.tsx` to match the new shape (one row, full width) instead of three columns.

## Verification

1. **Visual diff against mock** — open `.superdesign/design_iterations/habit_strength_stats_options_1.html` (variant C) and the running app's habit detail screen side-by-side. Match per the file rule "screenshot and compare to mockup before claiming done."
2. **States to check in-app**:
   - Brand-new habit (0 completions): renders cleanly, no NaN.
   - Habit with 1 completion: singular grammar works.
   - Mature habit with broken streak: longest streak shows historic best, not current.
   - Habit with non-orange color: gradient/icon recolor correctly.
3. **Type check**: `npx tsc --noEmit` clean.
4. **Lint**: `npm run lint` clean. New file under 100 lines.
5. **Unit test**: add a small test for `StrengthMilestoneStat` covering 0/1/many pluralization.
6. **Existing tests**: run the existing `HabitStrengthSection` test suite (if any) — adjust for removed props.
7. **Manual smoke**: open habit detail screen on iOS sim, confirm card renders without layout shift, confirm 1M/3M/1Y toggle still works.

## Out of scope

- No changes to the hero (ring + Strong pill + delta) — keep as-is.
- No changes to the chart.
- No changes to data flow above `HabitStrengthSection` — `completedDates` and `habitCreatedAt` are already passed in.
