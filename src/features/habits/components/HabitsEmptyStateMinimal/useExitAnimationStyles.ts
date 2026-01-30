/**
 * useExitAnimationStyles - Animated styles for exit animation
 */

import { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

interface UseExitAnimationStylesParams {
  iconScale: SharedValue<number>;
  iconExitScale: SharedValue<number>;
  iconTranslateY: SharedValue<number>;
  containerOpacity: SharedValue<number>;
  ringOpacity: SharedValue<number>;
  burstOpacity: SharedValue<number>;
}

export function useExitAnimationStyles({
  iconScale,
  iconExitScale,
  iconTranslateY,
  containerOpacity,
  ringOpacity,
  burstOpacity,
}: UseExitAnimationStylesParams) {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value * iconExitScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burstOpacity.value,
  }));

  return { burstStyle, containerStyle, iconStyle, ringStyle };
}
