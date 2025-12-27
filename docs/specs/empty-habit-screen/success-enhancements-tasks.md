# Success State Enhancements - Implementation Tasks

## Overview
Implementation tasks for the success celebration enhancements defined in `success-enhancements-spec.md`.

---

## Task 1: Add Animation Constants

**Priority**: High
**Estimated Effort**: Small
**Dependencies**: None

### Description
Add new animation constants for progress ring, particle burst, and tap hint pulse to the animations.ts file.

### Acceptance Criteria
- [ ] `PROGRESS_RING` constant with duration, size, strokeWidth, circumference
- [ ] `PARTICLE_BURST` constant with count, duration, distance, colors, staggerDelay
- [ ] `TAP_HINT_PULSE` constant with duration, minOpacity, maxOpacity, minScale, maxScale
- [ ] All values match spec exactly

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts`

---

## Task 2: Create ProgressRing Component

**Priority**: High
**Estimated Effort**: Medium
**Dependencies**: Task 1

### Description
Create a reusable SVG progress ring component that animates from 0 to 100% over a specified duration.

### Acceptance Criteria
- [ ] Renders SVG with background circle and animated fill circle
- [ ] Uses reanimated shared value for stroke-dashoffset animation
- [ ] Accepts `duration` prop (default: 1800ms)
- [ ] Accepts `size` prop (default: 120px)
- [ ] Respects reduced motion preference (completes instantly)
- [ ] Exports component from index

### Implementation Notes
- Use `react-native-svg` for SVG rendering
- Animate `strokeDashoffset` from circumference to 0
- Transform rotate -90deg to start from top

### Files to Create
- `src/features/habits/components/HabitsEmptyStateMinimal/ProgressRing.tsx`

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/index.ts` (export)

---

## Task 3: Create ParticleBurst Component

**Priority**: High
**Estimated Effort**: Medium
**Dependencies**: Task 1

### Description
Create a particle burst effect with 8 particles that explode outward from center.

### Acceptance Criteria
- [ ] Renders 8 circular particles in radial pattern (45° apart)
- [ ] Each particle animates: scale 0 → 1 → 0.5, opacity 1 → 0, translateX/Y outward
- [ ] Particles use staggered delays (25ms apart)
- [ ] Colors cycle through emerald, amber, violet, pink, blue
- [ ] Respects reduced motion (no particles rendered)
- [ ] Component is pointer-events: none

### Implementation Notes
- Calculate X/Y positions using Math.cos/sin for angles
- Use `withDelay` for stagger effect
- Each particle is an Animated.View with absolute positioning

### Files to Create
- `src/features/habits/components/HabitsEmptyStateMinimal/ParticleBurst.tsx`

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/index.ts` (export)

---

## Task 4: Add Pulsing Tap Hint Animation

**Priority**: Medium
**Estimated Effort**: Small
**Dependencies**: Task 1

### Description
Update the tap hint text to pulse gently, drawing attention to the skip affordance.

### Acceptance Criteria
- [ ] Tap hint fades in after 800ms delay
- [ ] After fade-in, begins infinite pulse loop
- [ ] Pulse: opacity 0.6 ↔ 1.0, scale 1.0 ↔ 1.02
- [ ] Pulse duration: 2s, ease-in-out
- [ ] Only renders when `autoTransition` is true
- [ ] Respects reduced motion (no pulse, just static text)

### Implementation Notes
- Use `withRepeat` with `reverse: true` for pulse loop
- Combine opacity and scale in single animated style

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/SuccessState.tsx`

---

## Task 5: Integrate ProgressRing into SuccessState

**Priority**: High
**Estimated Effort**: Small
**Dependencies**: Task 2

### Description
Add the progress ring around the success icon in SuccessState.

### Acceptance Criteria
- [ ] Progress ring wraps the success icon
- [ ] Ring is positioned absolutely behind icon
- [ ] Ring animation duration matches auto-transition delay (1800ms)
- [ ] Ring fades out during exit animation
- [ ] Ring freezes on tap-to-skip

### Implementation Notes
- Wrap icon container to include both ring and icon
- Pass `onComplete` callback to sync with auto-transition

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/SuccessState.tsx`

---

## Task 6: Integrate ParticleBurst into SuccessState

**Priority**: High
**Estimated Effort**: Small
**Dependencies**: Task 3

### Description
Add the particle burst effect that triggers on icon pop.

### Acceptance Criteria
- [ ] Particle burst renders inside icon container
- [ ] Burst triggers immediately on mount (with icon pop)
- [ ] Particles don't interfere with tap target
- [ ] Burst fades out during exit animation

### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/SuccessState.tsx`

---

## Task 7: Add Unit Tests

**Priority**: Medium
**Estimated Effort**: Medium
**Dependencies**: Tasks 2, 3, 4

### Description
Add unit tests for new components and animations.

### Acceptance Criteria
- [ ] ProgressRing renders with correct SVG attributes
- [ ] ParticleBurst renders 8 particles
- [ ] Reduced motion disables animations
- [ ] Animation constants have correct values

### Files to Create
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/ProgressRing.test.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/ParticleBurst.test.tsx`

---

## Task 8: Manual QA and Polish

**Priority**: High
**Estimated Effort**: Medium
**Dependencies**: Tasks 5, 6

### Description
Manual testing and polish pass on all devices.

### Acceptance Criteria
- [ ] Test on iOS simulator (iPhone 14, iPhone SE)
- [ ] Test on Android emulator (Pixel 4, low-end device)
- [ ] Verify 60fps during all animations
- [ ] Verify reduced motion works correctly
- [ ] Verify haptic timing feels right
- [ ] No layout shifts during animations
- [ ] Visual polish matches mockup

---

## Task Dependencies Graph

```
Task 1 (Constants)
    ├── Task 2 (ProgressRing)
    │       └── Task 5 (Integrate Ring)
    ├── Task 3 (ParticleBurst)
    │       └── Task 6 (Integrate Burst)
    └── Task 4 (Pulse Hint)

Tasks 2, 3, 4 → Task 7 (Tests)
Tasks 5, 6 → Task 8 (QA)
```

---

## Estimated Total Effort

| Task | Effort |
|------|--------|
| Task 1 | 15 min |
| Task 2 | 45 min |
| Task 3 | 45 min |
| Task 4 | 20 min |
| Task 5 | 15 min |
| Task 6 | 15 min |
| Task 7 | 60 min |
| Task 8 | 60 min |
| **Total** | **~4.5 hours** |
