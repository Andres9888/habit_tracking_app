/**
 * Badge display component for MilestoneCelebration
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp, ViewStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { STRENGTH_LEVEL_CONFIG } from '../HabitStrengthIndicator/HabitStrengthIndicator';
import type { StrengthLevel } from '../HabitStrengthIndicator/HabitStrengthIndicator';
import { styles } from './styles';

interface MilestoneBadgeProps {
  level: StrengthLevel;
  badgeContainerStyle: AnimatedStyleProp<ViewStyle>;
  glowStyle: AnimatedStyleProp<ViewStyle>;
}

export function MilestoneBadge({
  level,
  badgeContainerStyle,
  glowStyle,
}: MilestoneBadgeProps) {
  const theme = useAppTheme();
  const config = STRENGTH_LEVEL_CONFIG[level];

  return (
    <View style={styles.badgeContainer}>
      {/* Glow effect behind emoji */}
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          {
            backgroundColor: theme.custom.colors.warning[500],
          },
        ]}
      />

      {/* Milestone Emoji */}
      <Animated.View style={badgeContainerStyle}>
        <Text
          accessible
          accessibilityLabel={`${config.label} milestone emoji`}
          style={styles.emoji}
        >
          {config.emoji}
        </Text>
      </Animated.View>
    </View>
  );
}
