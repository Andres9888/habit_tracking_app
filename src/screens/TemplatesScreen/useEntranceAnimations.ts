/**
 * Screen entrance animation hooks for TemplatesScreen
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const ENTRANCE_SPRING = { damping: 24, stiffness: 400 };
const FADE_CONFIG = { duration: 150, easing: Easing.out(Easing.cubic) };
const CONTENT_FADE = { duration: 180, easing: Easing.out(Easing.cubic) };

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
    if (reducedMotion) {
      headerTranslateY.value = 0;
      headerOpacity.value = 1;
      searchTranslateY.value = 0;
      searchOpacity.value = 1;
      tabBarTranslateY.value = 0;
      tabBarOpacity.value = 1;
      contentTranslateY.value = 0;
      contentOpacity.value = 1;
      return;
    }

    // All elements animate in parallel with the same timing
    headerTranslateY.value = withSpring(0, ENTRANCE_SPRING);
    headerOpacity.value = withTiming(1, FADE_CONFIG);

    searchTranslateY.value = withSpring(0, ENTRANCE_SPRING);
    searchOpacity.value = withTiming(1, FADE_CONFIG);

    tabBarTranslateY.value = withSpring(0, ENTRANCE_SPRING);
    tabBarOpacity.value = withTiming(1, FADE_CONFIG);

    contentTranslateY.value = withSpring(0, ENTRANCE_SPRING);
    contentOpacity.value = withTiming(1, CONTENT_FADE);
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
