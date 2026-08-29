import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import {
  runBreathingTransition,
  runCompletionTransition,
  snapDayToggleAnimations,
} from './useHabitDayToggleAnimations.helpers';
import type { UseHabitDayToggleAnimationsParams } from './useHabitDayToggleAnimations.types';

export function useHabitDayToggleAnimations({
  completed,
  dateString,
  isToday,
}: UseHabitDayToggleAnimationsParams) {
  const reduceMotion = useReduceMotion();
  const completion = useSharedValue(completed ? 1 : 0);
  const buttonScale = useSharedValue(1);
  const breathingScale = useSharedValue(1);
  const prevCompletedRef = useRef<boolean | null>(null);
  const prevDateRef = useRef<string | null>(null);
  const [completionIconMounted, setCompletionIconMounted] = useState(completed);
  const hideCompletionIcon = useCallback(
    () => setCompletionIconMounted(false),
    []
  );

  useLayoutEffect(() => {
    if (prevDateRef.current === dateString) return;
    snapDayToggleAnimations(
      { breathingScale, buttonScale, completion },
      completed
    );
    setCompletionIconMounted(completed);
    prevCompletedRef.current = completed;
    prevDateRef.current = dateString;
  }, [breathingScale, buttonScale, completed, completion, dateString]);

  useLayoutEffect(() => {
    if (prevDateRef.current === dateString && completed) {
      setCompletionIconMounted(true);
    }
  }, [completed, dateString]);

  useEffect(() => {
    const previous = prevCompletedRef.current;
    prevCompletedRef.current = completed;
    if (previous === null || previous === completed) return;
    runCompletionTransition({
      completed,
      completion,
      hideIcon: hideCompletionIcon,
      reduceMotion,
    });
    return () => cancelAnimation(completion);
  }, [completed, completion, hideCompletionIcon, reduceMotion]);

  useEffect(() => {
    runBreathingTransition({
      breathingScale,
      reduceMotion,
      shouldBreathe: isToday && !completed && !reduceMotion,
    });
    return () => cancelAnimation(breathingScale);
  }, [breathingScale, completed, isToday, reduceMotion]);

  useEffect(() => {
    if (!reduceMotion) return;
    cancelAnimation(buttonScale);
    buttonScale.value = 1;
  }, [buttonScale, reduceMotion]);

  const cellScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : buttonScale.value }],
  }));
  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : breathingScale.value }],
  }));

  return {
    breathingStyle,
    buttonScale,
    cellScaleStyle,
    completion,
    completionIconMounted,
    reduceMotion,
  };
}
