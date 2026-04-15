# Fix: "Import Habit" button text clipped on iPhone 16 Pro Max

## Context

On iPhone 16 Pro Max, the "Import Habit" button on template cards shows as "Import Hab..." — the text is clipped by `overflow: 'hidden'` on the Button component. This also affects "Unlock with Pro" (even longer text).

## Root Cause

The button row splits width equally (`flex: 1` on each button). Each `size='medium'` button has `paddingHorizontal: 24px` (48px total). Combined with `overflow: 'hidden'` on the button container and no text fitting behavior, the text clips silently when it exceeds the available width.

Chain: `ActionButtons.styles.ts:14` (`flex: 1`) + `Button/styles.ts:7` (`overflow: 'hidden'`) + `useButtonConfig.ts:57` (`paddingHorizontal: spacing.lg = 24`) + `ButtonContent.tsx:75` (no `adjustsFontSizeToFit`)

## Fix

**Single file change:** `src/components/Button/ButtonContent.tsx` (lines 75-84)

Add three props to the `<Text>` element:

```tsx
<Text
  adjustsFontSizeToFit          // scales text down to fit
  maxFontSizeMultiplier={2}
  minimumFontScale={0.8}        // floor at 80% of original size (iOS only)
  numberOfLines={1}             // prevent wrapping
  style={[...]}
>
```

This is a safe default for all buttons — button text should never wrap or clip.

## Why not other approaches

- Removing `flex: 1` from cardButton — breaks equal-width button layout
- Reducing `paddingHorizontal` — changes visual design system spacing
- Fixing only in ActionButtons — doesn't prevent the same issue elsewhere

## Verification

1. Run on iPhone 16 Pro Max simulator
2. Navigate to Templates > any category > verify "Import Habit" is fully visible
3. Check "Unlock with Pro" also fits (longer text, locked templates)
4. Spot-check other buttons throughout the app for visual regression
