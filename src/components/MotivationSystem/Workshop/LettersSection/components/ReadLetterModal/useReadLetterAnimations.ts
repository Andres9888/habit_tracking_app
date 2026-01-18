/**
 * useReadLetterAnimations Hook
 * Animation values and styles for the read letter modal
 */

import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export function useReadLetterAnimations() {
  const envelopeScale = useSharedValue(0.8);
  const envelopeOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const sparkleScale = useSharedValue(0);

  const envelopeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: envelopeOpacity.value,
    transform: [{ scale: envelopeScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleScale.value,
    transform: [{ scale: sparkleScale.value }],
  }));

  return {
    contentAnimatedStyle,
    contentOpacity,
    contentTranslateY,
    envelopeAnimatedStyle,
    envelopeOpacity,
    envelopeScale,
    sparkleAnimatedStyle,
    sparkleScale,
  };
}
