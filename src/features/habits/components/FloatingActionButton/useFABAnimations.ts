import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const INITIAL_BOUNCE = 0;
const INITIAL_SCALE = 1;
const INITIAL_RIPPLE_OPACITY = 0;
const INITIAL_RIPPLE_SCALE = 0.6;
const BOUNCE_UP_DURATION_MS = 260;
const BOUNCE_DOWN_DURATION_MS = 520;
const BOUNCE_LOOP_DELAY_MS = 1200;
const PEAK_BOUNCE = 1;

export function useFABAnimations(
  celebrationsEnabled: boolean,
  reduceMotionPreference: boolean
) {
  const bounce = useRef(new Animated.Value(INITIAL_BOUNCE)).current;
  const pressScale = useRef(new Animated.Value(INITIAL_SCALE)).current;
  const rippleOpacity = useRef(new Animated.Value(INITIAL_RIPPLE_OPACITY)).current;
  const rippleScale = useRef(new Animated.Value(INITIAL_RIPPLE_SCALE)).current;

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      bounce.stopAnimation();
      bounce.setValue(INITIAL_BOUNCE);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          duration: BOUNCE_UP_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          toValue: PEAK_BOUNCE,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          duration: BOUNCE_DOWN_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          toValue: INITIAL_BOUNCE,
          useNativeDriver: true,
        }),
        Animated.delay(BOUNCE_LOOP_DELAY_MS),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  return { bounce, pressScale, rippleOpacity, rippleScale };
}
