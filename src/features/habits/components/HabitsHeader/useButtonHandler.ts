import type { SharedValue } from 'react-native-reanimated';
import { withSpring, withTiming } from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 18, stiffness: 240 };

interface ButtonHandlerConfig {
  scale: SharedValue<number>;
  pressInScale?: number;
  onPress: () => void;
  onPressIn?: () => void;
  reduceMotion?: boolean;
}

/**
 * Creates press handlers for an animated button.
 * Handles scale animation on press in/out.
 * Respects reduce motion accessibility setting.
 */
export function createButtonHandlers(
  config: ButtonHandlerConfig,
  triggerHaptic: () => void,
  triggerSelection: () => void
) {
  const { scale, pressInScale = 0.9, onPress, onPressIn, reduceMotion = false } = config;

  return {
    handlePress: () => {
      triggerSelection();
      onPress();
    },
    handlePressIn: () => {
      triggerHaptic();
      onPressIn?.();
      scale.value = reduceMotion
        ? withTiming(pressInScale, { duration: 0 })
        : withTiming(pressInScale, { duration: 50 });
    },
    handlePressOut: () => {
      scale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withSpring(1, SPRING_CONFIG);
    },
  };
}
