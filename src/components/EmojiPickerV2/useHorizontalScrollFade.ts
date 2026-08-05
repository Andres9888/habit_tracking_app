/**
 * Tracks horizontal scroll position to show/hide edge fade gradients.
 * Returns scroll handlers and boolean flags for left/right fades.
 */

import { useCallback, useRef, useState } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const SCROLL_THRESHOLD = 4;

export function useHorizontalScrollFade() {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const scrollMetrics = useRef({
    contentWidth: 0,
    layoutWidth: 0,
    offsetX: 0,
  });

  const updateFades = useCallback(() => {
    const { contentWidth, layoutWidth, offsetX } = scrollMetrics.current;
    const hasOverflow = contentWidth > layoutWidth + 1;

    setShowLeftFade(hasOverflow && offsetX > SCROLL_THRESHOLD);
    setShowRightFade(
      hasOverflow &&
        contentWidth - (offsetX + layoutWidth) > SCROLL_THRESHOLD
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      scrollMetrics.current = {
        contentWidth: contentSize.width,
        layoutWidth: layoutMeasurement.width,
        offsetX: contentOffset.x,
      };
      updateFades();
    },
    [updateFades]
  );

  return { handleScroll, showLeftFade, showRightFade };
}
