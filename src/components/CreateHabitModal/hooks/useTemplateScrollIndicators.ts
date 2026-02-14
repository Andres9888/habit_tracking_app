import { useCallback, useRef, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export const useTemplateScrollIndicators = (): {
  handleContentSizeChange: (width: number, height: number) => void;
  handleLayout: (event: LayoutChangeEvent) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  resetIndicators: () => void;
  showBottomShadow: boolean;
  showTopShadow: boolean;
} => {
  const scrollOffset = useRef(0);
  const metrics = useRef({ contentHeight: 0, layoutHeight: 0 });
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  const updateShadows = useCallback(() => {
    const { contentHeight, layoutHeight } = metrics.current;
    const offsetY = scrollOffset.current;
    const hasScrollable = contentHeight > layoutHeight + 1;
    setShowTopShadow(hasScrollable && offsetY > 4);
    setShowBottomShadow(
      hasScrollable && contentHeight - (offsetY + layoutHeight) > 4
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      scrollOffset.current = contentOffset.y;
      metrics.current = {
        contentHeight: contentSize.height,
        layoutHeight: layoutMeasurement.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      metrics.current = { ...metrics.current, contentHeight: height };
      updateShadows();
    },
    [updateShadows]
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      metrics.current = {
        ...metrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const resetIndicators = useCallback(() => {
    scrollOffset.current = 0;
    metrics.current = { ...metrics.current, contentHeight: 0 };
    setShowTopShadow(false);
    setShowBottomShadow(false);
  }, []);

  return {
    handleContentSizeChange,
    handleLayout,
    handleScroll,
    resetIndicators,
    showBottomShadow,
    showTopShadow,
  };
};
