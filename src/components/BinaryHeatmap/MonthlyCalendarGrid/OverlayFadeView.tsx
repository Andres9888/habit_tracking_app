/**
 * OverlayFadeView — absolute overlay that mounts/unmounts on the shared
 * cell-toggle clock (durations.quick, enter/exit easings), so connectors and
 * trace stubs move in lockstep with the day-cell fill fade.
 */
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';

interface OverlayFadeViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function OverlayFadeView({
  children,
  style,
  testID,
}: OverlayFadeViewProps) {
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View
      pointerEvents='none'
      testID={testID}
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.quick).easing(enterEasing)
      }
      exiting={
        reduceMotion
          ? undefined
          : FadeOut.duration(durations.quick).easing(exitEasing)
      }
      style={style}
    >
      {children}
    </Animated.View>
  );
}
