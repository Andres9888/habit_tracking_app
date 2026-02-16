/**
 * Reusable Press Animation Hook - OPTIMIZED: Added haptic feedback
 *
 * Provides smooth scale animation + haptics for pressable components.
 * Respects reduced motion preferences.
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Springs } from '../constants/motion';
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

const HAPTIC_MAP = {
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  selection: () => Haptics.selectionAsync(),
};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

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
  const reduceMotion = useReducedMotion();

  const triggerHaptic = useCallback(() => {
    if (enableHaptics && isHapticsSupported) {
      HAPTIC_MAP[hapticStyle]().catch(() => {
        // Silently fail - haptics are non-critical
      });
    }
  }, [enableHaptics, hapticStyle]);

  const pressHandlers = useCallback(
    (): PressAnimationHandlers => ({
      onPressIn: () => {
        scale.value = reduceMotion
          ? withTiming(pressScale, { duration: 0 })
          : withSpring(pressScale, springConfig);
        triggerHaptic();
      },
      onPressOut: () => {
        scale.value = reduceMotion
          ? withTiming(1, { duration: 0 })
          : withSpring(1, springConfig);
      },
    }),
    [pressScale, springConfig, scale, triggerHaptic, reduceMotion]
  )();

  const animatedStyle = useAnimatedStyle(() => {
    const isPressed = scale.value < 1;
    return {
      transform: [
        { scale: scale.value },
        // Gentle lift on press — premium depth feedback
        { translateY: isPressed ? -1 : 0 },
      ],
      // Elevate shadow on press for card-lift micro-interaction
      shadowOpacity: isPressed ? 0.12 : undefined,
      shadowRadius: isPressed ? 20 : undefined,
    };
  });

  return {
    animatedStyle,
    pressHandlers,
    scale,
  };
}
