/**
 * Pulsing dot animation hook for StrengthTimelineChart
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PULSE_DURATION, DOT_RADIUS } from './constants';
import type { ChartPoint } from './types';

interface UsePulseAnimationProps {
  lastPoint: ChartPoint | null;
}

export function usePulseAnimation({ lastPoint }: UsePulseAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (shouldReduceMotion || !lastPoint) return;

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.4, {
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.ease),
        })
      ),
      -1,
      false
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(0.8, {
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [shouldReduceMotion, lastPoint, pulseScale, pulseOpacity]);

  const pulsingRingProps = useAnimatedProps(() => ({
    opacity: pulseOpacity.value,
    r: DOT_RADIUS * pulseScale.value,
  }));

  return { pulsingRingProps };
}
