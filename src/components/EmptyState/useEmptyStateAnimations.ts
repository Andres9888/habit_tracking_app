/**
 * useEmptyStateAnimations Hook
 * Entrance animation with stagger (UX spec Section 8.2)
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import type { EmptyStateVariant } from './types';
import { springs } from '@/theme/animations';

const SPRING_CONFIG = springs.standard;

export function useEmptyStateAnimations(variant: EmptyStateVariant) {
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.9);
  const headlineOpacity = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(20);

  useEffect(() => {
    // Icon: fade in and scale up
    iconOpacity.value = withSpring(1, SPRING_CONFIG);
    iconScale.value = withSpring(1, SPRING_CONFIG);

    // Headline: fade in with delay
    headlineOpacity.value = withDelay(200, withSpring(1, SPRING_CONFIG));

    // Description: fade in with delay
    descriptionOpacity.value = withDelay(300, withSpring(1, SPRING_CONFIG));

    // CTA: fade in and slide up with delay
    ctaOpacity.value = withDelay(400, withSpring(1, SPRING_CONFIG));
    ctaTranslateY.value = withDelay(400, withSpring(0, SPRING_CONFIG));
  }, [variant]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  return { ctaStyle, descriptionStyle, headlineStyle, iconStyle };
}
