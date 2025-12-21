# Animation Consistency Audit

## Status: AUDIT COMPLETE - RECOMMENDATIONS PENDING

## Purpose
Ensure all animations across the app feel consistent, organic, and follow a unified design language based on Apple iOS patterns.

---

## Current Animation Constants

### Motion.ts (`src/constants/motion.ts`)
```typescript
export const Motion = {
  duration: {
    fast: 100,
    base: 150,
    reveal: 180,
    emphasized: 220,
    enter: 280,
    exit: 220,
  },
  easing: {
    outEase: Easing.out(Easing.ease),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    inCubic: Easing.in(Easing.cubic),
  },
};
```

---

## Animation Audit by Component

### 1. Modal.tsx (Templates Screen Transition)

| Animation | Config | Feel | Status |
|-----------|--------|------|--------|
| fullScreen enter | damping: 24, stiffness: **380** | Fast/snappy | ⚠️ Too fast |
| fullScreen exit | damping: 26, stiffness: 420 | Fast | ⚠️ Too fast |
| bottomSheet | damping: 26, stiffness: 300 | Good | ✅ OK |
| backdrop | 200ms | Fast | ⚠️ Could be slower |

**Recommendation**: Update fullScreen spring to organic values:
```typescript
// PROPOSED
const FULLSCREEN_SPRING = {
  damping: 32,
  stiffness: 180,
  mass: 1.3,
};
```

### 2. FullsizeTemplatePreview.tsx

| Animation | Config | Feel | Status |
|-----------|--------|------|--------|
| content slide | damping: 28, stiffness: 180, mass: 1.2 | Organic | ✅ Good |
| backdrop | 350ms, cubic ease-out | Smooth | ✅ Good |
| icon scale | damping: 14, stiffness: 120 | Gentle bounce | ✅ Good |
| icon glow | damping: 12, stiffness: 60 | Slow pulse | ✅ Good |
| content opacity | 400ms | Smooth | ✅ Good |

**Status**: ✅ Already optimized

### 3. HabitsHeader.tsx (Button Press Feedback)

| Animation | Config | Feel | Status |
|-----------|--------|------|--------|
| press in | 50ms timing | Instant | ✅ Good for press |
| press out | damping: 15, stiffness: 300 | Snappy return | ✅ Good |

**Status**: ✅ Appropriate for micro-interactions

### 4. CreateHabitModal Components

| Component | Animation | Config | Status |
|-----------|-----------|--------|--------|
| ColorPickerSection | select | Motion.duration.fast (100ms) | ✅ Good |
| StyleSection | scale | damping: 12, stiffness: 180 | ✅ Good |
| LivePreview | bounce | damping: 8, stiffness: 300 | ✅ Good |
| SuccessAnimation | checkmark | damping: 8-15, stiffness: 200-300 | ✅ Good |
| HeroNameInput | focus | damping: 15, stiffness: 200 | ✅ Good |

**Status**: ✅ Using Motion constants, consistent

---

## Proposed Animation Standards

### Spring Configs by Use Case

```typescript
// PROPOSED: Add to motion.ts

export const Springs = {
  // Sheet/Modal presentations (iOS-like)
  sheet: {
    damping: 32,
    stiffness: 180,
    mass: 1.3,
  },

  // Gentle content reveals
  gentle: {
    damping: 28,
    stiffness: 180,
    mass: 1.2,
  },

  // Button press feedback
  button: {
    damping: 15,
    stiffness: 300,
  },

  // Bouncy celebrations
  bouncy: {
    damping: 8,
    stiffness: 300,
  },

  // Subtle micro-interactions
  micro: {
    damping: 12,
    stiffness: 180,
  },

  // Slow, organic pulses
  pulse: {
    damping: 12,
    stiffness: 60,
  },
};
```

### Duration Standards

| Use Case | Duration | Easing |
|----------|----------|--------|
| Press feedback | 50-100ms | ease-out |
| Micro-interactions | 150ms | ease-out |
| Content reveals | 280-350ms | cubic ease-out |
| Sheet transitions | 400-500ms | spring or cubic |
| Success celebrations | 300-400ms | spring bounce |

---

## Files Requiring Updates

### Priority 1: Modal.tsx (High Impact)
Update `APPLE_SPRING_CONFIG` for fullScreen variant:
```typescript
// FROM
const APPLE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 380,
  mass: 1,
};

// TO
const APPLE_SPRING_CONFIG = {
  damping: 32,
  stiffness: 180,
  mass: 1.3,
};
```

Also update backdrop duration:
```typescript
// FROM
withTiming(backdropOpacity, { duration: 200 })

// TO
withTiming(backdropOpacity, { duration: 350, easing: Easing.out(Easing.cubic) })
```

### Priority 2: motion.ts (Add Spring Constants)
Add standardized spring configs for app-wide consistency.

---

## Consistency Checklist

- [x] FullsizeTemplatePreview - ✅ Organic (already fixed)
- [ ] Modal.tsx fullScreen - ⚠️ Needs update (stiffness 380 → 180)
- [ ] Modal.tsx backdrop - ⚠️ Needs update (200ms → 350ms)
- [x] HabitsHeader buttons - ✅ Good
- [x] CreateHabitModal components - ✅ Using Motion constants
- [ ] motion.ts - Add Spring constants for standardization

---

## Implementation Tasks

### Phase 1: Fix Modal.tsx
- [ ] Update APPLE_SPRING_CONFIG spring values
- [ ] Update backdrop timing to 350ms
- [ ] Test templates screen transition

### Phase 2: Standardize Constants
- [ ] Add Springs object to motion.ts
- [ ] Document usage guidelines
- [ ] Gradually migrate components to use Springs

---

## Benchmark Reference

### Apple iOS Sheet Presentation
- Duration: ~400-500ms
- Spring: damping ~30-35, stiffness ~150-200
- Curve: ease-out deceleration
- Feel: Smooth, weighted, no jarring stops

### Current "Add Habit" Modal (Native)
- Uses `animationType='slide'` (native iOS animation)
- Feel: Perfect - use this as the benchmark

---

*Created: December 2024*
*Status: Ready for Implementation*
