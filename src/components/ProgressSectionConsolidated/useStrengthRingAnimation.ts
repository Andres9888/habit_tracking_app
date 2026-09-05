/**
 * useStrengthRingAnimation - Animation hook for strength ring
 */

import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';
import { getLevelFromStrength } from './types';
import { durations } from '@/theme/animations';

const RING_ANIMATION_DURATION = durations.progress;
const RING_SIZE = 56;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const RING_CONSTANTS = {
  CENTER: RING_SIZE / 2,
  CIRCUMFERENCE,
  RADIUS,
  RING_SIZE,
  STROKE_WIDTH,
};

export function useStrengthRingAnimation(
  strength: number,
  emojis?: ProgressEmojiSet
) {
  const reduceMotion = useReduceMotion();

  const clampedStrength = useMemo(
    () => Math.max(0, Math.min(100, strength)),
    [strength]
  );

  const levelInfo = useMemo(
    () => getLevelFromStrength(clampedStrength, emojis),
    [clampedStrength, emojis]
  );

  const animatedStrength = useSharedValue(reduceMotion ? clampedStrength : 0);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      return;
    }

    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedStrength, reduceMotion, animatedStrength]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: Math.round(
      CIRCUMFERENCE * (1 - animatedStrength.value / 100)
    ),
  }));

  return {
    animatedCircleProps,
    clampedStrength,
    levelInfo,
  };
}
