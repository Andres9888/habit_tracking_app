/** Complete-button state color + tactile 4px press motion. */
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
  doneBg: string;
  doneBorder: string;
  doneText: string;
  restBg: string;
  restBorder: string;
  restText: string;
}

export function useDetailCompleteButtonAnimation(
  isCompletedToday: boolean,
  palette: CompleteButtonPalette
) {
  const reduceMotion = useReduceMotion();
  const { pressHandlers, scale: pressScale } = useDetailPressAnimation();
  const completionProgress = useSharedValue(isCompletedToday ? 1 : 0);
  const isMountRef = useRef(true);

  useEffect(() => {
    const isMountTransition = isMountRef.current;
    isMountRef.current = false;
    runCompleteButtonTransition({
      completionProgress,
      isCompletedToday,
      isMountTransition,
      reduceMotion,
    });
  }, [isCompletedToday, reduceMotion, completionProgress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.restBg, palette.doneBg]
    ),
    borderColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.restBorder, palette.doneBorder]
    ),
    transform: [
      { translateY: interpolate(pressScale.value, [0.96, 1], [4, 0]) },
      { scale: pressScale.value },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.restText, palette.doneText]
    ),
  }));

  return {
    containerStyle,
    labelStyle,
    pressHandlers,
  };
}
