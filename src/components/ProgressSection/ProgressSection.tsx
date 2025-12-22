/**
 * ProgressSection Component
 *
 * Main container for the consolidated Progress tab content.
 * Combines 3 focused, always-visible sections:
 * 1. YourProgressCard - Habit strength + actionable guidance
 * 2. PersonalBestsCard - Streak records + best/worst days
 * 3. ThisMonthCard - Bar chart + monthly trend
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { YourProgressCard } from './YourProgressCard';
import { PersonalBestsCard } from './PersonalBestsCard';
import { ThisMonthCard } from './ThisMonthCard';
import type { ProgressSectionProps } from './types';
import {
  calculateDayOfWeekStats,
  calculateStreakRecords,
  calculateTrendComparison,
  calculateCurrentStreak,
  generateActionableTip,
} from './utils';

export function ProgressSection({
  tracking,
  habitCreatedAt,
  strength,
  weeklyChange = 0,
  onInfoPress,
  onWorstDayPress,
  onSeeAllPress,
}: ProgressSectionProps) {
  // Calculate all derived data
  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, habitCreatedAt),
    [tracking, habitCreatedAt]
  );

  const currentStreak = useMemo(
    () => calculateCurrentStreak(tracking),
    [tracking]
  );

  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );

  const trend = useMemo(
    () => calculateTrendComparison(tracking),
    [tracking]
  );

  const bestDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    return withData.reduce((best, curr) => (curr.rate > best.rate ? curr : best));
  }, [dayStats]);

  const worstDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    return withData.reduce((worst, curr) => (curr.rate < worst.rate ? curr : worst));
  }, [dayStats]);

  const actionableTip = useMemo(
    () => generateActionableTip(dayStats, currentStreak),
    [dayStats, currentStreak]
  );

  // Calculate this month's completed days
  const thisMonthStats = useMemo(() => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    let completedDays = 0;
    let totalDays = 0;

    const current = new Date(thisMonthStart);
    while (current <= today) {
      totalDays++;
      if (completedDates.has(current.toISOString().split('T')[0])) {
        completedDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return { completedDays, totalDays };
  }, [tracking]);

  const hasEnoughData = tracking.length >= 7;

  return (
    <Animated.View
      className="gap-4"
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Section 1: Your Progress */}
      <YourProgressCard
        strength={strength}
        weeklyChange={weeklyChange}
        actionableTip={actionableTip}
        onInfoPress={onInfoPress}
      />

      {/* Section 2: Personal Bests (only show with enough data) */}
      {hasEnoughData && (
        <PersonalBestsCard
          streakRecords={streakRecords}
          currentStreak={currentStreak}
          bestDay={bestDay}
          worstDay={worstDay}
          onWorstDayPress={onWorstDayPress}
        />
      )}

      {/* Section 3: This Month (only show with enough data) */}
      {hasEnoughData && (
        <ThisMonthCard
          dayStats={dayStats}
          thisMonthRate={trend.thisMonth}
          lastMonthRate={trend.lastMonth}
          completedDays={thisMonthStats.completedDays}
          totalDays={thisMonthStats.totalDays}
          onSeeAllPress={onSeeAllPress}
        />
      )}
    </Animated.View>
  );
}

export default ProgressSection;
