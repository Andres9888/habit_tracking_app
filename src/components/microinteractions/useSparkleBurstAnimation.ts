
import { Animated, Easing } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';

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
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  
  // Use ref for callback to prevent it from triggering useEffect re-runs
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

    opacity.setValue(0.9);
    scale.setValue(0.6);

    Animated.parallel([
      Animated.timing(opacity, {
        duration: 400,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
        toValue: 1.6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      triggerComplete();
    });
  }, [isActive, reduceMotion, opacity, scale, triggerComplete]);

  return { opacity, scale };
}
