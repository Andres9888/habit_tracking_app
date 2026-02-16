import type { SharedValue } from 'react-native-reanimated';
import { withSpring, withTiming } from 'react-native-reanimated';
import { SPRING_CONFIGS } from '@/utils/animations/helpers';

const SPRING_CONFIG = SPRING_CONFIGS.entrance;

interface ButtonHandlerConfig {
  scale: SharedValue<number>;
  pressInScale?: number;
  onPress: () => void;
  onPressIn?: () => void;
}

/**
 * Creates press handlers for an animated button.
 * Handles scale animation on press in/out.
 */
export function createButtonHandlers(
  config: ButtonHandlerConfig,
  triggerHaptic: () => void,
  triggerSelection: () => void
) {
  const { scale, pressInScale = 0.9, onPress, onPressIn } = config;

  return {
    handlePress: () => {
      triggerSelection();
      onPress();
    },
    handlePressIn: () => {
      triggerHaptic();
      onPressIn?.();
      scale.value = withTiming(pressInScale, { duration: 50 });
    },
    handlePressOut: () => {
      scale.value = withSpring(1, SPRING_CONFIG);
    },
  };
}
