import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PULSE_MIN = 0.35;
const PULSE_MAX = 0.85;
const HALF_CYCLE_MS = 1200;

/**
 * Breathing opacity animation for ghost connectors.
 * Draws attention to the "complete today" opportunity.
 */
export function useGhostPulse(active: boolean, reduceMotion: boolean) {
  const opacity = useSharedValue(active && !reduceMotion ? PULSE_MIN : 0.6);

  useEffect(() => {
    if (!active || reduceMotion) {
      opacity.value = active ? 0.6 : 0;
      return;
    }

    opacity.value = withRepeat(
      withSequence(
        withTiming(PULSE_MAX, {
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(PULSE_MIN, {
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1
    );
  }, [active, reduceMotion, opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}
