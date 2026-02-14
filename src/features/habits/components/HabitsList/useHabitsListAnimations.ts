/**
 * HabitsList Entrance Animations Hook
 * Handles staggered spring-physics entrance animations for header, calendar, and habit rows.
 *
 * Uses react-native-reanimated withSpring for natural, premium-feeling transitions.
 */

import { useCallback } from 'react';
import {
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
  type SharedValue,
  Easing,
} from 'react-native-reanimated';

/** Spring config matching the app's design system: springify().damping(18) */
const LIST_SPRING_CONFIG = {
  damping: 18,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/** Stagger delay between header → calendar → habit rows */
const STAGGER_MS = 80;

interface UseHabitsListAnimationsOptions {
  headerOpacity: SharedValue<number>;
  headerTranslateY: SharedValue<number>;
  calendarOpacity: SharedValue<number>;
  calendarTranslateY: SharedValue<number>;
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  setIsInSuccessCelebration: (value: boolean) => void;
  setShouldTriggerHabitEntrance: (value: boolean) => void;
}

export function useHabitsListAnimations(
  options: UseHabitsListAnimationsOptions
) {
  const {
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    habitRowOpacity,
    habitRowTranslateY,
    setIsInSuccessCelebration,
    setShouldTriggerHabitEntrance,
  } = options;

  const handleSuccessTransitionComplete = useCallback(() => {
    setIsInSuccessCelebration(false);

    // Reset all values to their starting positions
    headerOpacity.value = 0;
    headerTranslateY.value = 16;
    calendarOpacity.value = 0;
    calendarTranslateY.value = 16;
    habitRowOpacity.value = 0;
    habitRowTranslateY.value = 16;

    // Phase 1: Header springs in
    const fadeConfig = { duration: 280, easing: Easing.out(Easing.cubic) };

    headerOpacity.value = withTiming(1, fadeConfig);
    headerTranslateY.value = withSpring(0, LIST_SPRING_CONFIG);

    // Phase 2: Calendar springs in (staggered)
    calendarOpacity.value = withDelay(STAGGER_MS, withTiming(1, fadeConfig));
    calendarTranslateY.value = withDelay(
      STAGGER_MS,
      withSpring(0, LIST_SPRING_CONFIG)
    );

    // Phase 3: Habit rows spring in (staggered further)
    const rowDelay = STAGGER_MS * 2;
    habitRowOpacity.value = withDelay(rowDelay, withTiming(1, fadeConfig));
    habitRowTranslateY.value = withDelay(
      rowDelay,
      withSpring(0, LIST_SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(setShouldTriggerHabitEntrance)(true);
        }
      })
    );
  }, [
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    habitRowOpacity,
    habitRowTranslateY,
    setIsInSuccessCelebration,
    setShouldTriggerHabitEntrance,
  ]);

  return { handleSuccessTransitionComplete };
}
