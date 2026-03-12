/**
 * GradientBar - Animated gradient fill with glow effect and dividers
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { styles } from './StrengthProgressBar.styles';
import { DIVIDER_POSITIONS } from './StrengthProgressBar.constants';
import { useGlowPulse } from './useGlowPulse';

interface GradientBarProps {
  barHeight: number;
  gradientColors: [string, string, string];
  progressAnimatedStyle: AnimatedStyle<ViewStyle>;
  showDividers: boolean;
}

export function GradientBar({
  barHeight,
  gradientColors,
  progressAnimatedStyle,
  showDividers,
}: GradientBarProps) {
  const glowStyle = useGlowPulse();

  return (
    <View
      style={[
        styles.barContainer,
        {
          backgroundColor: colors.gray[200],
          borderRadius: barHeight / 2,
          height: barHeight,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.barFill,
          { borderRadius: barHeight / 2, overflow: 'hidden' },
          progressAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{ flex: 1, height: '100%' }}
        />
        <Animated.View
          style={[
            {
              backgroundColor: colors.text.inverse,
              borderRadius: barHeight,
              height: barHeight * 1.5,
              position: 'absolute',
              right: -2,
              top: -(barHeight * 0.25),
              width: barHeight * 1.5,
            },
            glowStyle,
          ]}
        />
      </Animated.View>
      {showDividers ? DIVIDER_POSITIONS.map((pos) => (
          <View
            key={pos}
            style={[styles.divider, { height: barHeight, left: `${pos}%` }]}
          />
        )) : null}
    </View>
  );
}
