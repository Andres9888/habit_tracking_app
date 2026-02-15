/**
 * useSuccessExitAnimation - Exit animation for SuccessState
 */

import type { SharedValue } from 'react-native-reanimated';
import { useCallback, useRef } from 'react';

import {
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { EXIT_TRANSITION, EXIT_SPRING_CONFIG } from './animations';
import { useAutoTransitionTimer } from './useAutoTransitionTimer';
import { useExitAnimationStyles } from './useExitAnimationStyles';
import { useExitAnimationValues } from './useExitAnimationValues';

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
  const values = useExitAnimationValues();
  
  // Use ref for callback to avoid triggering useCallback re-creation
  const onTransitionCompleteRef = useRef(onTransitionComplete);
  onTransitionCompleteRef.current = onTransitionComplete;

  const triggerExitAnimation = useCallback(() => {
    if (isExiting.current) return;
    isExiting.current = true;

    if (shouldReduceMotion) {
      onTransitionCompleteRef.current?.();
      return;
    }

    values.ringOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    values.burstOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    values.iconTranslateY.value = withSpring(
      EXIT_TRANSITION.icon.translateY,
      EXIT_SPRING_CONFIG
    );
    values.iconExitScale.value = withTiming(EXIT_TRANSITION.icon.scale, {
      duration: EXIT_TRANSITION.icon.duration,
      easing: Easing.out(Easing.cubic),
    });
    contentOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    values.containerOpacity.value = withDelay(
      EXIT_TRANSITION.onCompleteDelay,
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished && onTransitionCompleteRef.current) {
          runOnJS(onTransitionCompleteRef.current)();
        }
      })
    );
  }, [shouldReduceMotion, contentOpacity, values]);

  useAutoTransitionTimer({
    autoTransition,
    containerOpacity: values.containerOpacity,
    iconExitScale: values.iconExitScale,
    iconTranslateY: values.iconTranslateY,
    onTransitionComplete,
    triggerExitAnimation,
  });

  const styles = useExitAnimationStyles({
    ...values,
    iconScale,
  });

  return { ...styles, triggerExitAnimation };
}
