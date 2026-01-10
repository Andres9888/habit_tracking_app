/**
 * MilestoneProgress Component
 *
 * Gamification component showing progress toward next meaningful milestone.
 */

import React, { useMemo } from 'react';

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { calculateMilestoneProgress } from '../MilestoneProgressTypes';
import type { MilestoneProgressProps } from '../MilestoneProgressTypes';

import { useMilestoneAnimations } from './MilestoneProgress.hooks';
import { useAccessibilityLabel } from './useAccessibilityLabel';
import { NoStreakState } from './NoStreakState';
import { CelebrationState } from './CelebrationState';
import { ProgressState } from './ProgressState';

export const MilestoneProgress = React.memo(function MilestoneProgress({
  currentStreak,
  onMilestoneHit,
  celebratedMilestones = [],
}: MilestoneProgressProps) {
  const reduceMotion = useReduceMotion();

  const milestoneData = useMemo(
    () => calculateMilestoneProgress(currentStreak, celebratedMilestones),
    [currentStreak, celebratedMilestones]
  );

  const {
    nextMilestone,
    daysRemaining,
    progressPercentage,
    displayState,
    previousMilestone,
  } = milestoneData;

  const {
    containerAnimatedStyle,
    progressAnimatedStyle,
    badgeAnimatedStyle,
    celebrationAnimatedStyle,
  } = useMilestoneAnimations({
    currentStreak,
    daysRemaining,
    displayState,
    onMilestoneHit,
    progressPercentage,
    reduceMotion,
  });

  const accessibilityLabel = useAccessibilityLabel({
    currentStreak,
    daysRemaining,
    displayState,
    nextMilestone,
    progressPercentage,
  });

  if (displayState === 'no-streak') {
    return (
      <NoStreakState
        accessibilityLabel={accessibilityLabel}
        containerAnimatedStyle={containerAnimatedStyle}
      />
    );
  }

  if (displayState === 'just-hit') {
    return (
      <CelebrationState
        accessibilityLabel={accessibilityLabel}
        celebrationAnimatedStyle={celebrationAnimatedStyle}
        containerAnimatedStyle={containerAnimatedStyle}
        currentStreak={currentStreak}
        nextMilestone={nextMilestone}
      />
    );
  }

  return (
    <ProgressState
      accessibilityLabel={accessibilityLabel}
      badgeAnimatedStyle={badgeAnimatedStyle}
      containerAnimatedStyle={containerAnimatedStyle}
      currentStreak={currentStreak}
      daysRemaining={daysRemaining}
      nextMilestone={nextMilestone}
      previousMilestone={previousMilestone}
      progressAnimatedStyle={progressAnimatedStyle}
      progressPercentage={progressPercentage}
    />
  );
});

export default MilestoneProgress;
