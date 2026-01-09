import { useCallback } from 'react';
import { SharedValue, withSpring } from 'react-native-reanimated';
import { CHIP_TRANSFORMS, SPRING_CONFIGS } from '../animations';

interface UseChipPressHandlersParams {
  scale: SharedValue<number>;
  translateY: SharedValue<number>;
  shadowOpacity: SharedValue<number>;
  shouldReduceMotion: boolean | null;
}

export function useChipPressHandlers({
  scale,
  translateY,
  shadowOpacity,
  shouldReduceMotion,
}: UseChipPressHandlersParams) {
  const handlePressIn = useCallback(() => {
    if (shouldReduceMotion) return;
    translateY.value = withSpring(
      CHIP_TRANSFORMS.hoverTranslateY,
      SPRING_CONFIGS.chipHover
    );
    scale.value = withSpring(
      CHIP_TRANSFORMS.hoverScale,
      SPRING_CONFIGS.chipHover
    );
    shadowOpacity.value = withSpring(0.15, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  const handlePressOut = useCallback(() => {
    if (shouldReduceMotion) return;
    scale.value = withSpring(
      CHIP_TRANSFORMS.selectedScale,
      SPRING_CONFIGS.chipPress
    );
    translateY.value = withSpring(0, SPRING_CONFIGS.chipHover);
    shadowOpacity.value = withSpring(0, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  const animatePressScale = useCallback(() => {
    if (!shouldReduceMotion) {
      scale.value = withSpring(
        CHIP_TRANSFORMS.pressScale,
        SPRING_CONFIGS.chipPress
      );
    }
  }, [scale, shouldReduceMotion]);

  return { animatePressScale, handlePressIn, handlePressOut };
}
