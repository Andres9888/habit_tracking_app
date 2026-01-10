/**
 * Screen entrance animation hooks for TemplatesScreen
 */

import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface UseEntranceAnimationsOptions {
  reducedMotion: boolean;
}

export function useEntranceAnimations({
  reducedMotion,
}: UseEntranceAnimationsOptions) {
  const headerTranslateY = useSharedValue(-20);
  const headerOpacity = useSharedValue(0);
  const searchOpacity = useSharedValue(0);
  const searchTranslateY = useSharedValue(15);
  const tabBarOpacity = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(15);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    // Content is instant - modal slide IS the animation (like native iOS sheets)
    headerTranslateY.value = 0;
    headerOpacity.value = 1;
    searchTranslateY.value = 0;
    searchOpacity.value = 1;
    tabBarTranslateY.value = 0;
    tabBarOpacity.value = 1;
    contentTranslateY.value = 0;
    contentOpacity.value = 1;
  }, [reducedMotion]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ translateY: searchTranslateY.value }],
  }));

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabBarOpacity.value,
    transform: [{ translateY: tabBarTranslateY.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return {
    contentAnimatedStyle,
    headerAnimatedStyle,
    searchAnimatedStyle,
    tabBarAnimatedStyle,
  };
}
