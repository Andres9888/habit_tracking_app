/**
 * GradientBar - Animated gradient fill with glow effect and dividers
 * Dark mode aware — track and divider colors adapt to theme.
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
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
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View
      style={[
        styles.barContainer,
        {
          backgroundColor: themeColors.gray[200],
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
              backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)',
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
      {showDividers &&
        DIVIDER_POSITIONS.map((pos) => (
          <View
            key={pos}
            style={[
              styles.divider,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.15)',
                height: barHeight,
                left: `${pos}%`,
              },
            ]}
          />
        ))}
    </View>
  );
}
