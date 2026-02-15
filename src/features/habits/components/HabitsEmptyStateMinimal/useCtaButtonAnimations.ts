/**
 * useCtaButtonAnimations - Animation hooks for CtaButton
 */

import { useCallback, useEffect, useRef } from 'react';

import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CTA_SHIMMER, CTA_TRANSFORMS, SPRING_CONFIGS } from './animations';

interface UseCtaButtonAnimationsOptions {
  disabled: boolean;
  isLoading: boolean;
}

export function useCtaButtonAnimations({
  disabled,
  isLoading,
}: UseCtaButtonAnimationsOptions) {
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const wasDisabledRef = useRef(disabled);
  const shimmerProgress = useSharedValue(0);

  // Trigger shimmer when disabled changes from true to false
  useEffect(() => {
    const wasDisabled = wasDisabledRef.current;
    wasDisabledRef.current = disabled;

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

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
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

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    shimmerAnimatedStyle,
  };
}
