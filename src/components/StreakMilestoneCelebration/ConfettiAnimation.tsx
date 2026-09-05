/**
 * ConfettiAnimation Component
 * Particle system for streak milestone celebrations
 *
 * Uses react-native-confetti-cannon with milestone-themed colors
 * Respects reduce motion accessibility setting
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useReducedMotion } from 'react-native-reanimated';
import {
  CONFETTI_COLORS,
  SCREEN_WIDTH,
  ANIMATION_TIMING,
} from './constants';
import type { ConfettiAnimationProps } from './types';

export function ConfettiAnimation({
  active,
  onComplete,
}: ConfettiAnimationProps) {
  const confettiRef = useRef<ConfettiCannon>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (active && confettiRef.current && !reduceMotion) {
      // Slight delay for modal to appear first
      const timer = setTimeout(() => {
        confettiRef.current?.start();
      }, ANIMATION_TIMING.CONFETTI_DELAY);

      return () => clearTimeout(timer);
    }
  }, [active, reduceMotion]);

  // Don't render if reduce motion is enabled
  if (reduceMotion) {
    return null;
  }

  if (!active) {
    return null;
  }

  return (
    <ConfettiCannon
      ref={confettiRef}
      fadeOut
      autoStart={false}
      colors={CONFETTI_COLORS}
      count={150}
      explosionSpeed={400}
      fallSpeed={2800}
      origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
      onAnimationEnd={onComplete}
    />
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
});

export default ConfettiAnimation;
