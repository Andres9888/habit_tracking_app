
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

export function useFABAnimations(
  celebrationsEnabled: boolean,
  reduceMotionPreference: boolean
) {
  const bounce = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      bounce.stopAnimation();
      bounce.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          duration: 260,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  return { bounce, pressScale, rippleOpacity, rippleScale };
}
