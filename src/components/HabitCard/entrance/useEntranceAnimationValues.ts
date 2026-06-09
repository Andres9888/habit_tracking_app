/**
 * useEntranceAnimationValues Hook
 * Initializes shared values for entrance animations
 */

import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { ACCENT_TARGET_WIDTH } from './constants';
import type { EntranceAnimationValues } from './types';

/**
 * Creates and returns all shared animation values for entrance animations.
 * These values are used across various entrance animation variants.
 * 
 * Note: useMemo ensures the returned object reference is stable
 * to prevent unnecessary effect re-runs in consuming hooks.
 */
export function useEntranceAnimationValues(
  initialVisible = false
): EntranceAnimationValues {
  const cardOpacity = useSharedValue(initialVisible ? 1 : 0);
  const cardTranslateY = useSharedValue(initialVisible ? 0 : 20);
  const accentScaleY = useSharedValue(initialVisible ? 1 : 0);
  const accentWidth = useSharedValue(initialVisible ? ACCENT_TARGET_WIDTH : 0);
  const accentOpacity = useSharedValue(initialVisible ? 1 : 0);
  const contentOpacity = useSharedValue(initialVisible ? 1 : 0);
  const contentTranslateX = useSharedValue(initialVisible ? 0 : -10);
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
