/**
 * Pulse animation hook for current streak highlight
 */

import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface UsePulseAnimationProps {
  reduceMotion: boolean;
  currentStreak: number;
}

export function usePulseAnimation({
  reduceMotion,
  currentStreak,
}: UsePulseAnimationProps) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (reduceMotion || currentStreak === 0) return;

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.6, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [currentStreak, reduceMotion, pulseScale, pulseOpacity]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  return pulseAnimatedStyle;
}
