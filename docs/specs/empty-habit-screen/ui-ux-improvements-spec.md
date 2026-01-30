# Empty State UI/UX Improvements Spec

## Overview

This spec defines 5 UI/UX polish improvements for the empty habits page to enhance perceived performance, visual feedback, and micro-interactions.

**Design Mock**: `.superdesign/design_iterations/empty_state_improvements_1.html`

## Current State

The empty state already has:
- Breathing hero icon animation
- Input with blue border on focus
- Chip selection with emerald highlight
- CTA button with press animation
- Staggered entrance via `AnimatedEntrance` wrapper

---

## Proposed Improvements

### 1. Loading Skeleton

**Problem**: When `isLoading=true`, the page shows disabled static elements with no visual feedback.

**Solution**: Replace static disabled state with animated skeleton placeholders.

**Behavior**:
- Show skeleton shimmer effect while loading
- Skeleton elements match layout: hero (80x80), headline (260x32), input (100%x56), chips (3 pills), CTA (100%x56)
- Shimmer animation: `background-position` slides left-to-right over 1.5s, infinite
- Skeleton colors: base `#E7E5E4`, highlight `#F5F5F4`

**Files**:
- Create `LoadingSkeleton.tsx`
- Modify `HabitsEmptyStateMinimal.tsx`

---

### 2. Chip Stagger Animation

**Problem**: All 6 chips enter simultaneously via single `AnimatedEntrance` wrapper.

**Solution**: Stagger each chip's entrance by 50ms for a cascade effect.

**Behavior**:
- Row 1 (Water, Walk, Write): delays 0ms, 50ms, 100ms
- Row 2 (Breathe, Read): delays 150ms, 200ms
- Row 3 (Stretch): delay 250ms
- Base delay: `ENTRANCE_DELAYS.chips` (existing)
- Each chip fades in (opacity 0→1) and slides up (translateY 10→0)
- Duration: 400ms per chip, ease-out

**Files**:
- Modify `SuggestionChips.tsx`
- Add `CHIP_STAGGER_DELAY` to `animations.ts`

---

### 3. Input Focus Haptic

**Problem**: Input focus has visual feedback but no tactile feedback.

**Solution**: Add light haptic when input receives focus.

**Behavior**:
- Trigger `impactLight` haptic on focus
- No haptic on blur
- Respects system haptic settings

**Files**:
- Modify `HabitInput.tsx`

---

### 4. Hero Glow Pulse

**Problem**: Hero icon breathes but shadow stays static.

**Solution**: Sync shadow intensity with breathing animation.

**Behavior**:
- Shadow opacity pulses: 0.15 → 0.35 → 0.15
- Shadow radius pulses: 24px → 32px → 24px
- Add outer glow: `0 0 60px rgba(16, 185, 129, 0.15)` at peak
- Synced with existing 3s breathing cycle
- Uses single shared value for both scale and shadow

**Files**:
- Modify `HeroIcon.tsx`

---

### 5. CTA Button Shimmer

**Problem**: No visual indication when CTA transitions from disabled to enabled.

**Solution**: Play shimmer animation when button becomes enabled.

**Behavior**:
- Trigger: `disabled` prop changes from `true` to `false`
- Animation: white gradient sweeps left-to-right across button
- Gradient: `transparent → rgba(255,255,255,0.3) → transparent`
- Duration: 600ms, ease-in-out
- Only plays once per enable transition
- Respects reduced motion (skip shimmer)

**Files**:
- Modify `CtaButton.tsx`
- Add `CTA_SHIMMER` constants to `animations.ts`

---

## Animation Constants

Add to `animations.ts`:

```typescript
// Chip stagger entrance
export const CHIP_STAGGER = {
  delay: 50, // ms between each chip
  duration: 400,
  translateY: 10,
};

// Hero glow pulse (synced with breathing)
export const HERO_GLOW = {
  minShadowOpacity: 0.15,
  maxShadowOpacity: 0.35,
  minShadowRadius: 24,
  maxShadowRadius: 32,
  outerGlowOpacity: 0.15,
  outerGlowRadius: 60,
};

// CTA shimmer on enable
export const CTA_SHIMMER = {
  duration: 600,
  gradientOpacity: 0.3,
};
```

---

## Component Changes Summary

| Component | Changes |
|-----------|---------|
| `LoadingSkeleton.tsx` | New component - skeleton placeholders |
| `HabitsEmptyStateMinimal.tsx` | Render `LoadingSkeleton` when `isLoading` |
| `SuggestionChips.tsx` | Add per-chip stagger delay |
| `HabitInput.tsx` | Add haptic on focus |
| `HeroIcon.tsx` | Add shadow pulse synced with breathing |
| `CtaButton.tsx` | Add shimmer on enable transition |
| `animations.ts` | Add new constants |

---

## Implementation Tasks

### Task 1: Add Animation Constants
**Priority**: High | **Effort**: 10 min | **Dependencies**: None

Add new animation constants for chip stagger, hero glow, and CTA shimmer.

**Acceptance Criteria**:
- [x] `CHIP_STAGGER` constant with delay, duration, translateY
- [x] `HERO_GLOW` constant with shadow opacity/radius ranges
- [x] `CTA_SHIMMER` constant with duration, gradientOpacity
- [x] All values match spec

**Files**: `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts`

**Completed**: 2025-12-27 - Added `CHIP_STAGGER`, `HERO_GLOW`, and `CTA_SHIMMER` constants with all spec values.

---

### Task 2: Create Loading Skeleton Component
**Priority**: High | **Effort**: 30 min | **Dependencies**: None

Create skeleton placeholder component with shimmer animation for loading state.

**Acceptance Criteria**:
- [x] Renders skeleton elements matching layout (hero, headline, input, chips, CTA)
- [x] Shimmer animation using `LinearGradient` or animated background
- [x] Skeleton colors: base `#E7E5E4`, highlight `#F5F5F4`
- [x] Animation duration: 1.5s infinite
- [x] Exported from index.ts
- [x] Includes `accessibilityLabel="Loading"`

**Files**: Create `LoadingSkeleton.tsx`, modify `index.ts`

**Completed**: 2025-12-27 - Created `LoadingSkeleton.tsx` with shimmer animation using `expo-linear-gradient` and Reanimated. Component includes 5 skeleton elements matching the empty state layout (hero 80x80, headline 260x32, input full-width x56, 3 chips, CTA full-width x56). All 10 unit tests passing.

---

### Task 3: Integrate Loading Skeleton
**Priority**: High | **Effort**: 10 min | **Dependencies**: Task 2

Replace static disabled state with LoadingSkeleton when `isLoading=true`.

**Acceptance Criteria**:
- [x] When `isLoading=true`, render `LoadingSkeleton` instead of main content
- [x] When `isLoading=false`, render normal empty state
- [x] Transition between states is instant (no animation needed)

**Files**: `HabitsEmptyStateMinimal.tsx`

**Completed**: 2025-12-27 - Integrated `LoadingSkeleton` component into `HabitsEmptyStateMinimal`. When `isLoading=true`, the component now renders the skeleton instead of main content. Updated 3 existing loading state tests to verify the new behavior (skeleton shows with accessibility label, content hidden during load, proper transition from loading to content). All 35 tests passing.

---

### Task 4: Add Chip Stagger Animation
**Priority**: Medium | **Effort**: 25 min | **Dependencies**: Task 1

Stagger each chip's entrance animation by 50ms for cascade effect.

**Acceptance Criteria**:
- [x] Each chip has individual entrance animation
- [x] Delays: 0, 50, 100, 150, 200, 250ms (per chip index)
- [x] Animation: opacity 0→1, translateY 10→0
- [x] Duration: 400ms, ease-out
- [x] Base delay still respects `ENTRANCE_DELAYS.chips`
- [x] Reduced motion: instant appearance, no stagger

**Files**: `SuggestionChips.tsx`, `HabitsEmptyStateMinimal.tsx`

**Completed**: 2025-12-27 - Added individual entrance animations to each chip with staggered delays (0-250ms in 50ms increments). Animation uses `withTiming` with ease-out easing for opacity (0→1) and translateY (10→0) over 400ms. Total delay combines `ENTRANCE_DELAYS.chips` (300ms) with chip-specific stagger. Reduced motion users see instant appearance. Removed `AnimatedEntrance` wrapper from `HabitsEmptyStateMinimal.tsx`. Added 4 unit tests for stagger delay calculations. All 98 tests passing.

---

### Task 5: Add Input Focus Haptic
**Priority**: Low | **Effort**: 10 min | **Dependencies**: None

Add light haptic feedback when input receives focus.

**Acceptance Criteria**:
- [x] Trigger `impactLight` haptic on focus
- [x] No haptic on blur
- [x] Uses existing `useHapticFeedback` hook

**Files**: `HabitInput.tsx`

**Completed**: 2025-12-27 - Added `useHapticFeedback` hook to `HabitInput.tsx` and called `triggerLightImpact()` in the `handleFocus` callback. No haptic is triggered on blur. Added 2 unit tests verifying haptic triggers on focus but not on blur. All 100 tests passing.

---

### Task 6: Add Hero Glow Pulse
**Priority**: Medium | **Effort**: 20 min | **Dependencies**: Task 1

Sync hero icon shadow with breathing animation for glow pulse effect.

**Acceptance Criteria**:
- [x] Shadow opacity pulses: 0.15 → 0.35 → 0.15
- [x] Shadow radius pulses: 24 → 32 → 24
- [x] Synced with existing 3s breathing animation
- [x] Reuses existing `scale` shared value (interpolate for shadow)
- [x] Reduced motion: static shadow at min values

**Files**: `HeroIcon.tsx`

**Completed**: 2025-12-27 - Added `interpolate` from react-native-reanimated to interpolate `shadowOpacity` (0.15 → 0.35) and `shadowRadius` (24 → 32) based on the existing breathing `scale` shared value. The shadow pulse is now synced with the 3s breathing animation cycle. When reduced motion is enabled, scale stays at minScale which keeps shadow at static minimum values. Added 13 unit tests in `HeroIcon.test.tsx` covering animation constants, glow behavior, and reduced motion. All 113 HabitsEmptyStateMinimal tests passing.

---

### Task 7: Add CTA Shimmer Effect
**Priority**: Medium | **Effort**: 25 min | **Dependencies**: Task 1

Add shimmer animation when CTA button transitions from disabled to enabled.

**Acceptance Criteria**:
- [x] Shimmer triggers when `disabled` changes from `true` to `false`
- [x] Animation: gradient sweeps left-to-right
- [x] Gradient: transparent → white(0.3) → transparent
- [x] Duration: 600ms
- [x] Only plays once per enable transition
- [x] Reduced motion: no shimmer, just instant enable

**Files**: `CtaButton.tsx`

**Completed**: 2025-12-27 - Added shimmer effect using `expo-linear-gradient` and Reanimated. Shimmer is triggered via `useEffect` that detects `disabled` prop changes from `true` to `false`. Animation uses `withTiming` over 600ms with `Easing.inOut(Easing.ease)`. The shimmer overlay is positioned absolutely over the button with `overflow: hidden` to clip at button edges. Reduced motion users see instant enable without shimmer animation. Added 27 unit tests in `CtaButton.test.tsx` covering shimmer trigger behavior, accessibility, press behavior, and reduced motion. All 137 HabitsEmptyStateMinimal tests passing.

---

### Task 8: Add Unit Tests
**Priority**: Medium | **Effort**: 45 min | **Dependencies**: Tasks 2, 4, 6, 7

Add unit tests for new components and animations.

**Acceptance Criteria**:
- [x] `LoadingSkeleton` renders correct skeleton elements
- [x] `LoadingSkeleton` has correct accessibility label
- [x] Chip stagger delays are calculated correctly
- [x] CTA shimmer triggers on enable transition
- [x] Hero glow respects reduced motion
- [x] Animation constants have correct values

**Files**: Create `LoadingSkeleton.test.tsx`, modify existing test files

**Completed**: 2025-12-27 - All unit tests were added during Tasks 2, 4, 5, 6, and 7. Test coverage includes:
- `LoadingSkeleton.test.tsx` (10 tests): skeleton elements, accessibility label, layout
- `HabitsEmptyStateMinimal.test.tsx` (4 tests): chip stagger delay calculations
- `CtaButton.test.tsx` (27 tests): shimmer trigger behavior, reduced motion
- `HeroIcon.test.tsx` (13 tests): glow pulse constants, reduced motion
Total: 137 tests across all HabitsEmptyStateMinimal component tests.

---

### Task 9: Manual QA
**Priority**: High | **Effort**: 30 min | **Dependencies**: Tasks 3, 4, 5, 6, 7

Manual testing on devices.

**Acceptance Criteria**:
- [ ] Test loading skeleton on slow network simulation
- [ ] Verify chip stagger looks smooth (60fps)
- [ ] Verify input haptic feels appropriate
- [ ] Verify hero glow syncs with breathing
- [ ] Verify CTA shimmer timing
- [ ] Test reduced motion settings
- [ ] Test on iOS and Android

**Note**: This task requires human intervention - manual testing on physical iOS and Android devices. Cannot be automated by Maestro agents.

---

## Task Dependencies Graph

```text
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

---

## Testing Strategy

### Unit Tests
- `LoadingSkeleton` renders correct number of skeleton elements
- Chip stagger delays are applied correctly
- CTA shimmer triggers on disabled→enabled transition
- Reduced motion disables shimmer and glow pulse

### Manual QA
- Verify 60fps during all animations
- Test loading skeleton on slow network
- Verify haptic feels appropriate (not too strong)
- Check shimmer timing feels natural

---

## Performance Considerations

- All animations use `transform` and `opacity` (GPU-accelerated)
- Skeleton shimmer uses CSS `background-position` (no JS)
- Glow pulse reuses existing breathing shared value
- No new timers or intervals

---

## Accessibility

- Loading skeleton includes `accessibilityLabel="Loading"`
- Reduced motion: skip shimmer, static glow, instant chip entrance
- Haptic respects system settings via `useHapticFeedback` hook

---

## Rollout Plan

1. Implement all 5 improvements
2. Run unit tests
3. Manual QA on iOS/Android
4. Ship behind feature flag (optional)
5. Monitor performance metrics

---

## Success Metrics

- No regression in empty state render time
- Positive user feedback on polish
- No accessibility complaints
