# Templates Screen Transition Animation Spec

## Status: PHASE 1 COMPLETE - AWAITING TESTING

## Problem
The transition animation from Habit List → Templates Screen (Import Habits) is too quick and doesn't feel organic. User taps the clipboard/import button and the modal appears too fast.

## Current State

### How it works
1. User taps clipboard button in HabitsHeader
2. `openTemplatesScreen()` sets `showTemplatesScreen: true`
3. `CustomModal` with `variant='fullScreen'` renders TemplatesScreen
4. Modal uses `APPLE_SPRING_CONFIG` animation

### Current Animation Config (`src/components/Modal.tsx`)

```typescript
const APPLE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 380,   // Very high = very fast
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};
```

### Current Animation Style

```typescript
// fullScreenProgress interpolates:
// - Scale: 0.94 → 1.0
// - Opacity: 0 → 0.8 → 1.0
// - TranslateY: 60 → 0
```

## Benchmark: CreateHabitModal

The "Add Habit" modal uses React Native's native `<Modal animationType='slide'>` which feels good because it uses the platform's native animation timing.

**Why it feels better:**
- Native iOS/Android spring curves
- ~400-500ms duration
- Smooth deceleration
- No jarring snap at the end

---

## Proposed Solution

### Option 1: Use Native Modal Animation (Recommended)

Change TemplatesScreen to use native `animationType='slide'` like CreateHabitModal:

```tsx
// In HabitsModals.tsx
<Modal
  transparent
  animationType='slide'
  visible={showTemplatesScreen}
  onRequestClose={handleTemplatesClose}
>
  <TemplatesScreen />
</Modal>
```

**Pros:**
- Matches CreateHabitModal feel exactly
- Uses iOS/Android native animation curves
- Zero custom animation code needed
- Feels natural to users

**Cons:**
- Loses custom spring physics
- Less control over exact timing

### Option 2: Slow Down Custom Spring

Update `APPLE_SPRING_CONFIG` to be slower/more organic:

```typescript
// Before (too fast)
const APPLE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 380,
  mass: 1,
};

// After (organic)
const FULLSCREEN_ORGANIC_SPRING = {
  damping: 32,      // More controlled, less bounce
  stiffness: 180,   // Much slower
  mass: 1.3,        // Heavier = more momentum
};
```

Also increase backdrop fade duration:
```typescript
// Before
backdropOpacityValue.value = withTiming(backdropOpacity, { duration: 200 });

// After
backdropOpacityValue.value = withTiming(backdropOpacity, {
  duration: 400,
  easing: Easing.out(Easing.cubic)
});
```

**Pros:**
- Keeps custom spring physics
- More control over feel
- Can tune to exact preference

**Cons:**
- May not feel as "native"
- More values to maintain

---

## Implementation Tasks

### Phase 1: Update Modal.tsx fullScreen animation

- [x] **Task 1.1**: Update `APPLE_SPRING_CONFIG` for fullScreen variant
  - Lower stiffness (380 → 180)
  - Higher damping (24 → 32)
  - Higher mass (1 → 1.3)
  - **DONE**: Created new `FULLSCREEN_ORGANIC_SPRING` config with these values and applied it to fullScreen entrance animation

- [x] **Task 1.2**: Increase backdrop fade duration
  - Change from 200ms to 400ms
  - Add cubic ease-out
  - **DONE**: Updated backdrop fade to 400ms for fullScreen entrance, 300ms for exit. Also restructured animation code to have per-variant backdrop timing.

- [x] **Task 1.3**: Optionally increase translateY starting position
  - Change from 60 → 80-100 for more dramatic slide
  - **DONE**: Changed translateY from 60 → 80 for more dramatic slide effect

### Phase 2: Test and Tune

- [ ] **Task 2.1**: Compare with CreateHabitModal feel
- [ ] **Task 2.2**: Adjust values until it matches benchmark
- [ ] **Task 2.3**: Test on both iOS and Android

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Modal.tsx` | Update spring config for fullScreen |

---

## Animation Physics Reference

| Property | Effect |
|----------|--------|
| **damping** | Higher = less bounce, more controlled |
| **stiffness** | Lower = slower movement |
| **mass** | Higher = more momentum/weight |

### Feel Guidelines

| Feel | Damping | Stiffness | Mass |
|------|---------|-----------|------|
| Snappy (current) | 24 | 380 | 1 |
| Apple-like | 28-32 | 180-220 | 1.2-1.4 |
| Very organic | 35+ | 120-150 | 1.5+ |

---

## Success Criteria

1. Templates screen entrance feels as smooth as CreateHabitModal
2. No jarring snap at the end of animation
3. ~400-500ms perceived duration
4. Works well on both iOS and Android

---

*Created: December 2024*
*Status: Ready for Implementation*
