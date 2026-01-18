/**
 * InsightsSection Component
 * Displays habit insights: best days, streak records, and trends
 */

import React, { useMemo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { InsightsSectionProps } from './InsightsSection.types';
import { MIN_TRACKING_DAYS_FOR_INSIGHTS } from './InsightsSection.constants';
import {
  calculateDayOfWeekStats,
  calculateStreakRecords,
  calculateTrendComparison,
  calculateCurrentStreak,
  findBestDay,
  findWorstDay,
} from './utils';
import {
  JourneyStatsSection,
  BestDaysSection,
  StreakRecordsSection,
  TrendSection,
  EmptyInsightsState,
} from './components';

export function InsightsSection({
  tracking,
  habitCreatedAt,
  totalCompletions,
  successRate,
  daysTracking,
}: InsightsSectionProps) {
  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, habitCreatedAt),
    [tracking, habitCreatedAt]
  );
  const bestDay = useMemo(() => findBestDay(dayStats), [dayStats]);
  const worstDay = useMemo(() => findWorstDay(dayStats), [dayStats]);
  const maxRate = useMemo(
    () => Math.max(...dayStats.map((d) => d.rate), 1),
    [dayStats]
  );
  const currentStreak = useMemo(
    () => calculateCurrentStreak(tracking),
    [tracking]
  );
  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );
  const trend = useMemo(() => calculateTrendComparison(tracking), [tracking]);

  if (tracking.length < MIN_TRACKING_DAYS_FOR_INSIGHTS) {
    return (
      <EmptyInsightsState
        daysRemaining={MIN_TRACKING_DAYS_FOR_INSIGHTS - tracking.length}
      />
    );
  }

  return (
    <Animated.View
      className='gap-4'
      entering={FadeInDown.delay(100).springify()}
    >
      <JourneyStatsSection
        daysTracking={daysTracking}
        successRate={successRate}
        totalCompletions={totalCompletions}
      />
      <BestDaysSection
        bestDay={bestDay}
        dayStats={dayStats}
        maxRate={maxRate}
        worstDay={worstDay}
      />
      <StreakRecordsSection streakRecords={streakRecords} />
      <TrendSection trend={trend} />
    </Animated.View>
  );
}

export default InsightsSection;
