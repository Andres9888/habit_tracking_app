/* eslint-disable max-lines */
/**
 * HabitCardContent Component
 * Inner content of the HabitCard including name, icon, streak, and progress
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 * @see docs/offline-habit-sync.md T028 - PendingSyncBadge integration
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { StrengthProgressBar } from '../../StrengthProgressBar/StrengthProgressBar';
import { PendingSyncBadge } from '../../SyncStatus';
import { styles } from '../HabitCard.styles';
import { streakStyles } from '../HabitCard.streakStyles';
import { StatusIndicator } from './StatusIndicator';
import { StreakBadge } from './StreakBadge';
import type { HabitCardContentProps } from './HabitCardContent.types';

function HabitCardContentComponent({
  name,
  icon,
  strength,
  currentStreak,
  bestStreak,
  completed,
  atRisk,
  theme,
  entranceContentStyle,
  checkmarkAnimatedStyle,
  rippleAnimatedStyle,
  completionIcon = 'checkbox',
  hasPendingOfflineOps = false,
  chainScale,
  chainRotate,
}: HabitCardContentProps) {
  const { colors: themeColors } = useThemeColors();
  return (
    <Animated.View style={[styles.content, entranceContentStyle]}>
      <View style={styles.topRow}>
        <View style={styles.habitInfo}>
          <Text style={styles.icon}>{icon}</Text>
          <Text
            numberOfLines={1}
            style={[
              theme.custom.typography.heading3,
              { color: themeColors.text.primary },
              completed && styles.completedText,
            ]}
          >
            {name}
          </Text>
        </View>
        <StatusAndStreakSection
          atRisk={atRisk}
          bestStreak={bestStreak}
          chainRotate={chainRotate}
          chainScale={chainScale}
          checkmarkAnimatedStyle={checkmarkAnimatedStyle}
          completed={completed}
          completionIcon={completionIcon}
          currentStreak={currentStreak}
          hasPendingOfflineOps={hasPendingOfflineOps}
          rippleAnimatedStyle={rippleAnimatedStyle}
        />
      </View>
      <View style={styles.bottomRow}>
        <StrengthProgressBar
          showEmoji
          showNextLevel
          showPercentage
          size='compact'
          strength={strength}
        />
      </View>
    </Animated.View>
  );
}

export const HabitCardContent = memo(HabitCardContentComponent);
