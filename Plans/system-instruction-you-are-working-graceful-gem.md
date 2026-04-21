# Align Chain Material Tiers with the Habit Growth Curve

## Context

The chain in `HabitChainVisualizer` currently upgrades its material (copper → chain → iron → gold → legendary) at **arbitrary streak milestones** — 7 / 30 / 100 / 365 days (`src/components/HabitChainVisualizer/materialTier.ts:110-116`). Those numbers are gamification beats, not science. The rest of the app already teaches the user a real automaticity curve:

- Each habit has a `strengthAlgorithm` — `forgiving` / `balanced` / `strict` — with a Lally-grounded `daysToForm` of **18 / 66 / 120** (`src/components/AlgorithmPicker/algorithmCopy.ts:14`, `:27`, `:37`, `:46`).
- The backend produces a per-habit `strength` score (0–100) that already incorporates the per-algorithm growth/decay rates.
- That strength is bucketed into a 5-level `StrengthLevel` — `starting → building → developing → strong → automatic` at thresholds **20 / 40 / 60 / 80** (`src/components/HabitStrengthIndicator/utils.ts:11-17`). This bucketization IS the habit growth curve made discrete, and the user already sees it in `HabitStrengthIndicator`, `StrengthProgressBar`, and progress emojis.

**Problem:** the chain's "upgrade" moments don't correspond to automaticity milestones. A 100-day simple-habit chain hits Gold at the same calendar day as a 100-day complex-habit chain, even though the first crossed the automaticity plateau 80 days earlier and the second hasn't crossed it yet.

**Goal:** make the chain material the *same signal* the rest of the app uses for habit formation, so every tier-up is a scientifically meaningful moment for that specific habit.

**Non-goal:** designing the tier-transition ceremony (animation/haptic on crossing). That's a separate follow-up (see "Improvement A" in `.context/attachments/Summary of Report line issue.md`).

## Approach

Map the 5 existing `StrengthLevel` stages 1:1 onto the 5 existing material tiers:

| StrengthLevel | Strength range (0–100) | Material tier |
|---|---|---|
| `starting` | 0–19 | Copper |
| `building` | 20–39 | Chain |
| `developing` | 40–59 | Iron |
| `strong` | 60–79 | Gold |
| `automatic` | 80–100 | Legendary |

Because `strength` is already algorithm-aware (forgiving grows faster, strict decays harder), a forgiving habit reaches Gold after ~18 days of clean completion while a strict habit takes ~120 days — *automatically*, no scaling math in the tier code.

Single-miss behavior: strength decays slowly, so a 1-day miss won't drop a user's tier. The immediate "you missed" feedback is already covered by the broken-link visual (rose-50 cell, red-600 dashed border, `Unlink` icon) shipped on this branch. This matches the project intent memory ("soften punishing accuracy").

The top `CalendarTimeline` strip (`src/components/CalendarTimeline/connectorStrength.ts`) stays on its streak-based 0/3/5/7/14/30 ladder — it's a 5-day rolling momentum indicator, not a lifetime tier.

## Changes

### 1. `src/components/HabitChainVisualizer/materialTier.ts` (signature change)

- Import `StrengthLevel` from `@/components/HabitStrengthIndicator/types`.
- Replace `getMaterialTier(streak: number): MaterialTier` with `getMaterialTier(strengthLevel: StrengthLevel | undefined): MaterialTier`.
- Map: `starting→COPPER`, `building→CHAIN`, `developing→IRON`, `strong→GOLD`, `automatic→LEGENDARY`.
- Fallback when `strengthLevel` is `undefined` (pre-migration habits, guest users): return `COPPER` — safe, humble default.
- Update the tier file's top-of-file docstring to describe the new curve mapping.

### 2. `src/components/HabitChainVisualizer/types.ts` (add prop)

- Add `strengthLevel?: StrengthLevel` to `HabitChainVisualizerProps`. Keep `currentStreak` (still used for the animated streak counter in `useChainVisualizerState` — unrelated to tier).

### 3. Propagate `strengthLevel` through the visualizer internals

Change callers so `strengthLevel` (not `currentStreak`) drives material tier. Files:

- `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx` — accept `strengthLevel`, forward to `ChainDayList`.
- `src/components/HabitChainVisualizer/ChainDayList.tsx` — forward to each `ChainDayItem`.
- `src/components/HabitChainVisualizer/ChainDayItem.tsx` — pass to `HabitDayToggle` + `DayConnector` in place of (or alongside) `currentStreak` for tier lookup.
- `src/components/HabitChainVisualizer/HabitDayToggle.tsx` — call `getMaterialTier(strengthLevel)` instead of `getMaterialTier(currentStreak)`.
- `src/components/HabitChainVisualizer/DayConnector.tsx` — same.
- `src/components/HabitChainVisualizer/ChainConnector.tsx` — same (cross-card link connector).

Keep `currentStreak` on the public API — the chain-counter animation still reads it.

### 4. `src/components/DraggableHabit/CardContent.tsx:78-88` (wire data)

- Pass `strengthLevel={props.strengthLevel}` to `<HabitChainVisualizer />`. (The Habit object already has `strength?: number` and `strengthLevel?: string` per `src/components/DraggableHabit/types.ts:44-45`.)
- Narrow the type: if only a raw `strength` number is available, compute level with `getStrengthLevel(strength)` from `src/components/HabitStrengthIndicator/utils.ts`. Prefer the precomputed `strengthLevel` field when present to avoid duplicate calculation.

### 5. (If needed) Trace the prop up one more level

Verify `DraggableHabit` passes `strengthLevel` / `strength` down to `CardContent`. If `strengthLevel` lives on `props.habit` rather than `props` directly, consume it there. No schema change — `strengthAlgorithm` and `strengthLevel` are already persisted server-side (`convex/schema.ts:154-163`).

## Critical files

- `src/components/HabitChainVisualizer/materialTier.ts` — signature + mapping
- `src/components/HabitChainVisualizer/types.ts` — new prop
- `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx` → `ChainDayList.tsx` → `ChainDayItem.tsx` → `HabitDayToggle.tsx` / `DayConnector.tsx` / `ChainConnector.tsx` — thread prop
- `src/components/DraggableHabit/CardContent.tsx` — wire from habit to visualizer
- `src/components/HabitStrengthIndicator/utils.ts` — reuse `getStrengthLevel`
- `src/components/HabitStrengthIndicator/types.ts` — reuse `StrengthLevel` type
- Preserve unchanged: `src/components/CalendarTimeline/connectorStrength.ts` (by design)

## Backward compatibility

The app is pre-1.0 and tier is derived, not stored — no migration. Side effects to expect on first run post-ship:

- A user with a 200-day *strict* streak whose `strength` is ~65 moves from Gold (old, at streak ≥100) → Gold (new, at strong ≥60). No change.
- A user with a 15-day *forgiving* streak whose `strength` is ~70 (fast growth) jumps from Chain (old, streak 7–29) → Gold (new, strong). Delightful upgrade.
- A user with a 40-day *strict* streak whose `strength` is ~35 drops from Iron (old, 30–99) → Chain (new, building). This is the intended correction: they haven't crossed the 40% automaticity line yet.
- A guest/legacy habit missing `strengthLevel` falls back to Copper until the backend recomputes.

## Verification

### Unit tests (new)
Create `src/components/HabitChainVisualizer/__tests__/materialTier.test.ts`:

- `getMaterialTier('starting')` → `COPPER`
- `getMaterialTier('building')` → `CHAIN`
- `getMaterialTier('developing')` → `IRON`
- `getMaterialTier('strong')` → `GOLD`
- `getMaterialTier('automatic')` → `LEGENDARY`
- `getMaterialTier(undefined)` → `COPPER`

### Integration (manual)
Use three seeded habits, one per algorithm, at representative strengths:

| Seed | strengthAlgorithm | strength | Expected tier |
|---|---|---|---|
| H1 | forgiving | 15 | Copper |
| H2 | forgiving | 75 | Gold |
| H3 | balanced | 55 | Iron |
| H4 | balanced | 85 | Legendary |
| H5 | strict | 35 | Chain |
| H6 | strict | 90 | Legendary |

Open the Habits home screen in the iOS simulator. For each seed, confirm cell fill / icon color / connector height-opacity / shimmer match the tier spec in `materialTier.ts`. Screenshot side-by-side with the mock at `.superdesign/design_iterations/chain_evolution_ideas_1.html` for a visual parity check (this is the "validate against the mockup" discipline from the collaboration memory).

### Guardrails
- `npx tsc --noEmit` — no new errors, no `any` escape hatches on `StrengthLevel`.
- `npm run lint:max-lines` — `materialTier.ts` stays well under 100 lines (currently 117, the new version should be shorter since threshold math disappears).
- Missed-day broken-link visual still renders — verify by toggling `weekStatus[i] = 'missed'` in the storybook/simulator. Tier mapping should not affect that code path.

## Risks & mitigations

- **Users who built identity on their streak number.** The chain counter (reading `currentStreak`) is unchanged — only the material mapping shifts. Their "100-day streak" badge stays intact.
- **Strength recompute lag.** If the backend recomputes strength asynchronously after a completion, the tier may appear to lag the streak by one tick. Acceptable; the forge-flash on tap still fires immediately.
- **`strengthLevel` missing on some habits.** Fallback to Copper (safe, not embarrassing); also consider computing `getStrengthLevel(habit.strength ?? 0)` client-side as a second-line fallback.
