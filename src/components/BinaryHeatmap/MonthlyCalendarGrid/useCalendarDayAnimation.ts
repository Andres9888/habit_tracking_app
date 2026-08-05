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
  completedBg: string;
  completeTextColor: string;
  incompleteTextColor: string;
  isPending?: boolean;
  reduceMotion: boolean;
  showCompleted: boolean;
  surfaceBg: string;
  useSolidCompletedFill: boolean;
}

export function useCalendarDayAnimation({
  completedBg,
  completeTextColor,
  incompleteTextColor,
  isPending = false,
  reduceMotion,
  showCompleted,
  surfaceBg,
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

  // One shared progress drives an OPAQUE color ramp (surface → completed).
  // Opaque interpolation is visually identical to the ribbon's alpha fade
  // over the same surface, and it can't compound where layers overlap — so
  // cell and bridge read as one shape dissolving, with no two-tone seam.
  // gamma: 1 = plain per-channel lerp, identical to the compositor's alpha
  // blend of the ribbon over the same surface — keeps cell and bridge on the
  // exact same color at every instant of the ramp.
  const fillStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        fillProgress.value,
        [0, 1],
        [surfaceBg, completedBg],
        'RGB',
        { gamma: 1 }
      ),
    }),
    [surfaceBg, completedBg]
  );
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
