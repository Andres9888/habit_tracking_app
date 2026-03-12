import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './MilestoneProgress.styles';
import { MILESTONES } from '../MilestoneProgressTypes';
import type { Milestone } from '../MilestoneProgressTypes';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface CelebrationStateProps {
  accessibilityLabel: string;
  containerAnimatedStyle: AnimatedStyle<ViewStyle>;
  celebrationAnimatedStyle: AnimatedStyle<ViewStyle>;
  currentStreak: number;
  nextMilestone: Milestone | null;
}

export const CelebrationState = React.memo(function CelebrationState({
  accessibilityLabel,
  containerAnimatedStyle,
  celebrationAnimatedStyle,
  currentStreak,
  nextMilestone,
}: CelebrationStateProps) {
  const hitMilestone = MILESTONES.find((m) => m.days === currentStreak);

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[
        styles.container,
        styles.celebrationContainer,
        containerAnimatedStyle,
      ]}
      testID='milestone-progress'
    >
      <Animated.View
        style={[styles.celebrationContent, celebrationAnimatedStyle]}
      >
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={styles.celebrationTitle}>
          You hit {currentStreak} days! {hitMilestone?.badge}
        </Text>
        <Text style={styles.celebrationSubtext}>
          {hitMilestone?.name ?? 'Milestone achieved'}
        </Text>
        {nextMilestone ? <Text style={styles.nextMilestoneText}>
            Next: {nextMilestone.days} days {nextMilestone.badge}
          </Text> : null}
      </Animated.View>
    </Animated.View>
  );
});
