/**
 * PulsingIcon Component
 *
 * A reusable animated wrapper that applies a pulsing opacity and scale effect
 * to its children. Commonly used for empty state icons to draw attention.
 *
 * Features:
 * - Smooth opacity pulsing (1 -> 0.5 -> 1)
 * - Subtle scale pulsing (1 -> 1.05 -> 1)
 * - Accessibility support via reduceMotion prop
 * - Uses Reanimated for 60fps animations on the UI thread
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export interface PulsingIconProps {
  /** Content to apply the pulsing animation to */
  children: React.ReactNode;
  /** When true, disables animations for accessibility */
  reduceMotion?: boolean;
}

export function PulsingIcon({
  children,
  reduceMotion = false,
}: PulsingIconProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const pulseOpacity = () => {
      opacity.value = withTiming(
        0.5,
        { duration: durations.loop },
        (finished) => {
          if (finished) {
            opacity.value = withTiming(
              1,
              { duration: durations.loop },
              (finished2) => {
                if (finished2) {
                  runOnJS(pulseOpacity)();
                }
              }
            );
          }
        }
      );
    };

    const pulseScale = () => {
      scale.value = withTiming(
        1.05,
        { duration: durations.loop },
        (finished) => {
          if (finished) {
            scale.value = withTiming(
              1,
              { duration: durations.loop },
              (finished2) => {
                if (finished2) {
                  runOnJS(pulseScale)();
                }
              }
            );
          }
        }
      );
    };

    pulseOpacity();
    pulseScale();
  }, [reduceMotion, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
