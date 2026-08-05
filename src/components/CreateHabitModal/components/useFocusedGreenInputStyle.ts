import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { createHabitMotion } from '../createHabitMotion';

const FOCUS_GREEN = '#10B981';
const ERROR_RED = '#EF4444';
const DEFAULT_BORDER = '#e7e5e4';

/** Emerald border + soft glow while the habit name field is focused. */
export function useFocusedGreenInputStyle(
  isFocused: boolean,
  hasError: boolean,
  defaultBorderColor: string = DEFAULT_BORDER
) {
  const reduceMotion = useReduceMotion();
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    const target = isFocused && !hasError ? 1 : 0;
    focusProgress.value = reduceMotion
      ? target
      : withTiming(target, createHabitMotion.inputFocusRing);
  }, [focusProgress, hasError, isFocused, reduceMotion]);

  return useAnimatedStyle(
    () => ({
      borderColor: hasError
        ? ERROR_RED
        : focusProgress.value > 0.5
          ? FOCUS_GREEN
          : defaultBorderColor,
      borderWidth: 2,
      elevation: focusProgress.value * 2,
      shadowColor: FOCUS_GREEN,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: focusProgress.value * 0.1,
      shadowRadius: focusProgress.value * 3,
    }),
    [defaultBorderColor, hasError]
  );
}
