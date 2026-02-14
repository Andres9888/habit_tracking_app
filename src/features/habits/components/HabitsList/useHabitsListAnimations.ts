/**
 * HabitsList Entrance Animations Hook
 * Handles staggered entrance animations for header, calendar, and habit rows
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const ENTRANCE_ANIMATION_DURATION_MS = 350;
const INITIAL_TRANSLATE_Y = 20;
const STAGGER_DELAY_MS = 100;
const POST_ANIMATION_CALLBACK_DELAY_MS = 200;
const INITIAL_OPACITY = 0;
const FINAL_OPACITY = 1;
const FINAL_TRANSLATE_Y = 0;

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
      duration: ENTRANCE_ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    };

    headerOpacity.setValue(INITIAL_OPACITY);
    headerTranslateY.setValue(INITIAL_TRANSLATE_Y);
    calendarOpacity.setValue(INITIAL_OPACITY);
    calendarTranslateY.setValue(INITIAL_TRANSLATE_Y);
    habitRowOpacity.setValue(INITIAL_OPACITY);
    habitRowTranslateY.setValue(INITIAL_TRANSLATE_Y);

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationRef.current = Animated.stagger(STAGGER_DELAY_MS, [
      Animated.parallel([
        Animated.timing(headerOpacity, { ...config, toValue: FINAL_OPACITY }),
        Animated.timing(headerTranslateY, {
          ...config,
          toValue: FINAL_TRANSLATE_Y,
        }),
      ]),
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          ...config,
          toValue: FINAL_OPACITY,
        }),
        Animated.timing(calendarTranslateY, {
          ...config,
          toValue: FINAL_TRANSLATE_Y,
        }),
      ]),
      Animated.parallel([
        Animated.timing(habitRowOpacity, { ...config, toValue: FINAL_OPACITY }),
        Animated.timing(habitRowTranslateY, {
          ...config,
          toValue: FINAL_TRANSLATE_Y,
        }),
      ]),
    ]);

    animationRef.current.start(() => {
      animationTimeoutRef.current = setTimeout(
        () => setShouldTriggerHabitEntrance(true),
        POST_ANIMATION_CALLBACK_DELAY_MS
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
