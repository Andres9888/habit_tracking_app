/**
 * SkeletonLoader Component
 * Base shimmer skeleton loader for loading states.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import type { SkeletonLoaderProps } from './types';

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  reduceMotion = false,
  style,
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (reduceMotion) {
      shimmerAnim.setValue(0.6);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.3,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [reduceMotion, shimmerAnim]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.border,
          borderRadius,
          height,
          opacity: shimmerAnim,
          width,
        },
        style,
      ]}
    />
  );
}

export default SkeletonLoader;
