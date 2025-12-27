# Empty State UI/UX Improvements Spec

## Overview

This spec defines 5 UI/UX polish improvements for the empty habits page to enhance perceived performance, visual feedback, and micro-interactions.

## Current State

The empty state already has:
- Breathing hero icon animation
- Input with blue border on focus
- Chip selection with emerald highlight
- CTA button with press animation
- Staggered entrance via `AnimatedEntrance` wrapper

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
