/**
 * GradientShimmerSkeleton Component
 *
 * Skeleton element with gradient sweep shimmer animation.
 * Used for larger elements like charts where the gradient effect is more visible.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import {
  SKELETON_COLORS_LIGHT,
  SKELETON_COLORS_DARK,
  SHIMMER_DURATION,
} from '../../SkeletonLoader/SkeletonLoader';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export interface GradientShimmerSkeletonProps {
  height: number;
  borderRadius?: number;
  reduceMotion?: boolean;
}

export function GradientShimmerSkeleton({
  height,
  borderRadius = 12,
  reduceMotion = false,
}: GradientShimmerSkeletonProps) {
  const { isDark } = useThemeColors();
  const SKELETON_COLORS = isDark ? SKELETON_COLORS_DARK : SKELETON_COLORS_LIGHT;
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      // For reduced motion, keep a static state
      shimmerPosition.value = 0.5;
      return;
    }

    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [shimmerPosition, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    // Animate the gradient from left to right
    const translateX = interpolate(shimmerPosition.value, [0, 1], [-200, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.gradientContainer,
        {
          backgroundColor: SKELETON_COLORS.base,
          borderRadius,
          height,
        },
      ]}
      testID='skeleton-chart-gradient'
    >
      <AnimatedLinearGradient
        colors={[
          SKELETON_COLORS.base,
          SKELETON_COLORS.highlight,
          SKELETON_COLORS.base,
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[StyleSheet.absoluteFillObject, styles.gradient, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '200%',
  },
  gradientContainer: {
    overflow: 'hidden',
    width: '100%',
  },
});
