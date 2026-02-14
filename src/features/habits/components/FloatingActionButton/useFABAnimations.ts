import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export function useFABAnimations(
  celebrationsEnabled: boolean,
  reduceMotionPreference: boolean
) {
  const bounce = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0.6);

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      cancelAnimation(bounce);
      bounce.value = 0;
      return;
    }

    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 520, easing: Easing.inOut(Easing.ease) }),
        withDelay(1200, withTiming(0, { duration: 0 }))
      ),
      -1
    );

    return () => {
      cancelAnimation(bounce);
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pressScale.value },
      { translateY: bounce.value * -6 },
    ],
  }));

  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));

  return {
    pressScale,
    rippleOpacity,
    rippleScale,
    fabAnimatedStyle,
    rippleAnimatedStyle,
  };
}
