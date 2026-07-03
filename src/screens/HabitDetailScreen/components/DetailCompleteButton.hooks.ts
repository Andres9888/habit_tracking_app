/**
 * DetailCompleteButton — fused full-width pill.
 * Incomplete: filled, elevated, loud CTA. Complete: light tinted, calm, check icon.
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

interface CompleteButtonPalette {
  filledBg: string;
  filledText: string;
  doneBg: string;
  doneBorder: string;
  doneText: string;
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
      [palette.filledBg, palette.doneBg]
    ),
    borderColor: palette.doneBorder,
    borderWidth: interpolate(completionProgress.value, [0, 1], [0, 1]),
    shadowOpacity: interpolate(completionProgress.value, [0, 1], [0.28, 0]),
    transform: [{ scale: pressScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.filledText, palette.doneText]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: interpolate(checkScale.value, [0, 1], [0.6, 1]) }],
  }));

  return {
    checkStyle,
    containerStyle,
    labelStyle,
    pressHandlers,
  };
}
