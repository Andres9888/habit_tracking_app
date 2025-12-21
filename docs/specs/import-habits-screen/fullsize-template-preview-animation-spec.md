# Fullsize Template Preview - Entrance Animation Spec

## Status: COMPLETED

## Problem
The FullsizeTemplatePreview modal entrance animation was too quick and didn't feel organic/premium.

## Solution
Improved spring physics and timing for Apple-like organic feel.

---

## Animation Changes

### Before (Too Quick)

| Phase | Duration/Config |
|-------|-----------------|
| Backdrop | 200ms linear |
| Content slide | damping: 22, stiffness: 300 |
| Content opacity | 300ms |
| Close button | delay 100ms, 200ms |
| Icon scale | delay 150ms, damping 12, stiffness 150 |
| Icon glow | delay 250ms, stiffness 80 |

### After (Organic/Apple-like)

| Phase | Duration/Config | Reason |
|-------|-----------------|--------|
| Backdrop | 350ms, cubic ease-out | Smooth, unhurried fade |
| Content slide | damping: 28, stiffness: 180, mass: 1.2 | Slower, more weight |
| Content opacity | 400ms, cubic ease-out | Gradual reveal |
| Close button | delay 200ms, 300ms | Better choreography |
| Icon scale | delay 250ms, damping: 14, stiffness: 120, mass: 0.9 | Gentle bounce |
| Icon glow | delay 400ms, stiffness: 60 | Slow, organic pulse |

---

## Spring Physics Explained

- **Higher damping** = Less bounce, more controlled
- **Lower stiffness** = Slower movement, more organic
- **Higher mass** = More momentum/weight, feels substantial
- **Longer delays** = Better choreographed reveal sequence
- **Cubic easing** = Smooth acceleration/deceleration

---

## Code Location

`src/components/FullsizeTemplatePreview.tsx` - Lines 188-241

```typescript
// Apple-like organic entrance animation
// Phase 1: Backdrop fade in (smooth 350ms)
backdropOpacity.value = withTiming(0.5, {
  duration: 350,
  easing: Easing.out(Easing.cubic)
});

// Phase 2: Content slides up with organic spring (iOS sheet style)
contentTranslateY.value = withSpring(0, {
  damping: 28,      // Higher damping = less bounce
  stiffness: 180,   // Lower stiffness = slower, more organic
  mass: 1.2,        // Slightly heavier = more momentum
});

// ... etc
```

---

## Files Modified

- `src/components/FullsizeTemplatePreview.tsx`

---

*Completed: December 2024*
