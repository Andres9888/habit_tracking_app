# Fix Habit Card Emoji Alignment When Names Wrap

## Context

Commit `58b53243d` changed `numberOfLines={1}` to `numberOfLines={2}` in `HabitCardContent.tsx` to support long habit names. This lets names wrap to a second line, but broke the emoji icon alignment — the emoji drops to the vertical center of the 2-line text block instead of staying top-aligned.

## The Fix

Two `alignItems` changes in one file: `src/components/HabitCard/HabitCard.styles.ts`

### Change 1 — `habitInfo` (line 54)

`alignItems: 'center'` → `alignItems: 'flex-start'`

Keeps the emoji icon pinned to the top when text wraps. For 1-line names, visually identical since emoji (26px) and text (22px lineHeight) are nearly the same height.

### Change 2 — `topRow` (line 85)

`alignItems: 'center'` → `alignItems: 'flex-start'`

Keeps the checkbox/status container top-aligned too, matching the emoji position when text wraps.

## Files Modified

- `src/components/HabitCard/HabitCard.styles.ts` — only file changed

## Verification

1. Run `npx expo start` and test with:
   - Short habit name (1 line) — emoji and checkbox should look unchanged
   - Long habit name (2 lines) — emoji and checkbox should align with the first line of text
2. `npm run lint` — no lint issues expected
