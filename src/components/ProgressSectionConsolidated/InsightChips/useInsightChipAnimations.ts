/**
 * useInsightChipAnimations Hook
 *
 * Manages entrance and pulse animations for an individual insight chip
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import {
  CHIP_STAGGER_DELAY,
  CHIP_ENTRANCE_DURATION,
  PULSE_DURATION,
} from './constants';

interface UseInsightChipAnimationsProps {
  index: number;
  reduceMotion: boolean;
  hasPulse: boolean;
}

export function useInsightChipAnimations({
  index,
  reduceMotion,
  hasPulse,
}: UseInsightChipAnimationsProps) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateX = useSharedValue(reduceMotion ? 0 : 20);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  // Press scale comes from the shared primitive; it is composed into
  // `containerStyle` below rather than mounted as a second Animated.View.
  const {
    scale: pressScale,
    pressHandlers: { onPressIn: handlePressIn, onPressOut: handlePressOut },
  } = usePressAnimation();

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateX.value = 0;
      return;
    }

    const delay = index * CHIP_STAGGER_DELAY;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CHIP_ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateX.value = withDelay(
      delay,
      withSpring(0, springs.standard)
    );
  }, [index, reduceMotion, opacity, translateX]);

  // Pulse animation for active streak
  useEffect(() => {
    if (!hasPulse || reduceMotion) {
      pulseScale.value = 1;
      pulseOpacity.value = 0;
      return;
    }

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: PULSE_DURATION / 2 }),
        withTiming(1, { duration: PULSE_DURATION / 2 })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: PULSE_DURATION / 2 }),
        withTiming(0, { duration: PULSE_DURATION / 2 })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
  }, [hasPulse, reduceMotion, pulseScale, pulseOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: pressScale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  return { containerStyle, handlePressIn, handlePressOut, pulseRingStyle };
}
