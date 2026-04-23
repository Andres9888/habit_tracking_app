/* eslint-disable max-lines-per-function */
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
import { RankEmojiTile } from './RankEmojiTile';
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
          <RankEmojiTile icon={icon} strength={strength} />
          <Text
            ellipsizeMode='tail'
            numberOfLines={2}
            style={[
              theme.custom.typography.heading3,
              { color: themeColors.text.primary },
              completed && styles.completedText,
            ]}
          >
            {name}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <PendingSyncBadge
            size='small'
            testID='habit-card-pending-sync-badge'
            visible={hasPendingOfflineOps}
          />
          <StatusIndicator
            atRisk={atRisk}
            chainRotate={chainRotate}
            chainScale={chainScale}
            checkmarkAnimatedStyle={checkmarkAnimatedStyle}
            completed={completed}
            completionIcon={completionIcon}
            hasPendingOfflineOps={hasPendingOfflineOps}
          />
        </View>
      </View>
      <StreakBadge bestStreak={bestStreak} currentStreak={currentStreak} />
      <Animated.View
        pointerEvents='none'
        style={[streakStyles.rippleOverlay, rippleAnimatedStyle]}
      />
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
