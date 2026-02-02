/**
 * Content display component for MilestoneCelebration
 */

import React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { STRENGTH_LEVEL_CONFIG } from '../HabitStrengthIndicator/constants';
import type { StrengthLevel } from '../HabitStrengthIndicator/types';
import { styles } from './styles';
import { MilestoneBadge } from './MilestoneBadge';
import { StrengthDisplay } from './StrengthDisplay';

interface MilestoneContentProps {
  level: StrengthLevel;
  strength: number;
  habitName: string;
  badgeContainerStyle: StyleProp<ViewStyle>;
  glowStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<ViewStyle>;
  percentageStyle: StyleProp<ViewStyle>;
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
