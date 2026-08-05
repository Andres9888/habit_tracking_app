# Sync HabitAlgorithmPicker icons with canonical MODE_STYLES

## Context

The Add page (`HabitAlgorithmPicker`) uses `Heart` / `Activity` / `Zap` to represent the forgiving / balanced / strict strength curve modes. The Strength Curve details modal and the Edit page already use the canonical icons from `strengthCurveModeStyles.ts`: `Sprout` / `TrendingUp` / `Mountain`. This produces a visual inconsistency where the same algorithm mode is represented by different icons across the three surfaces.

User has confirmed the canonical set is `Sprout` (forgiving), `TrendingUp` (balanced), `Mountain` (strict), so we sync the Add page to that set.

## Change

**File:** `src/screens/HabitEditScreen/HabitAlgorithmPicker.tsx`

Replace the `Heart` / `Activity` / `Zap` import and `OPTIONS` icon references with the canonical icons from `lucide-react-native`:

- `forgiving` → `Sprout`
- `balanced` → `TrendingUp`
- `strict` → `Mountain`

Specifically:
- Line 3: change `import { Heart, Activity, Zap } from 'lucide-react-native';` → `import { Sprout, TrendingUp, Mountain } from 'lucide-react-native';`
- Line 12: update `Icon: typeof Heart;` → `Icon: typeof Sprout;`
- Lines 15-17: update the three `Icon:` fields to `Sprout`, `TrendingUp`, `Mountain` respectively

No other behavioral changes — labels (`Simple` / `Average` / `Complex`), accessibility, sizing, haptics, and color logic stay identical.

## Files NOT changing

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` — already pulls from `MODE_STYLES`
- `src/screens/StrengthCurvePicker/strengthCurveModeStyles.ts` — already canonical (Sprout / TrendingUp / Mountain)
- `src/screens/StrengthCurvePicker/StrengthCurvePickerModal.tsx` and supporting tiles — already consume `MODE_STYLES`

## Verification

1. Open the habit edit screen and view the algorithm picker — confirm Sprout / TrendingUp / Mountain icons render in the three-segment toggle.
2. Tap into the Strength Curve picker modal — confirm the same three icons appear on the tier tiles.
3. Collapse back to AdvancedOptionsSection — confirm the mode preview chip uses the same icon as the selected tier.
4. Switch each mode (forgiving / balanced / strict) and verify the icon matches across all three surfaces for that mode.
