# Improve SoundPicker Closing Animation

## Context
PR #1297 polished the SoundPicker **opening** animation: tray fades down (`FadeInDown.duration(280)`) and pills fade in with a 60ms stagger. The **closing** animation is still a single, abrupt `FadeOutUp.duration(150)` applied only to the outer container — pills collapse uniformly with the parent, with no mirror to the staggered reveal. The result feels flat compared to the polished entry. We want the close to feel as intentional as the open while staying inside the design system's motion tokens.

## Current State
File: `src/components/SettingsModal/SoundPicker.tsx:35-38`

```tsx
<Animated.View
  entering={FadeInDown.duration(280)}
  exiting={FadeOutUp.duration(150)}
>
```

Pills (lines 52-56) only declare `entering`, no `exiting`. When the user disables completion sounds, the whole tray vanishes in 150ms with everything fading at once.

## Design System Constraints
From `src/theme/animations.ts`:
- Exit motion is `quick` = 150ms (small fades) or `reveal` = 180ms (slightly softer)
- Stagger is 60ms, max 5 items
- "Exit animations, small fades" → 150ms is the canonical exit duration

## Recommended Approach
Mirror the entry's two-layer choreography in reverse so the pills "peel away" before the tray collapses, while keeping every value inside the existing design tokens.

### Change 1 — Pills get a reverse-staggered exit
`SoundPicker.tsx:52-56`: add `exiting` prop to each `Animated.View` pill.

```tsx
<Animated.View
  key={key}
  className="flex-1"
  entering={FadeIn.duration(200).delay(120 + index * 60)}
  exiting={FadeOut.duration(120).delay((OPTIONS.length - 1 - index) * 40)}
>
```

- `FadeOut` (no Y translate) keeps pills feeling like they're being "switched off" rather than flying
- 120ms fade fits inside the 150ms quick token budget
- Reverse 40ms stagger (rightmost pill leaves first) is a tighter version of the entry's 60ms stagger — exits should feel snappier than entries per the spec
- Total pill choreography ≈ 200ms, finishing as the tray's 150ms fade-up completes

### Change 2 — Import `FadeOut`
`SoundPicker.tsx:6`: add `FadeOut` to the reanimated import.

```tsx
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp } from 'react-native-reanimated';
```

### Change 3 — Leave the tray exit unchanged
Keep `FadeOutUp.duration(150)` on the outer container. It already mirrors the entry direction (down-in / up-out) and matches the design system's quick exit token. Adding scale or longer durations would violate the "exits should feel snappier than entries" guideline.

## Why not other options I considered
- **Lengthen container fade to 180ms+** — drifts from the `quick` token and makes dismissal feel sluggish. Exits should be faster than entries, not symmetric in duration.
- **Add scale/spring to the tray exit** — breaks the recent design-system alignment that PR #1297 deliberately introduced (it removed the springify bounce).
- **Forward stagger on close (matching entry order)** — visually less satisfying. Reverse stagger reads as "undoing" the entry, which is the right semantic for a close.

## Critical Files
- `src/components/SettingsModal/SoundPicker.tsx` — only file modified

## Verification
1. Run the app: `npm run ios` (or use the iOS simulator already attached via `mcp__react-native-debugger`)
2. Open Settings → toggle "Completion sound" ON → watch entry (should match current polished behavior, unchanged)
3. Toggle "Completion sound" OFF → pills should fade out right-to-left over ~200ms, with the tray collapsing upward at the same time
4. Toggle rapidly to confirm no flicker or stuck pill states
5. Run `npm run lint` to confirm no max-lines or import warnings on the touched file (file stays well under 100 lines)
