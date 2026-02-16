/**
 * useStrengthHeroAnimations Hook
 *
 * Manages animation state for the StrengthHero component.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { ANIMATION } from '../constants';

/**
 * Hook to manage strength ring animations with reduce motion support.
 */
export function useStrengthHeroAnimations(strength: number) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const animatedStrength = useSharedValue(0);

  // Check for reduce motion preference
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) console.warn('Error checking reduce motion setting:', error);
        setReduceMotion(false);
      });
  }, []);

  // Animate ring fill on mount and when strength changes
  // Guard against NaN/undefined and round to integer to avoid Reanimated precision errors
  const safeStrength =
    typeof strength === 'number' && !Number.isNaN(strength) ? strength : 0;
  const roundedStrength = Math.round(safeStrength);

  useEffect(() => {
    animatedStrength.value = reduceMotion
      ? roundedStrength
      : withTiming(roundedStrength, {
          duration: ANIMATION.ringDuration,
          easing: Easing.out(Easing.cubic),
        });
  }, [roundedStrength, reduceMotion, animatedStrength]);

  return {
    animatedStrength,
    roundedStrength,
  };
}
