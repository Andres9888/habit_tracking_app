/** useEnsureVisible — scroll plumbing behind SettingsScrollProvider.
 *  Owns the ScrollView ref, the viewport height, and the current offset so an
 *  expanding row can ask for its revealed content to be brought on screen. */
import { useCallback, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import type { LayoutChangeEvent, ScrollView } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { MeasurableView } from './SettingsScrollContext';

/** Leave the triggering row visible above the content it revealed. */
const TOP_MARGIN = 12;

export function useEnsureVisible(scrollY: SharedValue<number>) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportRef = useRef(0);

  const onScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
    viewportRef.current = e.nativeEvent.layout.height;
  }, []);

  const ensureVisible = useCallback(
    (node: MeasurableView | null) => {
      const scroller = scrollRef.current;
      if (!node || !scroller) return;

      const handle = findNodeHandle(scroller.getScrollableNode());
      if (handle == null) return;

      node.measureLayout(
        handle,
        (_x, y, _width, height) => {
          const viewport = viewportRef.current;
          if (!viewport) return;
          // measureLayout resolves against the scroll content, so `y` is an
          // absolute content offset already.
          const bottom = y + height;
          if (bottom <= scrollY.value + viewport) return;
          const target = Math.max(
            0,
            Math.min(bottom - viewport, y - TOP_MARGIN)
          );
          scroller.scrollTo({ animated: true, y: target });
        },
        () => {}
      );
    },
    [scrollY]
  );

  return { ensureVisible, onScrollViewLayout, scrollRef };
}
