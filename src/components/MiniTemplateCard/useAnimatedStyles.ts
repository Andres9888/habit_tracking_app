/**
 * Animated styles for MiniTemplateCard component
 */

import { SharedValue } from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';

export function useImportButtonStyle(buttonPulse: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }],
  }));
}

export function useCheckmarkStyle(checkmarkScale: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: checkmarkScale.value,
    transform: [{ scale: checkmarkScale.value }],
  }));
}

export function useGlowStyle(successGlow: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: successGlow.value,
  }));
}

export function useChevronStyle(chevronTranslate: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    transform: [{ translateX: chevronTranslate.value }],
  }));
}

export function useScienceBadgeStyle(scienceBadgePulse: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: scienceBadgePulse.value,
  }));
}
