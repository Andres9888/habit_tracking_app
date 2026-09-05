import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface UseConnectorShimmerParams {
  shimmerSpeed: number;
  reduceMotion: boolean;
  /** Stagger offset so connectors don't all shimmer in sync */
  staggerIndex?: number;
}

const SHIMMER_WIDTH = 20;
const TRAVEL_DISTANCE = 60;
const STAGGER_MS = durations.standard;

/**
 * Drives a shimmer highlight that sweeps across a connector bar.
 * Returns an animated translateX style for the shimmer overlay.
 */
export function useConnectorShimmer({
  shimmerSpeed,
  reduceMotion,
  staggerIndex = 0,
}: UseConnectorShimmerParams) {
  const active = shimmerSpeed > 0 && !reduceMotion;
  const position = useSharedValue(-SHIMMER_WIDTH);

  useEffect(() => {
    if (!active) {
      position.value = -SHIMMER_WIDTH;
      return;
    }

    const delay = staggerIndex * STAGGER_MS;
    position.value = withDelay(
      delay,
      withRepeat(
        withTiming(TRAVEL_DISTANCE, {
          duration: shimmerSpeed,
          easing: Easing.linear,
        }),
        -1
      )
    );
  }, [active, shimmerSpeed, staggerIndex, position]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return { shimmerStyle, active };
}
