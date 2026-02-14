/**
 * Reusable Press Animation Hook - OPTIMIZED: Added haptic feedback
 *
 * Provides smooth scale animation + haptics for pressable components.
 * Respects reduced motion preferences.
 */

import { triggerHaptic } from '@/utils/haptics';
import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Springs } from '../constants/motion';
import type { HapticPatternName } from '@/utils/haptics';
import { CARD_PRESS_SCALE } from '../utils/animations/cardPressAnimation';

export interface PressAnimationConfig {
  /**
   * Scale value when pressed (default: 0.97)
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

  /**
   * Enable haptic feedback on press (default: true)
   */
  enableHaptics?: boolean;

  /**
   * Haptic feedback style (default: 'light')
   */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
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

const HAPTIC_STYLE_MAP: Record<string, HapticPatternName> = {
  heavy: 'heavy',
  light: 'tap',
  medium: 'toggle',
  selection: 'selection',
};

export function usePressAnimation(
  config: PressAnimationConfig = {}
): UsePressAnimationReturn {
  const {
    pressScale = CARD_PRESS_SCALE,
    respectReducedMotion: _respectReducedMotion = true,
    springConfig = Springs.button,
    enableHaptics = true,
    hapticStyle = 'light',
  } = config;

  const scale = useSharedValue(1);

  const fireHaptic = useCallback(() => {
    if (enableHaptics) {
      triggerHaptic(HAPTIC_STYLE_MAP[hapticStyle] || 'tap');
    }
  }, [enableHaptics, hapticStyle]);

  const pressHandlers = useCallback(
    (): PressAnimationHandlers => ({
      onPressIn: () => {
        scale.value = withSpring(pressScale, springConfig);
        fireHaptic();
      },
      onPressOut: () => {
        scale.value = withSpring(1, springConfig);
      },
    }),
    [pressScale, springConfig, scale, fireHaptic]
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
