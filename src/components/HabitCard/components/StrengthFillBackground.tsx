/**
 * StrengthFillBackground Component
 * Animated gradient fill showing habit strength percentage
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../HabitCard.styles';

interface StrengthFillBackgroundProps {
  strengthFillStyle: AnimatedStyle;
  strengthColor: string;
  borderRadius: number;
}

export function StrengthFillBackground({
  strengthFillStyle,
  strengthColor,
  borderRadius,
}: StrengthFillBackgroundProps) {
  return (
    <Animated.View
      pointerEvents='none'
      style={[
        styles.strengthFill,
        strengthFillStyle,
        {
          borderBottomLeftRadius: borderRadius,
          borderTopLeftRadius: borderRadius,
          overflow: 'hidden',
        },
      ]}
    >
      <LinearGradient
        colors={[
          strengthColor + '30', // 19% opacity at the start (left)
          strengthColor + '18', // 9% opacity in middle
          strengthColor + '00', // Fully transparent at end (right)
        ]}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
