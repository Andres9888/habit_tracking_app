# Phase 3: Migrate Legacy Animated API → react-native-reanimated

## Context

~25 files still use React Native's built-in `Animated` API instead of `react-native-reanimated`. Some also use the old spring model (`friction`/`tension`) instead of the modern `damping`/`stiffness` model. All new code uses reanimated, so these are legacy holdovers.

## Priority Files (most impactful)

Key files using legacy Animated:

1. `src/components/CreateHabitModal/components/SuccessAnimation/animationSequences.ts` — Animated.sequence, Animated.spring, Animated.timing
2. `src/components/DraggableHabit/highlightAnimations.ts` — Animated.parallel, Animated.spring, Animated.loop
3. `src/components/DraggableHabit/recordAnimations.ts` — Animated.parallel, Animated.spring with friction/tension
4. `src/components/CalendarTimeline/components/CheckBadge.tsx` — Animated.spring with friction/tension
5. `src/components/CreateHabitModal/components/ReminderSelector/useButtonAnimations.ts` — Animated.spring, Animated.sequence

## Tasks

- [x] Migrate `src/components/CreateHabitModal/components/ReminderSelector/useButtonAnimations.ts` from legacy `Animated` to `react-native-reanimated`. Replace `Animated.Value` with `useSharedValue`, `Animated.spring` with `withSpring`, `Animated.sequence` with `withSequence`, `Animated.timing` with `withTiming`. Convert `friction: 10, tension: 300` to equivalent `damping`/`stiffness` values (approx `damping: 18, stiffness: 150` from the design system `springs.button`). Use `CARD_PRESS_SCALE` (0.97) instead of hardcoded 0.96. Update any consuming components to use `useAnimatedStyle` instead of `style={{ transform: [{ scale: scaleAnim }] }}`. Verify with tsc. ✅ Completed: Migrated hook + ReminderOptionButton consumer + added 6-test suite. Commit cbc86fb3f.

- [x] Migrate `src/components/CalendarTimeline/components/CheckBadge.tsx` from legacy `Animated` to `react-native-reanimated`. Convert `Animated.spring` with `friction`/`tension` params to `withSpring` with `damping`/`stiffness`. Verify with tsc. ✅ Completed: Migrated to reanimated with `springs.bouncy` (damping: 10, stiffness: 180), separated static/animated styles, added 6-test suite. Zero regressions.

- [x] Migrate `src/components/DraggableHabit/highlightAnimations.ts` from legacy `Animated` to reanimated. Convert `Animated.parallel` to concurrent `withSpring`/`withTiming` calls, `Animated.loop` to reanimated's `withRepeat`. Verify with tsc. ✅ Completed: Migrated `highlightGlow` and `iconPulse` to reanimated SharedValue with `withSequence`/`withTiming`/`withRepeat`. Updated 8 files across the DraggableHabit component tree (highlightAnimations, useHighlightAnimation, useIconPulse, useDraggableHabitAnimations, DraggableHabitCard types+component, CardHeader, animationSequences barrel). cardScale remains legacy Animated.Value (shared with press handlers and record animations — next task). Added 6-test suite. Zero regressions. Commit f2ce022f1.

- [x] Migrate `src/components/DraggableHabit/recordAnimations.ts` from legacy `Animated` to reanimated. Convert `friction`/`tension` spring params to `damping`/`stiffness`. Verify with tsc. ✅ Completed: Migrated recordAnimations + all remaining DraggableHabit hooks (usePressHandlers, useEntranceAnimation, useNewRecordAnimation, NewRecordBadge, DraggableHabitCard, cardStyles, types). Replaced Animated.parallel/spring/timing with withSpring/withTiming/withSequence using design system tokens (springs.bouncy/standard/button, durations.standard). All SharedValue types, no legacy Animated.Value remaining. Added 7-test suite. Commit 8b4226552.

- [x] Migrate `src/components/CreateHabitModal/components/SuccessAnimation/animationSequences.ts` from legacy `Animated` to reanimated. This is a more complex file with multi-step sequences — use `withSequence`, `withDelay`, `withSpring`, `withTiming` from reanimated. Verify with tsc and test the success animation visually. ✅ Completed: Migrated entire SuccessAnimation component tree (6 files). animationSequences.ts: replaced Animated.sequence/parallel with withDelay/withSpring/withTiming, renamed to run\* functions that mutate SharedValues directly. useSuccessAnimations.ts: converted to useSharedValue + runOnJS for exit callback. SuccessAnimation.tsx: switched to Reanimated.View + useAnimatedStyle. SuccessCard.tsx: replaced Animated.View/Value with Reanimated.View/SharedValue + 4 useAnimatedStyle hooks. ConfettiParticle.tsx: replaced Animated.Value refs with useSharedValue, parallel timings with direct withDelay+withTiming, interpolate with template literal rotation. Uses design system springs.bouncy/standard. Added 13-test suite. Zero regressions. Commit 22618a326.

- After all migrations, search for remaining `from 'react-native'` imports of `Animated` to identify any remaining legacy usage. These are lower priority but should be tracked.
