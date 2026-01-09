/**
 * SuccessGlowOverlay - Green success glow effect
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import type { ViewStyle } from 'react-native';

interface SuccessGlowOverlayProps {
  animatedStyle: ViewStyle;
}

export function SuccessGlowOverlay({ animatedStyle }: SuccessGlowOverlayProps) {
  return (
    <Animated.View
      pointerEvents='none'
      style={[
        layoutStyles.successGlowOverlay,
        { backgroundColor: '#22c55e' },
        animatedStyle,
      ]}
    />
  );
}
