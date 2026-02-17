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

import { useThemeColors } from '../../theme/ThemeContext';
import { shadows } from '../../theme/spacing';
import { ActionableTipCard } from './ActionableTipCard';
import { MilestoneProgress } from './MilestoneProgress';
import { StatsGrid } from './StatsGrid';
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
  onInfoPress: _onInfoPress, // Kept for backwards compatibility
  onFocusDayPress,
  onSeeAllPress,
  onTipPress,
  onTipQuickAction,
}: ProgressSectionConsolidatedProps) {
  const {
    actionableTip,
    bestDayData,
    currentStreak,
    dayStats,
    focusDayData,
    hasEnoughData,
    monthlyChange,
    monthlyCompleted,
    monthlyTotal,
    streakRecords,
  } = useProgressSectionStats({ habitCreatedAt, tracking });
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel='Progress section'
      accessibilityRole='summary'
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      {/* Unified Card Container */}
      <View
        className='overflow-hidden rounded-2xl p-4'
        style={{
          ...shadows.card,
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
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
          strength={strength}
          weeklyChange={weeklyChange}
          onFocusDayPress={onFocusDayPress}
        />

        {/* Section 2: Milestone Progress */}
        <MilestoneProgress currentStreak={currentStreak} />

        {/* Section 3: Weekly Pattern Chart */}
        {hasEnoughData && (
          <WeeklyPatternChart
            dayStats={dayStats}
            onSeeAllPress={onSeeAllPress}
          />
        )}

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
        {hasEnoughData && (
          <StreakRecordsAccordion
            currentStreak={currentStreak}
            streakRecords={streakRecords}
          />
        )}
      </View>
    </Animated.View>
  );
}

export default ProgressSectionConsolidated;
