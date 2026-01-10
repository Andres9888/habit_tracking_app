/**
 * useEntranceAnimationValues Hook
 * Initializes shared values for entrance animations
 */

import { useSharedValue } from 'react-native-reanimated';
import type { EntranceAnimationValues } from './types';

/**
 * Creates and returns all shared animation values for entrance animations.
 * These values are used across various entrance animation variants.
 */
export function useEntranceAnimationValues(): EntranceAnimationValues {
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const accentScaleY = useSharedValue(0);
  const accentWidth = useSharedValue(0);
  const accentOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateX = useSharedValue(-10);
  const isAnimating = useSharedValue(false);

  return {
    accentOpacity,
    accentScaleY,
    accentWidth,
    cardOpacity,
    cardTranslateY,
    contentOpacity,
    contentTranslateX,
    isAnimating,
  };
}
