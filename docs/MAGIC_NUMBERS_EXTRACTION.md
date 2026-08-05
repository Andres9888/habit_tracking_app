# Magic Numbers Extraction Guide

## Overview

This guide documents the ongoing effort to extract magic numbers and strings from the codebase into named constants. This improves maintainability, consistency, and makes it easier to update values globally.

## Constants Organization

All UI-related constants are centralized in `src/constants/`:

### Main Constant Files

- **`ui-values.ts`** - New file containing all UI magic numbers:
  - Opacity values (0.2, 0.3, 0.4, 0.5, 0.7, 0.8, 0.9, 1)
  - Shadow opacity values (0.08, 0.15, 0.25, 0.32)
  - Scale values (0.4, 0.6, 0.9, 0.94, 0.95, 0.97, 0.98, 1, 1.02, 1.5, 1.8, 2)
  - Animation durations (50ms - 3000ms+)
  - Animation delays and stagger values
  - Translate/position values
  - Gesture thresholds
  - Screen dimensions
  - Letter spacing
  - Ripple effect configuration

- **`app.ts`** - Existing file with application-wide constants:
  - `FAB` object - Floating Action Button timing
  - `FREE_HABIT_LIMIT`, `MAX_SUGGESTIONS`, etc.
  - Network and validation limits
  - Animation delays

- **`motion.ts`** - Animation timing and easing curves
- **`strings.ts`** - UI text strings
- **`auth.ts`** - Authentication configuration

## Common Magic Numbers to Extract

### Opacity Values
```typescript
// BAD
opacity: 0.8
shadowOpacity: 0.08

// GOOD
opacity: OPACITY.strong
shadowOpacity: SHADOW_OPACITY.minimal
```

Available opacity constants:
- `OPACITY.transparent` = 0
- `OPACITY.subtle` = 0.2
- `OPACITY.subdued` = 0.3
- `OPACITY.moderate` = 0.4
- `OPACITY.medium` = 0.5
- `OPACITY.high` = 0.7
- `OPACITY.strong` = 0.8
- `OPACITY.veryStrong` = 0.9
- `OPACITY.full` = 1

Shadow opacity (for elevation):
- `SHADOW_OPACITY.minimal` = 0.08
- `SHADOW_OPACITY.light` = 0.15
- `SHADOW_OPACITY.medium` = 0.25
- `SHADOW_OPACITY.strong` = 0.32

### Scale Values (for press states, transforms)
```typescript
// BAD
toValue: 0.94
scale: 1.8

// GOOD
toValue: SCALE.pressSmall
scale: SCALE.large
```

Common scale values:
- `SCALE.minimum` = 0.4
- `SCALE.extraSmall` = 0.6 (ripple initial)
- `SCALE.small` = 0.9
- `SCALE.pressSmall` = 0.94
- `SCALE.pressMedium` = 0.95
- `SCALE.pressLarge` = 0.97
- `SCALE.nearNormal` = 0.98
- `SCALE.normal` = 1
- `SCALE.expand` = 1.02
- `SCALE.expandMedium` = 1.5
- `SCALE.large` = 1.8 (ripple final)
- `SCALE.extraLarge` = 2

### Animation Durations
```typescript
// BAD
duration: 300
Animated.delay(200)

// GOOD
duration: ANIMATION_DURATION.emphasized
Animated.delay(ANIMATION_DELAY.standard)
```

Duration examples:
- `ANIMATION_DURATION.instant` = 0
- `ANIMATION_DURATION.veryShort` = 50
- `ANIMATION_DURATION.short` = 100
- `ANIMATION_DURATION.brief` = 150
- `ANIMATION_DURATION.default` = 200
- `ANIMATION_DURATION.standard` = 250
- `ANIMATION_DURATION.medium` = 280
- `ANIMATION_DURATION.emphasized` = 300
- `ANIMATION_DURATION.long` = 320
- `ANIMATION_DURATION.extraLong` = 400
- `ANIMATION_DURATION.extended` = 500
- `ANIMATION_DURATION.background` = 600
- ... and more up to 3000ms

### Translate/Position Values
```typescript
// BAD
headerTranslateY.setValue(20)

// GOOD
headerTranslateY.setValue(TRANSLATE.small)
```

- `TRANSLATE.small` = 20px
- `TRANSLATE.medium` = 50px
- `TRANSLATE.large` = 150px

### Special Constants
```typescript
// Screen dimensions
maxHeight: SCREEN_HEIGHT * SCREEN.maxHeightPercent  // 0.85

// Letter spacing
letterSpacing: LETTER_SPACING.tight  // -0.76
letterSpacing: LETTER_SPACING.label  // 2

// Gesture thresholds
dismissThreshold: GESTURE.dismissThreshold  // 100px
velocityThreshold: GESTURE.velocityThreshold  // 800px/s

// Ripple effects
rippleOpacity.setValue(RIPPLE_EFFECT.initialOpacity)  // 0.26
rippleScale.setValue(RIPPLE_EFFECT.initialScale)  // 0.6
```

## Files Updated So Far

The following files have been refactored to use constants:

1. ✅ `src/constants/ui-values.ts` - **NEW** - Created with 150+ constants
2. ✅ `src/constants/index.ts` - Updated to export ui-values
3. ✅ `src/features/habits/components/FloatingActionButton/useFABHandlers.ts`
4. ✅ `src/features/habits/components/FloatingActionButton/useFABAnimations.ts`
5. ✅ `src/features/habits/components/HabitsList/useHabitsListAnimations.ts`
6. ✅ `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx`
7. ✅ `src/features/habits/components/HabitsHeader/AddHabitButton.tsx`
8. ✅ `src/features/habits/components/HabitsList/LockedHabitCard.tsx`
9. ✅ `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx`

## Files Still Needing Refactoring

There are ~140+ additional files with magic numbers that can be refactored. Priority areas:

### High Priority (Core UI Components)
- `src/features/habits/components/HabitsEmptyStateMinimal/`
- `src/screens/auth/` (SignInScreen, SignUpScreen, etc.)
- `src/components/HabitCard/`
- `src/components/PerformanceDashboard/`

### Medium Priority (Dashboard & Secondary UI)
- `src/screens/HabitDetailScreen/`
- `src/screens/CharacterScreen/`
- `src/screens/AnalyticsScreen/`
- `src/components/CalendarTimeline/`
- `src/components/DailyMomentumMeter/`

### Pattern: Replacing shadowOpacity

Most common pattern with 140+ instances:

```typescript
// Before
shadowOpacity: 0.08,   // → SHADOW_OPACITY.minimal
shadowOpacity: 0.15,   // → SHADOW_OPACITY.light
shadowOpacity: 0.25,   // → SHADOW_OPACITY.medium
shadowOpacity: 0.32,   // → SHADOW_OPACITY.strong
shadowOpacity: 0.3,    // → SHADOW_OPACITY.light (or new 0.3 if needed)
shadowOpacity: 0.2,    // → SHADOW_OPACITY.light
```

## How to Contribute

### Step 1: Find Files with Magic Numbers
```bash
# Find files with specific shadow opacity values
grep -rn "shadowOpacity: 0\.[0-9]" src --include="*.tsx" --include="*.ts"

# Find files with duration values
grep -rn "duration: [0-9]\{2,\}" src --include="*.tsx" --include="*.ts"

# Find files with opacity values
grep -rn "opacity: 0\.[0-9]" src --include="*.tsx" --include="*.ts"
```

### Step 2: Update a File
```typescript
// 1. Import the needed constants
import { OPACITY, SHADOW_OPACITY, SCALE, ANIMATION_DURATION } from '@/constants';

// 2. Replace magic numbers
// Before:
shadowOpacity: 0.08,
opacity: 0.8,
duration: 300,

// After:
shadowOpacity: SHADOW_OPACITY.minimal,
opacity: OPACITY.strong,
duration: ANIMATION_DURATION.emphasized,
```

### Step 3: Test
- Ensure the app still builds
- Visual testing to confirm animations still work correctly
- Run `npm run build` and `npm run test` if available

### Step 4: Commit
```bash
git add src/some-file.tsx
git commit -m "refactor: replace magic numbers with constants in FileName

- Update shadowOpacity values to use SHADOW_OPACITY.*
- Update opacity values to use OPACITY.*
- Update animation durations to use ANIMATION_DURATION.*"
```

## Adding New Constants

If you find a magic number that doesn't have a constant:

1. **Check if it already exists** - Look in `src/constants/ui-values.ts`
2. **Categorize it** - Decide which section it belongs in (opacity, scale, duration, etc.)
3. **Add with comments** - Include a docstring explaining what it's used for

```typescript
// In ui-values.ts

export const OPACITY = {
  /** Your comment about this value */
  newValue: 0.45,
} as const;
```

## Common Scenarios

### Scenario: Different opacity for pressed/unpressed states
```typescript
style={({ pressed }) => ({
  opacity: pressed ? OPACITY.strong : OPACITY.full,
})}
```

### Scenario: Staggered animations
```typescript
Animated.stagger(ANIMATION_DELAY.small, [
  animation1,
  animation2,
])
```

### Scenario: Translation animations
```typescript
Animated.timing(translateY, {
  toValue: TRANSLATE.large,
  duration: ANIMATION_DURATION.medium,
})
```

## Next Steps

1. Continue refactoring files in priority order
2. Consider adding CSS/Tailwind shadow opacity classes if not already present
3. Update component documentation to reference constants
4. Consider a linter rule to detect new magic numbers

## Related Files

- `src/constants/app.ts` - Application-wide constants
- `src/constants/motion.ts` - Motion/animation constants
- `src/theme/animations.ts` - Spring configurations
- `src/theme/spacing.ts` - Spacing utilities (may have some duplicates to consolidate)
