/**
 * useStickyHeader — tracks scroll offset to derive sticky state.
 *
 * Returns:
 * - scrollHandler: pass to DraggableFlatList's onScroll
 * - stickyProgress: SharedValue<number> (0 → normal, 1 → sticky)
 * - contextValue: ready-made value for StickyHeaderContext.Provider
 */

import { useMemo } from 'react';
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import type { StickyHeaderContextValue } from '../../../../components/CalendarTimeline/StickyHeaderContext';

/** Matches pt-12 (48px) — the point where the shelf reaches screen top */
const STICKY_THRESHOLD = 48;
const ANIM_DURATION = 180;

export function useStickyHeader(enabled = false) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const stickyProgress = useDerivedValue((): number => 0);

  const contextValue = useMemo<StickyHeaderContextValue>(
    () => ({ stickyProgress }),
    [stickyProgress]
  );

  return { scrollHandler, stickyProgress, contextValue } as const;
}
