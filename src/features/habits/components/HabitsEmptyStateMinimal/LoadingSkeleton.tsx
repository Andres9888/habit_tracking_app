/**
 * LoadingSkeleton - Animated skeleton placeholders for loading state
 *
 * Features:
 * - Skeleton elements matching the empty state layout
 * - Shimmer animation using LinearGradient
 * - Skeleton colors: base #E7E5E4, highlight #F5F5F4
 * - Animation duration: 1.5s infinite
 * - Accessibility label for screen readers
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

import { BORDER_RADIUS, TOUCH_TARGETS } from './constants';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Skeleton colors per spec
 */
const SKELETON_COLORS = {
  base: '#E7E5E4',
  highlight: '#F5F5F4',
} as const;

/**
 * Shimmer animation duration per spec
 */
const SHIMMER_DURATION = 1500;

/**
 * Skeleton element dimensions matching the empty state layout
 */
const SKELETON_DIMENSIONS = {
  chip: { height: 44, width: 80 },
  cta: { height: 56 },
  headline: { height: 32, width: 260 },
  hero: { height: 80, width: 80 },
  input: { height: 56 },
} as const;

interface ShimmerSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

/**
 * Single skeleton element with shimmer animation
 */
function ShimmerSkeleton({
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
    // Animate the gradient from left to right
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

/**
 * Loading skeleton for the empty state
 *
 * Renders skeleton placeholders matching the layout:
 * - Hero icon (80x80)
 * - Headline (260x32)
 * - Input (100%x56)
 * - Chips (3 pill shapes)
 * - CTA button (100%x56)
 */
export function LoadingSkeleton() {
  return (
    <View
      accessibilityLabel='Loading'
      accessibilityRole='progressbar'
      style={styles.container}
    >
      {/* Hero Icon Skeleton */}
      <ShimmerSkeleton
        borderRadius={BORDER_RADIUS.heroIcon}
        height={SKELETON_DIMENSIONS.hero.height}
        width={SKELETON_DIMENSIONS.hero.width}
      />

      {/* Headline Skeleton */}
      <ShimmerSkeleton
        borderRadius={8}
        height={SKELETON_DIMENSIONS.headline.height}
        style={styles.headline}
        width={SKELETON_DIMENSIONS.headline.width}
      />

      {/* Input Skeleton */}
      <View style={styles.inputContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.input}
          height={SKELETON_DIMENSIONS.input.height}
          width='100%'
        />
      </View>

      {/* Chips Row Skeleton - 3 pill shapes */}
      <View style={styles.chipsContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          width={SKELETON_DIMENSIONS.chip.width}
        />
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          style={styles.chipSpacing}
          width={SKELETON_DIMENSIONS.chip.width}
        />
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          style={styles.chipSpacing}
          width={SKELETON_DIMENSIONS.chip.width}
        />
      </View>

      {/* CTA Button Skeleton */}
      <View style={styles.ctaContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.cta}
          height={SKELETON_DIMENSIONS.cta.height}
          width='100%'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  chipSpacing: {
    marginLeft: 12,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  ctaContainer: {
    width: '100%',
  },
  headline: {
    marginBottom: 32,
    marginTop: 32,
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
});
