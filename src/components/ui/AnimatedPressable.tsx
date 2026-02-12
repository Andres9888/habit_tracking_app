/**
 * AnimatedPressable Component
 *
 * Drop-in replacement for React Native's Pressable with smooth scale animation.
 * Automatically animates on press without additional configuration.
 */

import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  usePressAnimation,
  type PressAnimationConfig,
} from '../../hooks/usePressAnimation';
import { useFocusRing } from '../../utils/accessibility';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends PressableProps {
  /**
   * Press animation configuration (optional)
   */
  animationConfig?: PressAnimationConfig;

  /**
   * Whether to disable the press animation (default: false)
   */
  disableAnimation?: boolean;

  /**
   * Whether to disable the focus ring (default: false)
   */
  disableFocusRing?: boolean;
}

/**
 * Pressable component with built-in scale animation on press.
 *
 * @example
 * ```tsx
 * <AnimatedPressable onPress={() => console.log('pressed')}>
 *   <Text>Press me</Text>
 * </AnimatedPressable>
 * ```
 *
 * @example With custom config
 * ```tsx
 * <AnimatedPressable
 *   onPress={() => console.log('pressed')}
 *   animationConfig={{ pressScale: 0.92 }}
 * >
 *   <Text>Press me harder</Text>
 * </AnimatedPressable>
 * ```
 */
export function AnimatedPressable({
  animationConfig,
  disableAnimation = false,
  disableFocusRing = false,
  children,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}: AnimatedPressableProps) {
  const { animatedStyle, pressHandlers } = usePressAnimation(animationConfig);
  const { focusStyle, focusHandlers } = useFocusRing({
    compact: true,
    disabled: disableFocusRing || !!pressableProps.disabled,
  });

  const handlePressIn = React.useCallback(
    (event: any) => {
      if (!disableAnimation) {
        pressHandlers.onPressIn();
      }
      onPressIn?.(event);
    },
    [disableAnimation, pressHandlers, onPressIn]
  );

  const handlePressOut = React.useCallback(
    (event: any) => {
      if (!disableAnimation) {
        pressHandlers.onPressOut();
      }
      onPressOut?.(event);
    },
    [disableAnimation, pressHandlers, onPressOut]
  );

  return (
    <AnimatedPressableBase
      {...pressableProps}
      {...(disableFocusRing ? {} : focusHandlers)}
      style={[style, !disableAnimation && animatedStyle, focusStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </AnimatedPressableBase>
  );
}

export default AnimatedPressable;
