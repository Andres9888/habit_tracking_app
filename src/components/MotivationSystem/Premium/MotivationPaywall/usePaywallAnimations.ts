/**
 * Animation hooks for MotivationPaywall
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

/**
 * Hook for CTA button glow animation
 */
export function useGlowAnimation(visible: boolean, reduceMotion: boolean) {
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (!visible || reduceMotion) return;

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [visible, glowOpacity, reduceMotion]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return { glowAnimatedStyle };
}

/**
 * Hook for CTA button press animation
 */
export function useButtonAnimation(reduceMotion: boolean) {
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    if (reduceMotion) return;
    buttonScale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  return { buttonAnimatedStyle, handlePressIn, handlePressOut };
}

/**
 * Hook for feature item stagger animation
 */
export function useFeatureAnimation(index: number, reduceMotion: boolean) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateX = useSharedValue(reduceMotion ? 0 : -20);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateX.value = 0;
      return;
    }

    const delay = 200 + index * 60;
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(0, { damping: 15 });
    }, delay);

    return () => clearTimeout(timer);
  }, [index, opacity, translateX, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return { animatedStyle };
}
