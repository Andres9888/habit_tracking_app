# Rename Strength-Curve Tiers: Simple / Average / Complex

## Context

The three strength-curve / algorithm cards currently use marketing-leaning names — **Quick Win**, **Textbook**, **Long Haul** — paired with a separate `complexity` label (`Simple` / `Everyday` / `Complex`) that gets rendered next to the name (e.g. "Textbook · Everyday habits"). The dual label is awkward, "Textbook" doesn't read clearly, and the latest design mock (`.superdesign/design_iterations/strength_curve_picker_13_tier_explainers.html`) moves to plain tier labels.

Per user direction:

- Rename the three tiers to **Simple / Average / Complex**.
- Card title should render as just `{name}` ("Simple", "Average", "Complex") — drop both the `· {complexity}` duplication **and** the redundant trailing `habits` word (every card on the screen is a habit setting, so the suffix adds no information).
- Keep the existing descriptions, examples, `daysToForm`, and icons as-is.

The internal mode keys (`forgiving` / `balanced` / `strict`) stay unchanged — they're the storage-level discriminator. Only the user-facing copy and the now-redundant `complexity` field move.

## Files to change

### 1. `src/components/AlgorithmPicker/algorithmCopy.ts` (primary)

- Rename `name` values:
  - `forgiving.name`: `'Quick Win'` → `'Simple'`
  - `balanced.name`: `'Textbook'` → `'Average'`
  - `strict.name`: `'Long Haul'` → `'Complex'`
- Remove the `complexity` field from `AlgorithmCopyEntry` and from each entry — it now duplicates `name` and isn't carrying its own information.
- Remove the `HabitComplexity` type export.
- Keep `description`, `examples`, `daysToForm`, `Icon`, `ALGORITHM_ORDER`, `DEFAULT_ALGORITHM`, `isAlgorithmMode` unchanged.

### 2. `src/components/AlgorithmPicker/AlgorithmCard.tsx`

- Line 37 — `accessibilityLabel`: change `` `${entry.name}, ${entry.complexity} habits` `` → `` `${entry.name}` ``.
- Line 61 — change `{entry.name} · {entry.complexity} habits` → `{entry.name}`.
- No other behavior changes.

### 3. `src/components/AlgorithmPicker/AdvancedAlgorithmDisclosure.tsx`

- Line 40 — `subtitle` becomes `` `Using ${ALGORITHM_COPY[activeMode].name}` `` (drop the redundant ` (${complexity})` half).

### 4. `src/screens/HabitEditScreen/HabitAlgorithmPicker.tsx`

- Lines 15-17 — update the `OPTIONS` `label` strings to match the new names: `'Simple'`, `'Average'`, `'Complex'`. (Labels are currently used only for the accessibility tree via the `key`-based `accessibilityLabel`, but the strings should still be in sync.)

### 5. `src/utils/algorithmFromDuration.ts` (light rename, cosmetic)

- Rename internal constants `QUICK_WIN_MAX_MINUTES` → `SIMPLE_MAX_MINUTES` and `TEXTBOOK_MAX_MINUTES` → `AVERAGE_MAX_MINUTES`. Behavior unchanged.

### 6. `src/utils/__tests__/algorithmFromDuration.test.ts`

- Update the three `it(...)` descriptions to use the new tier names:
  - `'maps very short habits to forgiving (Quick Win)'` → `'... (Simple)'`
  - `'maps everyday durations to balanced (Textbook)'` → `'... (Average)'`
  - `'maps long commitments to strict (Long Haul)'` → `'... (Complex)'`
- Expected mode values stay the same (`'forgiving'` / `'balanced'` / `'strict'`).

## Out of scope (per user)

- No changes to `description` or `examples` text on any of the three entries.
- No changes to `daysToForm`, icons, colors, or layout.
- No changes to the internal mode discriminator (`forgiving` / `balanced` / `strict`) — DB schema, persisted habits, and selection logic are untouched.

## Verification

1. **Type check**: `npm run typecheck` (or `tsc --noEmit`) — should pass cleanly after removing `HabitComplexity` and `complexity` references.
2. **Lint**: `npm run lint` — no new violations; `algorithmCopy.ts` stays well under 100 lines.
3. **Unit tests**: `npm test -- algorithmFromDuration` — three tests still pass with renamed descriptions.
4. **Manual UI check** (per CLAUDE.md "Reproduce before fixing" rule, applied as "Verify after changing"):
   - Open Habit Edit screen → Advanced disclosure. Confirm the three cards now read:
     - "Simple"
     - "Average" + DEFAULT pill (since `DEFAULT_ALGORITHM = 'balanced'`)
     - "Complex"
   - Collapsed disclosure subtitle reads `Using {Simple|Average|Complex}` based on selection.
   - The segmented `HabitAlgorithmPicker` (icons-only row) still selects correctly — labels are non-visible but accessible.
5. **Grep sweep**: confirm no stray `Quick Win` / `Textbook` / `Long Haul` / `HabitComplexity` / `\.complexity` references remain inside `src/` after the edits.
