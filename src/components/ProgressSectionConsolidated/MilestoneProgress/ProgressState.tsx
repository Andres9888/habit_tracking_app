import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './MilestoneProgress.styles';
import type { Milestone } from '../MilestoneProgressTypes';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface ProgressStateProps {
  accessibilityLabel: string;
  containerAnimatedStyle: AnimatedStyle<ViewStyle>;
  progressAnimatedStyle: AnimatedStyle<ViewStyle>;
  badgeAnimatedStyle: AnimatedStyle<ViewStyle>;
  progressPercentage: number;
  daysRemaining: number;
  currentStreak: number;
  nextMilestone: Milestone | null;
  previousMilestone: Milestone | null;
}

export const ProgressState = React.memo(function ProgressState({
  accessibilityLabel,
  containerAnimatedStyle,
  progressAnimatedStyle,
  badgeAnimatedStyle,
  progressPercentage,
  daysRemaining,
  currentStreak,
  nextMilestone,
  previousMilestone,
}: ProgressStateProps) {
  const { colors } = useThemeColors();
  
  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='progressbar'
      accessibilityValue={{
        max: 100,
        min: 0,
        now: progressPercentage,
      }}
      style={[styles.container, containerAnimatedStyle]}
      testID='milestone-progress'
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Next Milestone: {nextMilestone?.days} Days
          </Text>
          <Animated.Text style={[styles.badgeIcon, badgeAnimatedStyle]}>
            {nextMilestone?.badge}
          </Animated.Text>
        </View>
        <Text style={[styles.daysAway, { color: colors.text.secondary }]}>
          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} away
        </Text>
      </View>

      {/* Milestone name */}
      <Text style={[styles.milestoneName, { color: colors.text.tertiary }]}>{nextMilestone?.name}</Text>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarTrack, { backgroundColor: colors.surface }]}>
          <Animated.View
            style={[styles.progressBarFill, progressAnimatedStyle]}
          />
        </View>
        <Animated.View style={[styles.progressBadge, badgeAnimatedStyle]}>
          <Text style={styles.progressBadgeText}>{nextMilestone?.badge}</Text>
        </Animated.View>
      </View>

      {/* Progress label */}
      <View style={styles.progressLabel}>
        <Text style={[styles.progressLabelText, { color: colors.text.tertiary }]}>
          {previousMilestone ? `${previousMilestone.days}` : '0'}
        </Text>
        <Text style={[styles.progressLabelText, { color: colors.text.secondary, fontWeight: '600' }]}>{currentStreak} days</Text>
        <Text style={[styles.progressLabelText, { color: colors.text.tertiary }]}>{nextMilestone?.days}</Text>
      </View>
    </Animated.View>
  );
});
