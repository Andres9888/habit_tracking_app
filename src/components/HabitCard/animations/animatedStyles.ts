/**
 * HabitCard Animated Styles
 * Reusable animated style creators
 */

import {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  type SharedValue,
} from 'react-native-reanimated';
import { SWIPE_THRESHOLD } from '../HabitCard.constants';

export function useCardAnimatedStyle(
  translateX: SharedValue<number>,
  cardScale: SharedValue<number>
) {
  return useAnimatedStyle(() => {
    const scale = cardScale.value;
    // Elevate shadow when card is pressed (scale < 1) for a lift effect
    const isPressed = scale < 1;
    return {
      transform: [
        { translateX: translateX.value },
        { scale },
        // Subtle lift on press — card rises toward the user
        { translateY: isPressed ? -1.5 : 0 },
      ],
      // Dynamic shadow intensity for depth feedback
      shadowOpacity: isPressed ? 0.14 : 0.08,
      shadowRadius: isPressed ? 24 : 16,
      shadowOffset: { width: 0, height: isPressed ? 8 : 4 },
      elevation: isPressed ? 6 : 3,
    };
  });
}

export function useActionsAnimatedStyle(translateX: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));
}

export function useCheckmarkAnimatedStyle(
  scale: SharedValue<number>,
  rotate: SharedValue<number>
) {
  return useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${Math.round(rotate.value)}deg` },
    ],
  }));
}

export function useRippleAnimatedStyle(
  scale: SharedValue<number>,
  opacity: SharedValue<number>
) {
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
}
