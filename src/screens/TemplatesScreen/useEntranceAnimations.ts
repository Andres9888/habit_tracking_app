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

  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: headerOpacity.value ?? 1,
      transform: [{ translateY: headerTranslateY.value ?? 0 }],
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: searchOpacity.value ?? 1,
      transform: [{ translateY: searchTranslateY.value ?? 0 }],
    };
  });

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: tabBarOpacity.value ?? 1,
      transform: [{ translateY: tabBarTranslateY.value ?? 0 }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: contentOpacity.value ?? 1,
      transform: [{ translateY: contentTranslateY.value ?? 0 }],
    };
  });

  return {
    contentAnimatedStyle,
    headerAnimatedStyle,
    searchAnimatedStyle,
    tabBarAnimatedStyle,
  };
}
