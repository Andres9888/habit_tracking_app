/**
 * useModalStyles Hook
 * Animated styles for Modal variants
 */

import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';

interface UseModalStylesParams {
  translateY: SharedValue<number>;
  fullScreenProgress: SharedValue<number>;
  fullScreenGestureY: SharedValue<number>;
  scale: SharedValue<number>;
  alertOpacity: SharedValue<number>;
  backdropOpacityValue: SharedValue<number>;
}

export function useModalStyles({
  translateY,
  fullScreenProgress,
  fullScreenGestureY,
  scale,
  alertOpacity,
  backdropOpacityValue,
}: UseModalStylesParams) {
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
  }));

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Apple-like fullScreen animated style
  const fullScreenStyle = useAnimatedStyle(() => {
    // Scale: starts at 0.94, ends at 1.0
    const scaleValue = interpolate(
      fullScreenProgress.value,
      [0, 1],
      [0.94, 1],
      Extrapolation.CLAMP
    );

    // Opacity: starts at 0, ends at 1
    const opacityValue = interpolate(
      fullScreenProgress.value,
      [0, 0.5, 1],
      [0, 0.8, 1],
      Extrapolation.CLAMP
    );

    // TranslateY: starts at 80, ends at 0 (slides up)
    const translateYValue = interpolate(
      fullScreenProgress.value,
      [0, 1],
      [80, 0],
      Extrapolation.CLAMP
    );

    // Add gesture translation
    const gestureTranslateY = fullScreenGestureY.value;

    // Scale down slightly when dragging (interactive feedback)
    const gestureScale = interpolate(
      gestureTranslateY,
      [0, 200],
      [1, 0.96],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityValue,
      transform: [
        { translateY: translateYValue + gestureTranslateY },
        { scale: scaleValue * gestureScale },
      ],
    };
  });

  const centerAlertStyle = useAnimatedStyle(() => ({
    opacity: alertOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return {
    backdropStyle,
    bottomSheetStyle,
    centerAlertStyle,
    fullScreenStyle,
  };
}
