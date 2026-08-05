/**
 * useHeaderTintAnimation - Fades the ModalHeader tint to transparent as the
 * user scrolls past the HeroSection, so the header background matches whichever
 * section sits under it (peach over hero, gray-50 over content) — improves
 * readability + flow by keeping header chrome coherent with content.
 */

import { useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const FADE_DISTANCE = 60;

export function useHeaderTintAnimation(headerTint: string) {
  const scrollY = useSharedValue(0);
  const heroHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onHeroLayout = useCallback(
    (event: LayoutChangeEvent) => {
      heroHeight.value = event.nativeEvent.layout.height;
    },
    [heroHeight]
  );

  const animatedBgStyle = useAnimatedStyle(() => {
    const end = heroHeight.value;
    if (end <= 0) return { backgroundColor: headerTint };
    const start = Math.max(0, end - FADE_DISTANCE);
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [start, end],
        [headerTint, 'transparent']
      ),
    };
  });

  return { scrollHandler, onHeroLayout, animatedBgStyle, scrollY };
}
