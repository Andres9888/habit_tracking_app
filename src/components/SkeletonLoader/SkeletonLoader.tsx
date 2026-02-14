/**
 * SkeletonLoader Component
 * Base shimmer skeleton loader with gradient sweep animation.
 * Uses LinearGradient for a polished shimmer effect across all skeleton screens.
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
import type { SkeletonLoaderProps } from './types';

const SKELETON_COLORS = {
  base: '#E7E5E4',
  highlight: '#F5F5F4',
} as const;

const SHIMMER_DURATION = 1500;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  reduceMotion = false,
  style,
}: SkeletonLoaderProps) {
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

export default SkeletonLoader;
