/**
 * DetailCompleteButton animation — color cross-fade and check draw-in.
 */
import { useEffect } from 'react';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '../../../theme/animations';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';

const CHECK_SCALE_MIN = 0.6;

interface CompleteButtonPalette {
  primaryBg: string;
  successBg: string;
}

export function useDetailCompleteButtonAnimation(
  isCompletedToday: boolean,
  palette: CompleteButtonPalette
) {
  const reduceMotion = useReduceMotion();
  const { pressHandlers, scale: pressScale } = useDetailPressAnimation();
  const completionProgress = useSharedValue(isCompletedToday ? 1 : 0);
  const checkScale = useSharedValue(isCompletedToday ? 1 : 0);

  useEffect(() => {
    const target = isCompletedToday ? 1 : 0;
    completionProgress.value = reduceMotion
      ? target
      : withTiming(target, { duration: durations.quick });

    if (target === 1) {
      checkScale.value = 0;
      checkScale.value = reduceMotion ? 1 : withSpring(1, springs.button);
    } else {
      checkScale.value = reduceMotion
        ? 0
        : withTiming(0, { duration: durations.quick });
    }
  }, [isCompletedToday, reduceMotion, completionProgress, checkScale]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.primaryBg, palette.successBg]
    ),
    transform: [{ scale: pressScale.value }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(completionProgress.value, [0, 0.4], [1, 0], 'clamp'),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
  }));

  const filledCircleStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [
      {
        scale: interpolate(checkScale.value, [0, 1], [CHECK_SCALE_MIN, 1]),
      },
    ],
  }));

  return {
    checkStyle,
    circleStyle,
    containerStyle,
    filledCircleStyle,
    pressHandlers,
  };
}
