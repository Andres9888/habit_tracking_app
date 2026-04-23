# Habit Details Page — Reduce Bouncy Entrance Animations

## Context

The habit details screen feels too bouncy on entry. Exploration shows the screen is composed of ~10 sections that all animate in using Reanimated's `FadeInDown.duration(280).springify().damping(18-22)` or `FadeInUp.duration(280).springify().damping(18-22)` pattern. The `.springify()` modifier converts the fade+translate into spring physics — at damping 18, a short (280ms) entrance with a translateY offset can visibly overshoot, producing the "bouncy" feel. Multiple staggered elements compound the effect.

The theme system in `src/theme/animations.ts` has well-defined duration and easing presets (e.g. `durations.enter: 280`, `easings.standard`) but entrance components bypass them in favor of `.springify()`.

## Files to modify

All use `.springify().damping(X)` on screen entrance. Goal: replace with ease-out timing (no spring), matching the design system comment "Entry motion: fade + translateY, 280ms ease-out".

1. `src/screens/HabitDetail/components/DetailHero/DetailHero.tsx:20`
2. `src/screens/HabitDetail/components/YearHeatmapSection/YearHeatmapSection.tsx:16`
3. `src/screens/HabitDetail/components/SectionLabel/SectionLabel.tsx:19`
4. `src/screens/HabitDetail/components/GoalWhyAnchor/GoalWhyAnchor.tsx:24`
5. `src/screens/HabitDetail/components/GoalTabEmptyState.tsx:44`
6. `src/screens/HabitDetail/components/GoalTabContent.tsx:30,45`
7. `src/screens/HabitDetail/components/HabitDetailContent.tsx:63`
8. `src/screens/HabitDetail/components/CalendarTabContent.tsx:24`

(Paths to be verified during exploration — names from investigation summary.)

Leave alone:
- `DetailViewTabs.tsx` tab indicator — `withSpring(springs.standard)` is a positional animation, not an entrance, and damping 18 at short distances reads as snappy, not bouncy.
- `HeaderButton` press feedback — tap interactions should stay spring.
- `GoalCoachLine` — already uses `FadeIn` (no spring, no translateY).

## Approach

Replace `.springify().damping(X)` with `.easing(Easing.out(Easing.cubic))` on all entrance animations. Keep durations and delays as-is to preserve stagger rhythm.

**Before:**
```ts
entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
```

**After:**
```ts
entering={FadeInDown.duration(280).delay(100).easing(Easing.out(Easing.cubic))}
```

Add `Easing` to the `react-native-reanimated` import in each file.

## Verification

1. Open the app in the simulator, navigate to any habit's detail screen.
2. Watch entrance — sections should fade/slide in smoothly without overshoot.
3. Switch between Calendar / Strength / Goal tabs — tab indicator should still feel snappy (unchanged).
4. Press header buttons — scale feedback should still feel springy (unchanged).
5. Run `npx tsc --noEmit` to confirm no type errors.
