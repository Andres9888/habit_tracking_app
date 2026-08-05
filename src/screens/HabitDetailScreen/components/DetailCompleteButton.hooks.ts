/**
 * DetailCompleteButton — C1 "Settled" animation.
 * Rest: white bar, green outline, empty check-well ring.
 * Done: deep settled fill, well flips to a light medallion with a check.
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
  doneBg: string;
  doneText: string;
  restBg: string;
  restBorder: string;
  restText: string;
  wellDoneBg: string;
  wellRestBg: string;
  wellRestRing: string;
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
      [palette.restBg, palette.doneBg]
    ),
    borderColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.restBorder, palette.doneBg]
    ),
    transform: [{ scale: pressScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.restText, palette.doneText]
    ),
  }));

  const wellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.wellRestBg, palette.wellDoneBg]
    ),
    borderColor: interpolateColor(
      completionProgress.value,
      [0, 1],
      [palette.wellRestRing, palette.wellDoneBg]
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
    wellStyle,
  };
}
