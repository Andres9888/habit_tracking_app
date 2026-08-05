# Habit Strength (Detail Page) — Audit & Improvement Plan

## Context

The Habit Strength section is the centerpiece of the habit detail screen and the most product-defining surface in the app — it's where the user sees the *return* on their consistency. The current build has solid scientific bones (Lally 2010-calibrated three-mode algorithm, momentum-based simulation, defensive guards, accessibility roles) but the surface has a real a11y bug, a misleading time-range toggle, visual incoherence between the ring color and badge color, and the engagement loop the design intent doc calls for is mostly missing (no milestones, flat empty state, hidden algorithm, no "why this number").

This plan is an audit covering all four directions the user asked to look at: **bugs**, **engagement polish**, **algorithm surfacing**, and **visual redesign** — followed by a recommended sequencing.

Source of truth screenshot saved at `.context/screenshots/01-current.png` (Run 5K habit, 35% Developing, +25% vs last month, -4% last week, 1Y selected showing ~30 days of data).

---

## Track 1 — Real Bugs (do these regardless)

### 1.1 ProgressRing a11y label is hardcoded to "Strong"

- **File:** `src/components/HabitStrengthSection/StrengthHero/ProgressRing.tsx:52`
- **Problem:** `accessibilityLabel={`Habit strength ${roundedStrength}%, ${STRENGTH_LABELS.strong}`}` always announces "Strong" regardless of actual level. A habit at 8% announces "Habit strength 8%, Strong" to screen readers.
- **Fix:** Pass the actual label down (already computed as `safeLabel` in `StrengthHero.tsx:45`) and interpolate the correct `STRENGTH_LABELS[safeLabel]`.
- **Change scope:** Add `label` to `ProgressRingProps`, plumb from `StrengthHero.tsx:56-60`. ~10 lines.

### 1.2 Time-range toggle silently doesn't scope the headline

- **File:** `src/components/HabitStrengthSection/HabitStrengthSection.hooks.ts:56-79`
- **Problem:** `currentStrength`, `deltaVsMonth`, `deltaVsWeek`, and `sinceStart` are all computed independent of `timeRange`. Only `chartData` (line 81) respects the toggle. User taps 1M/3M/1Y and only the chart changes — ring and badge stay frozen.
- **Two options:**
  - **(a)** Make all metrics respect `timeRange` (truer to user expectation, more code).
  - **(b)** Constrain the toggle's scope visually — move 1M/3M/1Y to sit *only* over the chart, with a small "Chart range" label, so users don't expect it to affect the ring. (Cheaper, honest.)
- **Recommendation:** (b). The ring should always show *current* strength; ranges only contextualize the curve.

### 1.3 Duplicate "vs last month" delta

- **Files:** `StatusDisplay.tsx:72` (hero) and `StrengthStatsRow.tsx:109-113` (row).
- **Problem:** Same metric shown twice in adjacent space.
- **Fix:** In the hero, replace "+25% vs last month" with **"+3% vs last week"** (the more recent signal, currently hidden) OR a **streak-aware microcopy** ("3-day climb", "first dip in 2 weeks"). The stats row keeps the full breakdown.

### 1.4 Color clash between ring and tier badge

- **File:** `src/components/HabitStrengthSection/StrengthHero/StrengthHero.tsx:48`
- **Problem:** `ringColor = color || colors.primary` — when the user's habit color is set (e.g. cyan), the ring is cyan but the "Developing" badge uses amber, "Strong" uses emerald, "Weak" uses red. The pair never harmonizes.
- **Fix options:**
  - **(a)** Use tier color for the ring, treat habit color as accent only on the chart dot.
  - **(b)** Use habit color for the ring *and* the badge background, fall back to tier color only when no habit color is set. Keep tier color for *text* inside the badge (legibility).
  - **Recommendation:** (a). Tier color carries semantic meaning ("you're developing"); habit color is a personalization tag and belongs on the chart, not the ring.

### 1.5 Header comment mismatch

- **File:** `HabitStrengthSection.tsx:6` says "1M/1Y/All" but the toggle ships 1M/3M/1Y. Update the comment.

---

## Track 2 — Engagement Polish (per design intent doc)

The design intent doc says: *"bias toward what keeps users engaged. If a scientifically accurate decay rate feels punishing, soften it. If a growth curve feels too slow to be satisfying, make early progress more visible."* The current section reports state but doesn't *narrate* progress.

### 2.1 Milestones on the chart

Overlay markers on `StrengthChart` for:

- **Habit-formed line** (target % per algorithm mode: 85% at day 18 / 63 / 145).
- **Crossed-thresholds**: small dots when the line crossed 25%, 50%, 70% (with the date), so users see when they "leveled up".
- **Best-ever marker**: a small flag at the historical max.

Inputs already available from `strengthHistory` in `HabitStrengthSection.hooks.ts:49`.

### 2.2 Rich empty state

- **File:** `HabitStrengthSection.tsx:76-108`
- Current: 🌱 + "Not enough data yet. Complete your first day to start building strength."
- Proposal: show a **dashed preview curve** of the expected first-30-day trajectory for the habit's algorithm mode, with the target threshold line. Microcopy: "Your strength curve starts the day you do." Adds anticipation; gives the user something to *trace toward*.

### 2.3 "Why this number" tap-to-explain

Tappable hero opens a sheet:

- Last 7 days breakdown (✅ ✅ ⬜ ✅ ✅ ✅ ⬜).
- "Each completion this week: +X%. Each miss: -Y%."
- Mode in plain English ("This is a complex habit, so we use a 145-day curve.").
- Link to algorithm settings.

No new computation needed — `momentum.ts` already yields day-by-day deltas.

### 2.4 Headline microcopy beyond %

Above or below the ring, one short generative line:

- "🔥 3 days in a row" (streak-positive)
- "1 miss in 2 weeks" (consistency-positive)
- "Strongest you've been" (record)
- "Fastest 7-day rise yet" (velocity)

Pick the most flattering true statement (sorted priority list). Aligns with the intent doc's "fun-first" axis.

### 2.5 Resolve the 35% / 0% double-progress confusion

The streak card below says "0% complete (of 66 days)" while strength says 35%. Both are "progress" framings.

- **Either** name them more distinctly ("Strength" vs "Goal commitment") and explain how they differ in a tooltip, **or**
- Move the streak's percentage out and lead with the streak number alone ("0 / 66 days"). The denominator already conveys progress.

---

## Track 3 — Surface the Algorithm

Right now the three modes (Forgiving / Balanced / Strict) and their auto-pick from template duration are invisible on the detail page. Recent commit `98f4ae19d` added the auto-pick but no UI exposes it.

### 3.1 Mode chip in the section header

Next to "Habit Strength" title, a subtle chip: **"Balanced · 63d curve"** (tappable, opens an info sheet explaining the choice and offering override). Reuses `algorithmMode` field on the habit.

### 3.2 Target line on the chart

Dashed horizontal line at 85% with a label "habit-formed". Optional: a vertical guide at the target day (day 18 / 63 / 145) projected from `habitCreatedAt`.

### 3.3 Algorithm override UI

A row in the existing Edit Habit screen or a tap-through from the mode chip: radio choice of Forgiving / Balanced / Strict with a short description of each. (Per-habit override is already supported per recent commit `e8faefaa3`.)

---

## Track 4 — Visual Redesign

After the bug fixes above land, the section's information density is still uneven: small ring + small chart + dense stats row. Two redesign options to consider:

### 4.1 Anchor-the-hero variant (lower-risk)

- Grow ring from 64px → 96–112px.
- Move tier badge under the ring (centered) instead of right-of-ring.
- Right side becomes a 2-line microcopy block (Track 2.4 above) + the delta.
- Stats row stays.

### 4.2 Story-told variant (higher-reward)

- Replace the static ring with a **ring + sparkline-in-ring** (sparkline along the inside of the arc shows last 14 days).
- Chart becomes the primary visual (full-width, ~140px tall, with Y-axis labels at 0/50/85/100 and threshold lines).
- Stats row collapses into the chart's footer.
- Tap chart → opens fullscreen detail view.

**Recommendation:** Ship Track 1 + 2.1 + 2.4 + 3.1 first. Reassess visual redesign after.

---

## Critical Files

| Purpose                      | Path                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| Section container            | `src/components/HabitStrengthSection/HabitStrengthSection.tsx`                                |
| Business logic               | `src/components/HabitStrengthSection/HabitStrengthSection.hooks.ts`                           |
| Ring + label (hero)          | `src/components/HabitStrengthSection/StrengthHero/StrengthHero.tsx`                           |
| Ring SVG                     | `src/components/HabitStrengthSection/StrengthHero/ProgressRing.tsx`                           |
| Label + delta badge          | `src/components/HabitStrengthSection/StrengthHero/StatusDisplay.tsx`                          |
| Animated %                   | `src/components/HabitStrengthSection/StrengthHero/AnimatedPercentage.tsx`                     |
| Chart                        | `src/components/HabitStrengthSection/StrengthChart/StrengthChart.tsx`                         |
| Stats row                    | `src/components/HabitStrengthSection/StrengthStatsRow.tsx`                                    |
| Time range toggle            | `src/components/HabitStrengthSection/TimeRangeToggle.tsx`                                     |
| Constants (colors, sizes)    | `src/components/HabitStrengthSection/constants.ts`                                            |
| Strength hook (calc fallback)| `src/hooks/useHabitStrength.ts`                                                               |
| Algorithm modes              | `convex/habitStrength/algorithmConfig.ts`                                                     |
| Day-by-day simulation        | `convex/habitStrength/momentum.ts`                                                            |
| Detail screen integration    | `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx:72-87`                       |
| Design intent (memory)       | `~/.claude/projects/-Users-andres-Code-habit-tracking-app/memory/project_habit_strength_intent.md` |

## Verification

For each change:

1. **Build:** `npm run lint` and `npx tsc --noEmit` pass.
2. **Visual:** Re-screenshot via `xcrun simctl io booted screenshot` and diff against `.context/screenshots/01-current.png`. Test at least: Weak (<33%), Developing (33–66%), Strong (>66%), and brand-new habit (empty state). Test with and without a custom habit color.
3. **A11y:** With VoiceOver on, ring should announce the correct tier; stats row should announce the three metrics in order.
4. **Time-range scope (Track 1.2):** Confirm that whichever option (a or b) is taken, what changes when toggling 1M/3M/1Y matches the visual affordance.
5. **Mode chip (Track 3.1):** Open habits seeded with each algorithm mode; chip text matches.

---

## Recommended Sequencing

1. **Pass A — Bugs (Track 1).** Small, mostly mechanical. ~half-day. Ships a much more honest, accessible section.
2. **Pass B — Algorithm surfacing + headline microcopy (3.1 + 2.4).** ~half-day. Adds personality and credibility cheaply.
3. **Pass C — Chart milestones + threshold line (2.1 + 3.2).** ~1 day. Visual upgrade with no architectural change.
4. **Pass D — Empty state + tap-to-explain (2.2 + 2.3).** ~1 day. Highest engagement payoff.
5. **Pass E — Visual redesign decision (Track 4).** Only after A–D; reassess against fresh screenshots.
