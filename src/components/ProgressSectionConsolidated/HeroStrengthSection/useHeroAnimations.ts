/**
 * Animation hooks for HeroStrengthSection
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import {
  RING_ANIMATION_DURATION,
  EMOJI_SCALE_DELAY,
  CIRCUMFERENCE,
} from './constants';
import { springs } from '@/theme/animations';

interface UseHeroAnimationsParams {
  clampedStrength: number;
  progressPercent: number;
}

export function useHeroAnimations({
  clampedStrength,
  progressPercent,
}: UseHeroAnimationsParams) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const animatedStrength = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const progressBarWidth = useSharedValue(0);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) console.warn('Error checking reduce motion setting:', error);
        setReduceMotion(false);
      });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      emojiScale.value = 1;
      progressBarWidth.value = progressPercent;
      return;
    }
    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    emojiScale.value = withDelay(
      EMOJI_SCALE_DELAY,
      withSpring(1, springs.celebration)
    );
    progressBarWidth.value = withDelay(
      200,
      withTiming(progressPercent, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedStrength, reduceMotion, progressPercent]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: Math.round(
      CIRCUMFERENCE * (1 - animatedStrength.value / 100)
    ),
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  return {
    animatedCircleProps,
    animatedStrength,
    emojiAnimatedStyle,
    progressBarAnimatedStyle,
  };
}
