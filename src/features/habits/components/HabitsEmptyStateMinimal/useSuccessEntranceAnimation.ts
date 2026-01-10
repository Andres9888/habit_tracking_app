/**
 * useSuccessEntranceAnimation - Entrance animation for SuccessState
 *
 * Handles the initial icon pop and content fade-in effects.
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import { POP_ANIMATION, SPRING_CONFIGS } from './animations';

interface UseSuccessEntranceAnimationParams {
  shouldReduceMotion: boolean | null;
}

export function useSuccessEntranceAnimation({
  shouldReduceMotion,
}: UseSuccessEntranceAnimationParams) {
  const iconScale = useSharedValue(
    shouldReduceMotion ? POP_ANIMATION.finalScale : POP_ANIMATION.initialScale
  );
  const contentOpacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const contentTranslateY = useSharedValue(shouldReduceMotion ? 0 : 20);

  useEffect(() => {
    if (shouldReduceMotion) {
      iconScale.value = POP_ANIMATION.finalScale;
      contentOpacity.value = 1;
      contentTranslateY.value = 0;
      return;
    }

    iconScale.value = withSequence(
      withTiming(POP_ANIMATION.overshootScale, {
        duration: POP_ANIMATION.duration * 0.6,
      }),
      withSpring(POP_ANIMATION.finalScale, SPRING_CONFIGS.successPop)
    );

    contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    contentTranslateY.value = withDelay(
      200,
      withSpring(0, SPRING_CONFIGS.entrance)
    );
  }, [contentOpacity, contentTranslateY, iconScale, shouldReduceMotion]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return {
    contentOpacity,
    contentStyle,
    iconScale,
  };
}
