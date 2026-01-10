/**
 * Tab indicator animation hook for TemplatesScreen
 */

import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { LayoutChangeEvent } from 'react-native';

interface UseTabIndicatorOptions {
  reducedMotion: boolean;
}

export function useTabIndicator({ reducedMotion }: UseTabIndicatorOptions) {
  const tabIndicatorPosition = useSharedValue(0);
  const tabBarWidth = useSharedValue(0);

  const tabIndicatorStyle = useAnimatedStyle(() => {
    const padding = 5;
    const availableWidth = tabBarWidth.value - padding * 2;
    const indicatorWidth = availableWidth / 2;
    const translateX = tabIndicatorPosition.value * indicatorWidth;

    return {
      transform: [{ translateX }],
      width: indicatorWidth,
    };
  });

  const handleTabBarLayout = useCallback(
    (event: LayoutChangeEvent) => {
      tabBarWidth.value = event.nativeEvent.layout.width;
    },
    [tabBarWidth]
  );

  const setTabPosition = useCallback(
    (position: 0 | 1) => {
      tabIndicatorPosition.value = reducedMotion
        ? position
        : withSpring(position, { damping: 20, stiffness: 300 });
    },
    [reducedMotion, tabIndicatorPosition]
  );

  return { handleTabBarLayout, setTabPosition, tabIndicatorStyle };
}
