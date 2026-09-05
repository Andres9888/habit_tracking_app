/**
 * Animation hooks for ReminderOptionButton
 * Uses react-native-reanimated with design system spring presets
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';
import { CARD_PRESS_SCALE } from '../../../../utils/animations/cardPressAnimation';
import { Springs } from '../../../../constants/motion';

const SLIDE_UP_DISTANCE = -2;
const SLIDE_TIMING_MS = durations.instant;
const SLIDE_BOUNCE_SPRING = springs.celebration;

export function useButtonAnimations(reduceMotion: boolean) {
  const scale = useSharedValue(1);
  const slide = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withSpring(CARD_PRESS_SCALE, Springs.button);
  }, [scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) {
      scale.value = 1;
      slide.value = 0;
      return;
    }

    // Slide up then bounce back
    slide.value = withSequence(
      withTiming(SLIDE_UP_DISTANCE, { duration: SLIDE_TIMING_MS }),
      withSpring(0, SLIDE_BOUNCE_SPRING)
    );

    // Scale back to normal simultaneously
    scale.value = withSpring(1, Springs.button);
  }, [scale, slide, reduceMotion]);

  return {
    handlePressIn,
    handlePressOut,
    scale,
    slide,
  };
}

export type ButtonAnimations = ReturnType<typeof useButtonAnimations>;
export type AnimationSharedValue = SharedValue<number>;
