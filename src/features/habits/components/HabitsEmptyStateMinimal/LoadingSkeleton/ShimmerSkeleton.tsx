/**
 * ShimmerSkeleton Component
 *
 * Single skeleton element with shimmer animation.
 */

import { useEffect } from 'react';
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

import { SKELETON_COLORS, SHIMMER_DURATION } from './constants';

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
