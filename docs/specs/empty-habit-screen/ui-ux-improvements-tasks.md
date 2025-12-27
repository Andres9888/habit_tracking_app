# UI/UX Improvements - Implementation Tasks

## Overview

Implementation tasks for the 5 UI/UX polish improvements defined in `ui-ux-improvements-spec.md`.

---

## Task 1: Add Animation Constants

**Priority**: High
**Estimated Effort**: 10 min
**Dependencies**: None

### Description

Add new animation constants for chip stagger, hero glow, and CTA shimmer.

### Acceptance Criteria

- [ ] `CHIP_STAGGER` constant with delay, duration, translateY
- [ ] `HERO_GLOW` constant with shadow opacity/radius ranges
- [ ] `CTA_SHIMMER` constant with duration, gradientOpacity
- [ ] All values match spec

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts`

---

## Task 2: Create Loading Skeleton Component

**Priority**: High
**Estimated Effort**: 30 min
**Dependencies**: None

### Description

Create skeleton placeholder component with shimmer animation for loading state.

### Acceptance Criteria

- [ ] Renders skeleton elements matching layout (hero, headline, input, chips, CTA)
- [ ] Shimmer animation using `LinearGradient` or animated background
- [ ] Skeleton colors: base `#E7E5E4`, highlight `#F5F5F4`
- [ ] Animation duration: 1.5s infinite
- [ ] Exported from index.ts
- [ ] Includes `accessibilityLabel="Loading"`

### Implementation Notes

- Use `react-native-linear-gradient` or `Animated.View` with interpolated backgroundColor
- Match exact dimensions from existing components

### Files to Create

- `src/features/habits/components/HabitsEmptyStateMinimal/LoadingSkeleton.tsx`

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/index.ts`

---

## Task 3: Integrate Loading Skeleton

**Priority**: High
**Estimated Effort**: 10 min
**Dependencies**: Task 2

### Description

Replace static disabled state with LoadingSkeleton when `isLoading=true`.

### Acceptance Criteria

- [ ] When `isLoading=true`, render `LoadingSkeleton` instead of main content
- [ ] When `isLoading=false`, render normal empty state
- [ ] Transition between states is instant (no animation needed)

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx`

---

## Task 4: Add Chip Stagger Animation

**Priority**: Medium
**Estimated Effort**: 25 min
**Dependencies**: Task 1

### Description

Stagger each chip's entrance animation by 50ms for cascade effect.

### Acceptance Criteria

- [ ] Each chip has individual entrance animation
- [ ] Delays: 0, 50, 100, 150, 200, 250ms (per chip index)
- [ ] Animation: opacity 0→1, translateY 10→0
- [ ] Duration: 400ms, ease-out
- [ ] Base delay still respects `ENTRANCE_DELAYS.chips`
- [ ] Reduced motion: instant appearance, no stagger

### Implementation Notes

- Remove `AnimatedEntrance` wrapper from `SuggestionChips` in parent
- Add individual `Animated.View` per chip with calculated delay
- Use `withDelay` and `withTiming` from reanimated

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/SuggestionChips.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx`

---

## Task 5: Add Input Focus Haptic

**Priority**: Low
**Estimated Effort**: 10 min
**Dependencies**: None

### Description

Add light haptic feedback when input receives focus.

### Acceptance Criteria

- [ ] Trigger `impactLight` haptic on focus
- [ ] No haptic on blur
- [ ] Uses existing `useHapticFeedback` hook

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/HabitInput.tsx`

---

## Task 6: Add Hero Glow Pulse

**Priority**: Medium
**Estimated Effort**: 20 min
**Dependencies**: Task 1

### Description

Sync hero icon shadow with breathing animation for glow pulse effect.

### Acceptance Criteria

- [ ] Shadow opacity pulses: 0.15 → 0.35 → 0.15
- [ ] Shadow radius pulses: 24 → 32 → 24
- [ ] Synced with existing 3s breathing animation
- [ ] Reuses existing `scale` shared value (interpolate for shadow)
- [ ] Reduced motion: static shadow at min values

### Implementation Notes

- Use `interpolate` to derive shadow values from scale shared value
- Scale range: 1.0 → 1.08 maps to shadow opacity 0.15 → 0.35

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/HeroIcon.tsx`

---

## Task 7: Add CTA Shimmer Effect

**Priority**: Medium
**Estimated Effort**: 25 min
**Dependencies**: Task 1

### Description

Add shimmer animation when CTA button transitions from disabled to enabled.

### Acceptance Criteria

- [ ] Shimmer triggers when `disabled` changes from `true` to `false`
- [ ] Animation: gradient sweeps left-to-right
- [ ] Gradient: transparent → white(0.3) → transparent
- [ ] Duration: 600ms
- [ ] Only plays once per enable transition
- [ ] Reduced motion: no shimmer, just instant enable

### Implementation Notes

- Track previous disabled state with `useRef`
- Use `Animated.View` with `translateX` for gradient overlay
- Gradient implemented with `LinearGradient` or opacity mask

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/CtaButton.tsx`

---

## Task 8: Add Unit Tests

**Priority**: Medium
**Estimated Effort**: 45 min
**Dependencies**: Tasks 2, 4, 6, 7

### Description

Add unit tests for new components and animations.

### Acceptance Criteria

- [ ] `LoadingSkeleton` renders correct skeleton elements
- [ ] `LoadingSkeleton` has correct accessibility label
- [ ] Chip stagger delays are calculated correctly
- [ ] CTA shimmer triggers on enable transition
- [ ] Hero glow respects reduced motion
- [ ] Animation constants have correct values

### Files to Create

- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/LoadingSkeleton.test.tsx`

### Files to Modify

- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/SuggestionChips.test.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/CtaButton.test.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/HeroIcon.test.tsx`

---

## Task 9: Manual QA

**Priority**: High
**Estimated Effort**: 30 min
**Dependencies**: Tasks 3, 4, 5, 6, 7

### Description

Manual testing on devices.

### Acceptance Criteria

- [ ] Test loading skeleton on slow network simulation
- [ ] Verify chip stagger looks smooth (60fps)
- [ ] Verify input haptic feels appropriate
- [ ] Verify hero glow syncs with breathing
- [ ] Verify CTA shimmer timing
- [ ] Test reduced motion settings
- [ ] Test on iOS and Android

---

## Task Dependencies Graph

```
Task 1 (Constants)
    ├── Task 4 (Chip Stagger)
    ├── Task 6 (Hero Glow)
    └── Task 7 (CTA Shimmer)

Task 2 (LoadingSkeleton)
    └── Task 3 (Integrate Skeleton)

Task 5 (Input Haptic) - Independent

Tasks 2, 4, 6, 7 → Task 8 (Tests)
Tasks 3, 4, 5, 6, 7 → Task 9 (QA)
```

---

## Estimated Total Effort

| Task | Effort |
|------|--------|
| Task 1 | 10 min |
| Task 2 | 30 min |
| Task 3 | 10 min |
| Task 4 | 25 min |
| Task 5 | 10 min |
| Task 6 | 20 min |
| Task 7 | 25 min |
| Task 8 | 45 min |
| Task 9 | 30 min |
| **Total** | **~3.5 hours** |
