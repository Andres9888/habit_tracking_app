# Align Strength Curve row icon with details-page icon

## Context

The "Strength Curve" row in `AdvancedOptionsSection` shows a per-mode icon that doesn't match the icon shown for the same mode on the Strength Curve picker (details page). When a user taps the row, the icon visually "changes," which breaks recognition continuity between the entry point and the details page.

**Current mismatch:**

| Mode | List row (`ALGO_ICONS`) | Details page (`MODE_STYLES`) |
|------|-------------------------|------------------------------|
| `forgiving` | `Heart` | `Zap` |
| `balanced` | `Activity` | `Activity` ✓ |
| `strict` | `Zap` | `Mountain` |

Two of three modes are mismatched. The details page is the canonical visual treatment (it's where the user spends time picking and reading about each mode), so the row should adopt the details-page icons.

## Approach

Make `strengthCurveModeStyles.MODE_STYLES` the single source of truth for the per-mode Lucide icon, and have `AdvancedOptionsSection.tsx` read from it instead of maintaining its own `ALGO_ICONS` map.

This both fixes the current divergence and prevents future drift — anyone updating the icon for a mode will only have one place to update.

## Files to modify

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`

## Changes

1. Remove the local `ALGO_ICONS` map (lines 50–54).
2. Remove `Heart` from the lucide import (line 17). Keep `Activity` and `Zap` only if still used elsewhere in the file — quick grep shows they aren't used outside `ALGO_ICONS`, so they can be removed too. `ChevronDown`, `Sprout`, `Target` stay.
3. Import the canonical map:
   ```ts
   import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
   ```
   (The file already imports `StrengthCurvePickerModal` from `@/screens/StrengthCurvePicker` at line 43, so the screens→components boundary is already established for this feature.)
4. Replace line 100:
   ```ts
   const AlgoIcon = ALGO_ICONS[strengthAlgorithm];
   ```
   with:
   ```ts
   const AlgoIcon = MODE_STYLES[strengthAlgorithm].Icon;
   ```

The two usages of `<AlgoIcon ... />` (line 158 in the `PreviewChip` and line 251 in the `AdvancedOptionRow`) need no further change — they consume the resolved icon component.

## Reuse note

`MODE_STYLES` already exports the per-mode `Icon: LucideIcon` field (see `strengthCurveModeStyles.ts:14, 25, 34, 43`). No new types or helpers needed.

## Out of scope

- `src/screens/HabitEditScreen/HabitAlgorithmPicker.tsx:15` also uses `Heart` for `forgiving`. That's a separate picker surface and the user's request was specifically about the strength-curve row aligning with the strength-curve details page. Leaving it untouched unless the user confirms they want it included.

## Verification

1. Read the modified file and confirm `ALGO_ICONS` is gone and `MODE_STYLES[strengthAlgorithm].Icon` is in use.
2. Start the dev server (`bun run start` or the project's standard command) and open a habit's Advanced Options.
3. For each mode (`forgiving`, `balanced`, `strict`):
   - Confirm the icon in the collapsed `PreviewChip` matches the icon shown on the Strength Curve picker for that mode.
   - Confirm the icon in the expanded "Strength Curve" row matches as well.
   - Open the picker and verify the icon does not appear to change between the row and the picker tile.
4. Run `bun run lint` (or project equivalent) to confirm no unused-import warnings remain after removing `Heart`/`Activity`/`Zap`.
