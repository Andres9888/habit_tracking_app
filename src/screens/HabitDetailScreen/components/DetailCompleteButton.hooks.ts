/** DetailCompleteButton — calm fade: outlined → solid, check scale only. */
import { useEffect, useRef } from 'react';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { runCompleteButtonTransition } from './runCompleteButtonTransition';

const CHECK_SCALE_MIN = 0.6;
const OUTLINE_BG = 'transparent';

interface CompleteButtonPalette {
  inverseText: string;
  successBg: string;
  successBorder: string;
  successText: string;
}

export function useDetailCompleteButtonAnimation(
  isCompletedToday: boolean,
  palette: CompleteButtonPalette
) {
  const reduceMotion = useReduceMotion();
  const { pressHandlers, scale: pressScale } = useDetailPressAnimation();
  const completionProgress = useSharedValue(isCompletedToday ? 1 : 0);
  const checkScale = useSharedValue(isCompletedToday ? 1 : 0);
  const isMountRef = useRef(true);

  useEffect(() => {
    const isMountTransition = isMountRef.current;
    isMountRef.current = false;
    runCompleteButtonTransition({
      checkScale,
      completionProgress,
      isCompletedToday,
      isMountTransition,
      reduceMotion,
    });
  }, [isCompletedToday, reduceMotion, completionProgress, checkScale]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [OUTLINE_BG, palette.successBg]
    ),
    borderColor: palette.successBorder,
    borderWidth: 2,
    transform: [{ scale: pressScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.successText, palette.inverseText]
    ),
  }));

  const circleStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.successBorder, palette.inverseText]
    ),
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
    labelStyle,
    pressHandlers,
  };
}
