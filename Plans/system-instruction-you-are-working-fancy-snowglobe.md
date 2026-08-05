# Subtle Scroll Hints — Additional Ideas

## Context

The CreateHabit modal already has two subtle scrollability hints:

1. **Static chevron** — `ScrollForMoreHint.tsx` renders a 14px `ChevronDown` (lucide) at the bottom-center of the ScrollView, in `colors.text.tertiary`, with opacity interpolated 0→0.5 based on remaining scroll distance (8px → 48px window).
2. **Native indicator flash** — `CreateHabitModalCentered.tsx:60` calls `flashScrollIndicators()` ~350ms after the modal opens.

The user wants to add **one more very small hint** to reinforce scrollability without making it loud. The hint must be subtle — not a banner, not a tooltip, not text.

**Files in play:**
- `src/components/CreateHabitModal/components/ScrollForMoreHint.tsx` (existing chevron)
- `src/components/CreateHabitModal/components/CreateHabitScrollContent.tsx` (mounts the hint)
- `src/components/CreateHabitModal/CreateHabitModalCentered.tsx` (modal open + flash trigger)

---

## Candidate Hints (ranked by signal-to-noise)

### Option A — Gentle bounce loop on the existing chevron ⭐ recommended
A slow, low-amplitude vertical bounce (translateY ±2px, ~1.4s loop, ease in/out) on the chevron. Loop only runs while opacity > 0, so it fades out naturally near the bottom.
- **Why it fits:** Reuses the chevron we already have — zero new visual elements. Motion is the cheapest way to communicate "you can move."
- **Cost:** ~10 lines via `withRepeat(withTiming(...))` in `ScrollForMoreHint.tsx`.
- **Risk:** Loop animations on accessibility-reduced-motion need a `useReducedMotion()` guard.

### Option B — Soft gradient fade at the bottom edge
A 20–24px tall `expo-linear-gradient` strip overlaid at the bottom of the ScrollView, fading from transparent → modal background color. Implies content is being clipped.
- **Why it fits:** Classic affordance ("there's more under the fold"). Static, no animation.
- **Cost:** New `ScrollFadeMask` component (~25 lines) + import in `CreateHabitScrollContent.tsx`. Needs background color match from theme.
- **Risk:** If the background isn't a flat color, the mask edges can look mismatched.

### Option C — Second chevron stacked (» style)
Replace the single chevron with two stacked chevrons (4–5px vertical gap, second one at ~60% opacity of the first). Reads as "keep going down."
- **Why it fits:** Same component, same color, just adds one more `<ChevronDown />`. Very small visual change.
- **Cost:** ~5 lines in `ScrollForMoreHint.tsx`.
- **Risk:** Can read as "page down" rather than "scroll" — slightly more directive than current hint.

### Option D — Periodic re-flash of native scroll indicator
Re-call `flashScrollIndicators()` once more after ~3.5s if the user hasn't scrolled yet. Uses the native scrollbar that already exists.
- **Why it fits:** Zero new visual chrome. Pure timer + native API.
- **Cost:** ~10 lines in `CreateHabitModalCentered.tsx`, tracking scroll state.
- **Risk:** Android scroll indicators are less prominent than iOS — weaker signal there.

### Option E — One-time entrance pulse on the chevron
On mount, the chevron does a single 600ms scale pulse (0.8 → 1.1 → 1.0) to catch the eye, then stays static.
- **Why it fits:** Draws attention exactly once, then disappears as a recurring element.
- **Cost:** ~8 lines using `withSequence` in `ScrollForMoreHint.tsx`.
- **Risk:** Single pulses can be missed if the modal mounts during user blink/transition.

---

## Recommendation

**Option A (gentle bounce loop)** has the best ratio of "noticed" to "annoying." It piggybacks on the chevron already present, costs ~10 lines, and motion is what the eye picks up in peripheral vision. Pair it with a `useReducedMotion()` guard so the static chevron remains the fallback.

If A feels too much, **Option B (gradient fade)** is the next-most-subtle — purely static, no motion, but adds a new component.

## Implementation Sketch (Option A)

In `ScrollForMoreHint.tsx`:

```ts
// add at top
import { useEffect } from 'react';
import { useReducedMotion, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

// inside component
const bounce = useSharedValue(0);
const reduced = useReducedMotion();

useEffect(() => {
  if (reduced) return;
  bounce.value = withRepeat(
    withSequence(
      withTiming(2, { duration: 700 }),
      withTiming(0, { duration: 700 })
    ),
    -1,
    false
  );
}, [bounce, reduced]);

const wrapStyle = useAnimatedStyle(() => {
  // ...existing opacity calc...
  return {
    opacity,
    transform: [{ translateY: bounce.value }],
  };
});
```

## Verification

1. Open the CreateHabit modal on a device tall enough that content fits, and one where it overflows.
2. Confirm the chevron only animates when there's scroll room remaining (opacity > 0).
3. Toggle iOS "Reduce Motion" in Settings → Accessibility — animation should stop, chevron remains static.
4. Scroll to bottom — bounce and chevron both fade out smoothly.

---

## Open Questions for the User

1. Which option do you want — A, B, C, D, or E?
2. If A: bounce amplitude (1px, 2px, 3px)?
3. Should the new hint apply only to the CreateHabit modal, or also other scrollable surfaces (e.g. `FullsizeTemplatePreview`, `TodaysFocusCard`)?
