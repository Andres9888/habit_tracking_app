import { useEffect, useLayoutEffect, useRef } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { snapDayToggleAnimations } from './useHabitDayToggleAnimations.helpers';
import type { UseHabitDayToggleAnimationsParams } from './useHabitDayToggleAnimations.types';

/**
 * Press choreography only. Completion visuals are React-owned (plain styles +
 * an exiting fade) so they survive a re-render even if Reanimated drops the
 * cell's settled animated props.
 */
export function useHabitDayToggleAnimations({
  dateString,
  reduceMotionPreference,
}: UseHabitDayToggleAnimationsParams) {
  const reduceMotion = useReduceMotion({
    preference: reduceMotionPreference || undefined,
  });
  const buttonScale = useSharedValue(1);
  const prevDateRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (prevDateRef.current === dateString) return;
    prevDateRef.current = dateString;
    snapDayToggleAnimations({ buttonScale });
  }, [buttonScale, dateString]);

  useEffect(() => {
    if (!reduceMotion) return;
    snapDayToggleAnimations({ buttonScale });
  }, [buttonScale, reduceMotion]);

  const cellScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : buttonScale.value }],
  }));
  return { buttonScale, cellScaleStyle, reduceMotion };
}
