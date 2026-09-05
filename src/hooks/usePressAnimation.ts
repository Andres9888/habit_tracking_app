/**
 * Reusable Press Animation Hook
 *
 * The single press primitive for the app: a spring scale on press-in, spring
 * back on press-out, honouring Reduce Motion. `AnimatedPressable` wraps it;
 * everything else should either use that component or this hook directly.
 *
 * Haptics are OFF by default — callers fire haptics on *commit* (onPress), not
 * on press-in, so a scroll-cancelled touch never buzzes. Pass
 * `enableHaptics: true` only when the press-in tap is the sole tactile channel.
 *
 * @example
 * ```tsx
 * const { animatedStyle, pressHandlers } = usePressAnimation();
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
  type WithSpringConfig,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { springs } from '@/theme/animations';
import { CARD_PRESS_SCALE } from '../utils/animations/cardPressAnimation';
import { triggerHaptic } from '@/utils/haptics';

export interface PressAnimationConfig {
  /** Scale value when pressed (default: 0.97) */
  pressScale?: number;

  /** Whether to respect reduced motion preference (default: true) */
  respectReducedMotion?: boolean;

  /** Custom spring configuration (default: `springs.standard`) */
  springConfig?: WithSpringConfig;

  /** Enable haptic feedback on press-in (default: false) */
  enableHaptics?: boolean;

  /** Haptic feedback style (default: 'light') */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';

  /**
   * Add the card-lift treatment on press: translateY(-1) plus an elevated
   * shadow. Only meaningful on surfaces that already carry a shadow
   * (default: false).
   */
  lift?: boolean;
}

export interface PressAnimationHandlers {
  onPressIn: () => void;
  onPressOut: () => void;
}

export interface UsePressAnimationReturn {
  /** Animated style to apply to the component */
  animatedStyle: ReturnType<typeof useAnimatedStyle>;

  /** Press handlers to spread onto Pressable/TouchableOpacity */
  pressHandlers: PressAnimationHandlers;

  /** Direct access to scale value (for advanced usage) */
  scale: ReturnType<typeof useSharedValue<number>>;
}

const HAPTIC_MAP = {
  heavy: () => triggerHaptic('heavy'),
  light: () => triggerHaptic('tap'),
  medium: () => triggerHaptic('toggle'),
  selection: () => triggerHaptic('selection'),
};

const isHapticsSupported =
  Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

export function usePressAnimation(
  config: PressAnimationConfig = {}
): UsePressAnimationReturn {
  const {
    pressScale = CARD_PRESS_SCALE,
    respectReducedMotion = true,
    springConfig = springs.standard,
    enableHaptics = false,
    hapticStyle = 'light',
    lift = false,
  } = config;

  const scale = useSharedValue(1);
  // Reanimated's hook rather than the local `useReduceMotion`: this runs at 80+
  // call sites, and the local hook registers one AccessibilityInfo listener per
  // instance. Reanimated keeps a single shared subscription.
  // Reduce Motion suppresses the spring, not the haptic — the tactile channel is
  // what compensates for the removed visual feedback.
  const systemReduceMotion = useReducedMotion();
  const motionOff = respectReducedMotion && Boolean(systemReduceMotion);

  const fireHaptic = useCallback(() => {
    if (!enableHaptics || !isHapticsSupported) return;
    const promise = HAPTIC_MAP[hapticStyle]?.();
    if (promise && typeof (promise as Promise<unknown>).catch === 'function') {
      // Silently fail - haptics are non-critical
      promise.catch(() => {});
    }
  }, [enableHaptics, hapticStyle]);

  const pressHandlers = useCallback(
    (): PressAnimationHandlers => ({
      onPressIn: () => {
        scale.value = motionOff
          ? pressScale
          : withSpring(pressScale, springConfig);
        fireHaptic();
      },
      onPressOut: () => {
        scale.value = motionOff ? 1 : withSpring(1, springConfig);
      },
    }),
    [pressScale, springConfig, scale, fireHaptic, motionOff]
  )();

  // Branch inside the worklet — never conditionally detach the animated style.
  const animatedStyle = useAnimatedStyle(() => {
    const isPressed = scale.value < 1;
    if (!lift) {
      return { transform: [{ scale: scale.value }] };
    }
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
