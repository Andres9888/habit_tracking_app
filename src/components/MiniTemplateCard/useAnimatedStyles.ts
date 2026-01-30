/**
 * Animated styles for MiniTemplateCard component
 */

import { SharedValue } from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';

export function useImportButtonStyle(buttonPulse: SharedValue<number>) {
  return useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: buttonPulse.value ?? 1 }] };
  });
}

export function useCheckmarkStyle(checkmarkScale: SharedValue<number>) {
  return useAnimatedStyle(() => {
    'worklet';
    const scale = checkmarkScale.value ?? 0;
    return { opacity: scale, transform: [{ scale }] };
  });
}

export function useGlowStyle(successGlow: SharedValue<number>) {
  return useAnimatedStyle(() => {
    'worklet';
    return { opacity: successGlow.value ?? 0 };
  });
}

export function useChevronStyle(chevronTranslate: SharedValue<number>) {
  return useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: chevronTranslate.value ?? 0 }] };
  });
}

export function useScienceBadgeStyle(scienceBadgePulse: SharedValue<number>) {
  return useAnimatedStyle(() => {
    'worklet';
    return { opacity: scienceBadgePulse.value ?? 1 };
  });
}
