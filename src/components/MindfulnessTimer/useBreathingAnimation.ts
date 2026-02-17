/**
 * useBreathingAnimation Hook
 *
 * Manages the animated breathing circle state:
 * inhale (4s) → hold (4s) → exhale (4s) cycling.
 * Returns current phase, progress, and scale value for the circle.
 */

import { useEffect, useCallback, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  cancelAnimation,
  type AnimatedStyle,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { BREATHING_CYCLE, BREATHING_TOTAL, type BreathingPhase } from './mindfulnessUtils';

interface UseBreathingAnimationReturn {
  /** Animated style for the breathing circle */
  breathingStyle: AnimatedStyle<ViewStyle>;
  /** Current breathing phase label */
  phase: BreathingPhase;
  /** Start the breathing loop */
  start: () => void;
  /** Stop the breathing loop */
  stop: () => void;
}

export function useBreathingAnimation(isRunning: boolean): UseBreathingAnimationReturn {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);
  const phaseRef = useRef<BreathingPhase>('inhale');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    // Animate scale: expand during inhale, hold, shrink during exhale — repeating
    scale.value = 0.6;
    scale.value = withRepeat(
      withSequence(
        // Inhale: grow
        withTiming(1.0, {
          duration: BREATHING_CYCLE.inhale * 1000,
          easing: Easing.inOut(Easing.sin),
        }),
        // Hold: stay
        withTiming(1.0, {
          duration: BREATHING_CYCLE.hold * 1000,
          easing: Easing.linear,
        }),
        // Exhale: shrink
        withTiming(0.6, {
          duration: BREATHING_CYCLE.exhale * 1000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1, // infinite
      false,
    );

    opacity.value = 0.4;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: BREATHING_CYCLE.inhale * 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.9, { duration: BREATHING_CYCLE.hold * 1000, easing: Easing.linear }),
        withTiming(0.4, { duration: BREATHING_CYCLE.exhale * 1000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    // Track phase with JS interval
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed = (elapsed + 100) % (BREATHING_TOTAL * 1000);
      const sec = elapsed / 1000;
      if (sec < BREATHING_CYCLE.inhale) {
        phaseRef.current = 'inhale';
      } else if (sec < BREATHING_CYCLE.inhale + BREATHING_CYCLE.hold) {
        phaseRef.current = 'hold';
      } else {
        phaseRef.current = 'exhale';
      }
    }, 100);
  }, [scale, opacity]);

  const stop = useCallback(() => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [scale, opacity]);

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }
    return stop;
  }, [isRunning, start, stop]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    breathingStyle,
    phase: phaseRef.current,
    start,
    stop,
  };
}
