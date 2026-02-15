/**
 * Content display component for MilestoneCelebration
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import type { StrengthLevel } from '../HabitStrengthIndicator';
import { MilestoneBadge } from './MilestoneBadge';
import { STRENGTH_LEVEL_CONFIG } from '../HabitStrengthIndicator';
import { StrengthDisplay } from './StrengthDisplay';
import { styles } from './styles';
import { useAppTheme } from '../../theme';

interface MilestoneContentProps {
  level: StrengthLevel;
  strength: number;
  habitName: string;
  badgeContainerStyle: AnimatedStyle<ViewStyle>;
  glowStyle: AnimatedStyle<ViewStyle>;
  labelStyle: AnimatedStyle<ViewStyle>;
  percentageStyle: AnimatedStyle<ViewStyle>;
}

export function MilestoneContent({
  level,
  strength,
  habitName,
  badgeContainerStyle,
  glowStyle,
  labelStyle,
  percentageStyle,
}: MilestoneContentProps) {
  const theme = useAppTheme();
  const config = STRENGTH_LEVEL_CONFIG[level];

  return (
    <View style={styles.content}>
      <MilestoneBadge
        badgeContainerStyle={badgeContainerStyle}
        glowStyle={glowStyle}
        level={level}
      />

      <Animated.Text
        accessible
        accessibilityRole='header'
        style={[
          theme.custom.typography.heading1,
          styles.levelName,
          { color: theme.custom.colors.gray[900] },
          labelStyle,
        ]}
      >
        {config.label}
      </Animated.Text>

      <Animated.Text
        style={[
          theme.custom.typography.body,
          styles.description,
          { color: theme.custom.colors.gray[600] },
          labelStyle,
        ]}
      >
        {config.description}
      </Animated.Text>

      <StrengthDisplay percentageStyle={percentageStyle} strength={strength} />

      <Animated.Text
        style={[
          theme.custom.typography.bodySmall,
          styles.habitName,
          { color: theme.custom.colors.gray[500] },
          labelStyle,
        ]}
      >
        {habitName}
      </Animated.Text>
    </View>
  );
}
