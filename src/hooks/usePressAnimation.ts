/**
 * Reusable Press Animation Hook
 *
 * Provides smooth scale animation for pressable components.
 * Respects reduced motion preferences.
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Springs } from '../constants/motion';

export interface PressAnimationConfig {
  /**
   * Scale value when pressed (default: 0.96)
   */
  pressScale?: number;

  /**
   * Whether to respect reduced motion preference (default: true)
   */
  respectReducedMotion?: boolean;

  /**
   * Custom spring configuration (optional)
   */
  springConfig?: typeof Springs.button;
}

export interface PressAnimationHandlers {
  onPressIn: () => void;
  onPressOut: () => void;
}

export interface UsePressAnimationReturn {
  /**
   * Animated style to apply to the component
   */
  animatedStyle: ReturnType<typeof useAnimatedStyle>;

  /**
   * Press handlers to spread onto Pressable/TouchableOpacity
   */
  pressHandlers: PressAnimationHandlers;

  /**
   * Direct access to scale value (for advanced usage)
   */
  scale: ReturnType<typeof useSharedValue<number>>;
}

export function usePressAnimation(
  config: PressAnimationConfig = {}
): UsePressAnimationReturn {
  const {
    pressScale = 0.96,
    respectReducedMotion = true,
    springConfig = Springs.button,
  } = config;

  const scale = useSharedValue(1);

  const pressHandlers = useCallback(
    (): PressAnimationHandlers => ({
      onPressIn: () => {
        scale.value = withSpring(pressScale, springConfig);
      },
      onPressOut: () => {
        scale.value = withSpring(1, springConfig);
      },
    }),
    [pressScale, springConfig, scale]
  )();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    pressHandlers,
    scale,
  };
}
