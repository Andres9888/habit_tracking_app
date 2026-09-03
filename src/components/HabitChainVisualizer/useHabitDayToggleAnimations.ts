import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import {
  runCompletionTransition,
  snapDayToggleAnimations,
} from './useHabitDayToggleAnimations.helpers';
import type { UseHabitDayToggleAnimationsParams } from './useHabitDayToggleAnimations.types';

export function useHabitDayToggleAnimations({
  completed,
  dateString,
  reduceMotionPreference,
}: UseHabitDayToggleAnimationsParams) {
  const reduceMotion = useReduceMotion({
    preference: reduceMotionPreference || undefined,
  });
  const completion = useSharedValue(completed ? 1 : 0);
  const buttonScale = useSharedValue(1);
  const prevCompletedRef = useRef<boolean | null>(null);
  const prevDateRef = useRef<string | null>(null);
  const completedRef = useRef(completed);
  const [completionIconMounted, setCompletionIconMounted] = useState(completed);
  const hideCompletionIcon = useCallback(() => {
    if (!completedRef.current) setCompletionIconMounted(false);
  }, []);

  useLayoutEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useLayoutEffect(() => {
    if (prevDateRef.current === dateString) return;
    snapDayToggleAnimations({ buttonScale, completion }, completed);
    setCompletionIconMounted(completed);
    prevCompletedRef.current = completed;
    prevDateRef.current = dateString;
  }, [buttonScale, completed, completion, dateString]);

  useLayoutEffect(() => {
    if (prevDateRef.current === dateString && completed) {
      cancelAnimation(completion);
      completion.value = 1;
      setCompletionIconMounted(true);
    }
  }, [completed, completion, dateString]);

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
    if (!reduceMotion) return;
    cancelAnimation(buttonScale);
    buttonScale.value = 1;
    cancelAnimation(completion);
    completion.value = completedRef.current ? 1 : 0;
    if (!completedRef.current) setCompletionIconMounted(false);
  }, [buttonScale, completion, reduceMotion]);

  const cellScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : buttonScale.value }],
  }));
  return {
    buttonScale,
    cellScaleStyle,
    completion,
    completionIconMounted,
    reduceMotion,
  };
}
