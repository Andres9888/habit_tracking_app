/* eslint-disable max-lines */
/**
 * HabitCardContent Component
 * Inner content of the HabitCard including name, icon, streak, and progress
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 * @see docs/offline-habit-sync.md T028 - PendingSyncBadge integration
 * ACCESSIBILITY: Added aria-live region for completion state announcements (2026-02-17)
 */

import React, { memo, useMemo } from 'react';
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
  
  // Create live region announcement for completion state changes
  const liveRegionText = useMemo(() => {
    if (completed && bestStreak > 0) {
      return `Completed! Streak increased to ${currentStreak + 1} days.`;
    }
    if (completed) {
      return 'Completed!';
    }
    return '';
  }, [completed, currentStreak, bestStreak]);
  
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
      {/* Live region announcement for screen readers on completion state change */}
      <Text
        accessibilityLiveRegion='assertive'
        accessibilityRole='status'
        style={{ display: 'none' }}
      >
        {liveRegionText}
      </Text>
    </Animated.View>
  );
}

export const HabitCardContent = memo(HabitCardContentComponent);
