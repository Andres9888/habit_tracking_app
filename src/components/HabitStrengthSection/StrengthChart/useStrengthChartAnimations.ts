/**
 * StrengthChart Animation Hook
 *
 * Manages path draw animation and pulsing dot effect.
 */

import { useEffect } from 'react';

import {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATION, DOT_RADIUS } from '../constants';

interface UseStrengthChartAnimationsOptions {
  /** Whether user prefers reduced motion */
  reduceMotion: boolean;
  /** Length of the path for draw animation */
  pathLength: number;
  /** Number of data points (triggers animation reset) */
  dataLength: number;
}

interface UseStrengthChartAnimationsResult {
  /** Animated props for the path element */
  animatedPathProps: ReturnType<typeof useAnimatedProps>;
  /** Animated props for the pulsing dot */
  animatedDotProps: ReturnType<typeof useAnimatedProps>;
}

/**
 * Hook to manage chart animations: path drawing and dot pulsing.
 */
export function useStrengthChartAnimations({
  reduceMotion,
  pathLength,
  dataLength,
}: UseStrengthChartAnimationsOptions): UseStrengthChartAnimationsResult {
  const pathProgress = useSharedValue(0);
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(1);

  // Animate path draw and pulsing dot
  useEffect(() => {
    if (reduceMotion) {
      pathProgress.value = 1;
      dotScale.value = 1;
      return;
    }

    // Path draw animation
    pathProgress.value = 0;
    pathProgress.value = withTiming(1, {
      duration: ANIMATION.chartDrawDuration,
      easing: Easing.out(Easing.cubic),
    });

    // Pulsing dot animation
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: ANIMATION.pulseDuration / 2 }),
        withTiming(1, { duration: ANIMATION.pulseDuration / 2 })
      ),
      -1, // Infinite loop
      false
    );

    dotOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: ANIMATION.pulseDuration / 2 }),
        withTiming(1, { duration: ANIMATION.pulseDuration / 2 })
      ),
      -1,
      false
    );
  }, [dataLength, reduceMotion, pathProgress, dotScale, dotOpacity]);

  // Animated path props for draw animation
  const animatedPathProps = useAnimatedProps(() => {
    'worklet';
    const progress = pathProgress.value ?? 0;
    const safePathLength = pathLength ?? 0;
    return {
      strokeDashoffset: safePathLength * (1 - progress),
    };
  });

  // Animated dot props for pulsing
  // Note: r can be fractional for SVG, but we round to avoid Reanimated precision errors
  const animatedDotProps = useAnimatedProps(() => {
    'worklet';
    const opacity = dotOpacity.value ?? 1;
    const scale = dotScale.value ?? 1;
    return {
      opacity: Math.round(opacity * 100) / 100,
      r: Math.round(DOT_RADIUS * scale * 10) / 10,
    };
  });

  return {
    animatedDotProps,
    animatedPathProps,
  };
}
