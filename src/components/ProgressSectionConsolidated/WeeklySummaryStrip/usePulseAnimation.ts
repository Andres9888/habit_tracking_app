/**
 * usePulseAnimation Hook
 * Provides pulse animation for DayCell component
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import type { DayVisualState } from '../WeeklySummaryStripTypes';

/** Animation timing constants */
const PULSE_DURATION = 1500;

interface UsePulseAnimationParams {
  visualState: DayVisualState;
  reduceMotion: boolean;
}

export function usePulseAnimation({
  visualState,
  reduceMotion,
}: UsePulseAnimationParams) {
  const pulseValue = useSharedValue(0);

  // Pulsing animation for today incomplete state
  useEffect(() => {
    pulseValue.value =
      visualState === 'todayIncomplete' && !reduceMotion
        ? withRepeat(
            withSequence(
              withTiming(1, {
                duration: PULSE_DURATION / 2,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(0, {
                duration: PULSE_DURATION / 2,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            -1,
            false
          )
        : 0;
  }, [visualState, reduceMotion, pulseValue]);

  // Pulse animated style
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseValue.value, [0, 1], [1, 0.85]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [1, 1.05]) }],
  }));

  return { pulseAnimatedStyle };
}
