import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SHIMMER_CYCLES = 2;

export function useRankShimmer(
  speed: number,
  tileSize: number,
  shimmerWidth: number
) {
  const reducedMotion = useReducedMotion();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion || speed === 0) {
      cancelAnimation(shimmer);
      shimmer.value = 0;
      return;
    }
    shimmer.value = withRepeat(
      withTiming(1, { duration: speed, easing: Easing.linear }),
      SHIMMER_CYCLES,
      false
    );
    return () => cancelAnimation(shimmer);
  }, [speed, shimmer, reducedMotion]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmer.value,
          [0, 1],
          [-shimmerWidth, tileSize + shimmerWidth / 2]
        ),
      },
      { rotate: '18deg' },
    ],
  }));

  return { shimmerStyle };
}
