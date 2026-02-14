/**
 * HabitsList Entrance Animations Hook
 * Handles staggered entrance animations for header, calendar, and habit rows
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Animated values and state setters used by the HabitsList entrance sequence.
 */
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

/**
 * Encapsulates the success-to-list transition animation choreography.
 *
 * Resets header, calendar, and row animated values, then plays a staggered
 * sequence and re-enables habit entrance behavior when complete.
 */
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

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

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

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationRef.current = Animated.stagger(100, [
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
    ]);

    animationRef.current.start(() => {
      animationTimeoutRef.current = setTimeout(
        () => setShouldTriggerHabitEntrance(true),
        200
      );
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
