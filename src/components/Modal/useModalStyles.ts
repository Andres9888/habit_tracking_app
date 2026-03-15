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
import { SCREEN_HEIGHT } from './Modal.constants';

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
  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: backdropOpacityValue.value ?? 0,
    };
  });

  const bottomSheetStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: translateY.value ?? 0 }],
    };
  });

  // Full slide from bottom — matches native Modal animationType='slide'
  const fullScreenStyle = useAnimatedStyle(() => {
    'worklet';
    // TranslateY: slides up from bottom of screen
    const translateYValue = interpolate(
      fullScreenProgress.value ?? 0,
      [0, 1],
      [SCREEN_HEIGHT, 0],
      Extrapolation.CLAMP
    );

    // Add gesture translation for drag-to-dismiss
    const gestureTranslateY = fullScreenGestureY.value ?? 0;

    return {
      opacity: 1,
      transform: [
        { translateY: translateYValue + gestureTranslateY },
      ],
    };
  });

  const centerAlertStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: alertOpacity.value ?? 0,
      transform: [{ scale: scale.value ?? 1 }],
    };
  });

  return {
    backdropStyle,
    bottomSheetStyle,
    centerAlertStyle,
    fullScreenStyle,
  };
}
