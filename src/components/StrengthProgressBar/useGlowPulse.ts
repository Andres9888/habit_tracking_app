/**
 * useGlowPulse Hook
 * Pulsing glow animation at the leading edge of the progress bar
 */

import React from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export function useGlowPulse() {
  const glowPulse = useSharedValue(0);

  React.useEffect(() => {
    glowPulse.value = withRepeat(
      withTiming(1, {
        duration: durations.breathing,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [glowPulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.4, 0.9]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.8, 1.2]) }],
  }));

  return glowStyle;
}
