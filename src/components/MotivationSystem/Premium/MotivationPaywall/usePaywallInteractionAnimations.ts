/**
 * Interaction Animation Hooks for Paywall
 * Card tap: Scale to 1.01 (150ms), CTA press: Scale to 0.97/1.0
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const EASE_OUT = Easing.out(Easing.ease);

/** Card interaction (scale to 1.01 on tap) */
export function useCardInteractionAnimation(reduceMotion: boolean) {
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    if (!reduceMotion)
      scale.value = withTiming(1.01, { duration: 150, easing: EASE_OUT });
  };
  const handlePressOut = () => {
    if (!reduceMotion)
      scale.value = withTiming(1, { duration: 150, easing: EASE_OUT });
  };
  return {
    animatedStyle: useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    })),
    handlePressIn,
    handlePressOut,
  };
}

/** CTA press (scale to 0.97, release to 1.0) */
export function useCTAPressAnimation(reduceMotion: boolean) {
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    if (!reduceMotion)
      scale.value = withTiming(0.97, { duration: 120, easing: EASE_OUT });
  };
  const handlePressOut = () => {
    if (!reduceMotion)
      scale.value = withTiming(1, { duration: 180, easing: EASE_OUT });
  };
  return {
    animatedStyle: useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    })),
    handlePressIn,
    handlePressOut,
  };
}
