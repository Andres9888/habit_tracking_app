/**
 * StreakGoalCard — compact layout.
 *
 * Ring + inline metrics (with progress bar), prominent next-milestone pill,
 * collapsed milestone badge row, projected completion banner.
 */

import React from 'react';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { useStreakGoalData } from './StreakGoalCard.hooks';
import type { StreakGoalCardProps } from './StreakGoalCard.types';
import { dashboardStyles as s } from './styles/dashboard.styles';
import { CompactHero } from './CompactHero';
import { NextMilestonePill } from './NextMilestonePill';
import { MilestonesRow } from './MilestonesRow';
import { ProjectedBanner } from './ProjectedBanner';

export const StreakGoalCard = React.memo(function StreakGoalCard({
  currentStreak,
  streakGoal,
  bestStreak,
  completionRate,
}: StreakGoalCardProps) {
  const { daysRemaining, milestones, overallPercent, projectedDate } =
    useStreakGoalData(currentStreak, streakGoal);

  if (streakGoal <= 0) return null;

  const nextMilestone =
    milestones.find((m) => m.status === 'current') ?? null;

  return (
    <Animated.View
      accessibilityLabel={`Streak goal: ${currentStreak} of ${streakGoal} days, ${daysRemaining} remaining`}
      accessibilityRole="summary"
      entering={FadeInDown.delay(150).springify().damping(18)}
      style={s.container}
    >
      <CompactHero
        bestStreak={bestStreak}
        completionRate={completionRate}
        currentStreak={currentStreak}
        daysRemaining={daysRemaining}
        overallPercent={overallPercent}
        streakGoal={streakGoal}
      />

      <NextMilestonePill milestone={nextMilestone} />

      <MilestonesRow milestones={milestones} />

      <ProjectedBanner projectedDate={projectedDate} />
    </Animated.View>
  );
});
