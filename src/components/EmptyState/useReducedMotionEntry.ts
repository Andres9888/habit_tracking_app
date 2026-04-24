/**
 * useReducedMotionEntry — Returns FadeInUp animation config
 * that respects system reduce-motion preference.
 *
 * Usage: `entering={entry(delay)}`
 */

import { useReducedMotion } from 'react-native-reanimated';
import { FadeIn, FadeInUp } from 'react-native-reanimated';
import { enterEasing } from '@/theme/animations';

/**
 * Returns an animation factory that respects the user's reduce-motion preference.
 * - Normal: FadeInUp with spring physics and staggered delay
 * - Reduced motion: Simple FadeIn (no translation)
 */
export function useReducedMotionEntry() {
  const reduceMotion = useReducedMotion();

  const entry = (delay: number) =>
    reduceMotion
      ? FadeIn.duration(300).delay(delay)
      : FadeInUp.duration(280).delay(delay).easing(enterEasing);

  return { entry, reduceMotion };
}
