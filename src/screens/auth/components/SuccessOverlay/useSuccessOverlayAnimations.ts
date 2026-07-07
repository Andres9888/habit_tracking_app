import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

export function useSuccessOverlayAnimations(
  visible: boolean,
  onAnimationComplete?: () => void
) {
  const overlayOpacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  
  // Use ref for callback to avoid triggering useEffect re-runs
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: durations.moderate });

      ringScale.value = withDelay(
        100,
        withSequence(
          withSpring(1.2, springs.bouncy),
          withTiming(1.5, { duration: durations.emphasis })
        )
      );
      ringOpacity.value = withDelay(
        100,
        withSequence(
          withTiming(0.5, { duration: durations.standard }),
          withTiming(0, { duration: durations.emphasis })
        )
      );

      checkmarkScale.value = withDelay(
        200,
        withSpring(1, springs.bouncy)
      );
      checkmarkOpacity.value = withDelay(200, withTiming(1, { duration: durations.standard }));

      textOpacity.value = withDelay(400, withTiming(1, { duration: durations.moderate }));
      textTranslateY.value = withDelay(
        400,
        withSpring(0, springs.gentle)
      );

      if (onAnimationCompleteRef.current) {
        const timer = setTimeout(() => {
          onAnimationCompleteRef.current?.();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      overlayOpacity.value = 0;
      checkmarkScale.value = 0;
      checkmarkOpacity.value = 0;
      ringScale.value = 0;
      ringOpacity.value = 0;
      textOpacity.value = 0;
      textTranslateY.value = 20;
    }
  }, [visible, overlayOpacity, checkmarkScale, checkmarkOpacity, ringScale, ringOpacity, textOpacity, textTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return { checkmarkStyle, overlayStyle, ringStyle, textStyle };
}
