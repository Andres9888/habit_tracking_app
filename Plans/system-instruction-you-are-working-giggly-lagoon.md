# Plan: Calendar Timeline adopts a restrained version of Chain Visualizer's material tier system

## Context

The branch `habit-growth-curve-tiers` introduced a material tier system in `HabitChainVisualizer` — habit strength (0–100%) progresses through 5 named tiers: **copper → chain → iron → gold → legendary** (thresholds 20/40/60/80). Each tier controls connector height, opacity, shimmer, glow, cell shadow, and cell tinting.

The `CalendarTimeline` (the sticky header showing 7 day-rings + connectors across all habits) independently evolved its own connector escalation curve in `connectorStrength.ts` — 6 unnamed streak-based buckets (3/5/7/14/30) that only vary connector height, opacity, shimmer, and glow.

**Problem:** The two visuals live on the same screen but speak different visual languages. Chain has a rich "material" vocabulary (copper/gold/legendary); timeline has anonymous breakpoints. Users get no reinforcement between "my Meditation habit is gold-tier" and "my streak is gold-tier."

**Goal:** Give the calendar timeline the same tier *vocabulary* as the chain — but expressed in a *restrained* way (connector-only), so the sticky header stays quiet and legible while still echoing the progression language.

## Recommended Approach

**Share tier names + thresholds, restrict expression to connectors only.**

1. Timeline's connector still driven by **streak length** (unchanged signal — timeline is streak-centric).
2. Streak → tier mapping replaces the current 6-bucket `getTimelineConnectorStrength` with a call into a shared tier system:
   - `0–2 days` → copper
   - `3–6 days` → chain
   - `7–13 days` → iron
   - `14–29 days` → gold
   - `30+ days` → legendary
3. Timeline connector reads `connectorHeight`, `connectorOpacity`, `shimmerSpeed`, `glow` from the tier — same properties it already reads, just sourced from the shared tier definition instead of the ad-hoc bucket list.
4. **Day rings stay emerald.** No copper tint, no gold tint, no legendary platinum on the aggregate 7-day ring strip. The header's job is at-a-glance progress, not celebration.
5. Connectors can optionally also stay emerald (keeping timeline's signature color) OR adopt the tier's `tierColor` when `useAccent === false` (copper, gold, legendary). **Recommendation: keep connectors emerald** — the tier drives *geometry and animation* (thickness/opacity/shimmer/glow), not color. This is the "less strict" interpretation: restraint over maximum unity.

### Why this is "less strict"

| Dimension | Chain Visualizer (strict) | Calendar Timeline (less strict) |
|---|---|---|
| Cell color | Tier-tinted (copper/gold/legendary) | Emerald always |
| Connector color | Tier or habit accent | Emerald always |
| Connector thickness | From tier | From tier ✅ shared |
| Shimmer speed | From tier | From tier ✅ shared |
| Glow | From tier | From tier ✅ shared |
| Signal | Habit strength % | Streak days |
| Tier names | copper → legendary | copper → legendary ✅ shared |

The shared axis is the *escalation curve* (geometry + animation + vocabulary). The diverging axis is color (timeline stays monochrome emerald).

## Files to Modify

### New file
- `src/components/CalendarTimeline/timelineTier.ts` — exports `getTimelineTier(streak: number): MaterialTier` that maps streak days to the appropriate `MaterialTier` from `HabitChainVisualizer/materialTier.ts`.

### Modified files
- `src/components/CalendarTimeline/connectorStrength.ts` — becomes a thin adapter: `getTimelineConnectorStrength(streak)` returns `{ height, opacity, shimmerSpeed, glow }` derived from `getTimelineTier(streak)`. Keeps current call sites working unchanged. Or: delete this file entirely and update call sites to use `getTimelineTier` directly — preferred for clarity.
- `src/components/CalendarTimeline/components/ConnectorArm.tsx` / `ConnectorArms.tsx` — if we delete the adapter, update imports to `getTimelineTier`. Otherwise no change.
- `src/components/CalendarTimeline/tests/streakThreading.test.ts` — update expected thresholds if tests assert on the 6-bucket curve. The new 5-tier curve has slightly different breakpoints (e.g., the 5-day bucket is folded into `chain`; 14-day into `gold`).

### Not modified (intentional)
- `DayCellRing.tsx`, `DayCellRing.styles.ts`, `DayCellContent.tsx` — day rings remain emerald. No tier-based color changes to cells.
- `HabitChainVisualizer/materialTier.ts` — source of truth, not edited. Timeline consumes it.

## Reuse

- `MaterialTier` interface and the 5 tier constants from `src/components/HabitChainVisualizer/materialTier.ts` are reused directly. Timeline gets a parallel `getTimelineTier(streak)` selector function; the tier objects themselves are shared.
- Existing `useConnectorShimmer` hook (`src/components/CalendarTimeline/hooks/useConnectorShimmer.ts`) continues to consume `shimmerSpeed` unchanged.

## Threshold Choice Rationale

The new mapping compresses 6 buckets into 5 tiers. Concrete choices:

- **0–2d copper:** "Starting out" — first 2 days, no shimmer, thin connector.
- **3–6d chain:** A 3-day streak is the classic "building" signal (matches `chain` tier's "Building" semantic).
- **7–13d iron:** One full week — connector is thicker + more opaque, matching iron's "Growing."
- **14–29d gold:** Two weeks in — gold tier's shimmer kicks in (2000ms). Shareable moment.
- **30+d legendary:** One month — fastest shimmer (1000ms) + glow, matches legendary's "Unbreakable."

These boundaries are slightly shifted from the current curve (was: 3/5/7/14/30 → now: 3/7/14/30) because the 5-day intermediate bucket is absorbed. This is intentional — the chain visualizer already uses 5 tiers, and copying that cadence is the point.

## Verification

1. **Lint + types:** `npm run lint` and `npx tsc --noEmit` pass.
2. **Tests:** `npm test -- streakThreading` passes after threshold updates.
3. **Visual:** Start dev server, open the habits list screen, and confirm:
   - Calendar timeline connectors still visible, still emerald.
   - At various streak lengths (0, 3, 7, 14, 30+), connector thickness/shimmer/glow match the corresponding chain tier's geometry — side-by-side, the two visuals feel like family.
   - Day rings in the header still show emerald progress arcs (no copper/gold tint on the ring strip).
   - Chain visualizer in individual habit cards unchanged.
4. **Regression check:** Screenshot the header at streak=0, 5, 10, 20, 35 and compare against `main` to confirm the change is only in connector geometry breakpoints (expected diff) and not in day-ring colors (no diff expected).

## Out of Scope

- Changing the timeline's day-ring colors to copper/gold (rejected — too noisy for aggregate view).
- Changing the timeline's input signal from streak to aggregate strength (rejected — requires new data plumbing, muddies the streak mental model).
- Adding tier names or tooltips to the timeline header UI ("You're in Iron tier!"). This plan is structural/visual only; copy is a separate decision.
- Touching the `HabitChainVisualizer` itself.
