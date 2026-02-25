/**
 * useCelebrationAnimations — icon crossfade + ring progress for ProgressRingFAB.
 *
 * Mirrors celebrationAnimation.ts pattern: BOUNCE_SPRING for overshoot,
 * COMPLETION_SPRING for settle. Icon swap uses opacity crossfade (150ms).
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const BOUNCE_SPRING = { damping: 12, stiffness: 200 };
const COMPLETION_SPRING = { damping: 18, stiffness: 150 };
const CROSSFADE_MS = 150;

export interface CelebrationAnimStyles {
  plusStyle: { opacity: number };
  checkStyle: { opacity: number; transform: { scale: number }[] };
}

export function useCelebrationAnimations(
  isAllDone: boolean,
  justCompleted: boolean,
  reduceMotion: boolean
) {
  const plusOpacity = useSharedValue(1);
  const checkOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (isAllDone) {
      if (reduceMotion) {
        plusOpacity.value = 0;
        checkOpacity.value = 1;
        checkScale.value = 1;
      } else {
        plusOpacity.value = withTiming(0, { duration: CROSSFADE_MS });
        checkOpacity.value = withTiming(1, { duration: CROSSFADE_MS });
        checkScale.value = withSequence(
          withSpring(1.2, BOUNCE_SPRING),
          withSpring(1, COMPLETION_SPRING)
        );
      }
    } else {
      plusOpacity.value = reduceMotion
        ? 1
        : withTiming(1, { duration: CROSSFADE_MS });
      checkOpacity.value = reduceMotion
        ? 0
        : withTiming(0, { duration: CROSSFADE_MS });
      checkScale.value = 0;
    }
  }, [isAllDone, reduceMotion, plusOpacity, checkOpacity, checkScale]);

  const plusStyle = useAnimatedStyle(() => ({
    opacity: plusOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return { plusStyle, checkStyle };
}

/** Animate progress ring fill with snappy spring */
export function useProgressAnimation(
  completedToday: number,
  totalHabits: number,
  reduceMotion: boolean
): SharedValue<number> {
  const progress = useSharedValue(0);
  const target = totalHabits > 0 ? completedToday / totalHabits : 0;

  useEffect(() => {
    progress.value = reduceMotion
      ? target
      : withSpring(target, COMPLETION_SPRING);
  }, [target, reduceMotion, progress]);

  return progress;
}
