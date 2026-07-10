/** Calendar day fill, pop, text crossfade, and pending feedback animations. */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { runCalendarDayFillTransition } from './runCalendarDayFillTransition';

interface UseCalendarDayAnimationParams {
  completeTextColor: string;
  incompleteTextColor: string;
  isPending?: boolean;
  reduceMotion: boolean;
  showCompleted: boolean;
  useSolidCompletedFill: boolean;
}

export function useCalendarDayAnimation({
  completeTextColor,
  incompleteTextColor,
  isPending = false,
  reduceMotion,
  showCompleted,
  useSolidCompletedFill,
}: UseCalendarDayAnimationParams) {
  const fillProgress = useSharedValue(showCompleted ? 1 : 0);
  const cellPop = useSharedValue(1);
  const pendingOpacity = useSharedValue(1);
  const [fillMounted, setFillMounted] = useState(
    showCompleted && useSolidCompletedFill
  );
  const prevCompletedRef = useRef(showCompleted);
  const hideFill = useCallback(() => setFillMounted(false), []);

  useEffect(() => {
    const target = isPending ? 0.7 : 1;
    pendingOpacity.value = reduceMotion
      ? target
      : withTiming(target, { duration: durations.instant });
  }, [isPending, reduceMotion, pendingOpacity]);

  useEffect(() => {
    if (!useSolidCompletedFill) return;
    const wasCompleted = prevCompletedRef.current;
    prevCompletedRef.current = showCompleted;
    runCalendarDayFillTransition({
      cellPop,
      fillProgress,
      hideFill,
      reduceMotion,
      setFillMounted,
      showCompleted,
      wasCompleted,
    });
  }, [
    showCompleted,
    useSolidCompletedFill,
    reduceMotion,
    fillProgress,
    cellPop,
    hideFill,
  ]);

  // One shared progress: the fill fades (opacity) on exactly the same curve
  // that drives the text color crossfade — no scale collapse, no staggering.
  const fillStyle = useAnimatedStyle(() => ({
    opacity: fillProgress.value,
  }));
  const cellPopStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cellPop.value }],
  }));
  const pendingStyle = useAnimatedStyle(() => ({
    opacity: pendingOpacity.value,
  }));
  const textStyle = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        fillProgress.value,
        [0, 1],
        [incompleteTextColor, completeTextColor]
      ),
    }),
    [incompleteTextColor, completeTextColor]
  );

  return { cellPopStyle, fillMounted, fillStyle, pendingStyle, textStyle };
}
