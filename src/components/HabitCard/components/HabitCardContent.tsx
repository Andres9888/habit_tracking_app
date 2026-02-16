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

const DIFFICULTY_CONFIG = {
  easy: { color: '#22C55E', label: 'E' },
  medium: { color: '#F59E0B', label: 'M' },
  hard: { color: '#EF4444', label: 'H' },
};

interface HabitCardContentProps {
  name: string;
  icon: string;
  strength: number;
  currentStreak: number;
  bestStreak: number;
  completed: boolean;
  atRisk: boolean;
  theme: AppTheme;
  entranceContentStyle: AnimatedStyle;
  checkmarkAnimatedStyle: AnimatedStyle<{
    transform: ({ scale: number } | { rotate: string })[];
  }>;
  rippleAnimatedStyle: AnimatedStyle;
  /** Type of completion icon to display - T014 */
  completionIcon?: CompletionIconType;
  /** Whether there are pending offline operations - T014 */
  hasPendingOfflineOps?: boolean;
  /** Animated scale for chain link animation - T014 */
  chainScale?: SharedValue<number>;
  /** Animated rotation for chain link animation - T014 */
  chainRotate?: SharedValue<number>;
  /** Habit difficulty badge */
  difficulty?: 'easy' | 'medium' | 'hard';
}

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
  difficulty,
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
      {difficulty && (
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: DIFFICULTY_CONFIG[difficulty].color,
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {DIFFICULTY_CONFIG[difficulty].label}
          </Text>
        </View>
      )}
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
