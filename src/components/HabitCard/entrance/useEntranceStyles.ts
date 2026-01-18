/**
 * Entrance Animated Styles Hook
 * Provides animated styles for card, accent, and content
 */

import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

interface UseEntranceStylesOptions {
  cardOpacity: SharedValue<number>;
  cardTranslateY: SharedValue<number>;
  accentScaleY: SharedValue<number>;
  accentWidth: SharedValue<number>;
  accentOpacity: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  contentTranslateX: SharedValue<number>;
}

export function useEntranceStyles({
  cardOpacity,
  cardTranslateY,
  accentScaleY,
  accentWidth,
  accentOpacity,
  contentOpacity,
  contentTranslateX,
}: UseEntranceStylesOptions) {
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const accentStyle = useAnimatedStyle(() => {
    const translateYOffset = (1 - accentScaleY.value) * -50;
    return {
      opacity: accentOpacity.value,
      transform: [
        { scaleY: accentScaleY.value },
        { translateY: translateYOffset },
      ],
      width: accentWidth.value,
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  return { accentStyle, cardStyle, contentStyle };
}
