/**
 * StrengthFillBackground Component
 * Watercolor-style gradient fill showing habit strength percentage.
 * Layers: main wash + diagonal band + bottom pool.
 */

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../HabitCard.styles';

interface StrengthFillBackgroundProps {
  strengthFillStyle: AnimatedStyle;
  strengthColor: string;
  isDark?: boolean;
}

export const StrengthFillBackground = memo(function StrengthFillBackground({
  strengthFillStyle,
  strengthColor,
  isDark = false,
}: StrengthFillBackgroundProps) {
  const main = isDark ? ['60', '35', '10'] : ['50', '28', '08'];
  const band = isDark ? '18' : '12';
  const pool = isDark ? '15' : '10';

  return (
    <Animated.View
      pointerEvents='none'
      style={[styles.strengthFill, strengthFillStyle, { overflow: 'hidden' }]}
    >
      {/* Layer 1: Main horizontal wash */}
      <LinearGradient
        colors={[
          strengthColor + main[0],
          strengthColor + main[1],
          strengthColor + main[2],
        ]}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.65, 1]}
        start={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Layer 2: Diagonal band for organic texture */}
      <LinearGradient
        colors={['transparent', strengthColor + band, 'transparent']}
        end={{ x: 0.75, y: 1 }}
        locations={[0.25, 0.5, 0.75]}
        start={{ x: 0.25, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Layer 3: Bottom pool — watercolor settling effect */}
      <LinearGradient
        colors={['transparent', strengthColor + pool]}
        end={{ x: 0.5, y: 1 }}
        locations={[0.35, 1]}
        start={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
});
