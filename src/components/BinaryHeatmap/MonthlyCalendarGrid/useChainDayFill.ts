/**
 * useChainDayFill — one shared progress that fades the circle day dot's
 * colors between its base (default/missed) and completed states, on the same
 * clock as every other cell-toggle animation (durations.quick).
 */
import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';

export interface ChainDayFillColors {
  baseBg: string;
  baseBorder: string;
  completedBg: string;
  completedBorder: string;
  haloBorder: string;
}

export function useChainDayFill(
  showCompleted: boolean,
  todayIncomplete: boolean,
  fillColors: ChainDayFillColors
) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(showCompleted ? 1 : 0);

  useEffect(() => {
    const target = showCompleted ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withTiming(target, {
          duration: durations.quick,
          easing: showCompleted ? enterEasing : exitEasing,
        });
  }, [showCompleted, reduceMotion, progress]);

  return useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [fillColors.baseBg, fillColors.completedBg]
    );
    // Branch inside the worklet — never conditionally detach the style.
    if (todayIncomplete) {
      return {
        backgroundColor,
        borderColor: fillColors.haloBorder,
        borderWidth: 3,
      };
    }
    return {
      backgroundColor,
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [fillColors.baseBorder, fillColors.completedBorder]
      ),
      borderWidth: 2,
    };
  }, [todayIncomplete, fillColors]);
}
