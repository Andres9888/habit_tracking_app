# Plan: Emoji Category Pills — Scroll Fade Affordance

## Context

The emoji picker's category pills (horizontal scrollable tags like "Fitness", "Learning", etc.) provide no visual cue that they're scrollable. Users don't discover off-screen categories. The design decision (from mock exploration) is to add:

- **Right fade gradient** — visible when there's overflow content to the right
- **Left fade gradient** — appears when the user has scrolled right (> ~10px)
- Both fade out smoothly when there's no more content in that direction

This follows the app's existing pattern (`ScrollShadows.tsx` for vertical scroll) adapted for horizontal.

## Files to Modify/Create

| File | Action | Lines |
|---|---|---|
| `src/components/EmojiPickerV2/CategoryPill.tsx` | **Create** — extract from CategoryPills.tsx | ~45 |
| `src/components/EmojiPickerV2/CategoryPills.hooks.ts` | **Create** — `useScrollFades` hook | ~38 |
| `src/components/EmojiPickerV2/CategoryPills.tsx` | **Rewrite** — orchestrator with gradients | ~55 |
| `src/components/EmojiPickerV2/CategoryPills.styles.ts` | **Modify** — add fade overlay styles | ~55 |
| `src/components/EmojiPickerV2/index.ts` | **Modify** — update barrel exports | ~8 |

All files stay under 100-line limit. Current `CategoryPills.tsx` is already 108 lines (over limit), so the split also fixes that.

## Implementation Steps

### 1. Create `CategoryPill.tsx`

Extract the `CategoryPill` component (lines 12-73), `Category` interface, and `CategoryPillProps` from `CategoryPills.tsx`. Pure mechanical extraction, no logic changes. Keeps its own spring press animation via Reanimated.

### 2. Create `CategoryPills.hooks.ts` — `useScrollFades`

Hook using Reanimated worklets (follows `useStickyHeader.ts` pattern):

- **3 shared values**: `scrollX`, `contentWidth`, `layoutWidth`
- **`useAnimatedScrollHandler`**: tracks `contentOffset.x` into `scrollX`
- **`handleContentSizeChange`**: updates `contentWidth` when ScrollView content resizes
- **`handleLayout`**: updates `layoutWidth` when ScrollView viewport resizes
- **2 animated styles** using `useAnimatedStyle` + `withTiming(150ms)`:
  - `leftFadeStyle`: opacity 1 when `scrollX > 10`, else 0
  - `rightFadeStyle`: opacity 1 when `contentWidth - scrollX - layoutWidth > 10`, else 0

All scroll tracking runs on the UI thread — zero JS-thread re-renders.

### 3. Update `CategoryPills.styles.ts`

Add styles for the fade overlay container:

- `categoriesWrapper` — wrapper `View` (move `marginBottom` here from `categoriesScroll`)
- `fadeLeft` / `fadeRight` — absolute positioned, full height, 32px wide (`spacing.xl`), `zIndex: 1`
- `fadeGradient` — `{ flex: 1 }` to fill the overlay

### 4. Rewrite `CategoryPills.tsx`

- Import `useScrollFades`, `CategoryPill`, `LinearGradient`, `useThemeColors`
- Switch `ScrollView` to `Animated.ScrollView` with `scrollEventThrottle={16}`
- Wire `onScroll={scrollHandler}`, `onContentSizeChange`, `onLayout`
- Wrap everything in a `View` (categoriesWrapper)
- Add two `Animated.View` + `LinearGradient` overlays with `pointerEvents='none'`
- Gradient colors: `colors.surface` (from theme, auto dark/light) to `${colors.surface}00` (transparent)

### 5. Update `index.ts` barrel

Point `CategoryPill` and `Category` exports to new `./CategoryPill` file.

## Key Reuse

- **`expo-linear-gradient`** — already in `package.json`, used in `ScrollShadows.tsx`
- **`useAnimatedScrollHandler`** — existing Reanimated pattern in `useStickyHeader.ts`
- **`useThemeColors()`** — existing theme hook, gives `colors.surface` for light/dark
- **`pointerEvents='none'`** — existing pattern in `ScrollShadows.tsx`

## Verification

1. Open app, go to Create Habit > tap emoji field
2. Emoji picker sheet opens with category pills visible
3. **Right fade** should be visible on mount (categories overflow)
4. **Left fade** should be hidden initially
5. Scroll pills right ~15px — left fade appears smoothly
6. Scroll to end — right fade disappears
7. Tap pills under gradient areas — touch events pass through
8. Toggle dark mode — gradient matches dark surface color (`#1F2937`)
9. Run `npx expo start` — no TypeScript errors
10. Run `npm run lint:max-lines` — all modified files under 100 lines
