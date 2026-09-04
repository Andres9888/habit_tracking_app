/**
 * Reusable Press Animation Hook
 *
 * Provides smooth scale animation with optional haptic feedback for pressable components.
 * Automatically respects reduced motion accessibility preferences.
 *
 * Features:
 * - Smooth spring-based scale animation on press
 * - Optional haptic feedback (iOS & Native Handset)
 * - Reduced motion support
 * - Customizable press scale and spring configuration
 *
 * @param config - Configuration options
 * @returns Object containing animated style and press handlers
 *
 * @example
 * ```tsx
 * const { animatedStyle, pressHandlers } = usePressAnimation({
 *   pressScale: 0.95,
 *   enableHaptics: true,
 *   hapticStyle: 'light',
 * });
 *
 * <Pressable {...pressHandlers}>
 *   <Animated.View style={[styles.button, animatedStyle]}>
 *     <Text>Press me</Text>
 *   </Animated.View>
 * </Pressable>
 * ```
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { Springs } from '../constants/motion';
import { CARD_PRESS_SCALE } from '../utils/animations/cardPressAnimation';
import { triggerHaptic } from '@/utils/haptics';

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
  heavy: () => triggerHaptic('heavy'),
  light: () => triggerHaptic('tap'),
  medium: () => triggerHaptic('toggle'),
  selection: () => triggerHaptic('selection'),
};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

export function usePressAnimation(
  config: PressAnimationConfig = {}
): UsePressAnimationReturn {
  const {
    pressScale = CARD_PRESS_SCALE,
    respectReducedMotion = true,
    springConfig = Springs.button,
    enableHaptics = true,
    hapticStyle = 'light',
  } = config;

  const scale = useSharedValue(1);
  // Reanimated's hook rather than the local `useReduceMotion`: this runs at 80+
  // call sites, and the local hook registers one AccessibilityInfo listener per
  // instance. Reanimated keeps a single shared subscription.
  // Reduce Motion suppresses the spring, not the haptic — the tactile channel is
  // what compensates for the removed visual feedback.
  const systemReduceMotion = useReducedMotion();
  const motionOff = respectReducedMotion && Boolean(systemReduceMotion);

  const triggerHaptic = useCallback(() => {
    if (enableHaptics && isHapticsSupported) {
      const hapticFn = HAPTIC_MAP[hapticStyle];
      const promise = hapticFn?.();

      if (promise && typeof (promise as Promise<unknown>).catch === 'function') {
        promise.catch(() => {
          // Silently fail - haptics are non-critical
        });
      }
    }
  }, [enableHaptics, hapticStyle]);

  const pressHandlers = useCallback(
    (): PressAnimationHandlers => ({
      onPressIn: () => {
        scale.value = motionOff
          ? pressScale
          : withSpring(pressScale, springConfig);
        triggerHaptic();
      },
      onPressOut: () => {
        scale.value = motionOff ? 1 : withSpring(1, springConfig);
      },
    }),
    [pressScale, springConfig, scale, triggerHaptic, motionOff]
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
