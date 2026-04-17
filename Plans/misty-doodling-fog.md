# Plan: Configurable Habit Strength Algorithm Modes

## Context

The app currently has 3 divergent strength algorithms (Momentum v2.0, Snapshot, Frontend exponential smoothing) that can produce different numbers for the same habit history. The user wants to let users choose between **Forgiving**, **Balanced**, and **Strict** modes — with a global default in Settings and per-habit override in Habit Edit.

**Design intent**: Balance real science with fun/engagement. Forgiving mode for beginners, Strict for accountability seekers.

---

## Algorithm Design

All 3 modes use the existing Momentum v2.0 formula structure (`calculateNewStrength`) with different parameters:

| Parameter | Forgiving | Balanced (current) | Strict |
|-----------|-----------|----------|--------|
| `GROWTH_RATE` | 0.04 (4%) | 0.03 (3%) | 0.05 (5%) |
| `BASE_DECAY` | 0.01 (1%) | 0.02 (2%) | 0.04 (4%) |
| `SHIELD_EFFECTIVENESS` | 0.85 (85%) | 0.70 (70%) | 0.35 (35%) |

**Behavioral characteristics:**
- **Forgiving** — Misses barely hurt, strong streak protection, gentle growth. ~95 perfect days to reach Automatic. Best for building new habits.
- **Balanced** — Current behavior. ~66 perfect days to reach Automatic (87%). Meaningful streak protection.
- **Strict** — Fast growth, steep decay, minimal protection. Strength reflects recent behavior accurately. Best for accountability.

---

## Implementation Steps

### Step 1: Algorithm Config Module
**File:** `convex/habitStrength/algorithmConfig.ts` (new)

Define the 3 mode configs and a resolver function:

```ts
export type StrengthAlgorithmMode = 'forgiving' | 'balanced' | 'strict';

export const ALGORITHM_CONFIGS: Record<StrengthAlgorithmMode, AlgorithmParams> = {
  forgiving: { growthRate: 0.04, baseDecay: 0.01, shieldEffectiveness: 0.85 },
  balanced:  { growthRate: 0.03, baseDecay: 0.02, shieldEffectiveness: 0.70 },
  strict:    { growthRate: 0.05, baseDecay: 0.04, shieldEffectiveness: 0.35 },
};

export function getAlgorithmConfig(mode: StrengthAlgorithmMode): AlgorithmParams
```

### Step 2: Schema Changes
**Files:** `convex/schema.ts`

- Add to `habits` table: `strengthAlgorithm: v.optional(v.union(v.literal('forgiving'), v.literal('balanced'), v.literal('strict')))`
- Add to `userSettings` table: same validator

### Step 3: Settings Backend
**Files:** `convex/settings/types.ts`, `convex/settings/validators.ts`, `convex/settings/settings.ts`

- Add `STRENGTH_ALGORITHM_OPTIONS` constant and type
- Add to `DEFAULT_SETTINGS`: `strengthAlgorithm: 'balanced'`
- Add to return and update validators
- Add to query defaults fallback

### Step 4: Core Formula Update
**File:** `convex/habitStrength/momentum.ts`

- Modify `calculateNewStrength` to accept optional `AlgorithmParams` (defaults to balanced for backward compat)
- Modify `calculateMomentumStrengthSnapshot` to accept optional `mode` parameter
- Import config from `algorithmConfig.ts` instead of hardcoded constants

### Step 5: Wire Through All Callers
**Files that call `calculateMomentumStrengthSnapshot`:**
- `convex/habits/toggle.ts` — Resolve mode: `habit.strengthAlgorithm ?? userSettings.strengthAlgorithm ?? 'balanced'`
- `convex/tracking/strengthUpdater.ts` — Same resolution
- `convex/habits/pause.ts` — Same resolution
- `convex/habitStrength/recalculate.ts` — Same resolution

Each caller needs to:
1. Look up the habit's `strengthAlgorithm` field
2. If null, look up the user's global `strengthAlgorithm` setting
3. Pass the resolved mode to `calculateMomentumStrengthSnapshot`

### Step 6: Settings UI — Algorithm Picker
**File:** `src/components/SettingsModal/StrengthAlgorithmPicker.tsx` (new)

Follow the `DayShapePicker.tsx` pattern (3-option segmented control):
- 3 buttons: Forgiving (Feather icon), Balanced (Scale icon), Strict (Flame icon)
- Haptics feedback on selection
- Same selected/unselected color scheme as existing pickers

**File:** `src/components/SettingsModal/SettingsContent.tsx`

Add new "Habit Strength" section (or add to existing Behavior section) with the picker.

### Step 7: Habit Edit UI — Per-Habit Override
**File:** `src/screens/HabitEditScreen/HabitEditScreen.tsx`

Add algorithm picker below reminders section:
- Same 3-option picker component but with a 4th "Default" option that inherits from global settings
- Show which mode is inherited when "Default" is selected

### Step 8: Habit Creation Flow
**File:** `src/components/CreateHabitModal/` (hooks + form)

- Add `strengthAlgorithm` to form state (defaults to undefined = use global)
- Don't add it to the creation form UI — keep creation simple. Users can change it in edit.

### Step 9: Frontend Chart Alignment
**File:** `src/components/HabitStrengthHistory/strengthUtils/calculation.ts`

Update `calculateStrengthAtDate` to accept algorithm mode and use matching parameters:
- Map mode to appropriate growth/decay rates for the exponential smoothing formula
- This keeps the chart visually consistent with the backend calculation

---

## Critical Files

| File | Action |
|------|--------|
| `convex/habitStrength/algorithmConfig.ts` | **Create** — Mode configs |
| `convex/habitStrength/momentum.ts` | **Modify** — Accept params |
| `convex/habitStrength/constants.ts` | **No change** — Keep as fallback defaults |
| `convex/schema.ts` | **Modify** — Add fields to both tables |
| `convex/settings/types.ts` | **Modify** — Add type + default |
| `convex/settings/validators.ts` | **Modify** — Add validators |
| `convex/settings/settings.ts` | **Modify** — Add to query/mutation |
| `convex/habits/toggle.ts` | **Modify** — Resolve + pass mode |
| `convex/tracking/strengthUpdater.ts` | **Modify** — Resolve + pass mode |
| `convex/habits/pause.ts` | **Modify** — Resolve + pass mode |
| `convex/habitStrength/recalculate.ts` | **Modify** — Resolve + pass mode |
| `src/components/SettingsModal/StrengthAlgorithmPicker.tsx` | **Create** — 3-option picker |
| `src/components/SettingsModal/SettingsContent.tsx` | **Modify** — Add section |
| `src/screens/HabitEditScreen/HabitEditScreen.tsx` | **Modify** — Add picker |
| `src/components/HabitStrengthHistory/strengthUtils/calculation.ts` | **Modify** — Accept mode |

---

## Reusable Patterns

- **Picker UI**: Clone `DayShapePicker.tsx` pattern (segmented control with icons, haptics, selected/unselected states)
- **Schema validator**: Same `v.optional(v.union(v.literal(...)))` pattern used for `dayShape`, `habitCompletionIcon`
- **Settings flow**: Same query/mutation/default pattern in `convex/settings/`
- **Mode resolution**: Create shared `resolveStrengthAlgorithm(habit, userSettings)` utility

---

## Verification

1. **Unit tests**: Update `convex/habitStrength.test.ts` — test each mode produces expected strength after N completions/misses
2. **Mode resolution**: Test fallback chain (habit override > global setting > 'balanced' default)
3. **Settings persistence**: Change global mode in Settings, verify it persists across app restart
4. **Per-habit override**: Set different mode on one habit, verify it uses that mode while others use global
5. **Visual check**: Open strength history chart, verify curve shape changes with mode
6. **Backward compat**: Existing habits with no mode set should behave exactly as they do today (balanced)
