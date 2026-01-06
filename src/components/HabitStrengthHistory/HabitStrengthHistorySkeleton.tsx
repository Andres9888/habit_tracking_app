/**
 * HabitStrengthHistorySkeleton Component
 *
 * Loading skeleton for the Habit Strength History section.
 * Displays shimmer placeholders matching the layout of the actual content.
 *
 * Features:
 * - 3 pulse cards for comparison section
 * - Gradient shimmer effect for timeline chart
 * - 3 insight cards with icon placeholders
 * - Respects reduced motion preference
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

import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Skeleton colors matching the design system
 */
const SKELETON_COLORS = {
  base: '#E7E5E4', // stone-200
  highlight: '#F5F5F4', // stone-100
} as const;

/**
 * Shimmer animation duration in milliseconds
 */
const SHIMMER_DURATION = 1500;

interface GradientShimmerSkeletonProps {
  height: number;
  borderRadius?: number;
  reduceMotion?: boolean;
}

/**
 * Skeleton element with gradient sweep shimmer animation.
 * Used for larger elements like charts where the gradient effect is more visible.
 */
function GradientShimmerSkeleton({
  height,
  borderRadius = 12,
  reduceMotion = false,
}: GradientShimmerSkeletonProps) {
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

interface HabitStrengthHistorySkeletonProps {
  reduceMotion?: boolean;
}

export function HabitStrengthHistorySkeleton({
  reduceMotion = false,
}: HabitStrengthHistorySkeletonProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit strength history'
      className='gap-4'
      testID='habit-strength-history-skeleton'
    >
      {/* Header skeleton */}
      <View className='flex-row items-center justify-between'>
        <SkeletonLoader
          borderRadius={6}
          height={20}
          reduceMotion={reduceMotion}
          width={140}
        />
        <SkeletonLoader
          borderRadius={10}
          height={20}
          reduceMotion={reduceMotion}
          width={20}
        />
      </View>

      {/* Comparison cards skeleton (3 pulse cards) */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className='flex-1 items-center rounded-xl bg-stone-50 p-3'
            testID={`skeleton-card-${i}`}
          >
            <SkeletonLoader
              borderRadius={28}
              height={56}
              reduceMotion={reduceMotion}
              width={56}
            />
            <View className='mt-2 w-full items-center gap-1'>
              <SkeletonLoader
                borderRadius={4}
                height={12}
                reduceMotion={reduceMotion}
                width={40}
              />
              <SkeletonLoader
                borderRadius={4}
                height={12}
                reduceMotion={reduceMotion}
                width={60}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Timeline chart skeleton with gradient shimmer */}
      <GradientShimmerSkeleton
        borderRadius={12}
        height={120}
        reduceMotion={reduceMotion}
      />

      {/* Insights row skeleton (3 cards) */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className='flex-1 flex-row items-center gap-2 rounded-lg bg-stone-50 px-3 py-2.5'
            testID={`skeleton-insight-${i}`}
          >
            <SkeletonLoader
              borderRadius={9}
              height={18}
              reduceMotion={reduceMotion}
              width={18}
            />
            <View className='flex-1 gap-1'>
              <SkeletonLoader
                borderRadius={4}
                height={14}
                reduceMotion={reduceMotion}
                width={40}
              />
              <SkeletonLoader
                borderRadius={3}
                height={10}
                reduceMotion={reduceMotion}
                width={50}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '200%',
  },
  gradientContainer: {
    backgroundColor: SKELETON_COLORS.base,
    overflow: 'hidden',
    width: '100%',
  },
});

export default HabitStrengthHistorySkeleton;
