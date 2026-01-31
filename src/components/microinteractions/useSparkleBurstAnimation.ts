import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

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

  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🌟 SparkleBurst:', { color, isActive, reduceMotion });
    }

    if (!isActive || reduceMotion) {
      if (isActive && reduceMotion) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('🌟 SparkleBurst skipped (reduceMotion enabled)');
        }
        onComplete?.();
      }
      return;
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🌟 SparkleBurst TRIGGERED!');
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
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('🌟 SparkleBurst completed');
      }
      onComplete?.();
    });
  }, [isActive, onComplete, opacity, reduceMotion, scale, color]);

  return { opacity, scale };
}
