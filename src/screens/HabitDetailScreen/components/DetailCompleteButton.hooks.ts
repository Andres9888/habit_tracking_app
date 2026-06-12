/**
 * DetailCompleteButton animation — color cross-fade, check pop, button pop,
 * and a one-shot ring burst around the indicator on completion.
 */
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
const BURST_MAX_SCALE = 2.2;
const BURST_START_OPACITY = 0.65;

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
  const buttonPop = useSharedValue(1);
  const burstProgress = useSharedValue(0);
  const isMountRef = useRef(true);

  useEffect(() => {
    const isMountTransition = isMountRef.current;
    isMountRef.current = false;
    runCompleteButtonTransition({
      burstProgress,
      buttonPop,
      checkScale,
      completionProgress,
      isCompletedToday,
      isMountTransition,
      reduceMotion,
    });
  }, [
    isCompletedToday,
    reduceMotion,
    completionProgress,
    checkScale,
    buttonPop,
    burstProgress,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.primaryBg, palette.successBg]
    ),
    transform: [{ scale: pressScale.value * buttonPop.value }],
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

  const burstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      burstProgress.value,
      [0, 0.05, 1],
      [0, BURST_START_OPACITY, 0]
    ),
    transform: [
      { scale: interpolate(burstProgress.value, [0, 1], [1, BURST_MAX_SCALE]) },
    ],
  }));

  return {
    burstStyle,
    checkStyle,
    circleStyle,
    containerStyle,
    filledCircleStyle,
    pressHandlers,
  };
}
