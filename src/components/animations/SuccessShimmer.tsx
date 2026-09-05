/**
 * SuccessShimmer Component
 *
 * A brief, subtle shimmer/glow overlay that sweeps across on success.
 * Premium micro-interaction — plays once then disappears.
 *
 * Uses LinearGradient for the sweep and Reanimated for motion.
 */

import React, { useEffect, memo } from 'react';
import { StyleSheet } from 'react-native';
import { durations } from '@/theme/animations';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface SuccessShimmerProps {
  /** Whether to show the shimmer */
  active: boolean;
  /** Called when shimmer animation completes */
  onComplete?: () => void;
}

/**
 * A quick left-to-right shine sweep that conveys success.
 * Uses a translucent white band that moves across the parent container.
 * Parent must have `overflow: 'hidden'`.
 */
function SuccessShimmerComponent({ active, onComplete }: SuccessShimmerProps) {
  const translateX = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      // Reset
      translateX.value = -120;
      opacity.value = 0;

      // Fade in quickly, then sweep across
      opacity.value = withTiming(0.35, { duration: durations.tick });
      translateX.value = withDelay(
        durations.stagger,
        withTiming(
          400,
          { duration: durations.emphasis, easing: Easing.out(Easing.cubic) },
          (finished) => {
            'worklet';
            if (finished) {
              opacity.value = withTiming(0, { duration: durations.instant });
              if (onComplete) {
                runOnJS(onComplete)();
              }
            }
          }
        )
      );
    }
  }, [active, translateX, opacity, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { skewX: '-20deg' }],
  }));

  if (!active) return null;

  return (
    <Animated.View
      pointerEvents='none'
      style={[styles.shimmer, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 60,
  },
});

export const SuccessShimmer = memo(SuccessShimmerComponent);
