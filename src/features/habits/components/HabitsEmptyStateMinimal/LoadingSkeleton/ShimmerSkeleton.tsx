/**
 * ShimmerSkeleton Component
 *
 * Single skeleton element with shimmer animation.
 */

import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';

import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import {
  SKELETON_COLORS_LIGHT,
  SKELETON_COLORS_DARK,
  SHIMMER_DURATION,
} from '../../../../../components/SkeletonLoader/SkeletonLoader';
import { useThemeColors } from '../../../../../theme/ThemeContext';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface ShimmerSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

export function ShimmerSkeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: ShimmerSkeletonProps) {
  const { isDark } = useThemeColors();
  const SKELETON_COLORS = isDark ? SKELETON_COLORS_DARK : SKELETON_COLORS_LIGHT;
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [shimmerPosition]);

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
          backgroundColor: SKELETON_COLORS.base,
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
          SKELETON_COLORS.base,
          SKELETON_COLORS.highlight,
          SKELETON_COLORS.base,
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[
          StyleSheet.absoluteFillObject,
          { width: '200%' },
          animatedStyle,
        ]}
      />
    </View>
  );
}
