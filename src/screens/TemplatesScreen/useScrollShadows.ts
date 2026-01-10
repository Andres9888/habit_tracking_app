/**
 * Scroll shadow management for template lists
 * Shows gradient shadows at top/bottom when content is scrollable
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import type { ScrollMetrics } from './TemplatesScreen.types';

interface UseScrollShadowsOptions {
  resetDeps?: unknown[];
}

export function useScrollShadows(options: UseScrollShadowsOptions = {}) {
  const { resetDeps = [] } = options;

  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  const scrollOffset = useRef(0);
  const scrollMetrics = useRef<ScrollMetrics>({
    contentHeight: 0,
    layoutHeight: 0,
  });

  const updateShadows = useCallback(() => {
    const { layoutHeight, contentHeight } = scrollMetrics.current;
    const offsetY = scrollOffset.current;
    const hasScrollableContent = contentHeight > layoutHeight + 1;

    setShowTopShadow(hasScrollableContent && offsetY > 4);
    setShowBottomShadow(
      hasScrollableContent && contentHeight - (offsetY + layoutHeight) > 4
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      scrollOffset.current = contentOffset.y;
      scrollMetrics.current = {
        contentHeight: contentSize.height,
        layoutHeight: layoutMeasurement.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      scrollMetrics.current = {
        ...scrollMetrics.current,
        contentHeight: height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollMetrics.current = {
        ...scrollMetrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  // Reset shadows when dependencies change
  useEffect(() => {
    scrollOffset.current = 0;
    scrollMetrics.current = { ...scrollMetrics.current, contentHeight: 0 };
    setShowTopShadow(false);
    setShowBottomShadow(false);
  }, resetDeps);

  return {
    handleContentSizeChange,
    handleLayout,
    handleScroll,
    showBottomShadow,
    showTopShadow,
  };
}
