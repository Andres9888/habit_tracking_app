# Plan: Unify icon-tile colors in "MORE TO CUSTOMIZE" rows

## Context

On the Create / Edit Habit screen, the expanded **MORE TO CUSTOMIZE** section renders three rows — Strength Curve, Growth Icons, Streak Goal — each with a 36×36 rounded-xl squircle holding an icon. Today the three squircles use two different color families:

- Strength Curve → mint (primary.100 / primary.700) via `MODE_STYLES[algorithm]`
- Growth Icons → mint (primary.100 / primary.700)
- Streak Goal → gold (status.streakLight / status.streakText)

The mismatch reads as "Streak Goal is a different *kind* of thing" when really all three are peer customization entry points. The pills above each row already carry the per-feature accent color (green "Simple", beige "Ranks", beige "No goal set"), so the squircle's job is just to anchor the row, not to encode state. Duplicating accent color on both the pill and the squircle creates visual noise and breaks scannability.

**Outcome:** all three squircles share one neutral-but-on-brand treatment; pills remain the place where per-feature color lives.

## Approach

1. Build a static HTML mock at `.superdesign/design_iterations/customize_rows_1.html` that renders the current state side-by-side with 3 candidate unifications:
   - **A** — all three on primary mint (#D1FAE5 bg / #047857 icon)
   - **B** — all three on neutral surface (light gray, icon in primary green)
   - **C** — all three transparent with a 1px primary-tinted border, icon in primary green
2. Open the mock in the browser via Interceptor and let user pick.
3. Apply the winner to the React Native code:
   - `src/components/AdvancedOptions/AdvancedOptionsSection.tsx:234-274` — stop passing per-row tile colors for Growth Icons and Streak Goal; route all three through one shared token
   - `src/components/AdvancedOptions/AdvancedOptionRow.tsx:54-59` — accept a single default if no override is supplied
   - Leave `MODE_STYLES` and `status.streakLight/streakText` alone — they're used elsewhere (mode picker, streak chip)

## Critical files

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`
- `src/components/AdvancedOptions/AdvancedOptionRow.tsx`
- `src/theme/darkColors.ts` (only if a new shared token is needed)

## Verification

- Open Create Habit screen on iOS simulator, expand MORE TO CUSTOMIZE, confirm all three squircles match
- Toggle dark mode, confirm tokens resolve correctly in both themes
- Confirm pills above each row still show their accent color (no regression there)
- Confirm Streak chip elsewhere in app still uses gold (no token cross-contamination)
