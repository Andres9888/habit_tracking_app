/**
 * useEntranceAnimationValues Hook
 * Initializes shared values for entrance animations
 */

import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { EntranceAnimationValues } from './types';

/**
 * Creates and returns all shared animation values for entrance animations.
 * These values are used across various entrance animation variants.
 * 
 * Note: useMemo ensures the returned object reference is stable
 * to prevent unnecessary effect re-runs in consuming hooks.
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

  // Memoize the return object to prevent creating new object references
  // on every render, which would cause useEffect re-runs in consuming hooks
  return useMemo(
    () => ({
      accentOpacity,
      accentScaleY,
      accentWidth,
      cardOpacity,
      cardTranslateY,
      contentOpacity,
      contentTranslateX,
      isAnimating,
    }),
    [
      accentOpacity,
      accentScaleY,
      accentWidth,
      cardOpacity,
      cardTranslateY,
      contentOpacity,
      contentTranslateX,
      isAnimating,
    ]
  );
}
