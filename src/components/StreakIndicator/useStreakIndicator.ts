/**
 * Hook for StreakIndicator animation and state logic
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import type { Milestone } from './StreakIndicator.types';
import { MILESTONES, MILESTONE_BADGES } from './StreakIndicator.constants';

interface UseStreakIndicatorOptions {
  currentStreak: number;
  onMilestone?: (streak: number) => void;
  accessibilityLabel?: string;
  bestStreak: number;
}

export function useStreakIndicator({
  currentStreak,
  onMilestone,
  accessibilityLabel,
  bestStreak,
}: UseStreakIndicatorOptions) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  // Get the highest milestone reached
  let currentMilestone: Milestone | null = null;
  for (const milestone of MILESTONES) {
    if (currentStreak >= milestone) {
      currentMilestone = milestone;
    }
  }

  // Trigger animation and callback when milestone changes
  useEffect(() => {
    if (currentMilestone && onMilestone) {
      onMilestone(currentMilestone);
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [currentMilestone, onMilestone]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getFireColor = () => {
    if (currentStreak === 0) return theme.custom.colors.gray[400];
    if (currentMilestone === 100) return theme.custom.colors.info;
    if (currentMilestone === 30) return theme.custom.colors.warning[500];
    return theme.custom.colors.primary[500];
  };

  const getAccessibilityLabel = () => {
    if (accessibilityLabel) return accessibilityLabel;
    const streakText = `${currentStreak}-day streak`;
    const bestText = bestStreak > 0 ? `, best ${bestStreak} days` : '';
    const milestoneText = currentMilestone
      ? `, ${MILESTONE_BADGES[currentMilestone].label} achieved`
      : '';
    return `${streakText}${bestText}${milestoneText}`;
  };

  return {
    animatedStyle,
    currentMilestone,
    getAccessibilityLabel,
    getFireColor,
  };
}
