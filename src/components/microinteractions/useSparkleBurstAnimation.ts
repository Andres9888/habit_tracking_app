import { useCallback, useEffect, useRef } from 'react';
import { durations } from '@/theme/animations';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface UseSparkleBurstAnimationProps {
  color: string;
  isActive: boolean;
  onComplete?: () => void;
  reduceMotion: boolean;
}

export function useSparkleBurstAnimation({
  color,
  isActive,
  onComplete,
  reduceMotion,
}: UseSparkleBurstAnimationProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const triggerComplete = useCallback(() => {
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (!isActive || reduceMotion) {
      if (isActive && reduceMotion) {
        triggerComplete();
      }
      return;
    }

    opacity.value = 0.9;
    scale.value = 0.6;

    opacity.value = withTiming(
      0,
      { duration: durations.emphasis, easing: Easing.out(Easing.ease) },
      (finished) => {
        'worklet';
        if (finished) {
          runOnJS(triggerComplete)();
        }
      }
    );
    scale.value = withTiming(1.6, {
      duration: durations.emphasis,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive, reduceMotion, opacity, scale, triggerComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle };
}
