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
 * `startVisible` initializes values at their final visible state so cards
 * that will not animate (e.g. rows mounted by list virtualization while
 * scrolling) are visible on their very first frame instead of waiting for
 * a post-mount effect. Only the mount-time value matters — shared values
 * ignore later changes to the initial argument.
 *
 * Note: useMemo ensures the returned object reference is stable
 * to prevent unnecessary effect re-runs in consuming hooks.
 */
export function useEntranceAnimationValues(
  startVisible = false
): EntranceAnimationValues {
  const cardOpacity = useSharedValue(startVisible ? 1 : 0);
  const cardTranslateY = useSharedValue(startVisible ? 0 : 20);
  const accentScaleY = useSharedValue(startVisible ? 1 : 0);
  const accentWidth = useSharedValue(startVisible ? ACCENT_TARGET_WIDTH : 0);
  const accentOpacity = useSharedValue(startVisible ? 1 : 0);
  const contentOpacity = useSharedValue(startVisible ? 1 : 0);
  const contentTranslateX = useSharedValue(startVisible ? 0 : -10);
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
