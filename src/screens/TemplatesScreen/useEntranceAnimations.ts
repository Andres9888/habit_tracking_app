/**
 * Screen entrance animation hooks for TemplatesScreen
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

const TRANSLATE_CONFIG = { duration: durations.enter, easing: enterEasing };
const FADE_CONFIG = { duration: durations.quick, easing: enterEasing };
const CONTENT_FADE = { duration: durations.reveal, easing: enterEasing };

interface UseEntranceAnimationsOptions {
  reducedMotion: boolean;
}

export function useEntranceAnimations({
  reducedMotion,
}: UseEntranceAnimationsOptions) {
  const searchOpacity = useSharedValue(0);
  const searchTranslateY = useSharedValue(15);
  const tabBarOpacity = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(15);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    if (reducedMotion) {
      searchTranslateY.value = 0;
      searchOpacity.value = 1;
      tabBarTranslateY.value = 0;
      tabBarOpacity.value = 1;
      contentTranslateY.value = 0;
      contentOpacity.value = 1;
      return;
    }

    searchTranslateY.value = withTiming(0, TRANSLATE_CONFIG);
    searchOpacity.value = withTiming(1, FADE_CONFIG);

    tabBarTranslateY.value = withTiming(0, TRANSLATE_CONFIG);
    tabBarOpacity.value = withTiming(1, FADE_CONFIG);

    contentTranslateY.value = withTiming(0, TRANSLATE_CONFIG);
    contentOpacity.value = withTiming(1, CONTENT_FADE);
  }, [reducedMotion]);

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
    searchAnimatedStyle,
    tabBarAnimatedStyle,
  };
}
