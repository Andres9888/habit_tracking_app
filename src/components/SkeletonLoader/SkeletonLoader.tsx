/**
 * SkeletonLoader Component
 * Base shimmer skeleton loader with gradient sweep animation.
 * Uses LinearGradient for a polished shimmer effect across all skeleton screens.
 * Supports dark mode via useThemeColors hook.
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { absoluteFillObject } from '../../theme/absoluteFillObject';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SkeletonLoaderProps } from './types';

/** Light and dark skeleton color pairs */
export const SKELETON_COLORS_LIGHT = {
  base: '#E7E5E4',
  highlight: '#F5F5F4',
} as const;

export const SKELETON_COLORS_DARK = {
  base: '#374151',
  highlight: '#4B5563',
} as const;

export const SHIMMER_DURATION = 1500;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  reduceMotion = false,
  style,
}: SkeletonLoaderProps) {
  const { isDark } = useThemeColors();
  const skeletonColors = isDark ? SKELETON_COLORS_DARK : SKELETON_COLORS_LIGHT;
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      shimmerPosition.value = 0.5;
      return;
    }

    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [reduceMotion, shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerPosition.value, [0, 1], [-200, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          backgroundColor: skeletonColors.base,
          borderRadius,
          height,
          overflow: 'hidden',
          width,
        },
        style,
      ]}
    >
      <AnimatedLinearGradient
        colors={[
          skeletonColors.base,
          skeletonColors.highlight,
          skeletonColors.base,
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[
          absoluteFillObject,
          { width: '200%' },
          animatedStyle,
        ]}
      />
    </View>
  );
}

export default SkeletonLoader;
