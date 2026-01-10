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
  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: cardScale.value }],
  }));
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
