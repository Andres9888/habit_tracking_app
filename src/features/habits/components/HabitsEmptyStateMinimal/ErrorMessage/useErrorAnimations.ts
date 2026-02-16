/**
 * Animation hooks for ErrorMessage
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ERROR_ANIMATION } from '../animations';

interface UseErrorAnimationsParams {
  onDismiss: () => void;
  autoDismiss: boolean;
}

export function useErrorAnimations({
  onDismiss,
  autoDismiss,
}: UseErrorAnimationsParams) {
  const shouldReduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);
  const translateX = useSharedValue(0);

  // Use ref for callback to prevent it from triggering useEffect re-runs
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished && onDismissRef.current) {
        runOnJS(onDismissRef.current)();
      }
    });
  }, [opacity]);

  useEffect(() => {
    if (shouldReduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const {
      entranceDuration,
      shakeDuration,
      shakeDistance,
      shakeOscillations,
    } = ERROR_ANIMATION;

    opacity.value = withTiming(1, {
      duration: entranceDuration,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: entranceDuration,
      easing: Easing.out(Easing.ease),
    });

    const segmentDuration = shakeDuration / (shakeOscillations * 2);
    const shakeSequence: number[] = [];
    for (let i = 0; i < shakeOscillations; i++) {
      shakeSequence.push(
        withTiming(shakeDistance, { duration: segmentDuration }),
        withTiming(-shakeDistance, { duration: segmentDuration })
      );
    }
    shakeSequence.push(withTiming(0, { duration: segmentDuration }));

    const shakeTimer = setTimeout(() => {
      translateX.value = withSequence(...shakeSequence);
    }, entranceDuration);

    return () => clearTimeout(shakeTimer);
  }, [opacity, shouldReduceMotion, translateX, translateY]);

  useEffect(() => {
    if (!autoDismiss) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, ERROR_ANIMATION.autoDismissDelay);

    return () => clearTimeout(timer);
  }, [autoDismiss, handleDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return { animatedStyle, handleDismiss };
}
