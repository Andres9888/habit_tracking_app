/**
 * HabitsList Entrance Animations Hook
 * Handles staggered entrance animations for header, calendar, and habit rows
 */

import { useCallback } from 'react';
import { Animated, Easing } from 'react-native';

interface UseHabitsListAnimationsOptions {
  headerOpacity: Animated.Value;
  headerTranslateY: Animated.Value;
  calendarOpacity: Animated.Value;
  calendarTranslateY: Animated.Value;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
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
    const config = {
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    };

    headerOpacity.setValue(0);
    headerTranslateY.setValue(20);
    calendarOpacity.setValue(0);
    calendarTranslateY.setValue(20);
    habitRowOpacity.setValue(0);
    habitRowTranslateY.setValue(20);

    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(headerOpacity, { ...config, toValue: 1 }),
        Animated.timing(headerTranslateY, { ...config, toValue: 0 }),
      ]),
      Animated.parallel([
        Animated.timing(calendarOpacity, { ...config, toValue: 1 }),
        Animated.timing(calendarTranslateY, { ...config, toValue: 0 }),
      ]),
      Animated.parallel([
        Animated.timing(habitRowOpacity, { ...config, toValue: 1 }),
        Animated.timing(habitRowTranslateY, { ...config, toValue: 0 }),
      ]),
    ]).start(() => {
      setTimeout(() => setShouldTriggerHabitEntrance(true), 200);
    });
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
