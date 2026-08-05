import type { ViewStyle } from 'react-native';
/**
 * useCelebrationAnimations — icon crossfade + ring progress for ProgressRingFAB.
 *
 * Mirrors celebrationAnimation.ts pattern: BOUNCE_SPRING for overshoot,
 * COMPLETION_SPRING for settle. Icon swap uses opacity crossfade (150ms).
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

const BOUNCE_SPRING = springs.celebration;
const COMPLETION_SPRING = springs.standard;
const CROSSFADE_MS = 150;
const REVERT_DELAY_MS = 3500;
const REVERT_MS = 800;
const REVERT_SPRING = springs.standard;

export interface CelebrationAnimStyles {
  plusStyle: AnimatedStyle<ViewStyle>;
  checkStyle: AnimatedStyle<ViewStyle>;
}

export function useCelebrationAnimations(
  isAllDone: boolean,
  justCompleted: boolean,
  reduceMotion: boolean
) {
  const plusOpacity = useSharedValue(1);
  const plusScale = useSharedValue(1);
  const checkOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (isAllDone) {
      if (reduceMotion) {
        plusOpacity.value = 0;
        plusScale.value = 0;
        checkOpacity.value = 1;
        checkScale.value = 1;
      } else {
        plusOpacity.value = withTiming(0, { duration: CROSSFADE_MS });
        plusScale.value = withTiming(0, { duration: CROSSFADE_MS });
        checkOpacity.value = withTiming(1, { duration: CROSSFADE_MS });
        checkScale.value = withSequence(
          withSpring(1.2, BOUNCE_SPRING),
          withSpring(1, COMPLETION_SPRING)
        );
      }

      const revertTimer = setTimeout(() => {
        if (reduceMotion) {
          plusOpacity.value = 1;
          plusScale.value = 1;
          checkOpacity.value = 0;
          checkScale.value = 0;
        } else {
          plusOpacity.value = withTiming(1, { duration: REVERT_MS });
          plusScale.value = withSpring(1, REVERT_SPRING);
          checkOpacity.value = withTiming(0, { duration: REVERT_MS });
          checkScale.value = withTiming(0, { duration: REVERT_MS });
        }
      }, REVERT_DELAY_MS);

      return () => clearTimeout(revertTimer);
    } else {
      plusOpacity.value = reduceMotion ? 1 : withTiming(1, { duration: CROSSFADE_MS });
      plusScale.value = reduceMotion ? 1 : withSpring(1, REVERT_SPRING);
      checkOpacity.value = reduceMotion ? 0 : withTiming(0, { duration: CROSSFADE_MS });
      checkScale.value = 0;
    }
  }, [isAllDone, reduceMotion, plusOpacity, plusScale, checkOpacity, checkScale]);

  const plusStyle = useAnimatedStyle(() => ({
    opacity: plusOpacity.value,
    transform: [{ scale: plusScale.value }],
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
