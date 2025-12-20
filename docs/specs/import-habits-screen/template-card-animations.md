# Template Card Animation Enhancement Specification

## Problem Statement

The current template card animations in the Import Habits screen are basic and lack the polish expected in a premium habit tracking app. The animations need enhancement to:

1. Create a more engaging, delightful user experience
2. Provide better visual feedback during interactions
3. Guide user attention to key actions (Import button)
4. Make the browsing experience feel fluid and responsive

---

## Current State Analysis

### CollapsibleCategorySection.tsx

**Current Animation (lines 138-141)**:
```tsx
<Animated.View
  entering={FadeIn.duration(200)}
  exiting={FadeOut.duration(150)}
  style={styles.content}
>
```

**Issues**:
- Simple fade in/out - no spatial animation
- Cards appear all at once, no stagger
- No connection to the expand/collapse chevron animation
- Abrupt appearance doesn't feel organic

### MiniTemplateCard.tsx

**Current Animation (lines 53-65)**:
```tsx
const pressScale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: pressScale.value }],
}));

const handlePressIn = () => {
  pressScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
};
```

**Issues**:
- Only has press scale animation
- No entrance animation
- No hover/focus states
- Import button lacks animation feedback
- Research badge is static

### TemplateCard.tsx (View All tab)

**Current Animation (lines 118-137)**:
```tsx
const skipAnimation = animationIndex === 0;
const cardOpacity = useSharedValue(skipAnimation ? 1 : 0);
const cardTranslateY = useSharedValue(skipAnimation ? 0 : 20);

useEffect(() => {
  if (skipAnimation) return;
  const delay = animationIndex * 80;
  cardOpacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
  cardTranslateY.value = withDelay(delay, withSpring(0, { damping: 18 }));
}, [animationIndex]);
```

**Issues**:
- Stagger animation works but is disabled by default (animationIndex=0)
- No horizontal entrance (cards slide from bottom only)
- Icon glow is static, could pulse subtly
- No celebration/success animation after import

---

## Proposed Animation Improvements

### 1. Category Section Expansion Animation

**Goal**: Make category expansion feel like cards are "sliding out" from the header

```
Before (collapsed):
┌─────────────────────────────────┐
│ 💪 Health & Fitness         ▼  │
└─────────────────────────────────┘

After (expanding):
┌─────────────────────────────────┐
│ 💪 Health & Fitness         ▲  │
├─────────────────────────────────┤
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐   │
│  │ 1 │→ │ 2 │→ │ 3 │→ │ 4 │→→ │
│  └───┘  └───┘  └───┘  └───┘   │
└─────────────────────────────────┘
     ↑
  Cards slide in from left with stagger
```

**Implementation**:
```tsx
// Staggered entrance for each MiniTemplateCard
entering={SlideInRight
  .delay(index * 50)  // 50ms stagger
  .springify()
  .damping(18)
  .stiffness(120)
}

// Container uses FadeIn for the wrapper
<Animated.View entering={FadeIn.duration(150)}>
  <ScrollView horizontal ...>
    {templates.map((template, index) => (
      <Animated.View
        key={template._id}
        entering={SlideInRight.delay(index * 50).springify()}
      >
        <MiniTemplateCard ... />
      </Animated.View>
    ))}
  </ScrollView>
</Animated.View>
```

### 2. MiniTemplateCard Press Feedback

**Goal**: Multi-layer feedback that feels tactile

**Current**: Simple scale down
**Proposed**: Scale + shadow lift + subtle rotation

```tsx
const handlePressIn = () => {
  pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  shadowElevation.value = withTiming(8, { duration: 100 });
  rotation.value = withSpring(-0.5, { damping: 20, stiffness: 400 }); // subtle tilt
};

const handlePressOut = () => {
  pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
  shadowElevation.value = withTiming(3, { duration: 150 });
  rotation.value = withSpring(0, { damping: 15, stiffness: 300 });
};

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: pressScale.value },
    { rotate: `${rotation.value}deg` },
  ],
  shadowOpacity: interpolate(shadowElevation.value, [3, 8], [0.08, 0.15]),
  elevation: shadowElevation.value,
}));
```

### 3. Import Button Animation

**Goal**: Draw attention to the primary action and celebrate success

**A. Idle State - Subtle Pulse**:
```tsx
// Subtle breathing animation on the import button
const pulseScale = useSharedValue(1);

useEffect(() => {
  pulseScale.value = withRepeat(
    withSequence(
      withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ),
    -1, // infinite
    true
  );
}, []);
```

**B. Press Feedback**:
```tsx
// On press, scale down with haptic
const handleImportPress = () => {
  buttonScale.value = withSequence(
    withTiming(0.9, { duration: 80 }),
    withSpring(1, { damping: 10, stiffness: 200 })
  );
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};
```

**C. Success Animation**:
```tsx
// After successful import, show checkmark with celebration
const handleImportSuccess = () => {
  // 1. Checkmark appears with scale
  checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });

  // 2. Card border glows
  glowOpacity.value = withSequence(
    withTiming(0.6, { duration: 200 }),
    withTiming(0, { duration: 800 })
  );

  // 3. Confetti particles (optional - using Lottie or custom)
  // 4. Card fades/slides out if removing from list
};
```

### 4. Research Badge Animation

**Goal**: Subtle attention-getter for science-backed habits

```tsx
// Shimmer effect on research badge
const shimmerTranslate = useSharedValue(-100);

useEffect(() => {
  shimmerTranslate.value = withRepeat(
    withTiming(100, { duration: 2000, easing: Easing.linear }),
    -1,
    false
  );
}, []);

// Shimmer overlay using LinearGradient with translateX animation
```

### 5. Scroll Reveal Animation

**Goal**: Cards that aren't visible initially animate in when scrolled into view

**Option A**: Use `entering` with scroll position check
**Option B**: Implement intersection observer pattern with Reanimated

```tsx
// Using Layout animations
<Animated.View
  layout={Layout.springify().damping(18)}
  entering={FadeInRight.delay(50).springify()}
>
```

### 6. Category Header Micro-interactions

**Current**: Chevron rotates, header scales
**Enhancement**: Add icon bounce when expanding

```tsx
// When category expands, the icon "jumps" slightly
const iconBounce = useAnimatedStyle(() => ({
  transform: [
    {
      translateY: withSpring(isExpanded ? -3 : 0, { damping: 8, stiffness: 300 })
    },
    {
      scale: withSpring(isExpanded ? 1.1 : 1, { damping: 10, stiffness: 200 })
    }
  ],
}));
```

---

## Animation Timing Reference

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Category expand | 200ms | spring(18, 120) | Smooth reveal |
| Card stagger | 50ms delay each | spring(18, 120) | 5 cards = 250ms total |
| Press scale | 80ms down, spring up | spring(15, 200) | Snappy feedback |
| Import success | 400ms | spring(8, 150) | Celebratory |
| Shimmer cycle | 2000ms | linear | Subtle, continuous |
| Exit/collapse | 150ms | ease-out | Quick, not distracting |

---

## Implementation Phases

### Phase 1: Category Expansion Polish (High Impact)
- [x] Add staggered `SlideInRight` to MiniTemplateCards
  - **Completed**: Implemented with 50ms stagger delay per card, capped at 400ms max. Uses `SlideInRight.springify().damping(18).stiffness(120)` for smooth spring animation. Respects reduced motion accessibility setting.
- [x] Add icon bounce on category expansion
  - **Completed**: Added bouncing effect (-4px translateY + 1.15x scale) when expanding categories. Only triggers on expand, not collapse. Uses `withSequence` for natural settle animation.
- [x] Improve exit animation timing
  - **Completed**: Added `SlideOutLeft` with staggered delays (30ms per card, capped at 200ms) and 150ms duration for quick, non-distracting collapse animation.

### Phase 2: Card Interaction Enhancement
- [x] Add rotation + shadow lift to press feedback
  - **Completed**: Enhanced press feedback with scale (0.97), subtle rotation (-0.5deg tilt), and dynamic shadow elevation (3→8). Uses `withSpring` for snappy, tactile feel. Respects reduced motion accessibility setting by only applying scale when reduced motion is enabled.
- [x] Add subtle idle pulse to Import button
  - **Completed**: Added continuous breathing animation (1→1.03 scale) with 1500ms duration using `Easing.inOut(Easing.ease)`. Animation automatically stops when importing/imported, and properly cleans up on unmount with `cancelAnimation()`.
- [x] Add success checkmark animation after import
  - **Completed**: Added new `isImported` prop with full success state animation:
    - Checkmark icon appears with spring animation (damping: 8, stiffness: 150)
    - Green success glow overlay flashes (0→0.6→0 opacity over 1s)
    - Button changes to green (#22c55e) with "Added" label and Check icon
    - Left accent bar also changes to green
    - Pulse animation stops on success
    - All animations respect reduced motion settings

### Phase 3: Visual Polish
- [x] Add shimmer effect to Research badge
  - **Completed**: Added animated shimmer overlay to MiniTemplateCard's research badge using expo-linear-gradient. The shimmer moves horizontally (from -120 to 120 translateX) in a 2-second infinite loop with linear easing. Uses AnimatedLinearGradient with colors transitioning through transparent→iconColor(20%)→transparent for a subtle glass-like highlight. Animation properly respects reduced motion settings and includes cleanup with `cancelAnimation()` on unmount.
- [x] Add scroll reveal animation for cards entering viewport
  - **Completed**: Added `enableScrollReveal` prop to TemplateCard component (default: false). When enabled, cards animate in with `FadeInUp` spring animation (350ms duration, damping: 18, stiffness: 120) as they enter the FlatList viewport. This leverages Reanimated's entering animation which triggers when components mount during FlatList's virtualized rendering. Enabled for "View All" tab in TemplatesScreen. Respects reduced motion accessibility setting with instant appearance fallback via `FadeIn.duration(0)`.
- [ ] Add glow effect on successful import

### Phase 4: Performance & Accessibility
- [ ] Test animations with `useReducedMotion` hook
- [ ] Ensure all animations respect accessibility settings
- [ ] Profile animation performance on low-end devices
- [ ] Add `cancelAnimation()` cleanup in useEffect returns

---

## Technical Considerations

### Performance
- Use `useAnimatedStyle` for all transform animations
- Avoid animating layout properties (width, height, padding)
- Use `runOnJS` sparingly - keep logic on UI thread
- Consider `useDerivedValue` for computed animations

### Accessibility
```tsx
import { useReducedMotion } from 'react-native-reanimated';

const reducedMotion = useReducedMotion();

// Disable or simplify animations when reduced motion is enabled
entering={reducedMotion ? FadeIn.duration(0) : SlideInRight.springify()}
```

### Cleanup
```tsx
useEffect(() => {
  // Start animation
  pulseScale.value = withRepeat(...);

  // Cleanup on unmount
  return () => {
    cancelAnimation(pulseScale);
  };
}, []);
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/CollapsibleCategorySection.tsx` | Staggered entrance, icon bounce, improved exit |
| `src/components/MiniTemplateCard.tsx` | Enhanced press feedback, import animations |
| `src/components/TemplateCard.tsx` | Consistent entrance, success state |
| `src/hooks/useReduceMotion.ts` | Already exists - ensure usage |

---

## Animation Inspiration

Reference animations from:
- **Linear App** - Smooth card transitions, subtle hover states
- **Things 3** - Satisfying completion animations
- **Stripe Dashboard** - Elegant micro-interactions
- **Apple Fitness+** - Celebration moments

---

## Success Metrics

1. **Perceived performance**: App feels faster due to animation masking load times
2. **Engagement**: Users browse more templates (dwell time increases)
3. **Completion**: More templates imported (action feels rewarding)
4. **Polish perception**: Users rate the app as more "premium"

---

## Open Questions

1. Should cards that were just imported animate out of the list, or stay with a "Added" state?
2. Should we add sound effects for import success (optional, with toggle)?
3. Maximum stagger delay for categories with 10+ templates?
4. Should the shimmer on research badge be permanent or one-time on scroll-into-view?
