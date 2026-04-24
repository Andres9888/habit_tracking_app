/* eslint-disable max-lines */
/**
 * ProgressSectionConsolidated Component
 *
 * Main container for the consolidated Progress tab content.
 * Combines all sub-components into a single unified card with
 * clear visual hierarchy: Hero -> Insights -> Pattern -> Action
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React from 'react';
import { View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { durations, enterEasing } from '../../theme/animations';
import { shadows } from '../../theme/spacing';
import { useThemeColors } from '../../theme/ThemeContext';
import { ActionableTipCard } from './ActionableTipCard';
import { MilestoneProgress } from './MilestoneProgress';
import { StatsGrid } from './StatsGrid';
import { StreakGoalCard } from './StreakGoalCard';
import { StreakRecordsAccordion } from './StreakRecordsAccordion';
import type { ProgressSectionConsolidatedProps } from './types';
import { useProgressSectionStats } from './useProgressSectionStats';
import { WeeklyPatternChart } from './WeeklyPatternChart';

/**
 * Unified progress section that consolidates all progress information
 * into a single card with clear visual hierarchy.
 */
export function ProgressSectionConsolidated({
  tracking,
  habitCreatedAt,
  strength,
  weeklyChange = 0,
  progressEmojis,
  onInfoPress: _onInfoPress, // Kept for backwards compatibility
  onFocusDayPress,
  onSeeAllPress,
  onTipPress,
  onTipQuickAction,
  streakGoal,
}: ProgressSectionConsolidatedProps) {
  const { colors: themeColors } = useThemeColors();
  const {
    actionableTip,
    bestDayData,
    bestStreak,
    completionRate,
    currentStreak,
    dayStats,
    focusDayData,
    hasEnoughData,
    monthlyChange,
    monthlyCompleted,
    monthlyTotal,
    streakRecords,
  } = useProgressSectionStats({ habitCreatedAt, tracking });

  return (
    <Animated.View
      accessibilityLabel='Progress section'
      accessibilityRole='summary'
      entering={FadeInDown.delay(100).duration(durations.enter).easing(enterEasing)}
    >
      {/* Unified Card Container */}
      <View
        className='overflow-hidden rounded-2xl p-4'
        style={{
          ...shadows.card,
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          borderWidth: 1,
        }}
      >
        {/* Section 1: Stats Grid */}
        <StatsGrid
          bestDay={bestDayData}
          currentStreak={currentStreak}
          focusDay={focusDayData}
          monthlyChange={monthlyChange}
          monthlyCompleted={monthlyCompleted}
          monthlyTotal={monthlyTotal}
          progressEmojis={progressEmojis}
          strength={strength}
          weeklyChange={weeklyChange}
          onFocusDayPress={onFocusDayPress}
        />

        {/* Section 2: Milestone Progress */}
        <MilestoneProgress currentStreak={currentStreak} />

        {/* Section 2b: Streak Goal (if user has set a goal) */}
        {streakGoal && streakGoal > 0 ? (
          <StreakGoalCard
            bestStreak={bestStreak}
            completionRate={completionRate}
            currentStreak={currentStreak}
            streakGoal={streakGoal}
          />
        ) : null}

        {/* Section 3: Weekly Pattern Chart */}
        {hasEnoughData ? (
          <WeeklyPatternChart
            dayStats={dayStats}
            onSeeAllPress={onSeeAllPress}
          />
        ) : null}

        {/* Section 4: Actionable Tip */}
        <ActionableTipCard
          currentStreak={currentStreak}
          subtitle={
            currentStreak > 0
              ? `${currentStreak} day streak${currentStreak === 1 ? '' : 's'} and counting!`
              : undefined
          }
          tip={actionableTip}
          onPress={onTipPress}
          onQuickAction={onTipQuickAction}
        />

        {/* Section 5: Streak Records Accordion */}
        {hasEnoughData ? (
          <StreakRecordsAccordion
            currentStreak={currentStreak}
            streakRecords={streakRecords}
          />
        ) : null}
      </View>
    </Animated.View>
  );
}

export default ProgressSectionConsolidated;
