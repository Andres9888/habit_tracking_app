/**
 * CtaButton - Primary call-to-action button
 *
 * Features:
 * - Disabled state with 40% opacity
 * - Press animation (scale 0.98)
 * - Hover animation (translateY -1px)
 * - Loading state with spinner
 * - Shimmer animation when transitioning from disabled to enabled
 */

import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CTA_SHIMMER, CTA_TRANSFORMS, SPRING_CONFIGS } from './animations';
import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { CtaButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Primary action button with disabled/loading states
 */
export function CtaButton({ disabled, isLoading, onPress }: CtaButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Track previous disabled state for shimmer trigger
  const wasDisabledRef = useRef(disabled);
  const shimmerProgress = useSharedValue(0);

  // Trigger shimmer when disabled changes from true to false
  useEffect(() => {
    const wasDisabled = wasDisabledRef.current;
    wasDisabledRef.current = disabled;

    // Only shimmer on enable transition (disabled: true -> false)
    // Skip shimmer if reduced motion is enabled
    if (wasDisabled && !disabled && !shouldReduceMotion) {
      shimmerProgress.value = 0;
      shimmerProgress.value = withTiming(1, {
        duration: CTA_SHIMMER.duration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [disabled, shimmerProgress, shouldReduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  // Shimmer gradient animation style
  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    // Animate the gradient from left to right across the button
    // Start off-screen left (-100%), end off-screen right (100%)
    const translateX = interpolate(shimmerProgress.value, [0, 1], [-100, 100]);
    return {
      opacity: shimmerProgress.value > 0 && shimmerProgress.value < 1 ? 1 : 0,
      transform: [{ translateX: `${translateX}%` as unknown as number }],
    };
  });

  const handlePressIn = useCallback(() => {
    if (disabled || isLoading || shouldReduceMotion) return;
    scale.value = withSpring(
      CTA_TRANSFORMS.pressScale,
      SPRING_CONFIGS.ctaPress
    );
  }, [disabled, isLoading, scale, shouldReduceMotion]);

  const handlePressOut = useCallback(() => {
    if (shouldReduceMotion) return;
    scale.value = withSpring(1, SPRING_CONFIGS.ctaPress);
    translateY.value = withSpring(0, SPRING_CONFIGS.ctaPress);
  }, [scale, shouldReduceMotion, translateY]);

  const handlePress = useCallback(() => {
    if (disabled || isLoading) return;
    onPress();
  }, [disabled, isLoading, onPress]);

  const isDisabled = disabled || isLoading;

  return (
    <AnimatedPressable
      accessibilityHint={
        isDisabled ? 'Enter a habit name first' : 'Creates your new habit'
      }
      accessibilityLabel={COPY.ctaButton}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          backgroundColor: COLORS.emerald500,
          borderRadius: BORDER_RADIUS.cta,
          elevation: isDisabled ? 0 : 4,
          height: TOUCH_TARGETS.ctaHeight,
          justifyContent: 'center',
          opacity: isDisabled ? 0.4 : 1,
          overflow: 'hidden',
          paddingVertical: 16,

          // Required for shimmer to clip at button edges
          // Shadow for depth
          shadowColor: COLORS.emerald500,

          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          width: '100%',
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Shimmer overlay - sweeps across when button becomes enabled */}
      <AnimatedLinearGradient
        colors={[
          'transparent',
          `rgba(255, 255, 255, ${CTA_SHIMMER.gradientOpacity})`,
          'transparent',
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[
          StyleSheet.absoluteFillObject,
          { width: '100%' },
          shimmerAnimatedStyle,
        ]}
        testID='cta-shimmer-overlay'
      />
      {isLoading ? (
        <ActivityIndicator color='#ffffff' size='small' />
      ) : (
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          {COPY.ctaButton}
        </Text>
      )}
    </AnimatedPressable>
  );
}
