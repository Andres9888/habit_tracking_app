/**
 * ScrollRevealWrapper - Animated wrapper for scroll reveal effect
 */

import React from 'react';

import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  enabled: boolean;
  reducedMotion: boolean;
}

export function ScrollRevealWrapper({
  children,
  enabled,
  reducedMotion,
}: ScrollRevealWrapperProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  const animation = reducedMotion
    ? FadeIn.duration(0)
    : FadeInUp.duration(350).springify().damping(18).stiffness(150);

  return <Animated.View entering={animation}>{children}</Animated.View>;
}
