/**
 * Scroll metrics + handler for the landing browse scroll hint.
 */

import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

export function useBrowseScrollHint() {
  const scrollY = useSharedValue(0);
  const [showHint, setShowHint] = useState(false);
  const scrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });

  const updateHint = useCallback(() => {
    const { contentHeight, layoutHeight } = scrollMetrics.current;
    setShowHint(contentHeight > layoutHeight + 1);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleContentSizeChange = useCallback(
    (_width: number, contentHeight: number) => {
      scrollMetrics.current = { ...scrollMetrics.current, contentHeight };
      updateHint();
    },
    [updateHint]
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollMetrics.current = {
        ...scrollMetrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateHint();
    },
    [updateHint]
  );

  return {
    handleContentSizeChange,
    handleLayout,
    scrollHandler,
    scrollY,
    showHint,
  };
}
