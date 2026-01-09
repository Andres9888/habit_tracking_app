/**
 * Animated styles hook for MilestoneCelebration
 */

import { useAnimatedStyle } from 'react-native-reanimated';

interface AnimationValues {
  badgeScale: { value: number };
  glowOpacity: { value: number };
  labelOpacity: { value: number };
  shareButtonTranslateY: { value: number };
  shareButtonOpacity: { value: number };
  continueButtonOpacity: { value: number };
}

export function useMilestoneAnimatedStyles(animations: AnimationValues) {
  const badgeContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animations.badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: animations.glowOpacity.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: animations.labelOpacity.value,
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: animations.labelOpacity.value,
  }));

  const shareButtonStyle = useAnimatedStyle(() => ({
    opacity: animations.shareButtonOpacity.value,
    transform: [{ translateY: animations.shareButtonTranslateY.value }],
  }));

  const continueButtonStyle = useAnimatedStyle(() => ({
    opacity: animations.continueButtonOpacity.value,
  }));

  return {
    badgeContainerStyle,
    continueButtonStyle,
    glowStyle,
    labelStyle,
    percentageStyle,
    shareButtonStyle,
  };
}
