# Plan: Hide Templates Page Entry Points

## Context
The templates page (sparkle icon in bottom bar + "browse templates" in empty state) needs to be hidden. Rather than a full feature flag system, we'll use a simple constant so it's trivial to re-enable later.

## Approach: Feature flag constant + conditional rendering

### Step 1: Create feature flag file
**Create** `src/config/featureFlags.ts`
```ts
export const TEMPLATES_ENABLED = false;
```

### Step 2: Hide sparkle icon in bottom bar
**Modify** `src/features/habits/components/BottomActionBar/BottomActionBar.tsx`
- Import `TEMPLATES_ENABLED`
- Wrap the `rightZone` View (lines 88-105) in a conditional: only render when `TEMPLATES_ENABLED` is true
- The bar layout uses flexbox with `leftZone`, `centerZone`, `rightZone` — hiding `rightZone` will naturally rebalance (center stays centered since left/right zones are equal flex)

### Step 3: Hide "browse templates" button in empty state
**Modify** `src/features/habits/components/HabitsEmptyStateMinimal/InlineHint.tsx`
- Import `TEMPLATES_ENABLED`
- Conditionally render the `<TemplatesButton>` block (lines 35-41) only when `TEMPLATES_ENABLED` is true

## Files to modify
1. `src/config/featureFlags.ts` (new — 1 line)
2. `src/features/habits/components/BottomActionBar/BottomActionBar.tsx` (wrap rightZone in conditional)
3. `src/features/habits/components/HabitsEmptyStateMinimal/InlineHint.tsx` (wrap TemplatesButton in conditional)

## Verification
1. Run `npx expo start` and visually confirm sparkle icon is gone from bottom bar
2. Delete all habits to trigger empty state — confirm "browse templates" button is gone
3. Run `npm run lint` to ensure no lint errors
4. Flip `TEMPLATES_ENABLED = true` and verify both entry points reappear
