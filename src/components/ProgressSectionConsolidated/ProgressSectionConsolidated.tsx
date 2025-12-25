/**
 * ProgressSectionConsolidated Component
 *
 * Main container for the consolidated Progress tab content.
 * Combines all sub-components into a single unified card with
 * clear visual hierarchy: Hero → Insights → Pattern → Action
 *
 * This component replaces the separate YourProgressCard,
 * PersonalBestsCard, and ThisMonthCard with a unified design.
 *
 * Key improvements over the 3-card approach:
 * - Single neutral gradient theme (vs 3 different gradients)
 * - Hero section with clear primary metric
 * - Horizontal scroll insight chips (reduces vertical space)
 * - Compact weekly pattern chart
 * - Collapsible streak records
 * - ~35% reduction in vertical space
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { ProgressSectionConsolidatedProps } from './types';
import {
  calculateDayOfWeekStats,
  calculateCurrentStreak,
  calculateStreakRecords,
  generateActionableTip,
  getBestAndWorstDays,
} from '../ProgressSection/utils';
import { calculateMonthlyChangeForStatsGrid } from '../../utils/trendCalculations';

import { StatsGrid } from './StatsGrid';
import { MilestoneProgress } from './MilestoneProgress';
import { WeeklyPatternChart } from './WeeklyPatternChart';
import { ActionableTipCard } from './ActionableTipCard';
import { StreakRecordsAccordion } from './StreakRecordsAccordion';

/**
 * ProgressSectionConsolidated Component
 *
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
  // Convert habitCreatedAt string to timestamp for utils
  const habitCreatedTimestamp = useMemo(() => {
    if (!habitCreatedAt) return;
    try {
      return new Date(habitCreatedAt).getTime();
    } catch {
      return;
    }
  }, [habitCreatedAt]);

  // Calculate day of week statistics
  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, habitCreatedTimestamp),
    [tracking, habitCreatedTimestamp]
  );

  // Calculate current streak
  const currentStreak = useMemo(
    () => calculateCurrentStreak(tracking),
    [tracking]
  );

  // Calculate streak records for accordion
  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );

  // Calculate monthly change for trend indicator
  const monthlyChange = useMemo(
    () => calculateMonthlyChangeForStatsGrid(tracking),
    [tracking]
  );

  // Get best and worst performing days
  const { bestDay, worstDay } = useMemo(
    () => getBestAndWorstDays(dayStats),
    [dayStats]
  );

  // Generate actionable tip based on patterns
  const actionableTip = useMemo(
    () => generateActionableTip(dayStats, currentStreak),
    [dayStats, currentStreak]
  );

  // Calculate this month's completed/total days
  const { monthlyCompleted, monthlyTotal } = useMemo(() => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    let completed = 0;
    let total = 0;

    const current = new Date(thisMonthStart);
    while (current <= today) {
      total++;
      if (completedDates.has(current.toISOString().split('T')[0])) {
        completed++;
      }
      current.setDate(current.getDate() + 1);
    }

    return { monthlyCompleted: completed, monthlyTotal: total };
  }, [tracking]);

  // Determine if we have enough data to show detailed sections
  const hasEnoughData = tracking.length >= 7;

  // Format best/worst days for InsightChips
  const bestDayData = useMemo(() => {
    if (!bestDay) return null;
    return { name: bestDay.day, rate: bestDay.rate };
  }, [bestDay]);

  const focusDayData = useMemo(() => {
    if (!worstDay) return null;
    // Only show focus day if it's different from best day and below 70%
    if (bestDay && worstDay.dayIndex === bestDay.dayIndex) return null;
    if (worstDay.rate >= 70) return null;
    return { name: worstDay.day, rate: worstDay.rate };
  }, [worstDay, bestDay]);

  return (
    <Animated.View
      accessibilityLabel='Progress section'
      accessibilityRole='summary'
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Unified Card Container */}
      <View
        className='overflow-hidden rounded-2xl p-4'
        style={{
          // Neutral gradient background: white → stone-50 → stone-100
          backgroundColor: '#ffffff',
          borderColor: 'rgba(214, 211, 209, 0.6)', // stone-300/60
          borderWidth: 1,
          // Subtle shadow
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Section 1: Stats Grid (replaces HeroStrengthSection + InsightChips) */}
        {/* Phase 1 redesign: Compact 2x2 grid with embedded strength ring */}
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

        {/* Section 2: Milestone Progress (Phase 2 gamification) */}
        <MilestoneProgress currentStreak={currentStreak} />

        {/* Section 3: Weekly Pattern Chart (only with enough data) */}
        {hasEnoughData && (
          <WeeklyPatternChart
            dayStats={dayStats}
            onSeeAllPress={onSeeAllPress}
          />
        )}

        {/* Section 4: Actionable Tip with Quick Actions */}
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

        {/* Section 5: Streak Records Accordion (only with enough data) */}
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
