# Fix: Vertical line on BrandedLoadingScreen

## Root Cause
In `BrandedLoadingScreen.tsx` line 47, the outer container has `items-center` (`alignItems: 'center'`). This causes the ghost cards container (line 68, `<View className='flex-1 px-4 pt-6'>`) to shrink to content width instead of stretching full-width.

`HabitCardSkeleton` uses `flex-row` with a 4px accent strip + a `flex-1` content area. With no available parent width to grow into, the `flex-1` content resolves to 0px width — collapsing the entire card to just the 4px accent strip, which renders as the tall vertical gray line visible in the screenshot.

## Fix
**Single file:** `src/components/auth/BrandedLoadingScreen.tsx` — line 68

Add `self-stretch` to the ghost cards container so it overrides the parent's `items-center`:

```diff
-      <View className='flex-1 px-4 pt-6'>
+      <View className='flex-1 self-stretch px-4 pt-6'>
```

This is a 1-word change. No other files need modification.

## Verification
- Run the app — the BrandedLoadingScreen should now show full-width skeleton cards (icon placeholder, title bar, chain day dots) instead of a vertical line
- The `HabitsPageSkeleton` (used inside HabitsApp) is not affected — its parent doesn't use `items-center`, so it already renders correctly
