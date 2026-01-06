# Habit Card Entrance Animation Spec

**Status:** Draft
**Created:** 2026-01-05
**Author:** Sally (UX Expert)
**Related Mockup:** `.superdesign/design_iterations/habit_card_entrance_animations_1.html`

---

## Problem Statement

When transitioning from the empty habits state to showing the first habit card, the 6px left accent bar appears abruptly with the current fade-up animation. This creates a visual disconnect, especially since the accent bar is a key visual element that communicates habit color-coding.

## Current Behavior

- **Animation:** Simple fade-up (`translateY: 20 → 0`, `opacity: 0 → 1`)
- **Duration:** 350ms with `Easing.out(Easing.cubic)`
- **Issue:** Accent bar appears instantly with card, no visual hierarchy

## Proposed Variations

### Variation 1: Current (Fade Up) - Baseline
```
Card + Accent fade up together
Duration: 350ms
```
**Pros:** Simple, fast
**Cons:** Accent bar appears abrupt, no visual hierarchy

---

### Variation 2: Accent Slides Down First (RECOMMENDED)
```
1. Card container fades in (150ms)
2. Accent bar slides down from top (250ms, ease-out-back)
3. Content fades in from left (300ms)
Total: ~400ms
```
**Pros:** Creates visual hierarchy, emphasizes color-coding, smooth flow
**Cons:** Slightly more complex animation logic

---

### Variation 3: Accent Grows from Center
```
1. Card container fades in (150ms)
2. Accent bar scales Y from center outward (300ms, ease-out-back)
3. Content fades in (250ms)
Total: ~400ms
```
**Pros:** Playful, celebratory feel
**Cons:** May feel too whimsical for routine list view

---

### Variation 4: Slide from Left
```
1. Card slides in from left (translateX: -40 → 0)
2. Accent bar acts as "leading edge"
Duration: 350ms
```
**Pros:** Strong directional flow, accent leads naturally
**Cons:** Too aggressive for habit list, may feel jarring

---

### Variation 5: Ghost Card → Accent → Content
```
1. Ghost card outline appears (150ms)
2. Card fills white + accent appears (200ms)
3. Content fades in (200ms)
Total: ~550ms
```
**Pros:** Sophisticated, three-stage reveal
**Cons:** Too slow for common interaction, adds latency

---

### Variation 6: Accent Width Expansion
```
1. Card fades up normally (350ms)
2. Accent bar width grows 0 → 6px (200ms, ease-out-back)
Total: ~450ms
```
**Pros:** Subtle, minimal disruption to existing flow
**Cons:** Accent animation may be too subtle to notice

---

## Recommendation

**Primary:** Variation 2 (Accent Slides Down First)
- Best balance of visual interest and performance
- Draws attention to color-coding feature
- Matches existing spring configs (`Springs.gentle`)

**Alternative:** Variation 6 (Width Expansion)
- More conservative option
- Good if minimal change is preferred

---

## Tasks

### Task 1: Create Animation Hook
**File:** `src/components/HabitCard/useHabitCardEntrance.ts`

```typescript
// Hook to manage habit card entrance animation state
// Should accept: animationVariant, delay, onAnimationComplete
// Should return: animatedStyles for card, accent, content
```

- [x] Create new hook file
- [x] Define animation variant enum/type
- [x] Implement Reanimated shared values for opacity, translateY, scaleY, width
- [x] Add spring configurations matching `Springs.gentle`
- [x] Export animated style objects

**Implementation Notes (Task 1):**
- Created `useHabitCardEntrance.ts` with full TypeScript types
- Defined `HabitCardEntranceVariant` union type: `'fadeUp' | 'accentSlideDown' | 'widthExpansion' | 'none'`
- Implemented shared values: `cardOpacity`, `cardTranslateY`, `accentScaleY`, `accentWidth`, `accentOpacity`, `contentOpacity`, `contentTranslateX`
- Uses `Springs.gentle` config with customized damping for ease-out-back feel
- Exports `cardStyle`, `accentStyle`, `contentStyle` animated style objects
- Includes `useReduceMotion` integration for accessibility
- Implements auto-cleanup on unmount via `cancelAnimation`

### Task 2: Implement Variation 2 (Accent Slides Down)
**File:** `src/components/HabitCard/useHabitCardEntrance.ts`

```typescript
// Sequence:
// 1. cardOpacity: 0 → 1 (150ms)
// 2. accentScaleY: 0 → 1, transformOrigin: top (250ms, withSpring)
// 3. contentOpacity: 0 → 1, contentTranslateX: -10 → 0 (300ms)
```

- [x] Implement `runAccentSlideDown()` function
- [x] Use `withSequence` or `withDelay` for timing
- [x] Test with `Springs.gentle` config
- [x] Add `useCallback` for animation trigger

**Implementation Notes (Task 2):**
- `runAccentSlideDown()` implements 3-phase animation using `withDelay` for timing
- Phase 1: Card fades in (150ms) - `cardOpacity` with `Easing.out(cubic)`
- Phase 2: Accent slides down (250ms) - `accentScaleY` with custom spring (damping: 24)
- Phase 3: Content fades in from left (300ms) - `contentOpacity` + `contentTranslateX`
- Uses `runOnJS` for completion callback

### Task 3: Implement Variation 6 (Width Expansion)
**File:** `src/components/HabitCard/useHabitCardEntrance.ts`

```typescript
// Sequence:
// 1. Card fades up normally (350ms)
// 2. accentWidth: 0 → 6 (200ms, withSpring ease-out-back)
```

- [x] Implement `runWidthExpansion()` function
- [x] Animate width property with spring
- [x] Ensure accent bar clips properly during animation

**Implementation Notes (Task 3):**
- `runWidthExpansion()` implements 2-phase animation
- Phase 1: Card fades up normally (350ms) with `Easing.out(cubic)`
- Phase 2: Accent width grows 0→6px with spring (damping: 20 for ease-out-back feel)
- Width animated via `accentWidth` shared value, applied in `accentStyle`

### Task 4: Integrate with HabitCard Component
**File:** `src/components/HabitCard/HabitCard.tsx`

- [ ] Import `useHabitCardEntrance` hook
- [ ] Add `entranceVariant` prop (optional, default: 'accentSlideDown')
- [ ] Wrap accent bar `View` with `Animated.View`
- [ ] Apply animated styles from hook
- [ ] Trigger animation on mount or when `triggerEntrance` prop changes

### Task 5: Integrate with HabitsList for Stagger
**File:** `src/features/habits/components/HabitsList.tsx`

- [ ] Pass entrance animation trigger to HabitCard
- [ ] Calculate stagger delay based on item index
- [ ] Ensure animation only triggers on first appearance (not re-renders)
- [ ] Coordinate with `handleSuccessTransitionComplete` callback

### Task 6: Add Animation Variant Toggle (Dev Only)
**File:** `src/components/HabitCard/HabitCard.tsx` or dev settings

- [ ] Add dev-only UI to toggle between variations
- [ ] Allow A/B testing of animation variants
- [ ] Log animation variant for analytics (if applicable)

---

## Code Review Checklist

### Performance
- [ ] Animations run on UI thread (worklets)
- [ ] No unnecessary re-renders during animation
- [ ] Shared values properly cleanup on unmount
- [ ] Animation cancellation handled for fast navigation

### Accessibility
- [ ] `reduceMotion` setting respected
- [ ] Fallback to instant appearance when motion reduced
- [ ] No content hidden during animation (progressive reveal)

### Consistency
- [ ] Uses existing `Springs` constants from `motion.ts`
- [ ] Timing aligns with existing stagger delays (100ms)
- [ ] Easing matches app-wide animation style

### Edge Cases
- [ ] Works with single habit card
- [ ] Works with multiple cards (stagger)
- [ ] Works after habit deletion (re-entrance)
- [ ] Works with drag-and-drop reordering
- [ ] Handles rapid create/delete cycles

### Code Quality
- [ ] TypeScript types for animation variants
- [ ] JSDoc comments on public API
- [ ] Unit tests for hook logic
- [ ] No magic numbers (use constants)

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/HabitCard/useHabitCardEntrance.ts` | NEW - Animation hook |
| `src/components/HabitCard/HabitCard.tsx` | Add animated accent bar |
| `src/components/HabitCard/index.ts` | Export hook (if needed) |
| `src/features/habits/components/HabitsList.tsx` | Pass animation props |
| `src/constants/motion.ts` | Add entrance animation config (if needed) |

---

## Testing Plan

### Manual Testing
1. Create first habit from empty state → verify accent animation
2. Create multiple habits → verify stagger timing
3. Delete all habits, create new → verify animation replays
4. Toggle reduce motion → verify instant appearance
5. Fast navigation away during animation → verify no crashes

### Unit Tests
- `useHabitCardEntrance.test.ts`: Hook returns correct animated styles
- Verify animation triggers on mount
- Verify cleanup on unmount

---

## Success Metrics

- Animation feels cohesive with empty→card transition
- Accent bar draws visual attention without being distracting
- No performance regression (60fps maintained)
- User feedback positive on animation polish

---

## References

- **Mockup:** `.superdesign/design_iterations/habit_card_entrance_animations_1.html`
- **Motion constants:** `src/constants/motion.ts`
- **Current HabitCard:** `src/components/HabitCard/HabitCard.tsx`
- **HabitsList:** `src/features/habits/components/HabitsList.tsx`
