import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function usePulseAnimation(currentStreak: number) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) console.warn('Error checking reduce motion setting:', error);
        setReduceMotion(false);
      });
  }, []);

  useEffect(() => {
    if (reduceMotion || currentStreak === 0) return;

    const timing = (to: number) =>
      withTiming(to, { duration: 1000, easing: Easing.inOut(Easing.ease) });

    pulseScale.value = withRepeat(
      withSequence(timing(1.05), timing(1)),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(timing(1), timing(0.6)),
      -1,
      true
    );
  }, [currentStreak, reduceMotion]);

  return useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));
}
