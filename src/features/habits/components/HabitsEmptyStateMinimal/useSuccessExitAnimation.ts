/**
 * useSuccessExitAnimation - Exit animation for SuccessState
 *
 * Handles the shared element transition when exiting success state.
 */

import { useCallback, useRef } from 'react';
import {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { EXIT_TRANSITION, EXIT_SPRING_CONFIG } from './animations';
import { useAutoTransitionTimer } from './useAutoTransitionTimer';

interface UseSuccessExitAnimationParams {
  shouldReduceMotion: boolean | null;
  autoTransition: boolean;
  onTransitionComplete?: () => void;
  iconScale: SharedValue<number>;
  contentOpacity: SharedValue<number>;
}

export function useSuccessExitAnimation({
  shouldReduceMotion,
  autoTransition,
  onTransitionComplete,
  iconScale,
  contentOpacity,
}: UseSuccessExitAnimationParams) {
  const isExiting = useRef(false);
  const autoTransitionTimeout = useRef<NodeJS.Timeout | null>(null);

  const iconTranslateY = useSharedValue(0);
  const iconExitScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const ringOpacity = useSharedValue(1);
  const burstOpacity = useSharedValue(1);

  const triggerExitAnimation = useCallback(() => {
    if (isExiting.current) return;
    isExiting.current = true;

    if (autoTransitionTimeout.current) {
      clearTimeout(autoTransitionTimeout.current);
      autoTransitionTimeout.current = null;
    }

    if (shouldReduceMotion) {
      onTransitionComplete?.();
      return;
    }

    ringOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    burstOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    iconTranslateY.value = withSpring(
      EXIT_TRANSITION.icon.translateY,
      EXIT_SPRING_CONFIG
    );
    iconExitScale.value = withTiming(EXIT_TRANSITION.icon.scale, {
      duration: EXIT_TRANSITION.icon.duration,
      easing: Easing.out(Easing.cubic),
    });
    contentOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    containerOpacity.value = withDelay(
      EXIT_TRANSITION.onCompleteDelay,
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished && onTransitionComplete) {
          runOnJS(onTransitionComplete)();
        }
      })
    );
  }, [
    shouldReduceMotion,
    onTransitionComplete,
    iconTranslateY,
    iconExitScale,
    contentOpacity,
    containerOpacity,
    ringOpacity,
    burstOpacity,
  ]);

  useAutoTransitionTimer({
    autoTransition,
    containerOpacity,
    iconExitScale,
    iconTranslateY,
    onTransitionComplete,
    triggerExitAnimation,
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value * iconExitScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: ringOpacity.value }));
  const burstStyle = useAnimatedStyle(() => ({ opacity: burstOpacity.value }));

  return {
    burstStyle,
    containerStyle,
    iconStyle,
    ringStyle,
    triggerExitAnimation,
  };
}
