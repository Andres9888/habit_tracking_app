/**
 * Tab indicator animation hook for TemplatesScreen
 */

import { useCallback } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { LayoutChangeEvent } from 'react-native';

const INDICATOR_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };

interface UseTabIndicatorOptions {
  reducedMotion: boolean;
}

export function useTabIndicator({ reducedMotion }: UseTabIndicatorOptions) {
  const tabIndicatorPosition = useSharedValue(0);
  const tabBarWidth = useSharedValue(0);

  const tabIndicatorStyle = useAnimatedStyle(() => {
    'worklet';
    const padding = 5;
    const availableWidth = Math.max(0, tabBarWidth.value - padding * 2);
    const indicatorWidth = availableWidth > 0 ? availableWidth / 2 : 100;
    const translateX = tabIndicatorPosition.value * indicatorWidth;

    return {
      transform: [{ translateX: translateX || 0 }],
      width: indicatorWidth || 100,
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
        : withTiming(position, INDICATOR_CONFIG);
    },
    [reducedMotion, tabIndicatorPosition]
  );

  return { handleTabBarLayout, setTabPosition, tabIndicatorStyle };
}
