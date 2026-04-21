# Fix: Week-Boundary Connector Line Appears Thinner

## Context

On the Habits home screen, the horizontal connector line that crosses the week boundary (SUN→MON in the current 5-day window of Fri Apr 17 → Tue Apr 21, 2026) visually renders **thinner** than the other connector lines. The issue appears in two places:

1. The top **CalendarTimeline** strip (FRI · SAT · SUN · MON · Today)
2. **Inside each habit card** (e.g. "K" and "Huhy") rendered by `HabitChainVisualizer`

User constraint: fix must reuse whatever week convention the app already has — do **not** introduce a new `isPreviousWeek`/`startOfWeek` helper.

## Investigation Summary

Code review did **not** surface any explicit week-boundary logic. Both views pass a single `currentStreak` to every connector and compute thickness from that scalar:

- **Top strip** — `src/components/CalendarTimeline/components/DayStrip.tsx:96` passes `currentStreak` to every `DayCell` → `ConnectorArms` uses `getTimelineConnectorStrength(currentStreak)` (`connectorStrength.ts:18`) → heights 3–5px.
- **Habit card** — `src/components/HabitChainVisualizer/ChainDayList.tsx:67` passes `currentStreak` to every `ChainDayItem` → `DayConnector` uses `getStrengthConfig(currentStreak)` (`strengthConfig.ts:14`) → heights 1.5–3px.
- **Card edge connectors** — `src/components/HabitChainVisualizer/ChainConnector.tsx:48` (cross-card link) also uses the same `currentStreak`.

Because the scalar is shared, the thickness-from-streak hypothesis doesn't explain a single line being thinner than its neighbors. The difference must come from a rendering-level detail I haven't located yet — most likely one of:

1. **Ghost arm overlapping a real arm.** `DayStrip.tsx:84-86` computes `ghostLeft`/`ghostRight` at today's cell only, but there's a case where `isComplete ? prevComplete : null` produces `false` while the neighbor renders a full arm — leaving a shorter visible segment. Happens precisely at a transition where `isComplete` flips.
2. **Half-arm only from one side.** Each connector between two cells is drawn as two halves (`ConnectorArm` left + right, `src/components/CalendarTimeline/components/ConnectorArm.tsx:34-37`). If the `connectLeft`/`connectRight` predicates disagree due to a subtle asymmetry, only one half renders — visually producing a "thinner" (actually shorter) line at that one gap.
3. **Ghost-vs-real styling mismatch.** Ghost arms in `ConnectorArm.tsx:39-45` skip the `opacity: strength.opacity` style entirely — so a ghost half next to a real half gives one full-opacity + one dim half, reading as "thinner".

Hypothesis #2 or #3 is the most likely culprit, and it would manifest identically in the habit card because `HabitChainVisualizer/ChainDayList.tsx:74-78` uses the same "only render when both neighbors complete" predicate from one side only (the left cell), so half-arm logic isn't a concern in the card — which leaves a different mechanism to confirm there.

## Plan

### Step 1 — Reproduce and measure (read-only)

Before changing anything, confirm the defect and pinpoint the source.

1. Start the dev server / simulator and open the Habits home screen (date = today).
2. Screenshot the top strip AND a habit card at pixel density ≥ 2x.
3. In DevTools / React Native Element Inspector, read the rendered `height` (strength-driven) and `opacity` on each connector arm/bar around the SUN↔MON gap. Confirm whether:
   - Both halves render (one ghost, one real?) — points to hypothesis #3.
   - Only one half renders — points to hypothesis #2.
   - Height value itself differs — points at a per-cell `currentStreak` override we haven't seen.

### Step 2 — Surgical fix (depending on Step 1 result)

**If hypothesis #3 (ghost/real mismatch):** In `src/components/CalendarTimeline/components/ConnectorArm.tsx:39-45`, have the ghost branch also apply `{ opacity: strength.opacity }` (or harmonise via a shared style) so a ghost half reads at the same visual weight as a real half. No new week logic; it reuses the existing `strength` object.

**If hypothesis #2 (half-arm):** In `src/components/CalendarTimeline/components/DayStrip.tsx:84-95`, audit the `connectLeft`/`connectRight` predicates so neighbouring cells agree — specifically, ensure `day[i].connectRight` and `day[i+1].connectLeft` are symmetrical for identical data. Fix by deriving both from a shared `shouldConnect(i, i+1)` boolean.

**If hypothesis #1 or an unknown per-day thickness:** Trace the `currentStreak` / `strength.height` value being passed per cell in the inspector. Fix at the source so the value is identical for adjacent completed cells.

For the card mirror in `HabitChainVisualizer`:
- If the same ghost-opacity pattern exists in `src/components/HabitChainVisualizer/DayConnector.tsx:39-43` / `ChainConnector.tsx`, apply the same one-line parity.
- Otherwise, the card may simply render one half and the bug will turn out to live only on the strip; the visual illusion in the card could be tint-on-white rather than a true thickness difference — confirm during Step 1.

### Step 3 — Verify end-to-end

1. Rebuild and open the home screen.
2. Visual check: every connector in both the top strip and each habit card is a single continuous line of identical thickness and opacity, regardless of which pair of days it connects (no SUN↔MON discontinuity).
3. Edge cases to verify in the simulator:
   - Today is Mon (so week boundary is the very first gap of the strip).
   - Today is Sun (boundary is the very last gap).
   - A habit with streak = 0 (floor thickness) and one with streak ≥ 30 (max thickness) — the uniformity property must hold at both extremes.
   - A habit where SUN is not complete — the connector should still be absent (expected), not "thinner".
4. Run `npm run lint:max-lines` to make sure touched files stay within the 100-line budget (all candidate files are under it today).

## Critical Files

- `src/components/CalendarTimeline/components/ConnectorArm.tsx` — likely fix target (ghost vs real opacity parity)
- `src/components/CalendarTimeline/components/ConnectorArms.tsx` — shared `armBase` builder
- `src/components/CalendarTimeline/components/DayStrip.tsx` — `connectLeft`/`connectRight`/`ghostLeft`/`ghostRight` predicates
- `src/components/CalendarTimeline/connectorStrength.ts` — `getTimelineConnectorStrength` (do not modify unless Step 1 proves thickness value itself varies)
- `src/components/HabitChainVisualizer/DayConnector.tsx` — card equivalent of `ConnectorArm`
- `src/components/HabitChainVisualizer/ChainConnector.tsx` — card edge connector
- `src/components/HabitChainVisualizer/strengthConfig.ts` — `getStrengthConfig` (reference only, same caveat)

## Non-Goals

- No refactor of the strength-config tiers or their absolute values.
- No new "is previous week" predicate or date-math helper — reuse the existing flow.
- No visual redesign of the chain; purely restoring continuity at the week boundary.
